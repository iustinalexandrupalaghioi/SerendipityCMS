import CourseList from "@/components/business/courses/list/CourseList";
import Breadcrumb from "@/components/partials/Breadcrumb";
import { useDocumentTitle } from "@/lib/utils";

const breadcrumbItems = [{ path: "/", label: "Home" }, { label: "Courses" }];

const Course = () => {
  useDocumentTitle("Courses");

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <CourseList />
    </>
  );
};

export default Course;
