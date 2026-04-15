import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { defaultDraggables } from "../lib/defaults";
import type { DropZone as DropZoneType } from "../lib/types";
import { Draggable } from "./Draggable.tsx";
import { memo } from "react";

export const DropZone = memo(
  ({
    dropZone,
    activeDraggableId,
  }: {
    dropZone: DropZoneType;
    activeDraggableId?: string;
  }) => {
    const { id, draggables, backgroundColor } = dropZone;

    const { setNodeRef } = useDroppable({ id });

    const draggableById = Object.fromEntries(
      defaultDraggables.map((d) => [d.id, d]),
    );

    return (
      <div
        className="border-2 rounded-lg border-white h-30 w-full flex gap-4 hover:border-slate-100 transition-all"
        style={{ backgroundColor: (backgroundColor ?? "#ffffff") + "75" }}
      >
        <div
          className="w-30 rounded-md flex justify-center items-center text-4xl font-semibold text-black min-w-[135px]"
          style={{ backgroundColor }}
        >
          {id}
        </div>
        <div className="flex gap-4 overflow-x-hidden">
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
      </div>
    );
  },
);
