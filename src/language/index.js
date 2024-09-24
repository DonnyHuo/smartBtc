import { createI18n } from "vue-i18n";
import zhCN from "./locales/zh-CN";
import enUS from "./locales/en-US";
import store from "../store";

const i18n = createI18n({
  legacy: false,
  locale: store.state.lang || navigator.language, // 默认显示语言
  messages: {
    zh: zhCN,
    en: enUS,
  },
});

export default i18n;
