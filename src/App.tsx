import { Route, Routes } from "react-router";
import AdminHomePage from "./pages/AdminHomePage";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import SignupSuccess from "./pages/Auth/SignupSuccess";
import UpdatePassword from "./pages/Auth/UpdatePassword";
import UserProfile from "./pages/Auth/UserProfile";
import ErrorPage from "./pages/Error";
import Layout from "./pages/Layout";
import AddCourse from "./pages/Protected/business/commerce/AddCourse";
import AddCourseDay from "./pages/Protected/business/commerce/AddCourseDay";
import Appointment from "./pages/Protected/business/commerce/Appointment";
import Course from "./pages/Protected/business/commerce/Course";
import UpdateCourse from "./pages/Protected/business/commerce/UpdateCourse";
import UpdateCourseDay from "./pages/Protected/business/commerce/UpdateCourseDay";
import Category from "./pages/Protected/business/reference-data/Category";
import Service from "./pages/Protected/business/reference-data/Service";
import User from "./pages/Protected/business/reference-data/User";
import FreeDay from "./pages/Protected/business/time-management/FreeDay";
import Shift from "./pages/Protected/business/time-management/Shift";
import ProtectedRoute from "./pages/Protected/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import Enrollment from "./pages/Protected/business/commerce/Enrollment";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="auth/login" element={<Login />} />
      <Route path="auth/signup" element={<Signup />} />
      <Route path="auth/signup-success" element={<SignupSuccess />} />
      <Route path="auth/forgot-password" element={<ForgotPassword />} />
      <Route path="auth/update-password" element={<UpdatePassword />} />

      {/* Protected Routes */}

      <Route element={<Layout />}>
        <Route element={<ProtectedRoute />}>
          {/* Default authenticated route */}
          <Route index element={<AdminHomePage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/users" element={<User />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/services" element={<Service />} />
          <Route path="/business-hours" element={<Shift />} />
          <Route path="/free-days" element={<FreeDay />} />
          <Route path="/appointments" element={<Appointment />} />
          <Route path="/appointments/:status" element={<Appointment />} />
          <Route path="/courses" element={<Course />} />
          <Route path="/courses/add" element={<AddCourse />} />
          <Route path="/courses/update/:id" element={<UpdateCourse />} />
          <Route
            path="/courses/update/:courseId/course-days/add"
            element={<AddCourseDay />}
          />
          <Route
            path="/courses/update/:courseId/course-days/update/:id"
            element={<UpdateCourseDay />}
          />
        </Route>
        <Route path="/enrollments" element={<Enrollment />} />
        <Route path="/enrollments/:status" element={<Enrollment />} />
      </Route>

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
