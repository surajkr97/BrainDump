type Props = { done: number; total: number };

export default function TodoProgress({ done, total }: Props) {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="flex flex-col gap-2">
      <div
        role="progressbar"
        aria-label="Todos completed"
        aria-valuenow={percent}
        className="h-1.5 overflow-hidden rounded-full bg-line"
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="flex justify-between text-[14px] text-muted">
        <span>
          {done} of {total} done
        </span>
        <span>{done === total ? "All clear." : `${total - done} left`}</span>
      </p>
    </div>
  );
}
