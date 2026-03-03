interface BooleanDisplayProps {
  value: boolean;
}
const BooleanDisplay = ({ value }: BooleanDisplayProps) => {
  return <span>{value ? "Yes" : "No"}</span>;
};

export default BooleanDisplay;
