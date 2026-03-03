import { UpdatePasswordForm } from "@/components/authentication/UpdatePasswordForm";
import { useDocumentTitle } from "@/lib/utils";

const UpdatePassword = () => {
  useDocumentTitle("Update password");

  return (
    <div className="flex w-full items-center max-w-96 my-10 mx-auto">
      <div className="w-full max-w-sm">
        <UpdatePasswordForm />
      </div>
    </div>
  );
};

export default UpdatePassword;
