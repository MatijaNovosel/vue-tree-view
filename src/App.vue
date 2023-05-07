<template>
  <div style="display: flex">
    <tree-view
      color="blue"
      :items="treeViewItems"
      v-model="treeViewSelection"
      dense
      open-all
      unopenable
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
  }
];

const treeViewSelection = ref([]);
</script>
