import Collapsible from "@common/Collapsible";
import { MapView } from "@common/Map";
import { CreateProductForm } from "@models/product";
import { PRODUCT_CATEGORY_OPTIONS } from "@utils/constants";
import { useState } from "react";

type ReviewUpsertProductStepProps = {
    values: CreateProductForm;
};

export function ReviewUpsertProductStep({ values }: ReviewUpsertProductStepProps) {
    const [activeMarker, setActiveMarker] = useState<{
        id: number;
        latitude: number;
        longitude: number;
    } | undefined>({
        id: 1,
        latitude: values.latitude!,
        longitude: values.longitude!
    });
    return (
        <div className="flex flex-col w-full rounded-lg shadow-sm p-4 space-y-4">
            {/* Product Details */}
            <Collapsible defaultOpen title="Details">
                <div className="space-y-2 text-sm text-gray-800 px-4">
                    <div className='text-left'>
                        <span className="font-semibold underline">Title:</span>{" "}
                        {values.title || <span className="italic text-gray-500">{values.title}</span>}
                    </div>
                    <div className='text-left'>
                        <span className="font-semibold underline">Description:</span>{" "}
                        {values.description && (
                            <div className="flex flex-wrap gap-2 mt-1">
                                <span className="italic text-gray-500">{values.description}</span>
                            </div>
                        )}
                    </div>
                    <div className='text-left'>
                        <span className="font-semibold underline">Price:</span>{" "}
                        {values.price !== undefined ? `$${values.price.toLocaleString('en-US')}` : <span className="italic text-gray-500">Not provided</span>}
                    </div>
                    <div className='text-left'>
                        <span className="font-semibold underline">Category:</span>{" "}
                        {values.productCategoryId ? PRODUCT_CATEGORY_OPTIONS.find(opt => opt.value === values.productCategoryId)?.label ?? "" : <span className="italic text-gray-500">Not provided</span>}
                    </div>

                    {/* Attributes displayed as a table */}
                    <div className='text-left'>
                        <span className="font-semibold block mb-2 underline">Attributes:</span>
                        {values.attributes && Object.keys(values.attributes).length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm text-gray-800 border border-gray-300 rounded-lg">
                                    <tbody>
                                        {Object.entries(values.attributes).map(([key, val]) => (
                                            <tr key={key} className="border-b">
                                                <td className="px-4 py-2 font-semibold text-left w-1/3">{key}</td>
                                                <td className="px-4 py-2">{String(val)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <span className="italic text-gray-500">None</span>
                        )}
                    </div>

                    <div className='text-left'>
                        <span className="font-semibold underline">Tags:</span>{" "}
                        {values.tags && values.tags.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {values.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-block rounded-full px-2 py-0.5 text-xs font-medium border-1 border-[#55a8c2] text-[#55a8c2]"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <span className="italic text-gray-500">None</span>
                        )}
                    </div>
                    <div className='text-left'>
                        <span className="font-semibold underline">Images:</span>{" "}
                        {values.images && values.images.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {values.images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Product image ${idx + 1}`}
                                        className="h-24 w-24 object-cover rounded border border-gray-300"
                                    />
                                ))}
                            </div>
                        ) : (
                            <span className="italic text-gray-500">None</span>
                        )}
                    </div>
                </div>
            </Collapsible>

            {/* Location Details */}
            <Collapsible defaultOpen title="Location Details">
                <div className="space-y-2 text-sm text-gray-800 px-4">
                    <div className='text-left'>
                        <span className="font-semibold underline">Country:</span>{" "}
                        {values.country || <span className="italic text-gray-500">Not provided</span>}
                    </div>
                    <div className='text-left'>
                        <span className="font-semibold underline">Latitude:</span>{" "}
                        {values.latitude !== undefined ? values.latitude : <span className="italic text-gray-500">Not provided</span>}
                    </div>
                    <div className='text-left pb-2'>
                        <span className="font-semibold underline">Longitude:</span>{" "}
                        {values.longitude !== undefined ? values.longitude : <span className="italic text-gray-500">Not provided</span>}
                    </div>
                </div>
                <MapView
                    classNames="h-[15rem] underline"
                    mainCoords={{
                        id: 1,
                        name: values.title!,
                        price: values.price!.toLocaleString('en-US'),
                        latitude: values.latitude!,
                        longitude: values.longitude!
                    }}
                    activeMarker={activeMarker}
                    setActiveMarker={setActiveMarker}
                    onlyDisplay={true}
                />
            </Collapsible>
        </div>
    );
}