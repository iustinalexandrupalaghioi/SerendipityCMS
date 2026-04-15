import UserOverview from "@/components/business/users/overview/UserOverview";
import Breadcrumb from "@/components/partials/Breadcrumb";
import { useDocumentTitle } from "@/lib/utils";

const breadcrumbItems = [{ path: "/", label: "Home" }, { label: "Users" }];

const User = () => {
  useDocumentTitle("Users");

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <UserOverview />
    </>
  );
};

export default User;
