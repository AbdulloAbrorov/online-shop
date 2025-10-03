import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/use-auth";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { Profile } from "./profile";
import cartIcon from "../../../shared/ui/icon/card-icon.png";
import sginIn from "../../../shared/ui/icon/sign-up.png";
import sginUp from "../../../shared/ui/icon/sign-in.png";

export const UserMenu = () => {
  const [isActive, setIsActive] = useState(false);
  const cartItemsCount = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const { user } = useAuth();

  return (
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
              onClick={() => setIsActive((activ) => !activ)}
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
          {isActive && <Profile />}
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
  );
};
