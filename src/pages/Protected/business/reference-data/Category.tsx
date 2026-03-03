import CategoryList from "@/components/business/categories/list/CategoryList";
import Breadcrumb from "@/components/partials/Breadcrumb";
import { useDocumentTitle } from "@/lib/utils";

const breadcrumbItems = [{ path: "/", label: "Home" }, { label: "Categories" }];

const Category = () => {
  useDocumentTitle("Categories");

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <CategoryList />
    </>
  );
};

export default Category;
