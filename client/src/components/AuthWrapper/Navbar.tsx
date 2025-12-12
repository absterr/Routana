import { Link } from "react-router-dom";
import UserNav from "./UserNav";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Menu } from "lucide-react";

const Navbar = ({ hasSession }: { hasSession: boolean }) => (
  <nav className="border-b border-gray-200">
    <div className="flex justify-center">
      <div className="max-w-5xl w-full px-6">
        <div className="flex items-center justify-between w-full py-6">
          <Link to={hasSession ? "/dashboard" : "/"}>
            <p className="font-semibold text-2xl sm:text-3xl text-purple-600">Routana</p>
          </Link>
          {hasSession
            ? <UserNav />
            : <>
              <div className="hidden sm:flex items-center gap-x-6">
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

              <div className="block sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Menu />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-md p-2 flex flex-col gap-4" align="end">
                    <Link to={"/login"}>
                      <DropdownMenuItem className="font-semibold">
                        Log in
                      </DropdownMenuItem>
                    </Link>
                    <Link to={"/signup"}>
                      <DropdownMenuItem className="font-semibold text-purple-600">
                        Get started
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          }
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
