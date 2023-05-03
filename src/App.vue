<template>
  <div style="display: flex">
    <tree-view
      color="primary"
      :items="treeViewItems"
      selection-mode="leaf"
      hoverable
      v-model="treeViewSelection"
      dense
      open-all
    />
    {{ treeViewSelection.sort() }}
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import treeView from "./components/treeView.vue";

const treeViewItems = [
  {
    id: 1,
    name: "ID 1",
    children: [
      { id: 2, name: "ID 2" },
      { id: 3, name: "ID 3" },
      { id: 4, name: "ID 4" }
    ]
  },
  {
    id: 5,
    name: "ID 5",
    children: [
      {
        id: 6,
        name: "ID 6",
        children: [
          {
            id: 7,
            name: "ID 7",
            children: [
              { id: 8, name: "ID 8" },
              { id: 9, name: "ID 9" }
            ]
          }
        ]
      },
      {
        id: 10,
        name: "ID 10",
        children: [
          {
            id: 11,
            name: "ID 11",
            children: [
              { id: 12, name: "ID 12" },
              { id: 13, name: "ID 13" },
              { id: 14, name: "ID 14" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 15,
    name: "ID 15",
    children: [
      { id: 16, name: "ID 16" },
      { id: 17, name: "ID 17" },
      { id: 18, name: "ID 18" }
    ]
  },
  {
    id: 19,
    name: "ID 19",
    children: [
      {
        id: 20,
        name: "ID 20",
        children: [
          { id: 21, name: "ID 21" },
          { id: 22, name: "ID 22" },
          { id: 23, name: "ID 23" }
        ]
      },
      { id: 24, name: "ID 24" },
      { id: 25, name: "ID 25" }
    ]
  }
];

const treeViewSelection = ref([]);
</script>
