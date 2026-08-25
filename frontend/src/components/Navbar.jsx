import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, SparklesIcon } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-[#d8ded4] bg-[#f8f7f2]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3 text-lg font-black tracking-tight text-[#17322d]">
          <span className="grid size-9 rotate-[-8deg] place-items-center rounded-xl bg-[#d4f36a] text-[#17322d] shadow-[3px_3px_0_#17322d]">
            <SparklesIcon size={18} />
          </span>
          <span>
            Interview <span className="text-[#ee6657]">Craft</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 text-sm font-bold text-[#6a7972] sm:gap-5">
          <Link
            to="/problems"
            className={`rounded-md px-3 py-2 transition-colors ${
              isActive("/problems")
                ? "bg-[#17322d] text-white"
                : "hover:text-[#ee6657]"
            }`}
          >
            <span className="flex items-center gap-2">
              <BookOpenIcon size={16} /> Problems
            </span>
          </Link>

          <Link
            to="/dashboard"
            className={`rounded-md px-3 py-2 transition-colors ${
              isActive("/dashboard")
                ? "bg-[#17322d] text-white"
                : "hover:text-[#ee6657]"
            }`}
          >
            <span className="flex items-center gap-2">
              <LayoutDashboardIcon size={16} /> Dashboard
            </span>
          </Link>

          <div className="ml-1 border-l border-[#d8ded4] pl-3">
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
