import CoursesOverview from "@/components/business/courses/overview/CourseOverview";
import Breadcrumb from "@/components/partials/Breadcrumb";
import { useDocumentTitle } from "@/lib/utils";

const breadcrumbItems = [{ path: "/", label: "Home" }, { label: "Courses" }];

const Course = () => {
  useDocumentTitle("Courses");

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <CoursesOverview />
    </>
  );
};

export default Course;
