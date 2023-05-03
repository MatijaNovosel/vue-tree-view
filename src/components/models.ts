export type TreeViewSelectionMode = "independent" | "leaf";

export interface TreeViewNodeItem {
  id: number;
  name: string;
  children?: TreeViewNodeItem[];
}

export interface NodeState {
  parent: number | string | null;
  children: (number | string)[];
  vnode: any;
  isActive: boolean;
  isSelected: boolean;
  isIndeterminate: boolean;
  isOpen: boolean;
  item: TreeViewNodeItem;
}
