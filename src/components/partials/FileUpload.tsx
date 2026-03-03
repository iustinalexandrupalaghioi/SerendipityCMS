import * as React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { UploadIcon } from "lucide-react";

const FileUpload = ({
  label = "Upload File",
  disabled,
  id,
  name,
  title,
  onChange,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) => {
  const [fileName, setFileName] = React.useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFileName(file ? file.name : "");

    // still call the external onChange if provided (e.g. react-hook-form)
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={cn("relative group", className)}>
      <Button
        className={cn(
          "border bg-transparent text-foreground shadow-xs",
          "group-focus-within:border-ring group-focus-within:ring-ring/50 group-focus-within:ring-[3px]",
        )}
        size="lg"
        disabled={disabled}
      >
        <UploadIcon className="mr-2 h-4 w-4 text-primary" />
        {label}
      </Button>

      <input
        id={id || name}
        name={name}
        title={title}
        type="file"
        disabled={disabled}
        className="absolute inset-0 max-w-max h-full opacity-0 cursor-pointer"
        onChange={handleChange}
        {...props}
      />

      {fileName && (
        <p className="mt-2 text-sm text-muted-foreground truncate">
          {fileName}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
