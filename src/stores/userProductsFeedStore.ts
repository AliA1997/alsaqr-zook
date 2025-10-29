import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Pagination, PagingParams } from "@models/common";
import agent from "@utils/common";
import { ProductRecord } from "@models/product";
import { store } from ".";

export default class UserProductsFeedStore {

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () => { }
        );
    }

    loadingInitial = false;
    predicate = new Map();
    setPredicate = (predicate: string, value: string | number | Date | undefined) => {
        if (value) {
            this.predicate.set(predicate, value);
        } else {
            this.predicate.delete(predicate);
        }
    }
    pagingParams: PagingParams = new PagingParams(1, 25);
    pagination: Pagination | undefined = undefined;

    sellingProductsRegistry: Map<number, ProductRecord> = new Map<number, ProductRecord>();
    buyingProductsRegistry: Map<number, ProductRecord> = new Map<number, ProductRecord>();

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }
    setPagination = (value: Pagination | undefined) => {
        this.pagination = value;
    }
    setSearchQry = (val: string) => this.predicate.set('searchQry', val);


    setSellingProduct = (productId: number, product: ProductRecord) => {
        this.sellingProductsRegistry.set(productId, product);
    }
    setBuyingProduct = (productId: number, product: ProductRecord) => {
        this.buyingProductsRegistry.set(productId, product);
    }
    
    setLoadingInitial = (value: boolean) => {
        this.loadingInitial = value;
    }

    resetFeedState = () => {
        this.predicate.clear();
        this.sellingProductsRegistry.clear();
        this.buyingProductsRegistry.clear();
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append("currentPage", this.pagingParams.currentPage.toString());
        params.append("itemsPerPage", this.pagingParams.itemsPerPage.toString());
        params.append("latitude", store.commonStore.userIpInfo?.latitude?.toString() ?? "27.7671");
        params.append("longitude", store.commonStore.userIpInfo?.longitude?.toString() ?? "82.6384");

        params.append('all', 'true');
        this.predicate.forEach((value, key) => params.append(key, value));

        return params;
    }

    loadSellingProducts = async () => {

        this.setLoadingInitial(true);
        
        try {
            this.sellingProductsRegistry.clear();
            const { items, pagination } = await agent.productApiClient.getSellingProducts(this.axiosParams) ?? [];

            runInAction(() => {
                items.forEach((product: ProductRecord) => {
                    this.setSellingProduct(product.id, product);
                });

            });

            this.setPagination(pagination);
        } finally {
            this.setLoadingInitial(false);
        }

    }

    loadBuyingProducts = async () => {

        this.setLoadingInitial(true);
        
        try {
            this.sellingProductsRegistry.clear();
            const { items, pagination } = await agent.productApiClient.getBuyingProducts(this.axiosParams) ?? [];

            runInAction(() => {
                items.forEach((product: ProductRecord) => {
                    this.setBuyingProduct(product.id, product);
                });

            });

            this.setPagination(pagination);
        } finally {
            this.setLoadingInitial(false);
        }

    }


    get nearbySellingProducts() {
        return Array.from(this.sellingProductsRegistry.values());
    }
    get nearbyBuyingProducts() {
        return Array.from(this.buyingProductsRegistry.values());
    }
}