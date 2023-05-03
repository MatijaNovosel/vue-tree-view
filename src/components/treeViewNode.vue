<template>
  <div
    :aria-expanded="isOpen"
    :class="classes"
    class="v-treeview-node v-treeview-node--click"
  >
    <div class="v-treeview-node__root" @click="openNode">
      <div class="v-treeview-node__content">
        <div class="v-treeview-node__level" v-for="l in level" :key="l" />
        <v-btn
          v-if="hasChildren"
          size="35"
          variant="flat"
          class="v-treeview-node__toggle"
          :icon="isOpen ? 'mdi-chevron-down' : 'mdi-chevron-right'"
        />
        <div class="v-treeview-node__level" v-else />
        <v-checkbox-btn
          :true-icon="nodeIcon"
          density="compact"
          hide-details
          readonly
          :color="color"
          :model-value="isSelected"
          @click.stop="nodeSelected"
        />
        <div class="v-treeview-node__prepend">
          <slot name="prepend" />
        </div>
        <div class="v-treeview-node__label">
          <template v-if="item.name">
            {{ item.name }}
          </template>
          <slot name="label" v-else />
        </div>
        <div class="v-treeview-node__append">
          <slot name="append" />
        </div>
      </div>
    </div>
    <v-expand-transition>
      <div class="v-treeview-node__children" v-if="isOpen">
        <tree-view-node
          v-for="child in item.children"
          :level="level + 1"
          :key="child.id"
          :item="child"
          :color="color"
          @change="childNodeChanged"
        />
      </div>
    </v-expand-transition>
  </div>
</template>

<script lang="ts" setup>
import { useEventBus } from "@vueuse/core";
import { computed, inject } from "vue";
import { TreeViewNodeItem } from "./models";
import "./treeView.sass";

const { emit: emitNodeOpen } = useEventBus<number>("open-node");

const emit = defineEmits<{
  (e: "change", id: number): void;
}>();

const selectedNodes = inject<Set<number>>("selected-nodes");
const openedNodes = inject<Set<number>>("opened-nodes");

const props = defineProps<{
  level: number;
  item: TreeViewNodeItem;
  parentIsDisabled?: boolean;
  color?: string;
}>();

const checkAllChildrenSelected = (
  currentNode: TreeViewNodeItem,
  status: boolean
): boolean => {
  if (currentNode.children) {
    for (const child of currentNode.children) {
      if (child.children) {
        status =
          status &&
          selectedNodes!.has(child.id) &&
          checkAllChildrenSelected(child, status);
      } else {
        status = status && selectedNodes!.has(child.id);
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
          selectedNodes!.has(child.id) ||
          checkAtLeastOneChildSelected(child, status);
      } else {
        status = status || selectedNodes!.has(child.id);
      }
    }
  }
  return status;
};

const checkChildSelectStatus = (type: "all" | "atLeastOne") => {
  return type === "all"
    ? checkAllChildrenSelected(props.item, true)
    : checkAtLeastOneChildSelected(props.item, false);
};

const unselectNode = (id: number) => selectedNodes!.delete(id);

const selectNode = (id: number) => selectedNodes!.add(id);

const toggleNode = (id: number) => {
  if (selectedNodes!.has(id)) {
    unselectNode(id);
    return;
  }
  selectNode(id);
};

const applyToAllChildren = (
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

const childNodeChanged = () => {
  const id = props.item.id;
  if (hasChildren.value) {
    if (allChildrenSelected.value) {
      if (!isSelected.value) nodeSelected();
    } else {
      if (atLeastOneChildSelected.value) {
        if (!isSelected.value) selectNode(id);
      } else {
        if (isSelected.value) nodeSelected();
      }
    }
    emit("change", id);
  }
};

const nodeSelected = () => {
  if (hasChildren.value) {
    if (
      isSelected.value &&
      atLeastOneChildSelected.value &&
      !allChildrenSelected.value
    ) {
      applyToAllChildren(props.item, selectNode);
    } else {
      toggleNode(props.item.id);
      applyToAllChildren(
        props.item,
        isSelected.value ? selectNode : unselectNode
      );
    }
  } else {
    toggleNode(props.item.id);
  }
  emit("change", props.item.id);
};

const openNode = () => {
  if (hasChildren.value) emitNodeOpen(props.item.id);
};

const classes = computed(() => ({
  "v-treeview-node--leaf": !hasChildren.value,
}));

const isOpen = computed(() => openedNodes?.has(props.item.id));

const isSelected = computed(() => selectedNodes?.has(props.item.id));

const hasChildren = computed(
  () => !!props.item.children && !!props.item.children.length
);

const allChildrenSelected = computed(() => checkChildSelectStatus("all"));

const atLeastOneChildSelected = computed(() =>
  checkChildSelectStatus("atLeastOne")
);

const nodeIcon = computed(() => {
  if (hasChildren.value) {
    if (allChildrenSelected.value) return "mdi-checkbox-marked";
    if (atLeastOneChildSelected.value) return "mdi-minus-box";
    return undefined;
  }
  return "mdi-checkbox-marked";
});
</script>
