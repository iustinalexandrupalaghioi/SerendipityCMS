import EmailOverview from "@/components/business/email/overview/EmailOverview";
import { useDocumentTitle } from "@/lib/utils";

const Email = () => {
  useDocumentTitle("Emails");

  return <EmailOverview />;
};

export default Email;
