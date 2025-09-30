import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/use-auth";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import cartIcon from "../shared/ui/icon/card-icon.png";
import sginIn from "../shared/ui/icon/sign-up.png";
import sginUp from "../shared/ui/icon/sign-in.png";

const Navbar = () => {
  const [isActive, SetIsActive] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const cartItemsCount = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-[#FFFFFF]    ">
      <div className="max-w-[1120px] border-b-2 h-[88px] mx-auto flex  items-center">
        <div className=" w-[100%] flex justify-between ">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                className="font-monster font-bold text-[32px] tracking-wide bg-gradient-to-r from-pink-800 to-black bg-clip-text text-transparent hover:from-pink-600 hover:to-blue-500"
              >
                MobileXpress
              </Link>
            </div>
          </div>
          <div className="flex-between gap-[57px]">
            <div className="flex-between  gap-[50px]">
              <Link to="/" className="link">
                Home
              </Link>
              <Link to="/products" className="link">
                Products
              </Link>

              {user?.role === "ADMIN" && (
                <Link to="/admin" className="link">
                  Admin
                </Link>
              )}
            </div>

            <div className="flex-between gap-[35px]">
              <Link to="/cart" className="link relative">
                <img src={cartIcon} alt="card-icon" />
                {cartItemsCount > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium leading-4 rounded-full bg-indigo-600 text-white absolute top-0 right-[-10px]">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              {user ? (
                <div className="ml-3 relative">
                  <div>
                    <button
                      onClick={() => SetIsActive((activ) => !activ)}
                      type="button"
                      className="button h-10 w-10 rounded-full   flex items-center justify-center"
                      id="user-menu-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <div>
                        <span className="font-medium ">
                          {user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </button>
                  </div>
                  {isActive && (
                    <div
                      className=" bg-gradient-to-r from-pink-800 to-black text-main z-100 origin-top-right absolute right-0 mt-2 w-80 text-2xl rounded-md  py-7 pl-5 pr-4 flex flex-col items-start gap-10 "
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                      tabIndex={-1}
                    >
                      <div className=" color-main border-b ">
                        <div className="font-medium">{user.email}</div>
                        <div className=" mt-5">
                          {user.role === "ADMIN" ? "Administrator" : "User"}
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="hover:scale-110"
                        role="menuitem"
                        tabIndex={-1}
                        id="user-menu-item-2"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link to="/login">
                    <img src={sginIn} alt="sign-in" />
                  </Link>
                  <Link to="/register">
                    <img src={sginUp} alt="sign-up" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
