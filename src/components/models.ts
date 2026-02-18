export type TreeViewSelectionMode = "classic" | "independent";

export interface TreeViewNodeItem {
  id: number;
  name: string;
  children?: TreeViewNodeItem[];
}
