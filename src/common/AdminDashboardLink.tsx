import { Link } from "react-router-dom";


export default function AdminDashboardLink() {
    return (
        <div className="w-full px-4 pt-4">
            <Link
                to="/admin"
                data-testid="adminDashboardLink"
                className="inline-flex items-center rounded-full bg-[#55a8c2] px-5 py-2 text-sm font-bold text-white hover:opacity-90"
            >
                Go to Admin Dashboard
            </Link>
        </div>
    );
}
