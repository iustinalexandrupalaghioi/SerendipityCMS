import Breadcrumb from "@/components/partials/Breadcrumb";
import ServiceOverview from "@/components/business/services/overview/ServiceOverview";
import { useDocumentTitle } from "@/lib/utils";

const breadcrumbItems = [{ path: "/", label: "Home" }, { label: "Services" }];

const Service = () => {
  useDocumentTitle("Services");

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <ServiceOverview />
    </>
  );
};

export default Service;
