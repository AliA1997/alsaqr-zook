import { useState } from "react";
import { observer } from "mobx-react-lite";
import toast from "react-hot-toast";
import { Formik, FormikErrors, FormikTouched } from "formik";
import { useStore } from "@stores/index";
import {
  ProductRecord,
  UpdateProductForm,
  CreateProductForm,
} from "@models/product";
import { ProductCategories } from "@models/enums";
import { ModalBody, ModalPortal } from "@common/Modal";
import { InputContainer } from "@common/Containers";
import AlSaqrMultiImageUpload, { AlSaqrInput } from "@common/Inputs";
import { AlSaqrMultiSelect, AlSaqrSelect } from "@common/Selects";
import { AlSaqrFormLabel, ErrorText } from "@common/Titles";
import { AttributesEditor } from "@components/products/AttributesEditor";

interface UpsertProductModalProps {
  product?: ProductRecord;
  onClose: () => void;
  onSuccess?: () => void;
}

// The form is split into two wizard sections.
enum EditStep {
  Information = 0,
  CategoryAndAttributes = 1,
}

interface UpsertProductFormValues {
  title: string;
  description: string;
  price: string;
  images: string[];
  tags: string[];
  productCategoryId: string;
  attributes: Record<string, string>;
  country?: string;
}

// Formik's setFieldValue signature (returns a promise) — needed by the image upload.
type SetFieldValue = (
  field: string,
  value: any,
  shouldValidate?: boolean,
) => Promise<void | FormikErrors<UpsertProductFormValues>>;

// Section 1 — core listing information.
const InformationSection = ({
  values,
  errors,
  touched,
  setFieldValue,
}: {
  values: UpsertProductFormValues;
  errors: FormikErrors<UpsertProductFormValues>;
  touched: FormikTouched<UpsertProductFormValues>;
  setFieldValue: SetFieldValue;
}) => {
  const [showTitleEmoji, setShowTitleEmoji] = useState(false);
  const [showDescriptionEmoji, setShowDescriptionEmoji] = useState(false);

  return (
    <>
      <InputContainer>
        <AlSaqrFormLabel forInput="title">Title:</AlSaqrFormLabel>
        <AlSaqrInput
          type="text"
          name="title"
          input={values.title}
          setInput={(val: string) => setFieldValue("title", val)}
          showEmojiPicker={showTitleEmoji}
          setShowEmojiPicker={setShowTitleEmoji}
          selectEmojis={true}
          placeholder="Product Title"
          classNames="w-full"
        />
        {touched.title && errors.title && <ErrorText>{errors.title}</ErrorText>}
      </InputContainer>

      <InputContainer>
        <AlSaqrFormLabel forInput="description">Description:</AlSaqrFormLabel>
        <AlSaqrInput
          type="text"
          name="description"
          input={values.description}
          setInput={(val: string) => setFieldValue("description", val)}
          showEmojiPicker={showDescriptionEmoji}
          setShowEmojiPicker={setShowDescriptionEmoji}
          isTextArea={true}
          selectEmojis={true}
          placeholder="Product Description"
          classNames="w-full rounded-none"
        />
        {touched.description && errors.description && (
          <ErrorText>{errors.description}</ErrorText>
        )}
      </InputContainer>

      <InputContainer>
        <AlSaqrFormLabel forInput="images">Images:</AlSaqrFormLabel>
        <AlSaqrMultiImageUpload
          images={values.images ?? []}
          setImages={(uploaded: string[]) => {
            const merged = new Set([...(values.images ?? []), ...uploaded]);
            setFieldValue("images", Array.from(merged.values()));
          }}
          setFieldValue={setFieldValue}
        />
        {touched.images && errors.images && (
          <ErrorText>{errors.images as string}</ErrorText>
        )}
      </InputContainer>

      <InputContainer>
        <AlSaqrFormLabel forInput="price">Price:</AlSaqrFormLabel>
        <AlSaqrInput
          type="number"
          name="price"
          input={values.price}
          setInput={(val: string) => setFieldValue("price", val)}
          selectEmojis={false}
          placeholder="Price of Product"
          classNames="w-full"
        />
        {touched.price && errors.price && <ErrorText>{errors.price}</ErrorText>}
      </InputContainer>
    </>
  );
};

