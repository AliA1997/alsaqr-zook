import { useEffect, useMemo, useState } from 'react';
import L, { DragEndEvent, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ProductMarker, SimilarProductRecord } from '@models/product';
import ProductCard from '@components/products/ProductCard';
import { getHowSimilarKey, openGoogleMaps } from '@utils/functions';
import { ButtonLoader } from './CustomLoader';

type MapViewProps = {
    mainCoords: ProductMarker;
    classNames?: string;
    similarProducts?: SimilarProductRecord[];
    setActiveMarker: (marker: { id: number, latitude: number, longitude: number }) => void;
    activeMarker: { id: number, latitude: number, longitude: number } | undefined;
    onlyDisplay?: boolean;
};

export function MapView({
    mainCoords,
    classNames,
    similarProducts,
    setActiveMarker,
    activeMarker,
    onlyDisplay
}: MapViewProps) {
    const [mounted, setMounted] = useState<boolean>(false);
    const [activeProductToDisplay, setActiveProductToDisplay] = useState<SimilarProductRecord | undefined>(undefined);
    const mapCoords: LatLngTuple = useMemo(() => {
        return activeMarker && activeMarker.latitude
            ? [activeMarker.latitude, activeMarker.longitude]
            : [mainCoords.latitude, mainCoords.longitude]
    }, [activeMarker]);

    useEffect(() => {
        let map;
        if(onlyDisplay)
            map = L.map('map', {
                dragging: false,
                doubleClickZoom: false,
                boxZoom: false,
                keyboard: false,
                scrollWheelZoom: false,
            }).setView(mapCoords, 12);
        else
            map = L.map('map').setView(mapCoords, 12);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '',
            subdomains: 'alsaqr-zook',
            maxZoom: 19
        }).addTo(map);

        const mainMarker = L.marker([mainCoords.latitude, mainCoords.longitude], {
            icon: L.icon({
                iconUrl: 'https://img.icons8.com/3d-fluency/94/marker.png',
                iconSize: [30, 30],
                iconAnchor: [15, 30],
            }),
        });
        mainMarker.on('click', () => {
            setActiveMarker({
                id: mainCoords.id,
                latitude: mainCoords.latitude,
                longitude: mainCoords.longitude
            });
        });
        mainMarker.on('dblclick', () => {
            openGoogleMaps(mainCoords.latitude, mainCoords.longitude);
        });
        mainMarker.bindPopup(`
            <strong>${mainCoords.name}</strong><br/>
            Price: $${mainCoords.price}
        `);

        mainMarker.addTo(map)

        // Define similar product markers
        if (similarProducts)
            similarProducts?.forEach((sPM) => {
                const marker = L.circleMarker([sPM.latitude, sPM.longitude], {
                    radius: 6,
                    color: 'white',
                    weight: 2,
                    fillColor: 'blue',
                    fillOpacity: 1,
                });

                marker.bindPopup(`
                    <strong>${sPM.title}</strong><br/>
                    Price: $${sPM.price}
                `);


                marker.on('click', () => {
                    setActiveMarker({
                        id: sPM.id,
                        latitude: sPM.latitude,
                        longitude: sPM.longitude
                    });
                });
                marker.on('dblclick', () => {
                    openGoogleMaps(sPM.latitude, sPM.longitude);
                });


                marker.addTo(map);
            });

        setMounted(true);

        return () => {
            map.remove();
        };
    }, [mainCoords, similarProducts, setActiveMarker, activeMarker]);


    useEffect(() => {
        const selectedProductInMap = similarProducts ? similarProducts.find(s => s.id === activeMarker?.id) : undefined;
        setActiveProductToDisplay(selectedProductInMap ? Object.assign({}, selectedProductInMap) : undefined);
    }, [activeMarker]);

    if (!mounted)
        <ButtonLoader />

    return (
        <div className='relative'>
            <div className={`w-[100%] h-[25rem] ${classNames && classNames}`} id="map" />
            {activeProductToDisplay ? (
                <ProductCard
                    testId="similarproductcard"
                    classNames="absolute top-0 right-0 h-full z-[999] w-[33%]"
                    product={activeProductToDisplay}
                    onClick={() => window.open(`/products/${activeProductToDisplay.slug}`, "_blank")}
                    howSimilar={getHowSimilarKey(activeProductToDisplay.titleSimilarity, activeProductToDisplay.categorySimilarity, activeProductToDisplay.descriptionSimilarity)}
                    showCategory={true}
                />
            ) : null}

        </div>
    );
}

type DraggableMapProps = {
    setActiveMarker: (marker: { latitude: number, longitude: number }) => void;
    activeMarker: { latitude: number, longitude: number };
    mapId: string;
}

export function DraggableMap({
    setActiveMarker,
    activeMarker,
    mapId
}: DraggableMapProps) {
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        let map = null;
        if (mounted) {

            map = L.map(mapId).setView([activeMarker?.latitude, activeMarker?.longitude], 12);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '',
                subdomains: 'alsaqr-zook',
                maxZoom: 19
            }).addTo(map);

            const mainMarker = L.marker([activeMarker?.latitude, activeMarker?.longitude], {
                icon: L.icon({
                    iconUrl: 'https://img.icons8.com/3d-fluency/94/marker.png',
                    iconSize: [30, 30],
                    iconAnchor: [15, 30],
                }),
                draggable: true
            });

            mainMarker.on('dragend', (ev: DragEndEvent) => {
                setActiveMarker({
                    latitude: ev.target._latlng['lat'],
                    longitude: ev.target._latlng['lng'],
                })
            })

            mainMarker.addTo(map)
        }

        return () => {
            if (map)
                map.remove();
        };
    }, [mounted]);

    if (!mounted)
        return <ButtonLoader />;

    return (
        <div className='w-[100%] h-[25rem]' id={mapId} />
    );
}