import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";

const ErrorPage = () => {
  return (
    <div className="flex min-h-svh w-full  justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                <div className="flex flex-col items-center max-w-sm mx-auto text-center">
                  <p className="text-sm font-medium text-primary-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="#7f22fe"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                      />
                    </svg>
                  </p>
                  <h1 className="mt-3 text-2xl font-semibold text-primary md:text-3xl">
                    Page not found
                  </h1>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                We searched high and low, but couldn’t find what you’re looking
                for.
              </p>
              <div className="flex justify-center mt-8 gap-2">
                <Link to="/">
                  <Button size="sm" variant="default">
                    Home page
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
