import UpdateCourseScreen from "@/components/business/courses/form/UpdateCourseScreen";
import { useDocumentTitle } from "@/lib/utils";

const UpdateCourse = () => {
  useDocumentTitle("Update course");

  return <UpdateCourseScreen />;
};

export default UpdateCourse;
