import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import { Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import Logo from "@/assets/logo.png";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type FormSchema = z.infer<typeof formSchema>;

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: FormSchema) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo: `${window.location.origin}/auth/update-password`,
        }
      );
      if (error) throw error;
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className={cn("flex flex-col gap-6 max-w-96 mx-auto my-10", className)}
        {...props}
      >
        <Card>
          <CardHeader className="flex flex-col-reverse md:flex-row items-start justify-between md:items-center gap-2">
            <div className="flex flex-col gap-2">
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription>
                Password reset instructions sent
              </CardDescription>
            </div>
            <Link to="/">
              <img
                src={Logo}
                className="w-24 h-auto object-cover"
                alt="Serendipity Nail Lab & Training Center by Georgiana Talpan Logo"
              />
            </Link>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              If you registered using your email, you will receive a password
              reset email shortly.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={cn("flex flex-col gap-6 max-w-96 mx-auto my-10", className)}
      {...props}
    >
      <Card>
        <CardHeader className="flex flex-col-reverse md:flex-row items-start justify-between md:items-center gap-2">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-2xl">Reset Your Password</CardTitle>
            <CardDescription>
              Type in your email and we&apos;ll send you a link to reset your
              password
            </CardDescription>
          </div>
          <Link to="/">
            <img
              src={Logo}
              className="w-24 h-auto object-cover"
              alt="Serendipity Nail Lab & Training Center by Georgiana Talpan Logo"
            />
          </Link>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupAddon>
                          <Mail className="h-4 w-4 text-gray-500" />
                        </InputGroupAddon>
                        <InputGroupInput
                          type="email"
                          placeholder="john.doe@example.com"
                          {...field}
                        />
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send reset email"}
              </Button>

              <div className="mt-4 text-center text-sm">
                Remembered your password?{" "}
                <Link to="/" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
