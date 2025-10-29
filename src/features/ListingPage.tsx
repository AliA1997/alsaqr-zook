import CustomPageLoader from "@common/CustomLoader";
import ProductDetailCard from "@components/productDetails/ProductDetailsCard";
import ProductsMarquee from "@components/products/ProductMarquee";
import type { ProductRecord, SimilarProductRecord } from "@models/product";
import { useStore } from "@stores/index";
import { productApiClient } from "@utils/productApiClient";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useParams } from "react-router";


export default observer(() => {
    const { productFeedStore, commonStore } = useStore();
    const { productToViewId, setProductToViewId } = productFeedStore;
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
        const { product } = await productApiClient.getProduct(urlParams, productToViewId!);

        setLoadedProduct(product);
    }

    async function getSimilarProducts() {
        const urlParams = getUrlParams();
        const { similarProducts } = await productApiClient.getSimilarProducts(urlParams, productToViewId!);

        setLoadedSimilarProducts(similarProducts);
    }

    useEffect(() => {
        if(productSlug && productToViewId) {
            getProduct()
                .then(() => getSimilarProducts());
        }

        return () => {
            setProductToViewId(undefined);
            setLoadedSimilarProducts(undefined);
        }
    }, [productSlug])

    if(!loadedProduct || !loadedSimilarProducts)
        return <CustomPageLoader title="Loading" />;

    return (
        <>
            <ProductDetailCard product={loadedProduct} />
            {loadedSimilarProducts && loadedSimilarProducts.length && <ProductsMarquee products={loadedSimilarProducts} />}
            {loadedProduct && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify({
                        "@context": "https://zook.alsaqr.app/",
                        "@type": "Product",
                        name: loadedProduct.title,
                        image: loadedProduct.images[0],
                        description: loadedProduct.description,
                        brand: {
                            "@type": "Brand",
                            name: "AlSaqr Zook",
                        },
                    }) }}
                />
            )}
        </>
    );
})