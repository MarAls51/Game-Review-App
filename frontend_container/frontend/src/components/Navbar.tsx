import { useState, useContext, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { UserIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { buttonVariants } from "./ui/button";
import { Menu } from "lucide-react";
import { LogoIcon } from "./Icons";
import { Link, To } from "react-router-dom";
import { GameContext } from "../context/context";
import { useNavigate } from "react-router-dom";
import { routeList } from "../utils/routeList"; 

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMessage, setShowMessage] = useState("");
  const auth = useAuth();
  const { selectedGame } = useContext(GameContext);
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (auth.isAuthenticated) {
      navigate("/account");
    } else {
      auth.signinRedirect();
    }
  };

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => setShowMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const handleNavigation = (requiresSelection: boolean, requireLogin: boolean, href: To) => {
    if (requireLogin && !auth.isAuthenticated) {
      setShowMessage("You must first login to use this feature.");
    } else if (requiresSelection && !selectedGame) {
      setShowMessage("You must first select a game from the search bar to use this feature.");
    } else {
      setShowMessage("");
      navigate(href);
    }
  };

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between">
          <NavigationMenuItem className="font-bold flex">
            <Link to="/" className="ml-2 font-bold text-xl flex">
              <LogoIcon />
            </Link>
          </NavigationMenuItem>
          <span className="flex md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu className="flex md:hidden h-5 w-5" onClick={() => setIsOpen(true)}>
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({ href, label, requiresSelection, requireLogin }) => (
                    <button
                      key={label}
                      onClick={() => handleNavigation(requiresSelection, requireLogin, href)}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {label}
                    </button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          <nav className="hidden md:flex gap-2">
            {routeList.map(({ href, label, requiresSelection, requireLogin }) => (
              <button
                key={label}
                onClick={() => handleNavigation(requiresSelection, requireLogin, href)}
                className={`text-[17px] ${buttonVariants({ variant: "ghost" })}`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex gap-2">
            <button
              onClick={handleAuthClick}
              className={`border ${buttonVariants({ variant: "secondary" })}`}
            >
              <UserIcon className="mr-2 w-5 h-5" />
              Account
            </button>
          </div>
        </NavigationMenuList>
      </NavigationMenu>

      {showMessage && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-md">
          {showMessage}
        </div>
      )}
    </header>
  );
};
