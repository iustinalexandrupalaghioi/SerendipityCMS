import AllEnrollmentsOverview from "@/components/business/courses/course-enrollments/overview/AllEnrollmentsOverview";
import { useDocumentTitle } from "@/lib/utils";

const Enrollment = () => {
  useDocumentTitle("Enrollments");

  return <AllEnrollmentsOverview />;
};

export default Enrollment;
