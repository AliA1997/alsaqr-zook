import { observer } from "mobx-react-lite";
import toast from "react-hot-toast";
import { Formik, FormikErrors } from "formik";
import { useStore } from "@stores/index";
import { ProductRecord, UpdateProductForm } from "@models/product";
import { ConfirmModal } from "@common/Modal";
import { ErrorText } from "@common/Titles";

interface EditProductFormValues {
    title: string;
    description: string;
    price: number;
    tags: string;
}

interface EditProductFormProps {
    product: ProductRecord;
    onClose: () => void;
}

// Owner-only edit form for a selling listing. Validates with Formik, then routes the
// save through the custom ConfirmModal — the API still enforces creator-only edits via
// the bearer token, this only gates the UI and asks for confirmation before mutating.
const EditProductForm = observer(({ product, onClose }: EditProductFormProps) => {
    const { userProductsFeedStore, modalStore } = useStore();
    const { updateProduct } = userProductsFeedStore;
    const { showModal, closeModal } = modalStore;

    const initialValues: EditProductFormValues = {
        title: product.title ?? "",
        description: product.description ?? "",
        price: product.price ?? 0,
        tags: (product.tags ?? []).join(", "),
    };

    const validate = (values: EditProductFormValues) => {
        const errors: FormikErrors<EditProductFormValues> = {};
        if (!values.title) errors.title = "Title is required.";
        if (!values.description) errors.description = "Description is required.";
        if (values.price === undefined || values.price === null || Number(values.price) <= 0)
            errors.price = "Price must be greater than 0.";
        return errors;
    };

    // Build the partial UpdateProductForm, tracking which fields actually changed so the
    // API only patches what the owner touched.
    const buildUpdateForm = (values: EditProductFormValues): UpdateProductForm => {
        const fieldsToUpdate: string[] = [];
        const form: UpdateProductForm = { fieldsToUpdate };

        if (values.title !== product.title) {
            form.title = values.title;
            fieldsToUpdate.push("title");
        }
        if (values.description !== product.description) {
            form.description = values.description;
            fieldsToUpdate.push("description");
        }
        if (Number(values.price) !== product.price) {
            form.price = Number(values.price);
            fieldsToUpdate.push("price");
        }
        const parsedTags = values.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
        if (parsedTags.join(",") !== (product.tags ?? []).join(",")) {
            form.tags = parsedTags;
            fieldsToUpdate.push("tags");
        }

        return form;
    };

    const openUpdateConfirm = (values: EditProductFormValues) => {
        const form = buildUpdateForm(values);
        showModal(
            <ConfirmModal
                title="Update listing"
                confirmMessage={`Save changes to "${product.title}"?`}
                onClose={closeModal}
                declineButtonText="Cancel"
                confirmButtonText="Save changes"
                confirmButtonClassNames="bg-[#55a8c2]"
                confirmFunc={async () => {
                    try {
                        await updateProduct(form, product.id);
                        toast("Listing updated.", { icon: "✅" });
                    } catch {
                        toast.error("Could not update this listing.");
                    } finally {
                        closeModal();
                    }
                }}
            />
        );
    };

    return (
        <div className="flex w-full flex-col">
            <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Edit listing</h2>
            <Formik
                initialValues={initialValues}
                validate={validate}
                onSubmit={(values) => openUpdateConfirm(values)}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3" data-testid="editproductform">
                        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                            Title
                            <input
                                name="title"
                                type="text"
                                value={values.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                data-testid="editproducttitle"
                                className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-black dark:text-white"
                            />
                            {touched.title && errors.title ? <ErrorText>{errors.title}</ErrorText> : null}
                        </label>

                        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                            Description
                            <textarea
                                name="description"
                                value={values.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                rows={4}
                                data-testid="editproductdescription"
                                className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-black dark:text-white"
                            />
                            {touched.description && errors.description ? <ErrorText>{errors.description}</ErrorText> : null}
                        </label>

                        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                            Price
                            <input
                                name="price"
                                type="number"
                                value={values.price}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                data-testid="editproductprice"
                                className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-black dark:text-white"
                            />
                            {touched.price && errors.price ? <ErrorText>{errors.price}</ErrorText> : null}
                        </label>

                        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                            Tags (comma separated)
                            <input
                                name="tags"
                                type="text"
                                value={values.tags}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                data-testid="editproducttags"
                                className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 dark:border-gray-700 dark:bg-black dark:text-white"
                            />
                        </label>

                        <div className="mt-2 flex justify-between">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-full bg-gray-100 px-5 py-2 font-bold text-gray-900 disabled:opacity-40"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                data-testid="editproductsubmit"
                                className="rounded-full bg-[#55a8c2] px-5 py-2 font-bold text-white disabled:opacity-40"
                            >
                                Continue
                            </button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
});

export default EditProductForm;
