export default function Notice({ children }: { children: React.ReactNode }) {
  return <p className="py-6 text-center text-[15px] text-muted">{children}</p>;
}
