import { observer } from "mobx-react-lite";
import toast from "react-hot-toast";
import { useStore } from "@stores/index";
import { ProductRecord } from "@models/product";
import { ConfirmModal } from "@common/Modal";

interface DeleteProductModalProps {
    product: ProductRecord;
    onClose: () => void;
    // Fired after a successful delete so the dashboard can refresh.
    onSuccess?: () => void;
}

// Owner-only delete modal. Routes the delete through the custom ConfirmModal so the user
// must confirm first. The API still enforces creator-only deletes via the bearer token.
const DeleteProductModal = observer(({ product, onClose, onSuccess }: DeleteProductModalProps) => {
    const { userProductsFeedStore } = useStore();
    const { deleteProduct } = userProductsFeedStore;

    return (
        <ConfirmModal
            title="Delete listing"
            confirmMessage={`Are you sure you want to delete "${product.title}"? This cannot be undone.`}
            onClose={onClose}
            declineButtonText="Cancel"
            confirmButtonText="Delete"
            confirmButtonClassNames="bg-red-500"
            confirmFunc={async () => {
                try {
                    await deleteProduct(product.id);
                    toast("Listing deleted.", { icon: "🗑️" });
                    onSuccess?.();
                } catch {
                    toast.error("Could not delete this listing.");
                } finally {
                    onClose();
                }
            }}
        />
    );
});

export default DeleteProductModal;
