import AppointmentOverview from "@/components/business/appointments/overview/AppointmentOverview";
import { useDocumentTitle } from "@/lib/utils";

const Appointment = () => {
  useDocumentTitle("Appointments");

  return <AppointmentOverview />;
};

export default Appointment;
