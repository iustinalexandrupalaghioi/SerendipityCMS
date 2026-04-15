import FreeDayOverview from "@/components/business/free-days/overview/FreeDayOverview";
import Breadcrumb from "@/components/partials/Breadcrumb";
import { useDocumentTitle } from "@/lib/utils";

const breadcrumbItems = [{ path: "/", label: "Home" }, { label: "Free days" }];

const FreeDay = () => {
  useDocumentTitle("Free days");

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <FreeDayOverview />
    </>
  );
};

export default FreeDay;
