import { FC } from "react";
import Dashboard from "@pages/Dashboard";
import Page from "@pages/Page";
import CmsCategory from "@pages/CmsCategory";
import CmsHome from "@pages/CmsHome";
import BookRepairRequest from "@pages/BookRepairRequest";
import ContactRequest from "@pages/ContactRequest";
import NetworkRegion from "@pages/NetworkRegion";
import NetworkAddress from "@pages/NetworkAddress";
import UserProfiles from "@pages/UserProfile";

interface RouteConfig {
  path: string;
  title: string;
  component: FC;
}

const mainRoute: RouteConfig[] = [
  { path: "/", component: Dashboard, title: "Dashboard" },
  { path: "/dashboard", component: Dashboard, title: "Dashboard" },
  {
    path: "/cms-management/Page",
    component: Page,
    title: "CMS Manager",
  },
  {
    path: "/cms-management/category",
    component: CmsCategory,
    title: "CMS Categories",
  },
  { path: "/cms-overview", component: CmsHome, title: "CMS Overview" },
  {
    path: "/book-repair-requests",
    component: BookRepairRequest,
    title: "Book Repair Requests",
  },
  {
    path: "/contact-requests",
    component: ContactRequest,
    title: "Contact Requests",
  },
  {
    path: "/network-regions",
    component: NetworkRegion,
    title: "Network Regions",
  },
  {
    path: "/network-addresses",
    component: NetworkAddress,
    title: "Network Addresses",
  },
  {
    path: "/network-regions-manager",
    component: NetworkRegion,
    title: "Network Regions",
  },
  {
    path: "/network-addresses-manager",
    component: NetworkAddress,
    title: "Network Addresses",
  },
  { path: "/profile", component: UserProfiles, title: "Profile" },
];

export default mainRoute;