// Section 2 — category, tags and the open attributes map.
const CategoryAndAttributesSection = ({
  values,
  setFieldValue,
  productCategories,
}: {
  values: UpsertProductFormValues;
  setFieldValue: SetFieldValue;
  productCategories: { value: string; label: string }[];
}) => (
  <>
    <InputContainer>
      <AlSaqrFormLabel forInput="productCategoryId">
        Type of Product:
      </AlSaqrFormLabel>
      <AlSaqrSelect<ProductCategories>
        name="productCategoryId"
        label="Type of Product"
        placeholder="Type of Product"
        options={productCategories as any}
      />
    </InputContainer>

    <InputContainer>
      <AlSaqrFormLabel forInput="tags">Tags:</AlSaqrFormLabel>
      <AlSaqrMultiSelect
        name="tags"
        noOptionsText="No tags are available based on what you typed"
        placeholder="Select tags for your product"
      />
    </InputContainer>

    <InputContainer>
      <AttributesEditor
        attributes={values.attributes ?? {}}
        onChange={(newAttributes) => setFieldValue("attributes", newAttributes)}
        disabled={false}
        maxRows={10}
      />
    </InputContainer>
  </>
);

const STEP_TITLES: Record<EditStep, string> = {
  [EditStep.Information]: "Information",
  [EditStep.CategoryAndAttributes]: "Category & Attributes",
};

