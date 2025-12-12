import { Link } from "react-router-dom";
import UserNav from "./UserNav";
import { Button } from "../ui/button";

const Navbar = ({ hasSession }: { hasSession: boolean }) => (
  <nav className="border-b border-gray-200">
    <div className="flex justify-center">
      <div className="max-w-5xl w-full px-6">
        <div className="flex items-center justify-between w-full py-6">
          <Link to={hasSession ? "/dashboard" : "/"}>
            <p className="font-semibold text-3xl text-purple-600">Routana</p>
          </Link>
          {hasSession
            ? <UserNav />
            : <>
              <div className="hidden md:flex items-center gap-x-6">
                <Link to={"login"}>
                  <Button variant={"link"} className="text-base cursor-pointer font-semibold">
                    Log in
                  </Button>
                </Link>
                <Link to={"/signup"}>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Get started
                  </Button>
                </Link>
              </div>

              {/* MOBILE NAV BUTTONS GOES HERE */}
            </>
          }
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
