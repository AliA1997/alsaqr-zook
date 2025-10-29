
import { useEffect, useMemo, useRef, useState } from "react";
import { convertQueryStringToObject } from "@utils/index";
import { observer } from "mobx-react-lite";
import { useStore } from "@stores/index";
import { PagingParams } from "@models/common";
import { leadingDebounce } from "@utils/common";
import { ContentContainerWithRef } from "@common/Containers";
import { NoRecordsTitle } from "@common/Titles";

import CustomPageLoader from "@common/CustomLoader";
import { ProductCategories } from "@models/enums";
import ProductCard from "@components/products/ProductCard";

interface Props {
    productCategory?: ProductCategories;
}


const Feed = observer(({
    productCategory
}: Props) => {
    const {
        productFeedStore,
        vehicleFeedStore,
        rentalFeedStore,
        clothingFeedStore,
        electronicFeedStore,
        officeSuppliesFeedStore,
        petSuppliesFeedStore,
        sportingGoodsFeedStore,
        toysAndGamesFeedStore
    } = useStore();
    const [loading, setLoading] = useState<boolean>(false);
    const containerRef = useRef(null);
    const loaderRef = useRef(null);

    const feedLoadingInitial = useMemo(() => {
        if (productCategory === ProductCategories.Vehicles) return vehicleFeedStore.loadingInitial;
        else if (productCategory === ProductCategories.Rentals) return rentalFeedStore.loadingInitial;
        else if (productCategory === ProductCategories.Clothing) return clothingFeedStore.loadingInitial;
        else if (productCategory === ProductCategories.Electronics) return electronicFeedStore.loadingInitial;
        else if (productCategory === ProductCategories.OfficeSupplies) return officeSuppliesFeedStore.loadingInitial;
        else if (productCategory === ProductCategories.PetSupplies) return petSuppliesFeedStore.loadingInitial;
        else if (productCategory === ProductCategories.SportingGoods) return sportingGoodsFeedStore.loadingInitial;
        else if (productCategory === ProductCategories.ToysAndGames) return toysAndGamesFeedStore.loadingInitial;
        else return productFeedStore.loadingInitial;
    }, [
        productFeedStore.loadingInitial,
        vehicleFeedStore.loadingInitial,
        rentalFeedStore.loadingInitial,
        clothingFeedStore.loadingInitial,
        electronicFeedStore.loadingInitial,
        officeSuppliesFeedStore.loadingInitial,
        petSuppliesFeedStore.loadingInitial,
        sportingGoodsFeedStore.loadingInitial,
        toysAndGamesFeedStore.loadingInitial
    ]);

    const setFeedPagingParams = useMemo(() => {
        if (productCategory === ProductCategories.Vehicles) return vehicleFeedStore.setPagingParams;
        else if (productCategory === ProductCategories.Rentals) return rentalFeedStore.setPagingParams;
        else if (productCategory === ProductCategories.Clothing) return clothingFeedStore.setPagingParams;
        else if (productCategory === ProductCategories.Electronics) return electronicFeedStore.setPagingParams;
        else if (productCategory === ProductCategories.OfficeSupplies) return officeSuppliesFeedStore.setPagingParams;
        else if (productCategory === ProductCategories.PetSupplies) return petSuppliesFeedStore.setPagingParams;
        else if (productCategory === ProductCategories.SportingGoods) return sportingGoodsFeedStore.setPagingParams;
        else if (productCategory === ProductCategories.ToysAndGames) return toysAndGamesFeedStore.setPagingParams;
        else return productFeedStore.setPagingParams;
    }, [
        productFeedStore.pagingParams.currentPage,
        vehicleFeedStore.pagingParams.currentPage,
        rentalFeedStore.pagingParams.currentPage,
        clothingFeedStore.pagingParams.currentPage,
        electronicFeedStore.pagingParams.currentPage,
        officeSuppliesFeedStore.pagingParams.currentPage,
        petSuppliesFeedStore.pagingParams.currentPage,
        sportingGoodsFeedStore.pagingParams.currentPage,
        toysAndGamesFeedStore.pagingParams.currentPage
    ]);

    const setFeedPredicate = useMemo(() => {
        if (productCategory === ProductCategories.Vehicles) return vehicleFeedStore.setPredicate;
        else if (productCategory === ProductCategories.Rentals) return rentalFeedStore.setPredicate;
        else if (productCategory === ProductCategories.Clothing) return clothingFeedStore.setPredicate;
        else if (productCategory === ProductCategories.Electronics) return electronicFeedStore.setPredicate;
        else if (productCategory === ProductCategories.OfficeSupplies) return officeSuppliesFeedStore.setPredicate;
        else if (productCategory === ProductCategories.PetSupplies) return petSuppliesFeedStore.setPredicate;
        else if (productCategory === ProductCategories.SportingGoods) return sportingGoodsFeedStore.setPredicate;
        else if (productCategory === ProductCategories.ToysAndGames) return toysAndGamesFeedStore.setPredicate;
        else return productFeedStore.setPredicate;
    }, []);

    const feedPagingParams = useMemo(() => {
        if (productCategory === ProductCategories.Vehicles) return vehicleFeedStore.pagingParams;
        else if (productCategory === ProductCategories.Rentals) return rentalFeedStore.pagingParams;
        else if (productCategory === ProductCategories.Clothing) return clothingFeedStore.pagingParams;
        else if (productCategory === ProductCategories.Electronics) return electronicFeedStore.pagingParams;
        else if (productCategory === ProductCategories.OfficeSupplies) return officeSuppliesFeedStore.pagingParams;
        else if (productCategory === ProductCategories.PetSupplies) return petSuppliesFeedStore.pagingParams;
        else if (productCategory === ProductCategories.SportingGoods) return sportingGoodsFeedStore.pagingParams;
        else if (productCategory === ProductCategories.ToysAndGames) return toysAndGamesFeedStore.pagingParams;
        else return productFeedStore.pagingParams;
    }, [
        productFeedStore.pagingParams.currentPage,
        vehicleFeedStore.pagingParams.currentPage,
        rentalFeedStore.pagingParams.currentPage,
        clothingFeedStore.pagingParams.currentPage,
        electronicFeedStore.pagingParams.currentPage,
        officeSuppliesFeedStore.pagingParams.currentPage,
        petSuppliesFeedStore.pagingParams.currentPage,
        sportingGoodsFeedStore.pagingParams.currentPage,
        toysAndGamesFeedStore.pagingParams.currentPage
    ]);
    const feedPagination = useMemo(() => {
        if (productCategory === ProductCategories.Vehicles) return vehicleFeedStore.pagination;
        else if (productCategory === ProductCategories.Rentals) return rentalFeedStore.pagination;
        else if (productCategory === ProductCategories.Clothing) return clothingFeedStore.pagination;
        else if (productCategory === ProductCategories.Electronics) return electronicFeedStore.pagination;
        else if (productCategory === ProductCategories.OfficeSupplies) return officeSuppliesFeedStore.pagination;
        else if (productCategory === ProductCategories.PetSupplies) return petSuppliesFeedStore.pagination;
        else if (productCategory === ProductCategories.SportingGoods) return sportingGoodsFeedStore.pagination;
        else if (productCategory === ProductCategories.ToysAndGames) return toysAndGamesFeedStore.pagination;
        else return productFeedStore.pagination;
    }, [
        productFeedStore.nearbyProducts,
        productFeedStore.pagingParams.currentPage,
        vehicleFeedStore.nearbyVehicles,
        vehicleFeedStore.pagingParams.currentPage,
        rentalFeedStore.nearbyRentals,
        rentalFeedStore.pagingParams.currentPage,
        clothingFeedStore.nearbyClothing,
        clothingFeedStore.pagingParams.currentPage,
        electronicFeedStore.nearbyElectronics,
        electronicFeedStore.pagingParams.currentPage,
        officeSuppliesFeedStore.nearbyOfficeSupplies,
        officeSuppliesFeedStore.pagingParams.currentPage,
        petSuppliesFeedStore.nearbyPetSupplies,
        petSuppliesFeedStore.pagingParams.currentPage,
        sportingGoodsFeedStore.nearbySportingGoods,
        sportingGoodsFeedStore.pagingParams.currentPage,
        toysAndGamesFeedStore.nearbyToysAndGames,
        toysAndGamesFeedStore.pagingParams.currentPage
    ]);

    const filterPredicate: Map<string, any> = useMemo(() => {
        if (productCategory === ProductCategories.Vehicles) return vehicleFeedStore.predicate;
        else if (productCategory === ProductCategories.Rentals) return rentalFeedStore.predicate;
        else if (productCategory === ProductCategories.Clothing) return clothingFeedStore.predicate;
        else if (productCategory === ProductCategories.Electronics) return electronicFeedStore.predicate;
        else if (productCategory === ProductCategories.OfficeSupplies) return officeSuppliesFeedStore.predicate;
        else if (productCategory === ProductCategories.PetSupplies) return petSuppliesFeedStore.predicate;
        else if (productCategory === ProductCategories.SportingGoods) return sportingGoodsFeedStore.predicate;
        else if (productCategory === ProductCategories.ToysAndGames) return toysAndGamesFeedStore.predicate;
        else return productFeedStore.predicate;
    }, []);

    const loadListings = async () => {
        if (productCategory === ProductCategories.Vehicles) await vehicleFeedStore.loadVehicles();
        else if (productCategory === ProductCategories.Rentals) await rentalFeedStore.loadRentals();
        else if (productCategory === ProductCategories.Clothing) await clothingFeedStore.loadClothing();
        else if (productCategory === ProductCategories.Electronics) await electronicFeedStore.loadElectronics();
        else if (productCategory === ProductCategories.OfficeSupplies) await officeSuppliesFeedStore.loadOfficeSupplies();
        else if (productCategory === ProductCategories.PetSupplies) await petSuppliesFeedStore.loadPetSupplies();
        else if (productCategory === ProductCategories.SportingGoods) await sportingGoodsFeedStore.loadSportingGoods();
        else if (productCategory === ProductCategories.ToysAndGames) await toysAndGamesFeedStore.loadToysAndGames();
        else await productFeedStore.loadProducts();
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
                    && (paramsFromQryString.currentPage !== filterPredicate.get('currentPage')
                        || paramsFromQryString.itemsPerPage !== filterPredicate.get('itemsPerPage')
                        || paramsFromQryString.searchTerm != filterPredicate.get('searchTerm'))) {

                    setFeedPagingParams(new PagingParams(paramsFromQryString.currentPage, paramsFromQryString.itemsPerPage));
                    setFeedPredicate('searchTerm', paramsFromQryString.searchTerm);
                }

                await loadListings();
            } finally {
                setLoading(false);
            }
        }, 10000);
    }

    const fetchMoreItems = async (pageNum: number) => {
        setFeedPagingParams(new PagingParams(pageNum, 10))
        await loadListings();
    };


    useEffect(() => {

        getListings();
    }, []);

    const loadedListings = useMemo(() => {
        if (productCategory === ProductCategories.Vehicles) return vehicleFeedStore.nearbyVehicles;
        else if (productCategory === ProductCategories.Rentals) return rentalFeedStore.nearbyRentals;
        else if (productCategory === ProductCategories.Clothing) return clothingFeedStore.nearbyClothing;
        else if (productCategory === ProductCategories.Electronics) return electronicFeedStore.nearbyElectronics;
        else if (productCategory === ProductCategories.OfficeSupplies) return officeSuppliesFeedStore.nearbyOfficeSupplies;
        else if (productCategory === ProductCategories.PetSupplies) return petSuppliesFeedStore.nearbyPetSupplies;
        else if (productCategory === ProductCategories.SportingGoods) return sportingGoodsFeedStore.nearbySportingGoods;
        else if (productCategory === ProductCategories.ToysAndGames) return toysAndGamesFeedStore.nearbyToysAndGames;
        else return productFeedStore.nearbyProducts;

    }, [
        productFeedStore.nearbyProducts,
        vehicleFeedStore.nearbyVehicles,
        rentalFeedStore.nearbyRentals,
        clothingFeedStore.nearbyClothing,
        electronicFeedStore.nearbyElectronics,
        officeSuppliesFeedStore.nearbyOfficeSupplies,
        petSuppliesFeedStore.nearbyPetSupplies,
        sportingGoodsFeedStore.nearbySportingGoods,
        toysAndGamesFeedStore.nearbyToysAndGames,
    ]);


    // 1. Add this loader component at the end of your posts list
    const LoadMoreTrigger = () => {
        return (
            <div ref={loaderRef} style={{ height: '20px' }}>
                {feedLoadingInitial && loadedListings.length > 0 && <div>Loading more listings...</div>}
            </div>
        );
    };

    // 2. Fix your Intersection Observer useEffect
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const firstEntry = entries[0];
                const currentPage = feedPagination?.currentPage ?? 1;
                const itemsPerPage = feedPagination?.itemsPerPage ?? 10;
                const totalItems = feedPagination?.totalItems ?? 0;

                const nextPage = currentPage + 1;
                const totalItemsOnNextPage = nextPage * itemsPerPage;
                const hasMoreItems = (totalItems >= totalItemsOnNextPage);
                if (firstEntry?.isIntersecting && !feedLoadingInitial && hasMoreItems) {
                    fetchMoreItems(feedPagingParams.currentPage + 1);
                }
            },
            {
                root: containerRef.current,
                rootMargin: '10px',
                threshold: 0.2
            }
        );

        const currentLoader = loaderRef.current;
        if (currentLoader) {
            observer.observe(currentLoader);
        }

        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader);
            }
        };
    }, []);

    if (loading)
        return <CustomPageLoader title="Loading" />;

    return (
        <ContentContainerWithRef
            classNames={`
                text-left scrollbar-hide
            `}
            innerRef={containerRef}
        >
            <div className={`
                scrollbar-hide max-h-screen overflow-scroll 
                dark:border-gray-800 grid w-full max-w-7xl grid-cols-2 
                gap-4 sm:grid-cols-3 md:grid-cols-4 ${productCategory ? "" : "xl:grid-cols-5"}
            `}>
                {loadedListings && loadedListings.length
                    ? loadedListings.map((listingRec) => (
                        <ProductCard product={listingRec} key={listingRec.id} showCategory={!productCategory} />
                    ))
                    : <NoRecordsTitle>No Listings to show</NoRecordsTitle>}
                <LoadMoreTrigger />
            </div>
        </ContentContainerWithRef>
    );
});


export default Feed;
