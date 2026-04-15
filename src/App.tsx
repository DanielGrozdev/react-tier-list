import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { defaultDropZones, defaultDraggables } from "./lib/defaults";
import type { Draggable, DropZone } from "./lib/types";
import { DropZone as DropZoneComponent } from "./components/DropZone.tsx";
import { FreeDropZone } from "./components/FreeDropZone.tsx";
import { DraggableContent } from "./components/DraggableContent.tsx";

const dropZoneIds = defaultDropZones.map((dz) => dz.id);

export default function App() {
  const [draggables] = useState<Draggable[]>(defaultDraggables);
  const [dropZones, setDropZones] = useState<DropZone[]>(defaultDropZones);
  const [activeDraggable, setActiveDraggable] = useState<Draggable | undefined>(
    undefined,
  );
  const activeDraggableId = useMemo(
    () => activeDraggable?.id,
    [activeDraggable],
  );

  const handleDragStart = (e: DragStartEvent) => {
    const activeDraggable = draggables.find(
      (draggable) => draggable.id === e.active.id,
    );

    setActiveDraggable(activeDraggable);
  };

  const handleDragOver = (e: DragOverEvent) => {
    if (!e.over || !activeDraggable) return;

    const overId = e.over.id as string;
    const activeDraggableId = e.active.id as string;

    setDropZones((prev) => {
      const currentDropZone = prev.find((dz) =>
        dz.draggables.some((draggable) => draggable === activeDraggableId),
      );
      if (!currentDropZone) return prev;
      const currentDropZoneId = currentDropZone.id;

      // Case #1: If we're hovering the empty space in a dropZone
      if (dropZoneIds.includes(overId)) {
        const dropZone = prev.find((dz) => dz.id === overId);
        if (!dropZone) return prev;

        const newDraggables = [
          ...dropZone.draggables.filter(
            (draggable) => draggable !== activeDraggableId,
          ),
          activeDraggableId,
        ];
        return prev.map((dz) => {
          // If not the old OR new, just return
          if (dz.id !== overId && dz.id !== currentDropZoneId) return dz;

          // Remove from the old one IF we went across zones
          if (dz.id === currentDropZoneId && currentDropZoneId !== overId)
            return {
              ...dz,
              draggables: dz.draggables.filter(
                (draggable) => draggable !== activeDraggableId,
              ),
            };

          // Add to new one
          return { ...dz, draggables: newDraggables };
        });
      }

      // Case #2: Re-arranging items in the same row
      else if (
        currentDropZone.draggables.some((draggable) => draggable === overId)
      ) {
        const oldIndex = currentDropZone.draggables.findIndex(
          (draggable) => draggable === activeDraggableId,
        );
        const newIndex = currentDropZone.draggables.findIndex(
          (draggable) => draggable === overId,
        );

        if (oldIndex === newIndex) return prev;
        const newDraggables = arrayMove(
          currentDropZone.draggables,
          oldIndex,
          newIndex,
        );

        return prev.map((dz) => {
          if (dz.id !== currentDropZoneId) return dz;
          return { ...dz, draggables: newDraggables };
        });
      }

      // Case #3: Re-arranging between TWO different rows
      else if (
        !currentDropZone.draggables.some((draggable) => draggable === overId)
      ) {
        const newDropZone = prev.find((dz) =>
          dz.draggables.some((draggable) => draggable === overId),
        );

        if (!newDropZone) return prev;
        const overIndex = newDropZone.draggables.findIndex(
          (draggable) => draggable === overId,
        );
        const newDraggables = newDropZone.draggables.toSpliced(
          overIndex,
          0,
          activeDraggableId,
        );

        return prev.map((dz) => {
          // If not the new OR old dropZone, just return it as is
          if (dz.id !== currentDropZoneId && dz.id !== newDropZone.id)
            return dz;
          // Remove from the old one
          else if (dz.id === currentDropZoneId)
            return {
              ...dz,
              draggables: dz.draggables.filter(
                (draggable) => draggable !== activeDraggableId,
              ),
            };

          // Add to new
          return { ...dz, draggables: newDraggables };
        });
      }
      return prev;
    });
  };

  const handleDragEnd = () => {
    setActiveDraggable(undefined);
  };

  const freeDropZone = dropZones.find((dz) => dz.id === "free");
  if (!freeDropZone) return null;

  return (
    <>
      <div className="flex flex-col w-screeen min-h-screen justify-center item-center gap-16">
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          collisionDetection={pointerWithin}
        >
          <div className="w-full">
            {/* Zone */}
            {dropZones
              .filter((draggable) => draggable.id !== "free")
              .map((dz) => (
                <DropZoneComponent
                  key={dz.id}
                  dropZone={dz}
                  activeDraggableId={activeDraggableId}
                />
              ))}
          </div>
          {/* Cars */}
          <FreeDropZone
            dropZone={freeDropZone}
            activeDraggableId={activeDraggableId}
          />
          {/* Draggable content */}
          <DragOverlay>
            {activeDraggable && (
              <DraggableContent
                draggable={activeDraggable}
                isDragging
                activeDraggableId={activeDraggableId}
              />
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  );
}
