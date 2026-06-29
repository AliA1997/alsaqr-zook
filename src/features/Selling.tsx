import SellingFeed from "@components/userProducts/SellingFeed";
import AdminDashboardLink from "@common/AdminDashboardLink";
import { observer } from "mobx-react-lite";


export default observer(function() {
    return (
        <>
            <AdminDashboardLink />
            <SellingFeed />
        </>
    );
})
