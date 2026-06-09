import { Link } from "react-router";
import PageMeta from "@components/common/PageMeta";
import PageBreadcrumb from "@components/common/PageBreadCrumb";
import { useGetPagesQuery } from "@services/pageApi";
import { useGetCmsCategoriesQuery } from "@services/cmsCategoryApi";
import { PAGE_LIMIT } from "@utils/constant/common";

const CmsHome: React.FC = () => {
  const { data: pagesData } = useGetPagesQuery({
    page: 1,
    limit: 1,
    sort: "createdAt",
    direction: "desc",
  });
  const { data: categoriesData } = useGetCmsCategoriesQuery({
    page: 1,
    limit: PAGE_LIMIT,
    sort: "createdAt",
    direction: "desc",
  });

  const pageTotal = pagesData?.data?.pagination?.total ?? 0;
  const categoryTotal = categoriesData?.data?.pagination?.total ?? 0;

  return (
    <>
      <PageMeta title="CMS Overview — Everydaycar Admin" />
      <PageBreadcrumb pageTitle="CMS overview" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/cms-management/category"
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-[#007BFF]/55 dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[#003366] dark:text-white">
                CMS categories
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Placement, slugs, and category metadata
              </p>
            </div>
            <div className="rounded-full bg-[#007BFF]/10 px-3 py-1 text-sm font-semibold text-[#007BFF]">
              {categoryTotal}
            </div>
          </div>
        </Link>
        <Link
          to="/cms-management/Page"
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-[#007BFF]/55 dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[#003366] dark:text-white">
                CMS manager
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Static pages with CKEditor
              </p>
            </div>
            <div className="rounded-full bg-[#007BFF]/10 px-3 py-1 text-sm font-semibold text-[#007BFF]">
              {pageTotal}
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default CmsHome;
