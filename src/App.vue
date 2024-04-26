<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
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
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <HelloWorld msg="Hello World!V1.4" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />

  <a href="/test/index.html" target="_blank" v-if="is_install">
    <button @click="handleShowInstall" style="font-size: 50px">点击打开</button>
  </a>
  <button @click="handleShowInstall" style="font-size: 50px" v-else>
    {{ text }}
  </button>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
