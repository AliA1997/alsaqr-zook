import { EmojiHappyIcon } from "@heroicons/react/outline";
import { useCallback, useState } from "react";
import Picker from "@emoji-mart/react";
import emojiData from "@emoji-mart/data";
import { XIcon } from "@heroicons/react/solid";
import { fileToBase64 } from "@utils/functions";
import { FormikErrors } from "formik";

type TextInputProps = {
    input: string;
    setInput: (val: string) => void;
    selectEmojis: boolean;
    placeholder: string;
    name: string;
    type: string;
    showEmojiPicker?: boolean;
    setShowEmojiPicker?: (val: boolean) => void;
    isTextArea?: boolean;
    classNames?: string;
}

export function AlSaqrInput({
    input,
    setInput,
    name,
    type,
    setShowEmojiPicker,
    showEmojiPicker,
    selectEmojis,
    isTextArea,
    placeholder,
    classNames
}: TextInputProps) {

    const handleShowEmojiPicker = useCallback(
        () => {
            if (setShowEmojiPicker)
                setShowEmojiPicker!(!showEmojiPicker)
        },
        []
    );
    const handleEmojiSelect = useCallback(
        (iValue: string) => (emoji: any) => {
            const newInputValue = iValue + emoji.native;
            setInput(newInputValue);
            if (setShowEmojiPicker)
                setShowEmojiPicker!(false);
        },
        []
    );
    const handleEmojiSelectClickOutside = useCallback(
        () => {
            if (setShowEmojiPicker)
                setShowEmojiPicker(false)
        },
        []
    );

    return (
        <div className="relative d-flex flex-col">
            {isTextArea ? (
                <textarea
                    name={name}
                    rows={5}
                    className={`
                        flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        dark:bg-gray-900  ${classNames && classNames}
                    `}
                    placeholder={placeholder}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    className={`
                        flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        dark:bg-gray-900 ${classNames && classNames} 
                    `}
                    placeholder={placeholder}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            )}
            {selectEmojis ? (
                <>
                    <button
                        type='button'
                        className={`flex items-center justify-center cursor-pointer`}
                        onClick={(e: any) => {
                            e.stopPropagation();
                            handleShowEmojiPicker();
                        }}
                    >
                        <EmojiHappyIcon
                            className="h-5 w-5 text-gray-500 hover:text-[#55a8c2] transition-transform duration-150 ease-out hover:scale-125"
                        />
                    </button>
                    <div className="absolute top-full mt-2 left-0 z-50">
                        {showEmojiPicker && (
                            <Picker
                                data={emojiData}
                                onEmojiSelect={handleEmojiSelect(input)}
                                onClickOutside={handleEmojiSelectClickOutside}

                            />
                        )}
                    </div>
                </>
            ) : null}
        </div>
    );
}

type AlSaqrMultiImageUploadProps = {
    images: string[];
    setImages: (uploadedImages: string[]) => void;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<any>>;
};


export default function AlSaqrMultiImageUpload({
    images,
    setImages,
    setFieldValue
}: AlSaqrMultiImageUploadProps) {
    const [_, setIsDragging] = useState(false);

    const processFiles = async (files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files);
        const base64Images = await Promise.all(newFiles.map(fileToBase64));
        setImages(base64Images);
    };

    // input change
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        await processFiles(e.target.files);
    };

    // drag/drop
    const handleFiles = async (files: FileList | null) => {
        await processFiles(files);
    };

    const removeImage = (index: number) => {
        const filteredImages = images.slice().filter((_, i) => i !== index);
        setFieldValue('images', filteredImages);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };


    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="w-full max-w-full mx-auto"
        >
            {/* Upload input */}
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 z-[999]">
                <span className="text-gray-500">Click or drag images here</span>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />
            </label>

            {/* Preview grid */}
            {images && images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 lg:grid-cols-7 gap-3">
                    {images.map((fileBase64, idx) => {
                        return (
                            <div
                                key={idx}
                                className="relative w-28 h-28 rounded overflow-hidden border"
                            >
                                <img
                                    src={fileBase64}
                                    alt={`upload-${idx}`}
                                    className="object-cover w-full h-full"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage(idx);
                                    }}
                                    className="absolute top-1 right-1 bg-opacity-50 text-gray-900 rounded-full p-1 text-xs hover:bg-opacity-75"
                                >
                                    <XIcon className='h-4 w-4' />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}