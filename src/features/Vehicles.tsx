import Feed from "@components/shared/Feed";
import { ProductCategories } from "@models/enums";
import { observer } from "mobx-react-lite";

export default observer(function() {

    return (
        <Feed title="Vehicles for Sale" productCategory={ProductCategories.Vehicles} />
    );
})