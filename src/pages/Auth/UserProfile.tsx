import UserProfileCard from "@/components/user/UserProfileCard";
import { useDocumentTitle } from "@/lib/utils";

const UserProfile = () => {
  useDocumentTitle("My profile");
  return <UserProfileCard />;
};

export default UserProfile;
