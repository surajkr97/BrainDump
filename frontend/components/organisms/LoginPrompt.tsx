export default function LoginPrompt() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 p-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight text-ink">
        Brain<span className="text-accent">Dump</span>
      </h1>
      <p className="max-w-xs text-[17px] leading-relaxed text-muted">
        A quiet place to put the things you keep forgetting.
      </p>
      <a
        href="/auth/login"
        className="rounded-xl bg-accent px-6 py-3 text-[15px] font-medium text-accent-ink transition hover:opacity-90"
      >
        Log in
      </a>
    </main>
  );
}
