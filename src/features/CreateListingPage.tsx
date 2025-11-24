import { PageTitle } from "@common/Titles";
import CreateProductForm from "@components/products/CreateProductForm";
import { observer } from "mobx-react-lite";


export default observer(() => {
    return (
        <>
            <PageTitle>Create New Listing</PageTitle>
            <CreateProductForm />
        </>
    );
})