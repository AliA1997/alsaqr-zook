import { DraggableMap } from "@common/Map";
import { CheckIcon, ClipboardCopyIcon } from "@heroicons/react/solid";
import { CreateProductForm } from "@models/product";
import { useStore } from "@stores/index";
import { locationApiClient } from "@utils/locationApiClient";
import { FormikErrors } from "formik";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";


type CreateProductLocationStepProps = {
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<CreateProductForm>>;
}

export default observer(function CreateProductLocationStep({
    setFieldValue
}: CreateProductLocationStepProps) {
    const { commonStore } = useStore();
    const { userIpInfo } = commonStore;

    const [activeMarker, setActiveMarker] = useState<{ latitude: number, longitude: number }>({ latitude: userIpInfo?.latitude ?? 31.5, longitude: userIpInfo?.longitude ?? 39.39 })
    const [locationToDisplay, setLocationToDisplay] = useState<{ cityCountry: string, latitude: number, longitude: number, displayName: string } | undefined>();
    const [copied, setCopied] = useState<boolean>(false);

    useEffect(() => {
        if (activeMarker)
            locationApiClient.reverseLocateAddress(activeMarker.latitude, activeMarker.longitude)
                .then(reverseLocData => {
                    const locationFeatures = reverseLocData && reverseLocData["features"] && reverseLocData["features"].length ? reverseLocData["features"][0] : undefined;

                    if (locationFeatures) {
                        const newLatitude = locationFeatures["geometry"]["coordinates"][1];
                        const newLongitude = locationFeatures["geometry"]["coordinates"][0];
                        const countryBasedOnLatLong =  locationFeatures["properties"]["address"]["country"];
                        setLocationToDisplay({
                            cityCountry: `
                                ${locationFeatures["properties"]["address"]["state"] ?? locationFeatures["properties"]["address"]["province"] ?? locationFeatures["properties"]["address"]["city"]}, 
                               ${countryBasedOnLatLong}
                            `,
                            latitude: newLatitude,
                            longitude: newLongitude,
                            displayName: locationFeatures["properties"]["display_name"],
                        });
                        setFieldValue("latitude", newLatitude);
                        setFieldValue("longitude", newLongitude);
                        setFieldValue("country", countryBasedOnLatLong);
                    } else {
                        setLocationToDisplay(undefined);
                    }
                })
    }, [activeMarker, setActiveMarker]);
    
    const copyLocation = useCallback(() => {
        if (locationToDisplay?.displayName) {
            navigator.clipboard.writeText(locationToDisplay.displayName)
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        }
    }, [locationToDisplay]);

    return (
        <>
            <DraggableMap
                activeMarker={activeMarker}
                setActiveMarker={setActiveMarker}
                mapId="create-listing-map"
            />
            <div className="relative">
                <textarea
                    rows={2}
                    readOnly
                    onClick={copyLocation}
                    className={`
                        relative
                        flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        dark:bg-gray-900
                        w-[100%]
                        resize-none cursor-pointer
                    `}
                    placeholder="Location is displayed"
                    value={locationToDisplay ? locationToDisplay.displayName : ""}
                />
                {copied ? (
                    <CheckIcon className="absolute bottom-2 right-3 h-4 w-4 md:h-6 md:w-6 text-green-400" />
                ) : (
                    <ClipboardCopyIcon
                        className="absolute bottom-2 right-3 h-4 w-4 md:h-6 md:w-6 cursor-pointer"
                        onClick={copyLocation}
                    />
                )}
            </div>
        </>
    );
});