<script setup lang="ts">
import { useRegisterSW } from "virtual:pwa-register/vue";
import { onMounted, ref } from "vue";

const { updateServiceWorker } = useRegisterSW();

setTimeout(() => {
  updateServiceWorker(true);
}, 3000);

let deferredPrompt: any;
const text = ref("正在检查是否开启");
const is_install = ref(false);

async function checkInstall() {
  const relatedApps = await navigator.getInstalledRelatedApps();

  console.log(relatedApps);

  if (relatedApps.length > 0) {
    is_install.value = true;
  }
}

if (window.matchMedia("(display-mode: standalone)").matches) {
  is_install.value = true;
} else {
  setInterval(() => {
    checkInstall();
  }, 1000);

  window.addEventListener("beforeinstallprompt", (event) => {
    // 阻止默认的安装提示
    event.preventDefault();
    // 保存事件以便稍后触发
    deferredPrompt = event;
    text.value = "点击安装";
  });
}

const handleShowInstall = () => {
  deferredPrompt?.prompt?.();
  deferredPrompt?.userChoice.then((choiceResult: any) => {
    if (choiceResult.outcome === "accepted") {
      is_install.value = true;
    } else {
      alert("你已取消了安装");
    }
  });
};

const handleOpen = () => {
  window.open("https://files.lyb.im/test/index.html", "_blank");
};
</script>

<template>
  <button @click="handleOpen" style="font-size: 50px" v-if="is_install">
    点击打开
  </button>
  <button @click="handleShowInstall" style="font-size: 50px" v-else>
    {{ text }}
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
