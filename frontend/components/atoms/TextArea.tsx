type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export default function TextArea({ label, id, className = "", ...props }: Props) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <textarea
        id={id}
        {...props}
        className={`resize-none rounded-xl border border-line bg-surface px-4 py-2.5 text-[15px] text-ink outline-none transition placeholder:text-muted focus:border-accent disabled:opacity-50 ${className}`}
      />
    </>
  );
}
