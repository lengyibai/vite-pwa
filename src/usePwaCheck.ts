import { ref } from "vue";

interface MyNavigator extends Navigator {
  getInstalledRelatedApps: () => Promise<any[]>;
}

/** 是否为手机端 */
const isMobile = (() => /mobile/i.test(navigator.userAgent))();

/** @description 检查PWA应用安装 */
const usePwaCheck = () => {
  /** 电脑端检测安装定时器 */
  let pc_check_timer: NodeJS.Timeout;
  /** 弹出安装的事件对象 */
  let deferredPrompt: any;
  /** 安装状态对应提示 */
  const status_tip = {
    CHECKING: "正在检查安装状态...",
    INSTALLING: "安装中...",
    NO_INSTALL: "点击安装",
    INSTALLED: "点击打开",
  };

  const ExposeData = {
    status_tip,

    /** 是否安装 */
    install_status: ref<"CHECKING" | "INSTALLING" | "NO_INSTALL" | "INSTALLED">(
      "CHECKING"
    ),
    /** 是否正在检查 */
    is_checking: ref(false),
  };
  const { install_status } = ExposeData;

  /* 设置已安装 */
  const setInstalled = () => {
    if (isMobile) {
      install_status.value = "INSTALLED";
    } else {
      status_tip.INSTALLED = "你的电脑已安装，请直接在桌面打开";
      install_status.value = "INSTALLED";
    }
  };

  const ExposeMethods = {
    /** @description 安装Web应用 */
    handleShowInstall() {
      //如果已安装点击
      if (install_status.value === "INSTALLED" && isMobile) {
        window.open(location.href, "_blank");
        return;
      }

      //只有处于未安装状态才能点击安装
      if (install_status.value !== "NO_INSTALL") return;

      if (deferredPrompt && deferredPrompt.prompt && deferredPrompt.prompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult: any) => {
          if (choiceResult.outcome === "accepted") {
            install_status.value = "INSTALLING";
          } else {
            alert("你已取消了安装");
          }
        });
      }
    },
  };

  //如果为电脑端，超过五秒状态仍然在检测中，说明已经安装
  if (!isMobile) {
    pc_check_timer = setTimeout(() => {
      if (install_status.value === "CHECKING") {
        setInstalled();
      }
    }, 5000);
  }

  /** 用于实时检查是否安装当前应用（PC端此方法无效） */
  const checkInstall = () => {
    return new Promise<any[]>(async (resolve, reject) => {
      if ("getInstalledRelatedApps" in window.navigator) {
        const navigator = window.navigator as MyNavigator;
        const relatedApps = await navigator.getInstalledRelatedApps();

        //安装成功后数组不为空
        if (relatedApps?.length > 0) {
          resolve(relatedApps);
        } else {
          reject();
        }
      }
    });
  };

  /* 递归检查是否安装，如果没有安装，则每隔500毫秒检查一次 */
  const checking = () => {
    checkInstall()
      .then(setInstalled)
      .catch(() => {
        setTimeout(() => {
          if (
            window.matchMedia("(display-mode: standalone)").matches ||
            install_status.value === "INSTALLED"
          ) {
            setInstalled();
            return;
          }
          checking();
        }, 500);
      });
  };
  checking();

  //如果没有安装，则会弹出安装提示
  window.addEventListener("beforeinstallprompt", (event) => {
    clearTimeout(pc_check_timer);
    // 阻止默认的安装提示
    event.preventDefault();
    // 保存事件以便稍后触发
    deferredPrompt = event;
    //设置未安装状态
    install_status.value = "NO_INSTALL";
  });

  return {
    ...ExposeData,
    ...ExposeMethods,
  };
};

export { usePwaCheck };
