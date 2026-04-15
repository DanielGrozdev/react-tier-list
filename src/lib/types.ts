export type Draggable = {
  id: string;
  src: string;
  dz?: string;
};

export type DropZone = {
  id: string;
  draggables: string[];
  backgroundColor?: string;
};
