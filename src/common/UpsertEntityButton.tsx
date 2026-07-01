import { observer } from "mobx-react-lite";
import { PlusIcon } from "@heroicons/react/outline";
import { useStore } from "@stores/index";
import UpsertProductModal from "@components/userProducts/UpsertProductModal";

interface UpsertEntityButtonProps {
    label?: string;
    classNames?: string;
}

// Logged-in-only entry point for the create-listing flow. Opens the UpsertProductModal
// in create mode (the two-step Information / Category & Attributes wizard) and refreshes
// the selling feed once a listing is created. Hidden entirely when logged out so
// unauthenticated users never see mutating actions.
const UpsertEntityButton = observer(({ label, classNames }: UpsertEntityButtonProps) => {
    const { authStore, userProductsFeedStore, modalStore } = useStore();
    const { currentSessionUser } = authStore;
    const { loadSellingProducts } = userProductsFeedStore;
    const { showModal, closeModal } = modalStore;

    if (!currentSessionUser) return null;

    const openCreateProduct = () =>
        showModal(
            <UpsertProductModal onClose={closeModal} onSuccess={loadSellingProducts} />
        );

    return (
        <button
            type="button"
            data-testid="createProductButton"
            onClick={openCreateProduct}
            className={`inline-flex items-center rounded-full bg-[#55a8c2] px-5 py-3 text-md lg:text-lg font-bold text-white hover:opacity-90 ${classNames ?? ""}`}
        >
            <PlusIcon className="mr-2 h-4 w-4 transition-transform duration-150 ease-out group-hover:scale-125" />
            {label ?? "Create Product"}
        </button>
    );
});

export default UpsertEntityButton;
