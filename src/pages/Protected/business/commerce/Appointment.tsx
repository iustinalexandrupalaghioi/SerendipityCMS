import AppointmentOverview from "@/components/business/appointments/overview/AppointmentOverview";
import Breadcrumb from "@/components/partials/Breadcrumb";
import { useDocumentTitle } from "@/lib/utils";

const breadcrumbItems = [
  { path: "/", label: "Home" },
  { label: "Appointments" },
];

const Appointment = () => {
  useDocumentTitle("Appointments");

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <AppointmentOverview />
    </>
  );
};

export default Appointment;
