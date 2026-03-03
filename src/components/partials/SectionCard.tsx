const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="relative rounded-2xl border p-4 ">
    {/* Floating Border Label */}
    <div className="absolute -top-3 left-3 text-sm font-medium text-muted-foreground">
      {title}
    </div>
    {children}
  </div>
);

export default SectionCard;
