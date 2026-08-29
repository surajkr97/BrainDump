type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function Checkbox(props: Props) {
  return (
    <input
      type="checkbox"
      {...props}
      className="mt-0.5 size-5 shrink-0 accent-accent"
    />
  );
}
