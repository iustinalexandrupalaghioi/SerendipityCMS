import AddCourseScreen from "@/components/business/courses/form/AddCourseScreen";
import Breadcrumb from "@/components/partials/Breadcrumb";
import { useDocumentTitle } from "@/lib/utils";

const breadcrumbItems = [
  { path: "/", label: "Home" },
  { path: "/courses", label: "Courses" },
  { label: "Add Course" },
];

const AddCourse = () => {
  useDocumentTitle("Add course");

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <AddCourseScreen />
    </>
  );
};

export default AddCourse;
