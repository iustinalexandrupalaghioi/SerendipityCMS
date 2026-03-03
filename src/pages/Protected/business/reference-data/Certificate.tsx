import CertificateList from "@/components/business/certificates/list/CertificateList";
import Breadcrumb from "@/components/partials/Breadcrumb";
import { useDocumentTitle } from "@/lib/utils";

const breadcrumbItems = [
  { path: "/", label: "Home" },
  { label: "Certificates" },
];

const Certificate = () => {
  useDocumentTitle("Certificates");

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <CertificateList />
    </div>
  );
};

export default Certificate;
