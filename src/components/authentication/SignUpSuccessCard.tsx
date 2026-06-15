import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Logo from "@/assets/logo.png";
import DarkLogo from "@/assets/logo-dark.png";

const SignUpSuccessCard = () => {
  return (
    <div className="flex w-full mx-auto my-10 justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="flex flex-col-reverse md:flex-row items-start justify-between md:items-center gap-2">
              <div className="flex flex-col gap-2">
                <CardTitle className="text-2xl">
                  Thank you for signing up!
                </CardTitle>
                <CardDescription>Check your email to confirm</CardDescription>
              </div>
              <Link to="/">
                <img
                  src={Logo}
                  className="w-24 h-auto object-cover dark:hidden"
                  alt="Serendipity Nail Lab & Training Center by Georgiana Talpan Logo"
                />
                <img
                  src={DarkLogo}
                  className="w-24 h-auto object-cover hidden dark:block"
                  alt="Serendipity Nail Lab & Training Center by Georgiana Talpan Logo"
                />
              </Link>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                You&apos;ve successfully signed up. Please check your email to
                confirm your account before signing in.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUpSuccessCard;
