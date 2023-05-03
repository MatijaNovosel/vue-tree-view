export type TreeViewSelectionMode = "independent" | "leaf";

export interface TreeViewNodeItem {
  id: number;
  name: string;
  children?: TreeViewNodeItem[];
}
