import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Loader from "../ui/loader";
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
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Mail, LockIcon, Eye, EyeOff } from "lucide-react";
import Logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";

const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { user, loading } = useAuth();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const { error } = await supabase.auth.signInWithPassword(values);
      if (error) throw new Error(error.message);
      return true;
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  useEffect(() => {
    // Wait until loading finishes
    if (!loading && user && user.profile.role === "admin") {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  if (loading && !user)
    return <Loader className="mx-auto mt-10 animate-spin" />;

  return (
    <div
      className={cn("flex flex-col gap-6 max-w-96 mx-auto my-10", className)}
      {...props}
    >
      <Card>
        <CardHeader className="flex flex-col-reverse md:flex-row items-start justify-between md:items-center gap-2">
          <div className="flex flex-col gap-2">
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Please enter your email to access your account.
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
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              {/* Email */}
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

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>Password</FormLabel>
                      <Link
                        to="/auth/forgot-password"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <InputGroup>
                        <InputGroupAddon>
                          <LockIcon className="h-4 w-4 text-gray-500" />
                        </InputGroupAddon>
                        <InputGroupInput
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••"
                          {...field}
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            type="button"
                            variant="ghost"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Error Message */}
              {loginMutation.isError && (
                <p className="text-sm text-destructive text-center">
                  {(loginMutation.error as Error).message}
                </p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>

              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  to="/auth/signup"
                  className="underline underline-offset-4"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
