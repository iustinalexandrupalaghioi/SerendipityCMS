import AllEnrollmentsOverview from "@/components/business/courses/course-enrollments/overview/AllEnrollmentsOverview";
import Breadcrumb from "@/components/partials/Breadcrumb";
import { useDocumentTitle } from "@/lib/utils";

const breadcrumbItems = [
  { path: "/", label: "Home" },
  { label: "Enrollments" },
];

const Enrollment = () => {
  useDocumentTitle("Enrollments");

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <AllEnrollmentsOverview />
    </>
  );
};

export default Enrollment;
