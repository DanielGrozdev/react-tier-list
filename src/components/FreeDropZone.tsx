import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { defaultDraggables } from "../lib/defaults";
import type { DropZone } from "../lib/types";
import { Draggable } from "./Draggable.tsx";
import { memo } from "react";

export const FreeDropZone = memo(
  ({
    dropZone,
    activeDraggableId,
  }: {
    dropZone: DropZone;
    activeDraggableId?: string;
  }) => {
    const { id, draggables } = dropZone;

    const { setNodeRef } = useDroppable({ id });

    const draggableById = Object.fromEntries(
      defaultDraggables.map((d) => [d.id, d]),
    );

    return (
      <div className="border-2 border-slate-200 rounded-lg h-30 w-full flex gap-4 overflow-x-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutrial-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutrial-500">
        {draggables.length > 0 ? (
          <>
            <div className="flex gap-4">
              <SortableContext items={draggables}>
                {draggables.map((draggableId) => {
                  const draggable = draggableById[draggableId];

                  if (!draggable) return null;

                  return (
                    <Draggable
                      key={draggableId}
                      draggable={draggable}
                      activeDraggableId={activeDraggableId}
                    />
                  );
                })}
              </SortableContext>
            </div>

            <div ref={setNodeRef} className="flex-1" />
          </>
        ) : (
          <div className="flex flex-1 w-full justify-center items-center">
            No items to select
          </div>
        )}
      </div>
    );
  },
);
