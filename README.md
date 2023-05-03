<div align="center">
  <img src="https://user-images.githubusercontent.com/36193643/235635449-37f4efc3-74c4-4750-a39c-e4f2339d5087.png" />
</div>

<h1 align=center>Vue tree view</h1>
<p align=center>A tree view component for Vue 3.</p>

## 🚀 Installation

Install using your package manager of choice:

```bash
yarn add tree-view
```

## ⚙️ Usage

Import the component locally or define it globally and include the css file:

```vue
<template>
  <tree-view v-model="selection" />
</template>

<script lang="ts" setup>
import TreeView from "tree-view";
import { ref } from "vue";
import "tree-view/dist/style.css";

const selection = ref([]);
</script>
```

## 📃 Props

| Name             | Type               | Default | Description                                                                                                                                                   |
| ---------------- | ------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`        | `number[]`         |         | Standard two way input                                                                                                                                        |
| `dense`          | `boolean`          | false   | Changes the style of the component to a more compact design                                                                                                   |
| `openAll`        | `boolean`          | false   | All nodes will be opened on component load                                                                                                                    |
| `disabled`       | `boolean`          | false   | Makes the component uninteractable                                                                                                                            |
| `selection-mode` | `independent/leaf` | leaf    | Changes the way selection is handled, `leaf` selects all of the children if clicking on a parent, ` independent` selects a node without triggering any others |
