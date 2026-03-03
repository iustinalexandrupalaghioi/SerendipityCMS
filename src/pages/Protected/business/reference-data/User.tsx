import UserList from "@/components/business/users/list/UserList";
import Breadcrumb from "@/components/partials/Breadcrumb";
import { useDocumentTitle } from "@/lib/utils";

const breadcrumbItems = [{ path: "/", label: "Home" }, { label: "Users" }];

const User = () => {
  useDocumentTitle("Users");

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <UserList />
    </>
  );
};

export default User;
