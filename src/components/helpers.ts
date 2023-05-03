import { TreeViewNodeItem } from "./models";

export const applyToAllChildren = (
  currentNode: TreeViewNodeItem,
  fn: (id: number) => void
) => {
  if (currentNode.children) {
    for (const child of currentNode.children) {
      fn(child.id);
      if (child.children) applyToAllChildren(child, fn);
    }
  }
};

export const gatherAllNodeIds = (
  currentNode: TreeViewNodeItem,
  res: number[]
) => {
  if (currentNode.children) {
    for (const child of currentNode.children) {
      res = [...res, child.id];
      if (child.children) res = [...res, ...gatherAllNodeIds(child, res)];
    }
  }
  return [...res, currentNode.id];
};

export const checkAllChildrenSelected = (
  selectedNodes: Set<number>,
  currentNode: TreeViewNodeItem,
  status: boolean
): boolean => {
  if (currentNode.children) {
    for (const child of currentNode.children) {
      if (child.children) {
        status =
          status &&
          selectedNodes!.has(child.id) &&
          checkAllChildrenSelected(selectedNodes, child, status);
      } else {
        status = status && selectedNodes!.has(child.id);
      }
    }
  }
  return status;
};

export const checkAtLeastOneChildSelected = (
  selectedNodes: Set<number>,
  currentNode: TreeViewNodeItem,
  status: boolean
): boolean => {
  if (currentNode.children) {
    for (const child of currentNode.children) {
      if (child.children) {
        status =
          status ||
          selectedNodes!.has(child.id) ||
          checkAtLeastOneChildSelected(selectedNodes, child, status);
      } else {
        status = status || selectedNodes!.has(child.id);
      }
    }
  }
  return status;
};
