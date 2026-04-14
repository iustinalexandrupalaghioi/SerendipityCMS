import NavigationBar from "@/components/partials/NavigationBar";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="w-full bg-background sticky top-0 z-50 flex justify-center border-b border-b-foreground/10 h-16">
        <NavigationBar />
      </div>

      <div className="flex-1 w-full flex flex-col gap-5 items-center">
        <div className="flex-1 flex flex-col w-full px-1 md:px-10 mx-auto">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default Layout;
