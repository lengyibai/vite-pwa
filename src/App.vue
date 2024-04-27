<script setup lang="ts">
import { usePwaCheck } from "./usePwaCheck";

const { install_status, status_tip, handleShowInstall } = usePwaCheck();
</script>

<template>
  v2.3
  <button @click="handleShowInstall" style="font-size: 50px">
    {{ status_tip[install_status] }}
  </button>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  color: #fff;
}

html,
body,
#app {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

#app {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
}

button {
  font-size: 50px;
  background-color: transparent;
  border: 0.1em solid #fff;
  padding: 0.5em;
  transition: 0.25s;

  &:hover {
    background-color: #fff;
    color: #000;
  }
}
</style>
