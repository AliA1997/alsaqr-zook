import { useStore } from "@stores/index";
import { FormikErrors } from "formik";
import { observer } from "mobx-react-lite";
import { MouseEventHandler, useMemo } from "react";
import { CommonUpsertBoxTypes } from "typings";

type CommonButtonProps = {
    disabled?: boolean;
    onClick: MouseEventHandler<HTMLButtonElement>;
    classNames: string;
}


type InfoButtonProps = {
    classNames?: string;
} & CommonButtonProps

export function InfoButton({ classNames, disabled, onClick, children }: React.PropsWithChildren<InfoButtonProps>) {
    const buttonClassName = useMemo(() => {
        let defaultClassName = `
            flex
            min-w-[4rem] max-w-[12rem] max-h-[3rem] 
            border px-3 py-1 
            font-bold 
            disabled:opacity-40
            text-xs
            border-none
            text-gray-900
            dark:text-gray-50
            cursor-pointer
        `;
        if(classNames)
            defaultClassName += " " + classNames;

        return defaultClassName;
    }, [classNames])

    return (
        <button
            type='button'
            disabled={disabled}
            onClick={onClick}
            className={buttonClassName}
        >
            {children}
        </button>

    );
}

export function AbsoluteSuccessButton({ children, disabled, onClick, }: React.PropsWithChildren<CommonButtonProps>) {
    return (
        <button
            type='button'
            disabled={disabled}
            onClick={onClick}
            className={`
                min-w-[4rem] max-w-[12rem] max-h-[3rem] border px-3 py-1 
                font-bold 
                text-gray-900
                dark:text-white 
                hover:opacity-60
                bg-green-400
                hover:opacity-90
                disabled:opacity-40
                text-xs
                border-none
                flex
             `}
        >
            {children}
        </button>
    );
}

export function AbsoluteDangerButton({ children, disabled, onClick, classNames }: React.PropsWithChildren<CommonButtonProps>) {

    return (
        <button
            type='button'
            disabled={disabled}
            onClick={onClick}
            className={`
                min-w-[4rem] max-w-[12rem] max-h-[3rem] border px-3 py-1 
                font-bold 
                text-gray-900
                dark:text-white 
                hover:opacity-90
                bg-red-400
                disabled:opacity-40
                text-xs
                border-none
                flex
                ${classNames ? classNames : ''}
            `}
        >
            {children}
        </button>
    );
}

type FooterButtonsProps = {
    type: CommonUpsertBoxTypes;
    errors: FormikErrors<any>;
    setErrors: (val: FormikErrors<any>) => void;
    validateForm: (form: any, setErrors: (val: FormikErrors<any>) => void) => FormikErrors<any>;
    values: any;
    classNames?: string;
    submitting?: boolean;
}


export const FooterButtons = observer(({ 
    classNames,
    errors, 
    type, 
    setErrors, 
    validateForm, 
    values,
    submitting
}: FooterButtonsProps) => {

    const { productFeedStore } = useStore();
    const { 
        setCreateProductForm,
        createProductFormStep,
        setCreateProductFormStep,
        loadingUpsert
    } = productFeedStore;
    
    const currentStep = useMemo(() => {
        return createProductFormStep;
    }, [
        type, 
        createProductFormStep
    ]);

    const setCurrentStep = (val: number, form: any, disRegardErrors?: boolean) => (e: any) => {
        e.preventDefault();
        const newErrors = validateForm(form, setErrors);
        if(hasErrors(newErrors) && !disRegardErrors) {
            setErrors(newErrors)
            return;
        }
        
        setCreateProductFormStep(val);
        setCreateProductForm(form);
    };


    const upsertLoading = useMemo(() => {
        return loadingUpsert;
    }, [
        loadingUpsert
    ]);

    const lastStepBeforeReview = 1;
    const hasErrors = (err?: any) => err ? Object.values(err).some(v => !!v) : Object.values(errors).some(v => !!v);

    return (
        <div className={`
            flex ${currentStep === 0 ? 'justify-end' : 'justify-between'} items-center mt-2 w-full space-x-2 ${classNames && classNames}
        `}>
            {currentStep > 0 && (
                <button
                    data-testid="modalbackbutton"
                    type="button"
                    onClick={setCurrentStep(currentStep === 0 ? 0 : currentStep - 1, values, true)}
                    className={`
                        rounded-full bg-gray-200 px-5 py-2 font-bold text-gray-700
                        hover:opacity-90 hover:cursor-pointer
                    `}
                >
                    Back
                </button>
            )}

            {currentStep === (lastStepBeforeReview + 1)
                ? (
                    <button
                        data-testid="modalsubmitbutton"
                        type='submit'
                        disabled={hasErrors() || upsertLoading || submitting}
                        style={{
                            backgroundColor: '#55a8c2'
                        }}
                        className={`
                            rounded-full px-5 py-2 font-bold text-white disabled:opacity-40
                            hover:opacity-90 hover:cursor-pointer
                        `}
                    >
                        {upsertLoading || submitting ? (
                            <svg
                                aria-hidden="true"
                                className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-[#55a8c2]"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
                        ) : (
                            'Submit'
                        )}
                    </button>
                )
                : currentStep === lastStepBeforeReview ? (
                    <button
                        data-testid="modalreviewbutton"
                        type="button"
                        onClick={setCurrentStep(currentStep + 1, values)}
                        disabled={hasErrors()}
                        className={`
                            rounded-full px-5 py-2 font-bold text-white disabled:opacity-40
                            hover:opacity-90 hover:cursor-pointer
                        `}
                        style={{
                            backgroundColor: '#55a8c2'
                        }}
                    >
                        Review
                    </button>
                ) : (
                    <button
                        data-testid="modalnextbutton"
                        type="button"
                        onClick={setCurrentStep(currentStep + 1, values)}
                        className={`
                            rounded-full px-5 py-2 font-bold text-white disabled:opacity-40
                            hover:opacity-90 hover:cursor-pointer
                        `}
                        style={{
                            backgroundColor: '#55a8c2'
                        }}
                    >
                        Next
                    </button>
                )}
        </div>
    );
})