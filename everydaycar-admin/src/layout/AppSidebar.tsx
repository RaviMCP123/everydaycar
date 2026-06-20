import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { useSidebar } from "../context/useSidebar";
import {
  BoxCubeIcon,
  CalenderIcon,
  GridIcon,
  GroupIcon,
  ListIcon,
  MailIcon,
  PageIcon,
  PlugInIcon,
  UserCircleIcon,
} from "../icons";

type NavItem = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
};

const getNavItems = (t: (key: string) => string): NavItem[] => [
  { icon: GridIcon, name: t("sidebar.dashboard"), path: "/dashboard" },
  {
    icon: ListIcon,
    name: t("sidebar.cmsCategories"),
    path: "/cms-management/category",
  },
  {
    icon: PageIcon,
    name: t("sidebar.cmsManager"),
    path: "/cms-management/Page",
  },
  {
    icon: CalenderIcon,
    name: t("sidebar.bookRepairRequests"),
    path: "/book-repair-requests",
  },
  {
    icon: MailIcon,
    name: t("sidebar.contactRequests"),
    path: "/contact-requests",
  },
  {
    icon: GroupIcon,
    name: t("sidebar.networkRegions"),
    path: "/network-regions",
  },
  {
    icon: BoxCubeIcon,
    name: t("sidebar.networkAddresses"),
    path: "/network-addresses",
  },
  {
    icon: PlugInIcon,
    name: t("sidebar.smtpCredentials"),
    path: "/settings/email-credentials",
  },
  { icon: UserCircleIcon, name: t("sidebar.profile"), path: "/profile" },
];

const AppSidebar: React.FC = () => {
  const { t } = useTranslation();
  const { isExpanded, isMobileOpen, isHovered } = useSidebar();
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = useCallback(
    (path: string) =>
      location.pathname === path ||
      (path === "/dashboard" && location.pathname === "/"),
    [location.pathname],
  );
  const isCollapsed = !isExpanded && !isHovered && !isMobileOpen;
  const navItems = getNavItems(t);

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav) => {
        const linkElement = (
          <Link
            to={nav.path}
            className={`menu-item group ${
              isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
            }`}
          >
            <span
              className={`menu-item-icon-size ${
                isActive(nav.path)
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
              }`}
            >
              <nav.icon />
            </span>

            {(isExpanded || isHovered || isMobileOpen) && (
              <span
                className={`menu-item-text ${
                  isActive(nav.path)
                    ? "text-[#7ec8ff] dark:text-[#7ec8ff]"
                    : "text-white"
                }`}
              >
                {nav.name}
              </span>
            )}
          </Link>
        );

        return (
          <li key={nav.name}>
            {isCollapsed ? (
              <Tooltip placement="right" title={nav.name} color="#003366">
                {linkElement}
              </Tooltip>
            ) : (
              linkElement
            )}
          </li>
        );
      })}
    </ul>
  );

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-[#003366] dark:bg-[#002244] dark:border-gray-800 
      text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
              ? "w-[290px]"
              : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
    >
      <div
        className={`pt-2 pb-4 sm:pb-6 lg:pb-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/dashboard" className="inline-flex items-center gap-2 p-1">
          {(isExpanded || isHovered || isMobileOpen) && (
            <img
              className="h-8 sm:h-10"
              src={`${import.meta.env.BASE_URL}images/logo.png`}
              alt="everydaycar"
            />
          )}
          {!isExpanded && !isHovered && !isMobileOpen && (
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#007BFF] text-sm font-bold text-white">
              ec
            </span>
          )}
        </Link>
      </div>

      <div
        ref={scrollContainerRef}
        className={`flex flex-col overflow-y-auto duration-300 ease-linear sidebar-scrollbar ${
          isScrolling ? "scrolling" : ""
        }`}
      >
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>{renderMenuItems(navItems)}</div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
