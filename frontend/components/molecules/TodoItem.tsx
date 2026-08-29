import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";
import type { Todo } from "@/types/todo";

type Props = {
  todo: Todo;
  busy: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function TodoItem({
  todo,
  busy,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  return (
    <li className="flex items-start gap-3 px-4 py-3.5 sm:px-5">
      <Checkbox
        checked={todo.completed}
        onChange={onToggle}
        disabled={busy}
        aria-label={`Mark "${todo.title}" complete`}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className={`text-[17px] leading-snug wrap-break-word ${
            todo.completed ? "text-muted line-through" : "text-ink"
          }`}
        >
          {todo.title}
        </span>
        {todo.description && (
          <span className="text-[15px] leading-snug wrap-break-word text-muted">
            {todo.description}
          </span>
        )}
      </div>
      <div className="flex shrink-0 gap-0.5">
        <Button
          variant="ghost"
          onClick={onEdit}
          disabled={busy}
          aria-label={`Edit "${todo.title}"`}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          onClick={onDelete}
          disabled={busy}
          aria-label={`Delete "${todo.title}"`}
        >
          Delete
        </Button>
      </div>
    </li>
  );
}
