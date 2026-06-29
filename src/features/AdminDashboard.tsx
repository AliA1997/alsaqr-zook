import { useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@stores/index";
import { OptimizedImage } from "@common/Image";
import { CommonLink } from "@common/Links";
import { NoRecordsTitle } from "@common/Titles";
import CustomPageLoader from "@common/CustomLoader";
import ProductCard from "@components/products/ProductCard";
import ProductOwnerActions from "@components/userProducts/ProductOwnerActions";

const ALSAQR_PROFILE_BASE = `${import.meta.env.VITE_PUBLIC_ALSAQR_URL}/users`;

const AdminDashboard = observer(() => {
    const { authStore, userProductsFeedStore } = useStore();
    const { currentSessionUser } = authStore;
    const { loadSellingProducts, nearbySellingProducts, loadingInitial } = userProductsFeedStore;

    useEffect(() => {
        void loadSellingProducts();
    }, [loadSellingProducts]);

    const userId = currentSessionUser?.id;
    // Only surface listings the member actually created (ownership is the creator check).
    const ownedProducts = useMemo(
        () => nearbySellingProducts.filter((p) => p.userId === userId),
        [nearbySellingProducts, userId]
    );

    return (
        <div className="w-full md:col-span-7 scrollbar-hide max-h-screen overflow-scroll lg:col-span-5 dark:border-gray-800">
            <div className="mb-[7rem]">
                {/* Header — admin identity + link back to the AlSaqr social profile. */}
                <div>
                    <div
                        className="w-full bg-cover bg-center bg-no-repeat"
                        style={{
                            height: "160px",
                            backgroundImage: currentSessionUser?.bgThumbnail
                                ? `url(${currentSessionUser.bgThumbnail})`
                                : undefined,
                        }}
                    />
                    <div className="relative p-4">
                        <div className="flex flex-col md:flex-row md:items-start">
                            <div className="flex flex-1 items-start justify-center md:justify-start">
                                <div className="relative -mt-20 md:-mt-24 h-24 w-24 md:h-36 md:w-36">
                                    <OptimizedImage
                                        src={currentSessionUser?.avatar ?? ""}
                                        alt={currentSessionUser?.username ?? "avatar"}
                                        classNames="rounded-full border-4 border-gray-900 object-cover bg-white dark:bg-black h-24 w-24 md:h-36 md:w-36"
                                    />
                                </div>
                            </div>
                            <div className="flex shrink-0 items-start justify-end">
                                {currentSessionUser ? (
                                    <CommonLink
                                        animatedLink={false}
                                        classNames="border border-[0.1rem] hover:text-[#55a8c2]"
                                        onClick={() =>
                                            window.open(
                                                `${ALSAQR_PROFILE_BASE}/${currentSessionUser.username}`,
                                                "_blank",
                                                "noopener,noreferrer"
                                            )
                                        }
                                    >
                                        View on AlSaqr
                                    </CommonLink>
                                ) : null}
                            </div>
                        </div>
                        <div className="mt-3 ml-1 space-y-1">
                            <h1 className="text-xl font-bold leading-6 text-gray-800 dark:text-white">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm font-medium leading-5 text-gray-600 dark:text-gray-400">
                                @{currentSessionUser?.username}
                            </p>
                            <p className="pt-1 text-sm text-gray-500 dark:text-gray-300">
                                Manage the listings you're selling.
                            </p>
                        </div>
                    </div>
                    <hr className="border-gray-800" />
                </div>

                <div className="p-4" data-testid="adminDashboardListings">
                    {loadingInitial && ownedProducts.length === 0 ? (
                        <CustomPageLoader title="Loading" />
                    ) : ownedProducts.length ? (
                        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                            {ownedProducts.map((product) => (
                                <div key={product.id} className="flex flex-col">
                                    <ProductCard product={product} showCategory testId="adminProductCard" />
                                    <ProductOwnerActions product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <NoRecordsTitle>You haven't listed anything for sale yet.</NoRecordsTitle>
                    )}
                </div>
            </div>
        </div>
    );
});

export default AdminDashboard;
