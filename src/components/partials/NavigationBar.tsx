import Logo from "@/assets/logo.png";
import DarkLogo from "@/assets/logo-dark.png";
import { AuthButton } from "@/components/authentication/AuthButton";
import UserMenu from "@/components/user/UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/useIsMobile";

const NavigationBar = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  return (
    <nav className="w-full py-3 flex items-center justify-between px-4">
      <div className="flex gap-3 items-center">
        <a href="/" className="flex gap-1 items-center">
          <img
            src={Logo}
            className="w-16 h-auto object-cover dark:hidden"
            alt="GTA Nail Salon & Training Centre Logo"
          />
          <img
            src={DarkLogo}
            className="w-16 h-auto object-cover hidden dark:block"
            alt="GTA Nail Salon & Training Centre Logo"
          />
        </a>
        <div id="toolbar-slot" className="flex items-center gap-2" />
      </div>

      {!isMobile ? (
        <>{user ? <UserMenu /> : <AuthButton />}</>
      ) : (
        <>
          {isMobile && user && <UserMenu />}
          {isMobile && !user && <AuthButton />}
        </>
      )}
    </nav>
  );
};

export default NavigationBar;
