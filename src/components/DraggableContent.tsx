import type { Draggable } from "../lib/types";

export function DraggableContent({
  draggable,
  isDragging,
  activeDraggableId,
}: {
  draggable: Draggable;
  isDragging?: boolean;
  activeDraggableId?: string;
}) {
  const { id, src } = draggable;

  return (
    <div className="relative">
      <img
        src={`/src/assets/cars/${src}`}
        style={{ opacity: isDragging || activeDraggableId !== id ? 1 : 0 }}
        className="w-[200px]"
      />
    </div>
  );
}
