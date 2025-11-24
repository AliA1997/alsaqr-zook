import { useStore } from "@stores/index";
import { observer } from "mobx-react-lite";
import { Formik, FormikErrors } from 'formik';
import { motion } from 'framer-motion';
import { CreateProductForm } from "@models/product";
import { useMemo, useRef, useState } from "react";
import { ContentContainerWithRef } from "@common/Containers";
import { DEFAULT_CREATE_PRODUCT_FORM, LAST_CREATE_PRODUCT_FORM_STEP, NOT_ALLOWED_NSFW_CHECKER_RESULTS } from "@utils/constants";

import { FooterButtons } from "@common/Buttons";
import { CommonUpsertBoxTypes } from "@typings";
import { checkNsfwInImage, initializeClient } from "@utils/gradio";
import { DangerAlert } from "@common/Alerts";
import CreateProductLocationStep from "./CreateProduct/CreateProductLocationStep";
import { CreateProductFieldsStep } from "./CreateProduct/CreateProductFieldsStep";
import { ReviewUpsertProductStep } from "./ReviewUpsertProductStep";


export default observer(() => {
    const { productFeedStore } = useStore();
    const {
        createProduct,
        createProductForm,
        createProductFormStep,
    } = productFeedStore;


    const [nsfwAlert, setNsfwAlert] = useState<string>("");

    async function createForm(
        values: CreateProductForm,
        setValues: (values: React.SetStateAction<CreateProductForm>, shouldValidate?: boolean) => Promise<void | FormikErrors<CreateProductForm>>
    ) {
        try {
            await createProduct(values);
            setValues(DEFAULT_CREATE_PRODUCT_FORM);
        } catch {
            console.log("Their was a problem when creating a product for yourself")
        }
    }

    async function checkNsfw(imgUrl: string) {
        const client = await initializeClient()
        return await checkNsfwInImage(client, imgUrl);
    }

    function validateForm(values: any, setErrors?: (errorValues: any) => void) {
        let errors: FormikErrors<CreateProductForm> = {};

        if (!values.latitude && lastStepInCreateProduct)
            errors['latitude'] = "Latitude is required."
        else if (!values.longitude && lastStepInCreateProduct)
            errors['longitude'] = "Longitude is required."
        else if (!values.country && lastStepInCreateProduct)
            errors["country"] = "Country is required."
        else if (!values.title)
            errors["title"] = "Title is required."
        else if (!values.productCategoryId)
            errors['productCategoryId'] = "Product Category is required."
        else if (!values.price)
            errors['description'] = "Price is required."
        else if (!values.description)
            errors['description'] = "Description is required."
        else if (!values.images || !values.images.length)
            errors['images'] = 'Images are required.'

        if (setErrors)
            setErrors(errors);

        return errors;
    }

    const lastStepInCreateProduct = useMemo(() => createProductFormStep === LAST_CREATE_PRODUCT_FORM_STEP, [createProductFormStep]);
    const containerRef = useRef(null);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col space-x-2 p-5"
        >
            {nsfwAlert && (
                <div className="px-2">
                    <DangerAlert
                        title="NSFW Images Not Allowed"
                        message={nsfwAlert}
                        onClose={() => setNsfwAlert("")}
                    />
                </div>
            )}
            <Formik
                initialValues={createProductForm}
                validate={values => {
                    validateForm(values);
                }}
                onSubmit={async (values, { setSubmitting, setFieldValue, setValues }) => {
                    const procesingsImgs = values.images?.map(img => checkNsfw(img));
                    const checkedImages = await Promise.all(procesingsImgs ?? []);
                    const hasExplicitImages = checkedImages.some(img => NOT_ALLOWED_NSFW_CHECKER_RESULTS["Somewhat Explicit"] === img || NOT_ALLOWED_NSFW_CHECKER_RESULTS["Very Explicit"] === img);
                    if (hasExplicitImages) {
                        setFieldValue('images', []);
                        setNsfwAlert("NSFW images are not allowed. Please re‑upload your files without explicit content.");
                        return;
                    }
                    setNsfwAlert('');

                    await createForm(values, setValues);
                    setSubmitting(false);
                }}
            >
                {({
                    values,
                    errors,
                    setErrors,
                    handleSubmit,
                    setFieldValue,
                    isSubmitting
                }) => (
                    <ContentContainerWithRef
                        classNames={`
                            text-left scrollbar-hide max-w-full ml-0 mr-0
                        `}
                        innerRef={containerRef}
                    >
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-1 w-full flex-col scrollbar-hide overflow-scroll px-2"
                            data-testid="modalform"
                        >
                            {createProductFormStep === 1 ? (
                                <CreateProductLocationStep
                                    setFieldValue={setFieldValue}
                                />
                            ) : lastStepInCreateProduct ? (
                                <ReviewUpsertProductStep
                                    values={values}
                                />
                            ) : (
                                <CreateProductFieldsStep
                                    errors={errors}
                                    values={values}
                                    setFieldValue={setFieldValue}
                                />
                            )}
                            <FooterButtons
                                type={CommonUpsertBoxTypes.Product}
                                values={values}
                                errors={errors}
                                setErrors={setErrors}
                                validateForm={validateForm}
                                submitting={isSubmitting}
                            />
                        </form>
                    </ContentContainerWithRef>
                )}

            </Formik>
        </motion.div>
    );
});