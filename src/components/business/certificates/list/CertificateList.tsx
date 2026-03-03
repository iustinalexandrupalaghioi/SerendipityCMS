import DataTable from "@/components/partials/data-table/DataTable";
import Loader from "@/components/ui/loader";
import { useCertificates } from "@/hooks/useCertificates";
import { Navigate } from "react-router";
import { CertificateColumns } from "./CertificateColumns";
import AddCertificateDialog from "../form/AddCertificateDialog";

const CertificateList = () => {
  const { data, isLoading, error } = useCertificates();

  return (
    <div className="w-full py-2">
      <AddCertificateDialog />
      {isLoading && <Loader />}
      {error && <Navigate to="/error" />}
      {!isLoading && !error && data && (
        <DataTable
          filterTextColumns={["Name"]}
          filterTextPlaceholders={["Search by certificate name..."]}
          filterTextLabels={["Certificate name"]}
          columns={CertificateColumns}
          data={data}
        />
      )}
    </div>
  );
};

export default CertificateList;
