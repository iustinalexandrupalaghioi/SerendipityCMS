import CategoryOverview from "@/components/business/categories/overview/CategoryOverview";
import Breadcrumb from "@/components/partials/Breadcrumb";
import { useDocumentTitle } from "@/lib/utils";

const breadcrumbItems = [{ path: "/", label: "Home" }, { label: "Categories" }];

const Category = () => {
  useDocumentTitle("Categories");

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <CategoryOverview />
    </>
  );
};

export default Category;
