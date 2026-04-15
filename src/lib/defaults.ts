import type { DropZone, Draggable } from "./types";

export const defaultDraggables: Draggable[] = [
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

export const defaultDropZones: DropZone[] = [
  {
    id: "S",
    draggables: [],
    backgroundColor: "#ff7f7f",
  },
  {
    id: "A",
    draggables: [],
    backgroundColor: "#ffbf7f",
  },
  {
    id: "B",
    draggables: [],
    backgroundColor: "#ffe77f",
  },
  {
    id: "C",
    draggables: [],
    backgroundColor: "#bfff7f",
  },
  {
    id: "D",
    draggables: [],
    backgroundColor: "#7fffbf",
  },
  {
    id: "free",
    draggables: defaultDraggables.map((draggable) => draggable.id),
  },
];
