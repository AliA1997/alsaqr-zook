import { useContext, createContext } from 'react';
import CommonStore from './commonStore';
import ModalStore from './modalStore';
import AuthStore from './authStore';
import FeedStore from './feedStore';
import ListFeedStore from './listFeedStore';
import NotificationStore from './notificationStore';
import UserStore from './userStore';
import MessageStore from './messageStore';
import CommentFeedStore from './commentFeedStore';
import SettingsStore from './settingsStore';
import SearchStore from './searchStore';
import ClothingFeedStore from './clothingFeedStore';
import ElectronicsFeedStore from './electronicFeedStore';
import OfficeSuppliesFeedStore from './officeSuppliesFeedStore';
import PetSuppliesFeedStore from './petSuppliesFeedStore';
import ProductFeedStore from './productFeedStore';
import SportingGoodsFeedStore from './sportingGoodsFeedStore';
import ToysAndGamesFeedStore from './toysAndGamesFeedStore';
import VehicleFeedStore from './vehicleFeedStore';
import RentalsFeedStore from './rentalFeedStore';
import UserProductsFeedStore from './userProductsFeedStore';

interface Store {
    authStore: AuthStore;
    clothingFeedStore: ClothingFeedStore;
    commentFeedStore: CommentFeedStore;
    commonStore: CommonStore;
    electronicFeedStore: ElectronicsFeedStore;
    modalStore: ModalStore;
    feedStore: FeedStore;
    listFeedStore: ListFeedStore;
    messageStore: MessageStore;
    notificationStore: NotificationStore;
    officeSuppliesFeedStore: OfficeSuppliesFeedStore;
    petSuppliesFeedStore: PetSuppliesFeedStore;
    productFeedStore: ProductFeedStore;
    rentalFeedStore: RentalsFeedStore;
    searchStore: SearchStore;
    settingsStore: SettingsStore;
    sportingGoodsFeedStore: SportingGoodsFeedStore;
    toysAndGamesFeedStore: ToysAndGamesFeedStore;
    userStore: UserStore;
    userProductsFeedStore: UserProductsFeedStore;
    vehicleFeedStore: VehicleFeedStore;
}


export enum FilterKeys {
  Search = 'search',
  SearchUsers = 'search-users',
  SearchPosts = 'search-posts',
  MyBookmarks = "my-bookmarks",
  Explore = 'explore',
  Normal = 'normal',
  Lists = "lists",
  Community = "community",
  CommunityDiscussion = "community-discussion",
  Register = "register"
}


export const store: Store = {
    authStore: new AuthStore(),
    clothingFeedStore: new ClothingFeedStore(),
    commonStore: new CommonStore(),
    commentFeedStore: new CommentFeedStore(),
    electronicFeedStore: new ElectronicsFeedStore(),
    modalStore: new ModalStore(),
    feedStore: new FeedStore(),
    listFeedStore: new ListFeedStore(),
    messageStore: new MessageStore(),
    notificationStore: new NotificationStore(),
    officeSuppliesFeedStore: new OfficeSuppliesFeedStore(),
    petSuppliesFeedStore: new PetSuppliesFeedStore(),
    productFeedStore: new ProductFeedStore(),
    rentalFeedStore: new RentalsFeedStore(),
    searchStore: new SearchStore(),
    settingsStore: new SettingsStore(),
    sportingGoodsFeedStore: new SportingGoodsFeedStore(),
    toysAndGamesFeedStore: new ToysAndGamesFeedStore(),
    userStore: new UserStore(),
    userProductsFeedStore: new UserProductsFeedStore(),
    vehicleFeedStore: new VehicleFeedStore()
};

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}
