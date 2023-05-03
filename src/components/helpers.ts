import { TreeViewNodeItem } from "./models";

export function findNode(
  id: number,
  currentNode: TreeViewNodeItem
): TreeViewNodeItem | null {
  let currentChild, result;
  if (id == currentNode.id) {
    return currentNode;
  } else {
    if (currentNode.children) {
      for (let i = 0; i < currentNode.children.length; i++) {
        currentChild = currentNode.children[i];
        result = findNode(id, currentChild);
        if (result !== null) return result;
      }
    }
    return null;
  }
}
