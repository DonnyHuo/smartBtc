import { createI18n } from "vue-i18n";

import enUS from "./locales/en-US";
import zhCN from "./locales/zh-CN";
import store from "../store";

const i18n = createI18n({
  legacy: false,
  locale: store.state.lang, // 默认显示语言
  messages: {
    zh: zhCN,
    en: enUS,
  },
});

export default i18n;
