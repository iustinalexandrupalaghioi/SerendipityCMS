import AddCourseDayScreen from "@/components/business/courses/course-days/form/AddCourseDayForm";
import { useDocumentTitle } from "@/lib/utils";

const AddCourseDay = () => {
  useDocumentTitle("Course day");

  return <AddCourseDayScreen />;
};

export default AddCourseDay;
