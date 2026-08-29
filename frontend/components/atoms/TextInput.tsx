type Props = React.InputHTMLAttributes<HTMLInputElement> & { label: string };

export default function TextInput({ label, id, className = "", ...props }: Props) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className={`rounded-xl border border-line bg-surface px-4 py-2.5 text-[15px] text-ink outline-none transition placeholder:text-muted focus:border-accent disabled:opacity-50 ${className}`}
      />
    </>
  );
}
