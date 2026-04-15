import { useSortable } from "@dnd-kit/sortable";
import type { Draggable as DraggableType } from "../lib/types";
import { DraggableContent } from "./DraggableContent.tsx";

export function Draggable({
  draggable,
  activeDraggableId,
}: {
  draggable: DraggableType;
  activeDraggableId?: string;
}) {
  const { id } = draggable;
  const { setNodeRef, listeners, attributes, transform, transition } =
    useSortable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  return (
    <button
      data-tooltip-target={id}
      className="cursor-pointer min-w-auto w-[200px]"
      style={style}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      <DraggableContent
        draggable={draggable}
        activeDraggableId={activeDraggableId}
      />
    </button>
  );
}
