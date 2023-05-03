<template>
  <div class="treeview" :class="classes">
    <tree-view-node
      v-for="item in items"
      :color="props.color || 'accent'"
      :level="1"
      :item="item"
      :key="item.id"
    />
  </div>
</template>

<script lang="ts" setup>
import { useEventBus } from "@vueuse/core";
import {
  computed,
  onMounted,
  onUnmounted,
  provide,
  reactive,
  watch
} from "vue";
import { applyToAllChildren, gatherAllNodeIds } from "./helpers";
import { TreeViewNodeItem, TreeViewSelectionMode } from "./models";
import "./treeView.sass";
import treeViewNode from "./treeViewNode.vue";

const emit = defineEmits<{
  (e: "update:modelValue", values: number[]): void;
}>();

const props = defineProps<{
  dense?: boolean;
  disabled?: boolean;
  openAll?: boolean;
  color?: string;
  modelValue: number[];
  items: TreeViewNodeItem[];
  selectionMode: TreeViewSelectionMode;
}>();

const busOpenNode = useEventBus<number>("open-node");
const busSelectNode = useEventBus<TreeViewNodeItem>("select-node");

const nodeOpened = (id: number) => {
  if (state.openedNodes.has(id)) {
    state.openedNodes.delete(id);
    return;
  }
  state.openedNodes.add(id);
};

const checkAllChildrenSelected = (
  currentNode: TreeViewNodeItem,
  status: boolean
): boolean => {
  if (currentNode.children) {
    for (const child of currentNode.children) {
      if (child.children) {
        status =
          status &&
          state.selectedNodes.has(child.id) &&
          checkAllChildrenSelected(child, status);
      } else {
        status = status && state.selectedNodes.has(child.id);
      }
    }
  }
  return status;
};

const checkAtLeastOneChildSelected = (
  currentNode: TreeViewNodeItem,
  status: boolean
): boolean => {
  if (currentNode.children) {
    for (const child of currentNode.children) {
      if (child.children) {
        status =
          status ||
          state.selectedNodes.has(child.id) ||
          checkAtLeastOneChildSelected(child, status);
      } else {
        status = status || state.selectedNodes.has(child.id);
      }
    }
  }
  return status;
};

const checkChildSelectStatus = (
  item: TreeViewNodeItem,
  type: "all" | "atLeastOne"
) => {
  return type === "all"
    ? checkAllChildrenSelected(item, true)
    : checkAtLeastOneChildSelected(item, false);
};

const unselectNode = (id: number) => state.selectedNodes.delete(id);

const selectNode = (id: number) => state.selectedNodes.add(id);

const toggleNode = (id: number) => {
  if (state.selectedNodes.has(id)) {
    unselectNode(id);
    return;
  }
  selectNode(id);
};

const nodeSelected = (item: TreeViewNodeItem) => {
  if (!!item.children && !!item.children.length) {
    if (
      state.selectedNodes.has(item.id) &&
      checkChildSelectStatus(item, "atLeastOne") &&
      !checkChildSelectStatus(item, "all")
    ) {
      applyToAllChildren(item, selectNode);
    } else {
      toggleNode(item.id);
      applyToAllChildren(
        item,
        state.selectedNodes.has(item.id) ? selectNode : unselectNode
      );
    }
  } else {
    toggleNode(item.id);
  }
};

const unsubscribeOpenNode = busOpenNode.on(nodeOpened);
const unsubscribeSelectNode = busSelectNode.on(nodeSelected);

const state = reactive({
  selectedNodes: new Set<number>(),
  openedNodes: new Set<number>()
});

provide("selected-nodes", state.selectedNodes);
provide("opened-nodes", state.openedNodes);

const classes = computed(() => ({
  "treeview--dense": props.dense
}));

watch(
  () => state.selectedNodes,
  (val) => emit("update:modelValue", [...val]),
  {
    deep: true
  }
);

onMounted(() => {
  if (props.openAll === true) {
    let allVals: number[] = [];
    for (const node of props.items) {
      let x = gatherAllNodeIds(node, []);
      allVals = [...allVals, ...x];
    }
    for (const n of [...new Set(allVals)]) state.openedNodes.add(n);
  }
});

onUnmounted(() => {
  unsubscribeOpenNode();
  unsubscribeSelectNode();
});
</script>
