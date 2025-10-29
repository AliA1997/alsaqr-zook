import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Pagination, PagingParams } from "@models/common";
import agent from "@utils/common";
import { ProductRecord } from "@models/product";
import { ProductCategories } from "@models/enums";
import { store } from ".";

export default class SportingGoodsFeedStore {

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () => {}
        );
    }


    loadingInitial = false;
    predicate = new Map();
    setPredicate = (predicate: string, value: string | number | Date | undefined) => {
        if(value) {
            this.predicate.set(predicate, value);
        } else {
            this.predicate.delete(predicate);
        }
    }
    pagingParams: PagingParams = new PagingParams(1, 25);
    pagination: Pagination | undefined = undefined;

    sportingGoodsRegistry: Map<number, ProductRecord> = new Map<number, ProductRecord>();

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }
    setPagination = (value: Pagination | undefined) => {
        this.pagination = value;
    }
    setSearchQry = (val: string) => this.predicate.set('searchQry', val);


    setSportingGoods = (sportingGoodsId: number, sportingGoods: ProductRecord) => {
        this.sportingGoodsRegistry.set(sportingGoodsId, sportingGoods);
    }

    setLoadingInitial = (value: boolean) => {
        this.loadingInitial = value;
    }

    resetFeedState = () => {
        this.predicate.clear();
        this.sportingGoodsRegistry.clear();
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append("currentPage", this.pagingParams.currentPage.toString());
        params.append("itemsPerPage", this.pagingParams.itemsPerPage.toString());
        params.append("latitude", store.commonStore.userIpInfo?.latitude?.toString() ?? "27.7671");
        params.append("longitude", store.commonStore.userIpInfo?.longitude?.toString() ?? "82.6384");
                
        this.predicate.forEach((value, key) => params.append(key, value));

        return params;
    }

    loadSportingGoods = async () => {

        this.setLoadingInitial(true);
        try {
            const { items, pagination } = await agent.productApiClient.getNearbyProductsOnCategory(this.axiosParams, ProductCategories.SportingGoods) ?? [];

            runInAction(() => {
                items.forEach((product: ProductRecord) => {
                    this.setSportingGoods(product.id, product);
                });

            });

            this.setPagination(pagination);
        } finally {
            this.setLoadingInitial(false);
        }

    }
 

    get nearbySportingGoods() {
        return Array.from(this.sportingGoodsRegistry.values());
    }
}