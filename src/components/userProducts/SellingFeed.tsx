import { useEffect, useRef, useState } from "react";
import { convertQueryStringToObject } from "@utils/index";
import { observer } from "mobx-react-lite";
import { useStore } from "@stores/index";
import { PagingParams } from "@models/common";
import { leadingDebounce } from "@utils/api/agent";
import { ContentContainerWithRef } from "@common/Containers";
import { NoRecordsTitle } from "@common/Titles";

import ProductCard from "@components/products/ProductCard";
import { SkeletonLoader } from "@common/CustomLoader";

const SellingFeed = observer(() => {
  const { userProductsFeedStore } = useStore();
  const {
    predicate,
    setPredicate,
    pagination,
    setPagingParams,
    pagingParams,
    loadSellingProducts,
    nearbySellingProducts,
    loadingInitial,
  } = userProductsFeedStore;
  const [mounted, setMounted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const containerRef = useRef(null);
  const loaderRef = useRef(null);

  const loadListings = async () => {
    await loadSellingProducts();
  };

  async function getListings() {
    leadingDebounce(async () => {
      setLoading(true);
      try {
        const paramsFromQryString = convertQueryStringToObject(
          window.location.search,
        );

        if (
          paramsFromQryString.currentPage &&
          paramsFromQryString.itemsPerPage &&
          (paramsFromQryString.currentPage !== predicate.get("currentPage") ||
            paramsFromQryString.itemsPerPage !==
              predicate.get("itemsPerPage") ||
            paramsFromQryString.searchTerm != predicate.get("searchTerm"))
        ) {
          setPagingParams(
            new PagingParams(
              paramsFromQryString.currentPage,
              paramsFromQryString.itemsPerPage,
            ),
          );
          setPredicate("searchTerm", paramsFromQryString.searchTerm);
        }

        await loadListings();
      } finally {
        setLoading(false);
      }
    }, 10000);
  }

  const fetchMoreItems = async (pageNum: number) => {
    setPagingParams(new PagingParams(pageNum, 10));
    await loadListings();
  };

  useEffect(() => {
    setMounted(true);
    getListings();
  }, []);

  // 1. Add this loader component at the end of your posts list
  const LoadMoreTrigger = () => {
    return (
      <div ref={loaderRef} style={{ height: "20px" }}>
        {loadingInitial && nearbySellingProducts.length > 0 && (
          <div>Loading more listings you sell...</div>
        )}
      </div>
    );
  };

  // 2. Fix your Intersection Observer useEffect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        const currentPage = pagination?.currentPage ?? 1;
        const itemsPerPage = pagination?.itemsPerPage ?? 10;
        const totalItems = pagination?.totalItems ?? 0;

        const nextPage = currentPage + 1;
        const totalItemsOnNextPage = nextPage * itemsPerPage;
        const hasMoreItems = totalItems >= totalItemsOnNextPage;
        if (firstEntry?.isIntersecting && !loadingInitial && hasMoreItems) {
          fetchMoreItems(pagingParams.currentPage + 1);
        }
      },
      {
        root: containerRef.current,
        rootMargin: "10px",
        threshold: 0.2,
      },
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

  if (!mounted || loading) return <SkeletonLoader count={7} />;

  return (
    <ContentContainerWithRef
      classNames={`
                    text-left scrollbar-hide
                `}
      innerRef={containerRef}
    >
      <div
        className={`
            scrollbar-hide max-h-screen overflow-scroll 
            dark:border-gray-800 grid w-full max-w-7xl ${nearbySellingProducts && nearbySellingProducts.length ? 
            "grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5" : "grid-cols-1 text-center"}
        `}
      >
        {nearbySellingProducts && nearbySellingProducts.length ? (
          nearbySellingProducts.map((listingRec) => (
            <ProductCard
              product={listingRec}
              key={listingRec.id}
              showCategory={true}
            />
          ))
        ) : (
          <NoRecordsTitle>
            {"You are not selling anything yet. :)"}
          </NoRecordsTitle>
        )}
        <LoadMoreTrigger />
      </div>
    </ContentContainerWithRef>
  );
});

export default SellingFeed;
