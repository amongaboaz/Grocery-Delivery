import { NavLink, Outlet } from "react-router-dom";
import { PlusIcon, PackageSearchIcon, ShoppingBagIcon, LogOutIcon, BarChart3Icon, ShieldIcon, Truck } from "lucide-react";
import Navbar from "../../Navbar";
import { Link } from "react-router-dom";

export default function AdminLayout() {

    const AdminLinkData = [
        { to: "/admin", label: "Dashboard", icon: BarChart3Icon },
        { to: "/admin/products/new", label: "Add Product", icon: PlusIcon },
        { to: "/admin/products", label: "Products", icon: PackageSearchIcon },
        { to: "/admin/orders", label: "Orders", icon: ShoppingBagIcon },
        { to: "/admin/delivery-partners", label: "Delivery Partners", icon: Truck },
        { to: "/", label: "Exit", icon: LogOutIcon },
    ]

    return (
        <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-app-cream/30">
            {/* Desktop Navbar */}
            <div className="max-lg:hidden">
                <Navbar />
            </div>

            {/* Mobile Top Bar */}
            <div className="lg:hidden bg-white border-b border-app-border sticky top-0 z-40 px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-app-green">
                    <ShieldIcon className="size-5" /> Admin Panel
                </Link>
                <Link to="/" className="p-2 text-zinc-500 hover:text-app-orange transition-colors">
                    <LogOutIcon className="size-5" />
                </Link>
            </div>

            <div className="flex flex-col h-full lg:flex-row gap-6 lg:gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 animate-fade-in">
                {/* Admin Sidebar */}
                <aside className="w-full lg:w-64 shrink-0 h-fit bg-white rounded-2xl p-4 lg:p-4 border border-app-border">
                    <div className="hidden lg:flex pb-4 mb-4 border-b border-app-border">
                        <h2 className="text-lg font-semibold text-app-green flex items-center gap-2 px-2">
                            <ShieldIcon className="size-5 text-green-900" /> Admin Panel
                        </h2>
                    </div>
                    <nav className="flex flex-row lg:flex-col gap-2 lg:gap-1.5 overflow-x-auto no-scrollbar pb-2 lg:pb-0">

                        {AdminLinkData.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={true}
                                className={({ isActive }) => `flex items-center gap-2 lg:gap-3 px-3 py-2 lg:p-2.5 rounded-md text-sm transition-colors whitespace-nowrap ${isActive
                                    ? "bg-app-green text-white"
                                    : "text-app-text-light hover:bg-orange-50 hover:text-zinc-900"
                                    }`}
                            >
                                <link.icon className="size-4 shrink-0" /> {link.label}
                            </NavLink>
                        ))}
                    </nav>
                </aside>
                <main className="flex-1 overflow-y-auto no-scrollbar pb-20 lg:pb-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
