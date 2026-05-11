import {
    ArrowRightIcon,
    BikeIcon,
    ChevronDownIcon,
    LogOutIcon,
    MapPinIcon,
    MenuIcon,
    PackageIcon,
    SearchIcon,
    ShieldIcon,
    ShoppingCartIcon,
    UserIcon,
    XIcon,
  } from "lucide-react";
  
  import { useState } from "react";
  import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
  
  const Navbar = () => {
    const user = {
      name: "John Doe",
      email: "john@example.com",
      isAdmin: true,
    };
  
    const {cartCount,setIsCartOpen} = useCart()
  
    const [searchQuery, setSearchQuery] = useState("");
    const [userMenuOpen, setUserMenuOpen] = useState(false);
  
    const navigate = useNavigate();
  
    const handleSearch = (e) => {
      e.preventDefault();
  
      if (!searchQuery.trim()) return;
  
      navigate(`/search?q=${searchQuery}`);
    };

    const handleLogout = () => {
        setUserMenuOpen(false)
        navigate("/");
    }
  
    return (
      <nav className="bg-white sticky top-0 z-50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-[22px] font-semibold shrink-0"
          >
            <BikeIcon size={24} />
            Instacart
          </Link>
  
          <div className="flex items-center justify-end w-full gap-4 lg:gap-10">
            
            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-6 text-sm text-zinc-600">
              <Link to="/" className="hover:text-black transition-colors">
                Home
              </Link>
  
              <Link
                to="/products"
                className="hover:text-black transition-colors"
              >
                Products
              </Link>
  
              <Link
                to="/deals"
                className="text-orange-500 font-medium"
              >
                Deals
              </Link>
            </div>
  
            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="hidden sm:flex flex-1 max-w-sm text-xs sm:text-sm"
            >
              <div className="relative w-full">
                <SearchIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500"
                />
  
                <input
                  type="text"
                  placeholder="Search for groceries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-orange-50 rounded-full border border-orange-100 focus:border-orange-300 outline-none"
                />
              </div>
            </form>
  
            {/* Right Actions */}
            <div className="flex items-center gap-3">
              
              {/* Cart */}
              <button
                className="relative p-2 rounded-xl hover:bg-zinc-100 transition-colors"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCartIcon className="size-5 text-zinc-900" />
  
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 size-4 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
  
              {/* User Menu */}
              <div className="relative">
                {user ? (
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                  >
                    <div className="size-7 rounded-full bg-green-950 text-white flex items-center justify-center text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
  
                    <ChevronDownIcon className="size-4 text-zinc-500" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/login"
                      className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-950 rounded-lg hover:bg-green-900 transition-colors"
                    >
                      <UserIcon size={16} />
                      Sign In
                    </Link>
  
                    {userMenuOpen ? (
                      <XIcon
                        className="md:hidden cursor-pointer"
                        onClick={() =>
                          setUserMenuOpen(!userMenuOpen)
                        }
                      />
                    ) : (
                      <MenuIcon
                        className="md:hidden cursor-pointer"
                        onClick={() =>
                          setUserMenuOpen(!userMenuOpen)
                        }
                      />
                    )}
                  </div>
                )}
  
                {/* Dropdown */}
                {userMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
  
                    {/* Menu */}
                    <div className="absolute right-0 mt-2.5 w-56 bg-white rounded-xl shadow-lg border border-zinc-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                      
                      {/* User Info */}
                      {user && (
                        <div className="px-4 py-3 border-b border-zinc-200">
                          <p className="text-sm font-medium text-zinc-900">
                            {user.name}
                          </p>
  
                          <p className="text-xs text-zinc-500">
                            {user.email}
                          </p>
                        </div>
                      )}
  
                      <div
                        onClick={() => setUserMenuOpen(false)}
                        className="flex flex-col"
                      >
                        
                        {/* Guest Links */}
                        {!user && (
                          <Link
                            to="/login"
                            className="dropdown-link"
                          >
                            <UserIcon size={16} />
                            Sign In
                          </Link>
                        )}
  
                        {/* User Links */}
                        {user && (
                          <>
                            <Link
                              to="/orders"
                              className="dropdown-link"
                            >
                              <PackageIcon size={16} />
                              My Orders
                            </Link>
  
                            <Link
                              to="/addresses"
                              className="dropdown-link"
                            >
                              <MapPinIcon size={16} />
                              Addresses
                            </Link>
                          </>
                        )}
  
                        {/* Mobile Links */}
                        <Link
                          to="/products"
                          className="dropdown-link md:hidden"
                        >
                          <ArrowRightIcon size={16} />
                          Products
                        </Link>
  
                        <Link
                          to="/deals"
                          className="dropdown-link"
                        >
                          <ArrowRightIcon size={16} />
                          Deals
                        </Link>
  
                        {/* Admin */}
                        {user?.isAdmin && (
                          <Link
                            to="/admin/products"
                            className="dropdown-link"
                          >
                            <ShieldIcon
                              size={16}
                              className="text-orange-600"
                            />
  
                            <span className="text-orange-600">
                              Admin Panel
                            </span>
                          </Link>
                        )}
  
                        {/* Logout */}
                        {user && (
                          <div className="border-t border-zinc-200 pt-1 mt-1">
                            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full transition-colors">
                              <LogOutIcon size={16} />
                              Logout
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar;