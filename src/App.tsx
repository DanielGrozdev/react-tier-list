import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  useDroppable,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { atom, useAtom, useAtomValue } from "jotai";

type Draggable = {
  id: string;
  src: string;
  dz?: string;
};

type DropZone = {
  id: string;
  draggables: string[];
};

const defaultDraggables: Draggable[] = [
  { id: crypto.randomUUID(), src: "alfa155.png" },
  { id: crypto.randomUUID(), src: "ferrariF50.png" },
  { id: crypto.randomUUID(), src: "fordGt40.png" },
  { id: crypto.randomUUID(), src: "jaguarDtype.png" },
  { id: crypto.randomUUID(), src: "lexusLfa.png" },
  { id: crypto.randomUUID(), src: "mazdaRx7.png" },
  { id: crypto.randomUUID(), src: "mclarenF1.png" },
  { id: crypto.randomUUID(), src: "mercedes190e.png" },
  { id: crypto.randomUUID(), src: "mercedes300Sl.png" },
  { id: crypto.randomUUID(), src: "miniCooperS.png" },
  { id: crypto.randomUUID(), src: "mitsubishiLancer.png" },
  { id: crypto.randomUUID(), src: "nismoR34.png" },
  { id: crypto.randomUUID(), src: "nissanR34.png" },
  { id: crypto.randomUUID(), src: "peugeotRcz.png" },
  { id: crypto.randomUUID(), src: "porsche911.png" },
  { id: crypto.randomUUID(), src: "porsche911Gt3.png" },
  { id: crypto.randomUUID(), src: "shelbyCobra.png" },
  { id: crypto.randomUUID(), src: "subaruImpreza.png" },
  { id: crypto.randomUUID(), src: "toyotaSupra.png" },
  { id: crypto.randomUUID(), src: "toyotaTs030.png" },
];

const defaultDropZones: DropZone[] = [
  {
    id: "S",
    draggables: [],
  },
  {
    id: "A",
    draggables: [],
  },
  {
    id: "B",
    draggables: [],
  },
  {
    id: "C",
    draggables: [],
  },
  {
    id: "D",
    draggables: [],
  },
  {
    id: "free",
    draggables: defaultDraggables.map((draggable) => draggable.id),
  },
];

const dropZoneIds = defaultDropZones.map((dz) => dz.id);

const activeDraggableAtom = atom<Draggable>();

export default function App() {
  const [draggables] = useState<Draggable[]>(defaultDraggables);
  const [dropZones, setDropZones] = useState<DropZone[]>(defaultDropZones);
  const [activeDraggable, setActiveDraggable] = useAtom(activeDraggableAtom);

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
      <div className="flex flex-col w-screeen h-screen justify-center item-center gap-16">
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
                <DropZone key={dz.id} dropZone={dz} />
              ))}
          </div>
          {/* Cars */}
          <FreeDropZone dropZone={freeDropZone} />
          {/* Draggable content */}
          <DragOverlay>
            {activeDraggable && (
              <DraggableContent draggable={activeDraggable} isDragging />
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  );
}

function DropZone({ dropZone }: { dropZone: DropZone }) {
  const { id, draggables } = dropZone;

  const { setNodeRef } = useDroppable({ id: id });
  const backgroundColor = dropZoneColorMap[id] as keyof typeof dropZoneColorMap;

  return (
    <div
      className="border-2 rounded-lg border-white h-30 w-full flex gap-4 hover:border-slate-100 transition-all"
      style={{ backgroundColor: backgroundColor + "75" }}
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
            const draggable = defaultDraggables.find(
              (draggable) => draggable.id === draggableId,
            );

            if (!draggable) return null;

            return <Draggable key={draggableId} draggable={draggable} />;
          })}
        </SortableContext>
      </div>

      <div ref={setNodeRef} className="flex-1" />
    </div>
  );
}

function FreeDropZone({ dropZone }: { dropZone: DropZone }) {
  const { id, draggables } = dropZone;

  const { setNodeRef } = useDroppable({ id: id });
  return (
    <>
      <div className="border-2 border-slate-200 rounded-lg h-30 w-full flex gap-4 overflow-x-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutrial-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutrial-500">
        {draggables.length > 0 ? (
          <>
            <div className="flex gap-4">
              <SortableContext items={draggables}>
                {draggables.map((draggableId) => {
                  const draggable = defaultDraggables.find(
                    (draggable) => draggable.id === draggableId,
                  );

                  if (!draggable) return null;

                  return <Draggable key={draggableId} draggable={draggable} />;
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
    </>
  );
}

function Draggable({ draggable }: { draggable: Draggable }) {
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
    <>
      <div
        id={id}
        role="tooltip"
        className="absolute z-10 bg-amber-500 text-white invisible"
      >
        Tooltip content
        <div className="tooltip-arrow" data-popper-arrow></div>
      </div>
      <button
        data-tooltip-target={id}
        className="cursor-pointer min-w-auto w-[200px]"
        style={style}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
      >
        <DraggableContent draggable={draggable} />
      </button>
    </>
  );
}

function DraggableContent({
  draggable,
  isDragging,
}: {
  draggable: Draggable;
  isDragging?: boolean;
}) {
  const { id, src } = draggable;
  const activeDraggableId = useAtomValue(activeDraggableAtom)?.id;

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
const dropZoneColorMap = {
  S: "#ff7f7f", // rgb(255, 127, 127)
  A: "#ffbf7f", // rgb(255, 191, 127)
  B: "#ffe77f", // rgb(255, 231, 127)
  C: "#bfff7f", // rgb(191, 255, 127)
  D: "#7fffbf", // rgb(127, 255, 191)
};
