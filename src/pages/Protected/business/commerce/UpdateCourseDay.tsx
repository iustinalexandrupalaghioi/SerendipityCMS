import UpdateCourseDayScreen from "@/components/business/courses/course-days/form/UpdateCourseDayScreen";
import { useDocumentTitle } from "@/lib/utils";

const UpdateCourseDay = () => {
  useDocumentTitle("Course day");

  return <UpdateCourseDayScreen />;
};

export default UpdateCourseDay;
