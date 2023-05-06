<template>
  <div :class="classes" class="treeview-node treeview-node--click">
    <div class="treeview-node__root">
      <div class="treeview-node__content">
        <div class="treeview-node__level" v-for="l in level" :key="l" />
        <div
          v-if="hasChildren"
          size="35"
          variant="flat"
          class="treeview-node__toggle"
          @click.stop="openNode"
        >
          <img
            :style="{
              transform: `rotate(${isOpen ? 90 : 0}deg)`
            }"
            :class="{
              open: isOpen,
              close: !isOpen
            }"
            src="./chevron.svg"
            width="15"
            height="15"
          />
        </div>
        <div class="treeview-node__level" v-else />
        <template v-if="selectable">
          <label class="checkbox">
            <input
              type="checkbox"
              :indeterminate="isIndeterminate"
              :checked="isChecked"
              @click="nodeSelected"
            />
            <span>
              {{ item.name }}
            </span>
          </label>
        </template>
        <template v-else>
          {{ item.name }}
        </template>
      </div>
    </div>
    <div class="treeview-node__children" v-if="isOpen">
      <tree-view-node
        v-for="child in item.children"
        :selectable="selectable"
        :level="level + 1"
        :key="child.id"
        :item="child"
        :color="color"
        @change="childNodeChanged"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEventBus } from "@vueuse/core";
import { computed, inject } from "vue";
import {
  checkAllChildrenSelected,
  checkAtLeastOneChildSelected
} from "./helpers";
import { TreeViewNodeItem } from "./models";

const { emit: emitNodeOpen } = useEventBus<number>("open-node");
const { emit: emitNodeSelected } = useEventBus<TreeViewNodeItem>("select-node");

const emit = defineEmits<{
  (e: "change"): void;
}>();

const selectedNodes = inject<Set<number>>("selected-nodes");
const openedNodes = inject<Set<number>>("opened-nodes");

const props = defineProps<{
  level: number;
  item: TreeViewNodeItem;
  selectable?: boolean;
  color?: string;
}>();

const checkChildSelectStatus = (type: "all" | "atLeastOne") => {
  return type === "all"
    ? checkAllChildrenSelected(selectedNodes!, props.item, true)
    : checkAtLeastOneChildSelected(selectedNodes!, props.item, false);
};

const selectNode = (id: number) => selectedNodes!.add(id);

const childNodeChanged = () => {
  const id = props.item.id;
  if (hasChildren.value) {
    if (checkChildSelectStatus("all")) {
      if (!isSelected.value) nodeSelected();
    } else {
      if (checkChildSelectStatus("atLeastOne")) {
        if (!isSelected.value) selectNode(id);
      } else {
        if (isSelected.value) nodeSelected();
      }
    }
    emit("change");
  }
};

const nodeSelected = () => {
  emitNodeSelected(props.item);
  emit("change");
};

const openNode = () => {
  if (hasChildren.value) emitNodeOpen(props.item.id);
};

const classes = computed(() => ({
  "treeview-node--leaf": !hasChildren.value
}));

const isOpen = computed(() => openedNodes?.has(props.item.id));

const isSelected = computed(() => selectedNodes?.has(props.item.id));

const hasChildren = computed(
  () => !!props.item.children && !!props.item.children.length
);

const isChecked = computed(() => {
  if (hasChildren.value) {
    if (checkChildSelectStatus("all")) return true;
    if (checkChildSelectStatus("atLeastOne")) return false;
    return false;
  }
  return isSelected.value;
});

const isIndeterminate = computed(() => {
  if (hasChildren.value) {
    if (checkChildSelectStatus("all")) return false;
    if (checkChildSelectStatus("atLeastOne")) return true;
  }
  return false;
});
</script>
