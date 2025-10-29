import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Pagination, PagingParams } from "@models/common";
import agent from "@utils/common";
import { ProductRecord } from "@models/product";
import { ProductCategories } from "@models/enums";
import { store } from ".";

export default class ToysAndGamesFeedStore {

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

    toysAndGamesRegistry: Map<number, ProductRecord> = new Map<number, ProductRecord>();

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }
    setPagination = (value: Pagination | undefined) => {
        this.pagination = value;
    }
    setSearchQry = (val: string) => this.predicate.set('searchQry', val);


    setToysAndGames = (toysAndGamesId: number, toysAndGames: ProductRecord) => {
        this.toysAndGamesRegistry.set(toysAndGamesId, toysAndGames);
    }

    setLoadingInitial = (value: boolean) => {
        this.loadingInitial = value;
    }

    resetFeedState = () => {
        this.predicate.clear();
        this.toysAndGamesRegistry.clear();
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

    loadToysAndGames = async () => {

        this.setLoadingInitial(true);
        try {
            const { items, pagination } = await agent.productApiClient.getNearbyProductsOnCategory(this.axiosParams, ProductCategories.ToysAndGames) ?? [];

            runInAction(() => {
                items.forEach((product: ProductRecord) => {
                    this.setToysAndGames(product.id, product);
                });

            });

            this.setPagination(pagination);
        } finally {
            this.setLoadingInitial(false);
        }

    }
 

    get nearbyToysAndGames() {
        return Array.from(this.toysAndGamesRegistry.values());
    }
}