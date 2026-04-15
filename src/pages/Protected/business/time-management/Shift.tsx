import ShiftOverview from "@/components/business/work-hours/overview/ShiftOverview";
import Breadcrumb from "@/components/partials/Breadcrumb";
import { useDocumentTitle } from "@/lib/utils";

const breadcrumbItems = [
  { path: "/", label: "Home" },
  { label: "Business hours" },
];

const Shift = () => {
  useDocumentTitle("Business hours");

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <ShiftOverview />
    </>
  );
};

export default Shift;
