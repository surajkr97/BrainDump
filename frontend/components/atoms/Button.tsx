type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
};

const variants = {
  primary:
    "rounded-xl bg-accent px-5 py-2.5 text-[15px] font-medium text-accent-ink transition hover:opacity-90",
  ghost:
    "rounded-lg px-2 py-1.5 text-[14px] text-muted transition hover:text-ink",
  danger:
    "rounded-lg px-2 py-1.5 text-[14px] text-muted transition hover:text-danger",
};

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={`${variants[variant]} outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 ${className}`}
    />
  );
}
