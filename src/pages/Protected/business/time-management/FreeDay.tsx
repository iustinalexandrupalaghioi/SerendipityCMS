import FreeDayList from "@/components/business/free-days/list/FreeDayList";
import Breadcrumb from "@/components/partials/Breadcrumb";
import { useDocumentTitle } from "@/lib/utils";

const breadcrumbItems = [{ path: "/", label: "Home" }, { label: "Free days" }];

const FreeDay = () => {
  useDocumentTitle("Free days");

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <FreeDayList />
    </div>
  );
};

export default FreeDay;
