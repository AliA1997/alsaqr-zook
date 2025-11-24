import { InputContainer } from "@common/Containers";
import AlSaqrMultiImageUpload, { AlSaqrInput } from "@common/Inputs";
import { AlSaqrMultiSelect, AlSaqrSelect } from "@common/Selects";
import { AlSaqrFormLabel, ErrorText } from "@common/Titles";
import { ProductCategories } from "@models/enums";
import { AttributesEditor } from "../AttributesEditor";
import { PRODUCT_CATEGORY_OPTIONS } from "@utils/constants";
import { CreateProductForm } from "@models/product";
import { FormikErrors } from "formik";
import { useState } from "react";

type CreateProductFieldsStepProps = {
    values: CreateProductForm;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<CreateProductForm>>;
    errors: FormikErrors<CreateProductForm>;
}

export function CreateProductFieldsStep({
    values,
    setFieldValue,
    errors
}: CreateProductFieldsStepProps) {
    const [showInputEmojiPicker, setShowInputEmojiPicker] = useState<boolean>(false);
    const [showTextAreaEmojiPicker, setShowTextAreaEmojiPicker] = useState<boolean>(false);

    return (
        <>
            <InputContainer>
                <AlSaqrFormLabel forInput="title" >
                    Title:
                </AlSaqrFormLabel>
                <AlSaqrInput
                    type='text'
                    name="title"
                    input={values.title ?? ""}
                    setInput={(val: string) => setFieldValue("title", val)}
                    showEmojiPicker={showInputEmojiPicker}
                    setShowEmojiPicker={setShowInputEmojiPicker}
                    selectEmojis={true}
                    placeholder="Product Title"
                    classNames="w-full"
                />
                {errors.title && <ErrorText>{errors.title}</ErrorText>}
            </InputContainer>

            <AlSaqrMultiImageUpload
                images={values.images ?? []}
                setImages={(imagesUploaded: string[]) => {
                    const setOfImages = new Set([...(values.images ?? []), ...imagesUploaded])
                    setFieldValue('images', Array.from(setOfImages.values()))
                }}
                setFieldValue={setFieldValue}
            />
            {errors.images && <ErrorText>{errors.images}</ErrorText>}

            <InputContainer>
                <AlSaqrFormLabel forInput="description" >
                    Description:
                </AlSaqrFormLabel>
                <AlSaqrInput
                    type="text"
                    name="description"
                    input={values.description ?? ""}
                    setInput={(val: string) => setFieldValue("description", val)}
                    showEmojiPicker={showTextAreaEmojiPicker}
                    setShowEmojiPicker={setShowTextAreaEmojiPicker}
                    isTextArea={true}
                    selectEmojis={true}
                    placeholder="Product Description"
                    classNames="w-full rounded-none"
                />
                {errors.description && <ErrorText>{errors.description}</ErrorText>}
            </InputContainer>

            <InputContainer>
                <AlSaqrFormLabel forInput="price" >
                    Price:
                </AlSaqrFormLabel>
                <AlSaqrInput
                    name="price"
                    type="number"
                    placeholder={'Price of Product'}
                    aria-placeholder={'Price of Product'}
                    input={values.price?.toString() ?? ""}
                    setInput={(val: string) => setFieldValue("price", val)}
                    selectEmojis={false}
                    classNames="w-full"
                />
                {errors.price && <ErrorText>{errors.price}</ErrorText>}

            </InputContainer>

            <InputContainer>
                <AlSaqrFormLabel forInput="price" >
                    Type of Product:
                </AlSaqrFormLabel>
                <AlSaqrSelect<ProductCategories>
                    name="productCategoryId"
                    label="Type of Product"
                    options={PRODUCT_CATEGORY_OPTIONS}
                />
            </InputContainer>

            <InputContainer>
                <AlSaqrFormLabel forInput="price" >
                    Tags:
                </AlSaqrFormLabel>
                <AlSaqrMultiSelect
                    name="tags"
                    noOptionsText="No tags are available based on what you typed"
                    placeholder="Select tags for your product"
                />
                {errors.price && <ErrorText>{errors.price}</ErrorText>}

            </InputContainer>

            <InputContainer>
                <AttributesEditor
                    attributes={values.attributes ?? {}}
                    onChange={(newAttributes: any) => {
                        console.log(`
                                            {
                                            ...(values.attributes ?? {}),
                                            ...newAttributes
                                        }`, newAttributes)
                        setFieldValue("attributes", newAttributes)
                    }}
                    disabled={false}
                    maxRows={10}
                />
            </InputContainer>
        </>
    );
}