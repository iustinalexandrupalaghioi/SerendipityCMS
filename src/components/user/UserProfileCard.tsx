import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import userImage from "@/assets/user.webp";
import UpdateUserProfileForm from "./UpdateUserProfileForm";
import { ThemeSwitcher } from "../partials/ThemeSwitcher";
import { format } from "date-fns";
export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  image?: File;
}

export default function UserProfileCard({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [updatedProfileImage, setUpdatedProfileImage] = useState<string | null>(
    null,
  );

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    if (isEditing) {
      setUpdatedProfileImage(null);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 min-w-full md:min-w-96 mx-auto my-10",
        className,
      )}
      {...props}
    >
      <Card className="md:max-w-96">
        <CardHeader className="flex justify-center">
          {/* Profile Image */}
          {!isEditing && (
            <figure className="mt-8">
              <img
                src={
                  user?.user_metadata.avatar_url ||
                  updatedProfileImage ||
                  userImage
                }
                alt={`${user?.user_metadata.first_name}'s profile`}
                className="w-32 h-32 rounded-full border-2 border-gray-300 object-cover"
              />
            </figure>
          )}
        </CardHeader>

        {/* Card Body */}
        <CardContent>
          {!isEditing ? (
            <div className="flex flex-col items-center gap-2">
              {user?.user_metadata.first_name &&
              user.user_metadata.last_name ? (
                <CardTitle>
                  {user.user_metadata.first_name} {user.user_metadata.last_name}
                </CardTitle>
              ) : (
                user?.user_metadata.full_name && (
                  <CardTitle>{user.user_metadata.full_name}</CardTitle>
                )
              )}

              <CardDescription>{user?.email}</CardDescription>
              {user?.user_metadata.date_of_birth && (
                <CardDescription>
                  Date of birth:{" "}
                  {format(user?.user_metadata.date_of_birth, "dd-MM-yyyy")}
                </CardDescription>
              )}
              {user?.phone && <CardDescription>{user.phone}</CardDescription>}
              <CardFooter className="card-actions mt-2 w-full">
                <Button
                  className="w-full"
                  title="Update your profile details"
                  type="button"
                  onClick={handleEditToggle}
                >
                  Update profile
                </Button>
              </CardFooter>
            </div>
          ) : (
            <UpdateUserProfileForm handleEditToggle={handleEditToggle} />
          )}
          <div className="flex mt-4 justify-center">
            <ThemeSwitcher />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
