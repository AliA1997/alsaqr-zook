import { useEffect, useRef, useState } from "react";
import { convertQueryStringToObject } from "@utils/index";
import { observer } from "mobx-react-lite";
import { useStore } from "@stores/index";
import { PagingParams } from "@models/common";
import { leadingDebounce } from "@utils/common";
import { ContentContainerWithRef } from "@common/Containers";
import { NoRecordsTitle } from "@common/Titles";

import CustomPageLoader from "@common/CustomLoader";
import ProductCard from "@components/products/ProductCard";


const BuyingFeed = observer(() => {
    const {
        userProductsFeedStore
    } = useStore();
    const {
        predicate,
        setPredicate,
        setPagingParams,
        loadBuyingProducts,
        nearbyBuyingProducts,
        loadingInitial
     } = userProductsFeedStore;
    const [loading, setLoading] = useState<boolean>(false);
    const containerRef = useRef(null);
    const loaderRef = useRef(null);

    const loadListings = async () => {
        await loadBuyingProducts();
    }

    async function getListings() {
        leadingDebounce(async () => {

            setLoading(true);
            try {
                const paramsFromQryString = convertQueryStringToObject(
                    window.location.search
                );

                if (
                    (paramsFromQryString.currentPage && paramsFromQryString.itemsPerPage)
                    && (paramsFromQryString.currentPage !== predicate.get('currentPage')
                        || paramsFromQryString.itemsPerPage !== predicate.get('itemsPerPage')
                        || paramsFromQryString.searchTerm != predicate.get('searchTerm'))) {

                    setPagingParams(new PagingParams(paramsFromQryString.currentPage, paramsFromQryString.itemsPerPage));
                    setPredicate('searchTerm', paramsFromQryString.searchTerm);
                }

                await loadListings();
            } finally {
                setLoading(false);
            }
        }, 10000);
    }

    useEffect(() => {

        getListings();
    }, []);

    // 1. Add this loader component at the end of your posts list
    const LoadMoreTrigger = () => {
        return (
            <div ref={loaderRef} style={{ height: '20px' }}>
                {loadingInitial && nearbyBuyingProducts.length > 0 && <div>Loading more listings you can buy...</div>}
            </div>
        );
    };

    if (loading)
        return <CustomPageLoader title="Loading" />;

    return (
        <ContentContainerWithRef
            classNames={`
                text-left overflow-y-auto scrollbar-hide
                grid w-full max-w-7xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 
            `}
            innerRef={containerRef}
        >
                {nearbyBuyingProducts && nearbyBuyingProducts.length
                    ? nearbyBuyingProducts.map((listingRec) => (
                        <ProductCard product={listingRec} key={listingRec.id} showCategory={true} />
                    ))
                    : <NoRecordsTitle>{"No products to show. :)"}</NoRecordsTitle>}
                <LoadMoreTrigger />
        </ContentContainerWithRef>
    );
});

export default BuyingFeed;