// Header row: title on the left, close button aligned to it on the right.
const ModalHeader = ({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) => (
  <div className="flex items-center justify-between gap-3">
    <h2 className="truncate text-base font-bold text-gray-900 dark:text-white sm:text-lg">
      {title}
    </h2>
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      style={{ background: "transparent" }}
      className="shrink-0 text-gray-400 hover:text-gray-600"
    >
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
);

const UpsertProductModal = observer(
  ({ product, onClose, onSuccess }: UpsertProductModalProps) => {
    const { userProductsFeedStore, productFeedStore, commonStore, modalStore } =
      useStore();
    const { updateProduct } = userProductsFeedStore;
    const { createProduct, productCategories } = productFeedStore;
    const { closeModal } = modalStore;

    const [step, setStep] = useState<EditStep>(EditStep.Information);
    const isEdit = !!product;

    const initialValues: UpsertProductFormValues = {
      title: product?.title ?? "",
      description: product?.description ?? "",
      price: product?.price?.toString() ?? "",
      images: product?.images ?? [],
      tags: product?.tags ?? [],
      productCategoryId: product?.productCategoryId ?? "",
      attributes: (product?.attributes ?? {}) as Record<string, string>,
    };

    // Required: title, description, images (step 1) and category (step 2).
    // Price, tags and attributes are optional.
    const validate = (values: UpsertProductFormValues) => {
      const errors: FormikErrors<UpsertProductFormValues> = {};
      if (!values.title) errors.title = "Title is required.";
      if (!values.description) errors.description = "Description is required.";
      if (!values.images || values.images.length === 0)
        errors.images = "At least one image is required.";
      if (!values.productCategoryId)
        errors.productCategoryId = "Category is required.";
      return errors;
    };

    const buildUpdateForm = (
      values: UpsertProductFormValues,
    ): UpdateProductForm => {
      const ip = commonStore.userIpInfo;
      const form: UpdateProductForm = {
        latitude: product?.latitude!,
        longitude: product?.longitude!,
      };

      if (values.title && values.title !== product!.title)
        form.title = values.title;

      if (values.description && values.description !== product!.description)
        form.description = values.description;

      if (
        values.price &&
        values.price !== "" &&
        Number(values.price) !== product!.price
      )
        form.price = Number(values.price);

      if (
        values.images &&
        values.images.join(",") !== (product!.images ?? []).join(",")
      )
        form.images = values.images;

      if (
        values.tags &&
        values.tags.join(",") !== (product!.tags ?? []).join(",")
      )
        form.tags = values.tags;

      if (
        values.productCategoryId &&
        values.productCategoryId !== product!.productCategoryId
      )
        form.productCategoryId = values.productCategoryId;

      if (
        values.attributes &&
        JSON.stringify(values.attributes) !==
          JSON.stringify(product!.attributes ?? {})
      )
        form.attributes = values.attributes;

      form.country = ip?.locationDisplayName ?? "United States";

      return form;
    };

    const submitUpdate = async (values: UpsertProductFormValues) => {
      const form = buildUpdateForm(values);

      try {
        await updateProduct(form, product!.id);
        toast("Listing updated.", { icon: "✅", position: "top-center" });
        onSuccess?.();
        closeModal();
      } catch {
        toast.error("Could not update this listing.");
      } 
    };

    const buildCreateForm = (
      values: UpsertProductFormValues,
    ): CreateProductForm => {
      const ip = commonStore.userIpInfo;

      return {
        title: values.title,
        description: values.description,
        price: values.price === "" ? undefined : Number(values.price),
        images: values.images,
        tags: values.tags,
        productCategoryId: values.productCategoryId || undefined,
        attributes: values.attributes,
        latitude: ip?.latitude ?? 27.7671,
        longitude: ip?.longitude ?? 82.6384,
        country: ip?.locationDisplayName ?? "United States",
      };
    };

    const submitCreate = async (values: UpsertProductFormValues) => {
      try {
        await createProduct(buildCreateForm(values));
        toast("Listing created.", { icon: "✅", position: "top-center" });
        onSuccess?.();
        onClose();
      } catch {
        toast.error("There was a problem creating your listing.");
      }
    };

    return (
      <ModalPortal>
        <ModalBody
          onClose={onClose}
          contentClassNames="max-w-[95vw] sm:max-w-xl lg:max-w-3xl"
          headerChildren={
            <ModalHeader
              title={isEdit ? "Edit listing" : "Create listing"}
              onClose={onClose}
            />
          }
        >
          <div className="flex w-full flex-col">
            {/* Step indicator */}
            <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold">
              {[EditStep.Information, EditStep.CategoryAndAttributes].map(
                (s) => (
                  <span
                    key={s}
                    className={`rounded-full px-3 py-1 ${
                      step === s
                        ? "bg-[#55a8c2] text-white"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {s + 1}. {STEP_TITLES[s]}
                  </span>
                ),
              )}
            </div>

            <Formik
              initialValues={initialValues}
              validate={validate}
              onSubmit={async (values) => {
                if (isEdit) await submitUpdate(values);
                else await submitCreate(values);
              }}
            >
              {({
                values,
                errors,
                touched,
                setFieldValue,
                setTouched,
                isSubmitting,
                handleSubmit,
              }) => {
                // Validate only the step-1 required fields, then advance.
                const goNext = () => {
                  const hasStep1Error =
                    !values.title ||
                    !values.description ||
                    !values.images ||
                    values.images.length === 0;
                  if (hasStep1Error) {
                    setTouched(
                      {
                        ...touched,
                        title: true,
                        description: true,
                        images: true,
                      },
                      true,
                    );
                    return;
                  }
                  setStep(EditStep.CategoryAndAttributes);
                };

                return (
                  <form
                    onSubmit={handleSubmit}
                    className="flex w-full flex-col gap-3"
                    data-testid="upsertproductform"
                  >
                    {step === EditStep.Information ? (
                      <InformationSection
                        values={values}
                        errors={errors}
                        touched={touched}
                        setFieldValue={setFieldValue}
                      />
                    ) : (
                      <CategoryAndAttributesSection
                        values={values}
                        setFieldValue={setFieldValue}
                        productCategories={(productCategories ?? []).map(
                          (pc) => ({ value: pc.id, label: pc.name }),
                        )}
                      />
                    )}

                    <div className="mt-2 flex justify-between">
                      {step === EditStep.Information ? (
                        <button
                          key="cancel"
                          type="button"
                          onClick={onClose}
                          className="rounded-full bg-gray-100 px-5 py-2 font-bold text-gray-900 disabled:opacity-40"
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          key="back"
                          type="button"
                          data-testid="upsertproductback"
                          onClick={() => setStep(EditStep.Information)}
                          className="rounded-full bg-gray-100 px-5 py-2 font-bold text-gray-900 disabled:opacity-40"
                        >
                          Back
                        </button>
                      )}

                      {/* Distinct keys force React to mount separate DOM nodes for the
                                            "Next" (type=button) and "Save/Create" (type=submit) buttons.
                                            Without them React reuses one node and flips its type mid-click,
                                            so clicking Next submits the form instead of advancing the step. */}
                      {step === EditStep.Information ? (
                        <button
                          key="next"
                          type="button"
                          data-testid="upsertproductnext"
                          onClick={goNext}
                          className="rounded-full bg-[#55a8c2] px-5 py-2 font-bold text-white disabled:opacity-40"
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          key="submit"
                          type="submit"
                          disabled={isSubmitting}
                          data-testid="upsertproductsubmit"
                          className="rounded-full bg-[#55a8c2] px-5 py-2 font-bold text-white disabled:opacity-40"
                        >
                          {isEdit
                            ? "Save changes"
                            : isSubmitting
                              ? "Creating…"
                              : "Create listing"}
                        </button>
                      )}
                    </div>
                  </form>
                );
              }}
            </Formik>
          </div>
        </ModalBody>
      </ModalPortal>
    );
  },
);

export default UpsertProductModal;
