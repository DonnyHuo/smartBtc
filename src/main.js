import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/css/init.css";
import "./assets/css/tailwindcss.css";
import "vant/lib/index.css";
import {
  Button,
  Toast,
  Loading,
  Overlay,
  Popover,
  Tab,
  Tabs,
  Progress,
  ActionSheet,
  Search,
  Notify,
  Picker,
  Popup,
  Image as VanImage,
  Switch,
  Empty,
  Step,
  Steps,
  DropdownMenu,
  DropdownItem,
  Checkbox,
} from "vant";
import axios from "axios";

import { Table, Slider } from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import "animate.css";
import i18n from "./language";

// import * as echarts from "echarts/core";
// import {
//   TitleComponent,
//   ToolboxComponent,
//   TooltipComponent,
//   GridComponent,
//   DataZoomComponent,
// } from "echarts/components";
// import { LineChart } from "echarts/charts";
// import { UniversalTransition } from "echarts/features";
// import { CanvasRenderer } from "echarts/renderers";

// echarts.use([
//   TitleComponent,
//   ToolboxComponent,
//   TooltipComponent,
//   GridComponent,
//   DataZoomComponent,
//   LineChart,
//   CanvasRenderer,
//   UniversalTransition,
// ]);

const app = createApp(App);
app.config.globalProperties.$axios = axios;
app
  .use(i18n)
  .use(Button)
  .use(Toast)
  .use(Checkbox)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Loading)
  .use(Overlay)
  .use(Step)
  .use(Steps)
  .use(Slider)
  .use(Popover)
  .use(Tab)
  .use(Tabs)
  .use(Progress)
  .use(Table)
  .use(ActionSheet)
  .use(Search)
  .use(Notify)
  .use(Picker)
  .use(Popup)
  .use(VanImage)
  .use(Switch)
  .use(Empty)
  .use(store)
  .use(router)
  .mount("#app");
