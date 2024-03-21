<template>
  <div class="treeview" :class="classes">
    <tree-view-node
      v-for="item in items"
      :selectable="selectable"
      :color="props.color"
      :level="1"
      :item="item"
      :key="item.id"
      :disabled="disabled"
      :unopenable="unopenable"
      :identifier="identifier"
    />
  </div>
</template>

<script lang="ts" setup>
import { rand, useEventBus } from "@vueuse/core";
import {
computed,
onMounted,
onUnmounted,
provide,
reactive,
watch
} from "vue";
import {
applyToAllChildren,
checkChildSelectStatus,
gatherAllNodeIds
} from "./helpers";
import { TreeViewNodeItem, TreeViewSelectionMode } from "./models";
import treeViewNode from "./treeViewNode.vue";

const emit = defineEmits<{
  (e: "update:modelValue", values: number[]): void;
}>();

const props = withDefaults(
  defineProps<{
    dense?: boolean;
    disabled?: boolean;
    openAll?: boolean;
    selectable?: boolean;
    unopenable?: boolean;
    color?: string;
    modelValue: number[];
    items: TreeViewNodeItem[];
    selectionMode?: TreeViewSelectionMode;
  }>(),
  {
    color: "#7e7ec2",
    selectionMode: "leaf",
    selectable: true
  }
);

const identifier = rand(1, 9999);

const busOpenNode = useEventBus<number>(`open-node-${identifier}`);
const busSelectNode = useEventBus<TreeViewNodeItem>(
  `select-node-${identifier}`
);

const nodeOpened = (id: number) => {
  if (state.openedNodes.has(id)) {
    state.openedNodes.delete(id);
    return;
  }
  state.openedNodes.add(id);
};

const unselectNode = (id: number) => state.selectedNodes.delete(id);

const selectNode = (id: number) => {
  state.selectedNodes.add(id);
};

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
      checkChildSelectStatus(state.selectedNodes, item, "atLeastOne") &&
      !checkChildSelectStatus(state.selectedNodes, item, "all")
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
  openedNodes: new Set<number>(),
  stopRecursion: false
});

provide("selected-nodes", state.selectedNodes);
provide("opened-nodes", state.openedNodes);

const classes = computed(() => ({
  "treeview--dense": props.dense
}));

watch(
  () => state.selectedNodes,
  (val) => {
    emit("update:modelValue", [...val]);
    state.stopRecursion = true;
  },
  {
    deep: true
  }
);

watch(
  () => props.modelValue,
  (val) => {
    if (state.stopRecursion) {
      state.stopRecursion = false;
      return;
    }
    if (val.length) {
      for (const n of [...new Set(val)]) state.selectedNodes.add(n);
      return;
    }
    state.selectedNodes.clear();
  },
  {
    immediate: true
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

<style>
.treeview-node--click > .treeview-node__root,
.treeview-node--click > .treeview-node__root > .treeview-node__content > * {
  cursor: pointer;
  user-select: none;
}

.treeview-node.treeview-node--active .treeview-node__content .v-icon {
  color: inherit;
}

.treeview-node__root {
  display: flex;
  align-items: center;
  min-height: 48px;
  padding-left: 8px;
  padding-right: 8px;
  position: relative;
}

.treeview-node__root::before {
  background-color: currentColor;
  bottom: 0;
  content: "";
  left: 0;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.treeview-node__root::after {
  content: "";
  font-size: 0;
  min-height: inherit;
}

.treeview-node__children {
  transition: all 0.2s cubic-bezier(0, 0, 0.2, 1);
}

.treeview--dense .treeview-node__root {
  min-height: 40px;
}

.treeview-node__toggle {
  width: 24px;
  user-select: none;
  margin-right: 4px;
}

.treeview-node__level {
  width: 24px;
}

.treeview-node__content {
  align-items: center;
  display: flex;
  flex-basis: 0%;
  flex-grow: 1;
  flex-shrink: 0;
  min-width: 0;
}

.open {
  animation: open 0.15s linear;
}

@keyframes open {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(90deg);
  }
}

.close {
  animation: close 0.15s linear;
}

@keyframes close {
  0% {
    transform: rotate(90deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.m-checkbox {
  z-index: 0;
  position: relative;
  display: inline-block;
  font-family: Roboto;
  font-size: 16px;
  line-height: 1.5;
}

.m-checkbox > input {
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  z-index: -1;
  position: absolute;
  left: -10px;
  top: -8px;
  display: block;
  margin: 0;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  box-shadow: none;
  outline: none;
  opacity: 0;
  transform: scale(1);
  pointer-events: none;
  transition: opacity 0.3s, transform 0.2s;
}

.m-checkbox > span {
  display: inline-block;
  width: 100%;
  cursor: pointer;
}

.m-checkbox > span::before {
  content: "";
  display: inline-block;
  box-sizing: border-box;
  margin: 3px 11px 3px 1px;
  border: solid 2px;
  border-color: grey;
  border-radius: 2px;
  width: 18px;
  height: 18px;
  vertical-align: top;
  transition: border-color 0.2s, background-color 0.2s;
}

.m-checkbox > span::after {
  content: "";
  display: block;
  position: absolute;
  top: 3px;
  left: 1px;
  width: 10px;
  height: 5px;
  border: solid 2px transparent;
  border-right: none;
  border-top: none;
  transform: translate(3px, 4px) rotate(-45deg);
}

.m-checkbox > input:checked,
.m-checkbox > input:indeterminate {
  background-color: v-bind(color);
}

.m-checkbox > input:checked + span::before,
.m-checkbox > input:indeterminate + span::before {
  border-color: v-bind(color);
  background-color: v-bind(color);
}

.m-checkbox > input:checked + span::after,
.m-checkbox > input:indeterminate + span::after {
  border-color: white;
}

.m-checkbox > input:indeterminate + span::after {
  border-left: none;
  transform: translate(4px, 3px);
}

.m-checkbox:hover > input {
  opacity: 0.04;
}

.m-checkbox > input:focus {
  opacity: 0.12;
}

.m-checkbox:hover > input:focus {
  opacity: 0.16;
}

.m-checkbox > input:active {
  opacity: 1;
  transform: scale(0);
  transition: transform 0s, opacity 0s;
}

.m-checkbox > input:active + span::before {
  border-color: v-bind(color);
}

.m-checkbox > input:checked:active + span::before {
  border-color: transparent;
  background-color: grey;
}

.m-checkbox > input:disabled {
  opacity: 0;
}

.m-checkbox > input:disabled + span {
  color: grey;
  cursor: initial;
}

.m-checkbox > input:disabled + span::before {
  border-color: currentColor;
}

.m-checkbox > input:checked:disabled + span::before,
.m-checkbox > input:indeterminate:disabled + span::before {
  border-color: transparent;
  background-color: currentColor;
}
</style>
