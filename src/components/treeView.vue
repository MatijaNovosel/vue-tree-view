<template>
  <div class="v-treeview" :class="classes">
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
import { TreeViewNodeItem, TreeViewSelectionMode } from "./models";
import "./treeView.sass";
import treeViewNode from "./treeViewNode.vue";

const emit = defineEmits<{
  (e: "update:modelValue", values: number[]): void;
}>();

const props = defineProps<{
  dense?: boolean;
  disabled?: boolean;
  filter?: () => void;
  openAll?: boolean;
  search?: string;
  color?: string;
  modelValue: number[];
  items: TreeViewNodeItem[];
  selectionMode: TreeViewSelectionMode;
}>();

const busOpenNode = useEventBus<number>("open-node");

const gatherAllNodeIds = (currentNode: TreeViewNodeItem, res: number[]) => {
  if (currentNode.children) {
    for (const child of currentNode.children) {
      res = [...res, child.id];
      if (child.children) res = [...res, ...gatherAllNodeIds(child, res)];
    }
  }
  return [...res, currentNode.id];
};

const openNode = (id: number) => {
  if (state.openedNodes.has(id)) {
    state.openedNodes.delete(id);
    return;
  }
  state.openedNodes.add(id);
};

const unsubscribeOpenNode = busOpenNode.on(openNode);

const state = reactive({
  selectedNodes: new Set<number>(),
  openedNodes: new Set<number>()
});

provide("selected-nodes", state.selectedNodes);
provide("opened-nodes", state.openedNodes);

const classes = computed(() => ({
  "v-treeview--dense": props.dense
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
});
</script>
