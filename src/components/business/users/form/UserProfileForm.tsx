import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { InputGroup, InputGroupInput } from "@/components/ui/input-group";

import { Combobox } from "@/components/partials/Combobox";
import type { Control } from "react-hook-form";
import type { UserProfileFormValues } from "./form-schema";

interface UserProfileFormProps {
  control: Control<UserProfileFormValues>;
  mode: "Add" | "Update";
  disabled?: boolean;
}

const roles = [
  { label: "Admin", value: "admin" },
  { label: "User", value: "user" },
];

const UserProfileForm = ({ control, mode, disabled }: UserProfileFormProps) => {
  return (
    <div className="w-full flex flex-col gap-4 md:gap-6">
      {/* ID (Update Only) */}
      {mode === "Update" && (
        <FormField
          control={control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Id</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupInput disabled {...field} />
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <FormField
        control={control}
        name="first_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First name</FormLabel>
            <FormControl>
              <InputGroup>
                <InputGroupInput
                  placeholder="First name"
                  type="text"
                  disabled
                  {...field}
                />
              </InputGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="last_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last name</FormLabel>
            <FormControl>
              <InputGroup>
                <InputGroupInput
                  placeholder="Last name"
                  type="text"
                  disabled
                  {...field}
                />
              </InputGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email address</FormLabel>
            <FormControl>
              <InputGroup>
                <InputGroupInput
                  type="text"
                  placeholder="Email address"
                  disabled
                  {...field}
                />
              </InputGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Active */}
      <FormField
        control={control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role</FormLabel>
            <FormControl>
              <Combobox
                disabled={disabled}
                items={roles}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select role..."
                className="w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default UserProfileForm;
