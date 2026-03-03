import CourseEnrollmentList from "@/components/business/courses/course-enrollments/list/EnrollmentList";
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
      <CourseEnrollmentList />
    </>
  );
};

export default Enrollment;
