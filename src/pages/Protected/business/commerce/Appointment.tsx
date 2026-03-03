import AppointmentList from "@/components/business/appointments/list/AppointmentList";
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
      <AppointmentList />
    </>
  );
};

export default Appointment;
