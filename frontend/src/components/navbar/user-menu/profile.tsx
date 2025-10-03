import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/use-auth";

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
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
  );
};
