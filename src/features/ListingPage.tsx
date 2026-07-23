import { ContentContainerWithRef } from "@common/Containers";
import { SkeletonLoader } from "@common/CustomLoader";
import { MapView } from "@common/Map";
import ProductDetailCard from "@components/productDetails/ProductDetailsCard";
import ProductsMarquee from "@components/products/ProductMarquee";
import type { ProductRecord, SimilarProductRecord } from "@models/product";
import { useStore } from "@stores/index";
import {
  commonAgent,
// @ts-ignore: external URL import for runtime bundler
} from "https://cdn.jsdelivr.net/gh/AliA1997/alsaqr-core-web@v0.0.5/dist/alsaqr-web-core.js";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";


export default observer(() => {
    const [activeMarker, setActiveMarker] = useState<{
        id: number;
        latitude: number;
        longitude: number;
    } | undefined>(undefined);
    const { productFeedStore, commonStore } = useStore();
    const containerRef = useRef(null);

    const { productToViewId } = productFeedStore;
    const { userIpInfo } = commonStore;

    const [loadedProduct, setLoadedProduct] = useState<ProductRecord | undefined>(undefined);
    const [loadedSimilarProducts, setLoadedSimilarProducts] = useState<SimilarProductRecord[] | undefined>(undefined);

    const { productSlug } = useParams();

    const getUrlParams = () => {
        let urlParamsToReturn = new URLSearchParams();
        urlParamsToReturn.set("latitude", (userIpInfo?.latitude ?? 27.31).toString());
        urlParamsToReturn.set("longitude", (userIpInfo?.longitude ?? 102.2).toString());
        return urlParamsToReturn;
    }
    async function getProduct() {
        const urlParams = getUrlParams();
        const { product } = await commonAgent.productApiClient.getProduct(urlParams, productToViewId!);

        setLoadedProduct(product);
    }

    async function getSimilarProducts() {
        const urlParams = getUrlParams();
        const { similarProducts } = await commonAgent.productApiClient.getSimilarProducts(urlParams, productToViewId!);

        setLoadedSimilarProducts(similarProducts);
    }

    useEffect(() => {

        if (productSlug && productToViewId) {
            getProduct()
                .then(() => getSimilarProducts());
        }

        return () => {
            setLoadedSimilarProducts(undefined);
        }
    }, [productSlug])

    if (!loadedProduct || !loadedSimilarProducts)
        return <SkeletonLoader count={6} />;

    return (
        <ContentContainerWithRef
            classNames={`
                text-left scrollbar-hide
            `}
            innerRef={containerRef}
        >
            <div className={`scrollbar-hide max-h-screen overflow-scroll `}>
                <ProductDetailCard product={loadedProduct} />
                {loadedSimilarProducts && loadedSimilarProducts.length && <ProductsMarquee products={loadedSimilarProducts} />}
                <section className='relative mb-[4rem] p-[0.5rem]'>
                    <MapView
                        mainCoords={{
                            id: loadedProduct.id,
                            latitude: loadedProduct.latitude,
                            longitude: loadedProduct.longitude,
                            name: loadedProduct.title,
                            price: loadedProduct.price?.toString() ?? "0"
                        }}
                        similarProducts={loadedSimilarProducts && loadedSimilarProducts.length ? loadedSimilarProducts : []}
                        setActiveMarker={setActiveMarker}
                        activeMarker={activeMarker}
                    />
                </section>
                {loadedProduct && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://zook.alsaqr.app/",
                                "@type": "Product",
                                name: loadedProduct.title,
                                image: loadedProduct.images[0],
                                description: loadedProduct.description,
                                brand: {
                                    "@type": "Brand",
                                    name: "AlSaqr Zook",
                                },
                            })
                        }}
                    />
                )}
            </div>
        </ContentContainerWithRef>
    );
})