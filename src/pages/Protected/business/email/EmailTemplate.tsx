import EmailTemplateOverview from "@/components/business/email/email-template/overview/EmailTemplateOverview";
import { useDocumentTitle } from "@/lib/utils";

const EmailTemplate = () => {
  useDocumentTitle("Email templates");

  return <EmailTemplateOverview />;
};

export default EmailTemplate;
