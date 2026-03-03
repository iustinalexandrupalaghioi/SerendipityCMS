import Logo from "@/assets/logo.png";
import { AuthButton } from "@/components/authentication/AuthButton";
import UserMenu from "@/components/user/UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { NavigationMenu } from "@radix-ui/react-navigation-menu";

const NavigationBar = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  return (
    <NavigationMenu className="w-full py-3 flex items-center justify-between px-10">
      <div className="flex gap-3 items-center">
        <a href="/" className="flex gap-1 items-center">
          <img
            src={Logo}
            className="w-16 h-auto object-cover"
            alt="GTA Nail Salon & Training Centre Logo"
          />
        </a>
      </div>
      {!isMobile ? (
        <>{user ? <UserMenu /> : <AuthButton />}</>
      ) : (
        <>
          {isMobile && user && <UserMenu />}
          {isMobile && !user && <AuthButton />}
        </>
      )}
    </NavigationMenu>
  );
};

export default NavigationBar;
