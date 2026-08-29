export default function ErrorAlert({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-xl border border-danger/30 px-4 py-3 text-[15px] text-danger"
    >
      {message}
    </p>
  );
}
