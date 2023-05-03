<div align="center">
  <img height="150" src="https://user-images.githubusercontent.com/36193643/236064375-67123a53-6a84-4e13-af87-acc578c92f86.png" />
</div>

<h1 align=center>Vue tree view</h1>
<p align=center>A tree view component for Vue 3.</p>

## 🚀 Installation

Install using your package manager of choice:

```bash
yarn add vue-tree-view
```

## ⚙️ Usage

Import the component locally or define it globally and include the css file:

```vue
<template>
  <div style="display: flex">
    <tree-view
      color="blue"
      :items="treeViewItems"
      v-model="treeViewSelection"
      dense
      open-all
    />
    {{ treeViewSelection.sort() }}
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { TreeView } from "vue-tree-view";
import "vue-tree-view/dist/style.css";

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
```

## 📃 Props

| Name             | Type                    | Default | Description                                                                                                                                                   |
| ---------------- | ----------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`        | `number[]`              |         | Standard two way input                                                                                                                                        |
| `dense`          | `boolean`               | false   | Changes the style of the component to a more compact design                                                                                                   |
| `open-all`       | `boolean`               | false   | All nodes will be opened on component load                                                                                                                    |
| `disabled`       | `boolean`               | false   | Makes the component uninteractable                                                                                                                            |
| `selection-mode` | `independent` or `leaf` | leaf    | Changes the way selection is handled, `leaf` selects all of the children if clicking on a parent, ` independent` selects a node without triggering any others |
| `color`          | `string`                | #7e7ec2 | Color of the active checkboxes                                                                                                                                |
