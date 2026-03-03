import ServiceList from "@/components/business/services/list/ServiceList";
import Breadcrumb from "@/components/partials/Breadcrumb";
import { useDocumentTitle } from "@/lib/utils";

const breadcrumbItems = [{ path: "/", label: "Home" }, { label: "Services" }];

const Service = () => {
  useDocumentTitle("Services");

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <ServiceList />
    </>
  );
};

export default Service;
