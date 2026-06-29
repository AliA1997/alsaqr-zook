import { observer } from "mobx-react-lite";
import toast from "react-hot-toast";
import { useStore } from "@stores/index";
import { ProductRecord } from "@models/product";
import { ModalBody, ModalPortal, ConfirmModal } from "@common/Modal";
import { AbsoluteDangerButton, InfoButton } from "@common/Buttons";
import EditProductForm from "./EditProductForm";

interface ProductOwnerActionsProps {
    product: ProductRecord;
}

// Renders edit/delete controls only when the logged-in user created the listing.
// The API enforces this server-side too (via the bearer token); this only hides the
// controls from non-owners. Every mutation is gated behind the custom confirm modal.
const ProductOwnerActions = observer(({ product }: ProductOwnerActionsProps) => {
    const { authStore, userProductsFeedStore, modalStore } = useStore();
    const { currentSessionUser } = authStore;
    const { deleteProduct } = userProductsFeedStore;
    const { showModal, closeModal } = modalStore;

    const isOwner = !!currentSessionUser && currentSessionUser.id === product.userId;
    if (!isOwner) return null;

    const openEdit = () =>
        showModal(
            <ModalPortal>
                <ModalBody onClose={closeModal}>
                    <EditProductForm product={product} onClose={closeModal} />
                </ModalBody>
            </ModalPortal>
        );

    const openDelete = () =>
        showModal(
            <ConfirmModal
                title="Delete listing"
                confirmMessage={`Are you sure you want to delete "${product.title}"? This cannot be undone.`}
                onClose={closeModal}
                declineButtonText="Cancel"
                confirmButtonText="Delete"
                confirmButtonClassNames="bg-red-500"
                confirmFunc={async () => {
                    try {
                        await deleteProduct(product.id);
                        toast("Listing deleted.", { icon: "🗑️" });
                    } catch {
                        toast.error("Could not delete this listing.");
                    } finally {
                        closeModal();
                    }
                }}
            />
        );

    return (
        <div className="flex gap-2 px-2 py-2">
            <InfoButton classNames="bg-[#55a8c2] text-white" onClick={openEdit}>Edit</InfoButton>
            <AbsoluteDangerButton onClick={openDelete}>Delete</AbsoluteDangerButton>
        </div>
    );
});

export default ProductOwnerActions;
