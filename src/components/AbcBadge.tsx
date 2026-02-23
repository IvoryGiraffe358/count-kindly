interface AbcBadgeProps {
  classification: "A" | "B" | "C";
}

const abcConfig = {
  A: "bg-primary/10 text-primary border-primary/20",
  B: "bg-accent/10 text-accent-foreground border-accent/20",
  C: "bg-muted text-muted-foreground border-border",
};

export default function AbcBadge({ classification }: AbcBadgeProps) {
  return (
    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold border ${abcConfig[classification]}`}>
      {classification}
    </span>
  );
}
