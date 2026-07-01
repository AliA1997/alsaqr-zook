import { observer } from "mobx-react-lite";
import { useStore } from "@stores/index";
import { ProductRecord } from "@models/product";
import { AbsoluteDangerButton, InfoButton } from "@common/Buttons";
import UpsertProductModal from "./UpsertProductModal";
import DeleteProductModal from "./DeleteProductModal";

interface ProductOwnerActionsProps {
    product: ProductRecord;
}


const ProductOwnerActions = observer(({ product }: ProductOwnerActionsProps) => {
    const { authStore, userProductsFeedStore, modalStore } = useStore();
    const { currentSessionUser } = authStore;
    const { loadSellingProducts } = userProductsFeedStore;
    const { showModal, closeModal } = modalStore;

    const isOwner = !!currentSessionUser && currentSessionUser.id === product.userId;
    if (!isOwner) return null;

    const openEdit = () =>
        showModal(
            <UpsertProductModal
                product={product}
                onClose={closeModal}
                onSuccess={loadSellingProducts}
            />
        );

    const openDelete = () =>
        showModal(
            <DeleteProductModal
                product={product}
                onClose={closeModal}
                onSuccess={loadSellingProducts}
            />
        );

    return (
        <div className="flex gap-2 px-2 py-2">
            <InfoButton classNames="bg-[#55a8c2] text-white rounded" onClick={openEdit}>Edit</InfoButton>
            <AbsoluteDangerButton classNames="bg-red-500 hover:bg-red-600 text-white rounded" onClick={openDelete}>Delete</AbsoluteDangerButton>
        </div>
    );
});

export default ProductOwnerActions;
