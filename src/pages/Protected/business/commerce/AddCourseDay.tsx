import AddCourseDayScreen from "@/components/business/courses/course-days/form/AddCourseDayForm";
import { useDocumentTitle } from "@/lib/utils";

const AddCourseDay = () => {
  useDocumentTitle("Add course day");

  return <AddCourseDayScreen />;
};

export default AddCourseDay;
