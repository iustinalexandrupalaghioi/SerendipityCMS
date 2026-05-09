import UpdateCourseScreen from "@/components/business/courses/form/UpdateCourseScreen";
import { useDocumentTitle } from "@/lib/utils";

const UpdateCourse = () => {
  useDocumentTitle("Course");

  return <UpdateCourseScreen />;
};

export default UpdateCourse;
