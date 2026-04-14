import AddCourseScreen from "@/components/business/courses/form/AddCourseScreen";
import { useDocumentTitle } from "@/lib/utils";

const AddCourse = () => {
  useDocumentTitle("Add course");

  return (

      <AddCourseScreen />
 
  );
};

export default AddCourse;
