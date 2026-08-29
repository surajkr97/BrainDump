type Props = { email?: string };

export default function DashboardHeader({ email }: Props) {
  return (
    <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        Brain<span className="text-accent">Dump</span>
      </h1>
      <span className="flex min-w-0 items-baseline gap-3 text-[15px] text-muted">
        <span className="truncate">{email}</span>
        <a
          href="/auth/logout"
          className="shrink-0 whitespace-nowrap underline underline-offset-4 transition hover:text-ink"
        >
          Log out
        </a>
      </span>
    </header>
  );
}
