import ShiftList from "@/components/business/work-hours/list/ShiftList";
import Breadcrumb from "@/components/partials/Breadcrumb";
import { useDocumentTitle } from "@/lib/utils";

const breadcrumbItems = [
  { path: "/", label: "Home" },
  { label: "Business hours" },
];

const Shift = () => {
  useDocumentTitle("Business hours");

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <ShiftList />
    </div>
  );
};

export default Shift;
