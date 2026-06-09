import { Link } from "react-router";
import { Skeleton } from "antd";
import PageMeta from "@components/common/PageMeta";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import { useGetDashboardStatsQuery } from "@services/dashboardApi";
import { useSelector } from "react-redux";
import { RootState } from "store";

type StatCard = {
  title: string;
  value: number;
  hint: string;
  accent: string;
  href?: string;
};

// const quickLinks = [
//   {
//     title: "CMS categories",
//     description: "Placements, slugs, and category metadata",
//     href: "/cms-management/category",
//   },
//   {
//     title: "CMS manager",
//     description: "Add and edit pages with the rich text editor",
//     href: "/cms-management/Page",
//   },
//   {
//     title: "Book repair requests",
//     description: "View and manage incoming repair bookings",
//     href: "/book-repair-requests",
//   },
//   {
//     title: "Contact requests",
//     description: "Read messages submitted from the website",
//     href: "/contact-requests",
//   },
// ];

function getUserDisplayName(
  user: RootState["user"]["user"],
): string {
  if (!user) return "";
  return [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
}

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const displayName = getUserDisplayName(user);
  const { data, isLoading, isFetching } = useGetDashboardStatsQuery();
  const stats = data?.data;

  const statCards: StatCard[] = [
    {
      title: "Total Repairers",
      value: stats?.totalRepairers ?? 0,
      hint: "Network addresses registered",
      accent: "bg-blue-50 text-[#003366]",
      href: "/network-addresses",
    },
    {
      title: "Pending Referrals",
      value: stats?.pendingReferrals ?? 0,
      hint: "New book repair requests",
      accent: "bg-amber-50 text-amber-800",
      href: "/book-repair-requests",
    },
    {
      title: "Active Jobs",
      value: stats?.activeJobs ?? 0,
      hint: "Book repairs in progress",
      accent: "bg-[#E3F2FD] text-[#1565C0]",
      href: "/book-repair-requests",
    },
    {
      title: "Completed",
      value: stats?.completedJobs ?? 0,
      hint: "Closed book repair requests",
      accent: "bg-[#E8F5E9] text-[#2E7D32]",
      href: "/book-repair-requests",
    },
  ];

  const secondaryStats = [
    {
      label: "Contact requests",
      value: stats?.contactRequests ?? 0,
      href: "/contact-requests",
    },
    {
      label: "CMS pages",
      value: stats?.cmsPages ?? 0,
      href: "/cms-management/Page",
    },
    {
      label: "CMS categories",
      value: stats?.cmsCategories ?? 0,
      href: "/cms-management/category",
    },
    {
      label: "Network regions",
      value: stats?.networkRegions ?? 0,
      href: "/network-regions",
    },
  ];

  return (
    <>
      <PageMeta title="Dashboard — Everydaycar Admin" />
      <PageBreadcrumb pageTitle="Dashboard" />
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#003366]">
          Welcome back{displayName ? `, ${displayName}` : ""}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Everydaycar Repair Network admin — live overview of repairers,
          referrals, and website activity.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        
      </div>

      {isLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => {
              const content = (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-[#007BFF]/40">
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="mt-2 text-3xl font-bold text-[#003366]">
                    {card.value.toLocaleString()}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">{card.hint}</p>
                  <span
                    className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-semibold ${card.accent}`}
                  >
                    {isFetching ? "Refreshing..." : "Live data"}
                  </span>
                </div>
              );

              return card.href ? (
                <Link key={card.title} to={card.href} className="block">
                  {content}
                </Link>
              ) : (
                <div key={card.title}>{content}</div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {secondaryStats.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition hover:border-[#007BFF]/40"
              >
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="mt-1 text-2xl font-bold text-[#003366]">
                  {item.value.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
