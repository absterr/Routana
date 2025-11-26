import { Link } from "react-router-dom";
import UserNav from "./UserNav";

const Navbar = () => {
  return (
    <nav className="border-b border-gray-200">
      <div className="flex justify-center">
        <div className="max-w-5xl w-full px-6">
          <div className="flex items-center justify-between w-full py-6">
            <Link to={"/"}>
              <p className="font-semibold text-3xl text-purple-600">Routana</p>
            </Link>
            <UserNav />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
