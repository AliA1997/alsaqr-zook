import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Comment, CommentToDisplay, PostRecord, PostToDisplay } from "@typings";
import { Pagination, PagingParams } from "@models/common";

export default class FeedStore {

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () => {}
        );
    }


    loadingInitial = false;
    loadingUpsert = false;
    loadingPost = false;
    loadingComments = false;
    predicate = new Map();
    setPredicate = (predicate: string, value: string | number | Date | undefined) => {
        if(value) {
            this.predicate.set(predicate, value);
        } else {
            this.predicate.delete(predicate);
        }
    }
    pagingParams: PagingParams = new PagingParams(1, 10);
    pagination: Pagination | undefined = undefined;

    zookPostingsRegistry: Map<string, PostToDisplay> = new Map<string, PostToDisplay>();
    commentsRegistry: Map<string, Comment> = new Map<string, Comment>();

    loadedPost: PostToDisplay | undefined = undefined;

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }
    setPagination = (value: Pagination | undefined) => {
        this.pagination = value;
    }
    setSearchQry = (val: string) => this.predicate.set('searchQry', val);


    setPost = (postId: string, post: PostToDisplay) => {
        this.zookPostingsRegistry.set(postId, post);
    }
    setComment = (commentId: string, comment: CommentToDisplay) => {
        this.commentsRegistry.set(commentId, comment);
    }

    setLoadingInitial = (value: boolean) => {
        this.loadingInitial = value;
    }
    setLoadingUpsert = (value: boolean) => {
        this.loadingUpsert = value;
    }
    setLoadingPost = (value: boolean) => {
        this.loadingPost = value;
    }
    setLoadingComments = (value: boolean) => {
        this.loadingComments = value;
    }
    setLoadedPost = (value: PostToDisplay) => {
        this.loadedPost = value;
    }


    resetFeedState = () => {
        this.predicate.clear();
        this.zookPostingsRegistry.clear();
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append("currentPage", this.pagingParams.currentPage.toString());
        params.append("itemsPerPage", this.pagingParams.itemsPerPage.toString());
        this.predicate.forEach((value, key) => params.append(key, value));

        return params;
    }

    loadPosts = async () => {

        this.setLoadingInitial(true);

        try {
            if(this.pagingParams.currentPage === 1)
                this.zookPostingsRegistry.clear();
        
            // const { items, pagination } = await agent.postApiClient.getPosts(this.axiosParams) ?? [];
            
            runInAction(() => {
                // items.forEach((pst: PostToDisplay) => {
                //     this.setPost(pst.post.id, pst);
                // });
                
                // this.setPagination(pagination);
            });

        } finally {
            this.setLoadingInitial(false);
            // alert(this.postsRegistry.size)
        }

    }

    addPost = async (newPost: PostRecord) => {
        console.log('newposting:', newPost)
        this.setLoadingInitial(true);
        try {
            // await agent.postApiClient.addPost(newPost) ?? {};

        } finally {
            this.setLoadingInitial(false);
        }

    }

    deleteYourPost = async (postId: string) => {
        console.log('postId:', postId)

        this.setLoadingUpsert(true);
        try {
            // await agent.mutatePostApiClient.deleteYourPost(postId) ?? {};

        } finally {
            this.setLoadingUpsert(false);
        }

    }

    loadPost = async (postId: string) => {
        console.log(postId);
        this.setLoadingPost(true);
        try {
            // const {post} = await agent.postApiClient.getPost(postId) ?? {};

            runInAction(() => {
                // this.setLoadedPost(post);
            });
        } finally {
            this.setLoadingPost(false);
        }

    }

    get comments() {
        return Array.from(this.commentsRegistry.values());
    }


    get zookPostings() {
        return Array.from(this.zookPostingsRegistry.values());
    }
}