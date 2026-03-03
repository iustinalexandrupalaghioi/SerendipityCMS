import GridMenu from "@/components/partials/menu-tiles/GridMenu";
import { useDocumentTitle } from "@/lib/utils";

const AdminHomePage = () => {
  useDocumentTitle("Menu");

  return <GridMenu />;
};

export default AdminHomePage;
