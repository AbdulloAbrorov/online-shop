import { Link } from "react-router-dom";
import { UserMenu } from "./user-menu/user-menu";
import { useNavLinks } from "./nav-links/nav-links";

export const Navbar = () => {
  const navLinks = useNavLinks();

  return (
    <nav className="bg-white">
      <div className="max-w-[1120px] h-[88px] mx-auto flex items-center border-b-2">
        <div className="w-full flex justify-between items-center">
          <Link
            to="/"
            className="font-monster font-bold text-2xl bg-gradient-to-r from-pink-800 to-black bg-clip-text text-transparent hover:from-pink-600 hover:to-blue-500"
          >
            MobileXpress
          </Link>

          <div className="flex items-center gap-10">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="link">
                {link.label}
              </Link>
            ))}
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};
