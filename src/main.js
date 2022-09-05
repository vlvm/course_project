import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/fonts/iconfont.css";
// import "amfe-flexible";
import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer";
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999,
  },
});
import globalComponents from "./components/globalComponents";
Vue.use(globalComponents);
import {
  ConfigProvider,
  Row,
  Col,
  Space,
  Button,
  Slider,
  Input,
  InputNumber,
  Tree,
  Tabs,
  Tag,
  Message,
  Modal,
  Menu,
  Dropdown,
  Icon,
  Tooltip,
  Empty,
  Checkbox,
  Divider,
  Badge,
  Select,
  Collapse,
  Card,
  Progress,
  Table,
  DatePicker,
  Upload,
  Result,
  FormModel,
  Radio,
  Popover,
} from "ant-design-vue";

Vue.use(ConfigProvider);
Vue.use(Row);
Vue.use(Col);
Vue.use(Space);
Vue.use(Button);
Vue.use(Slider);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Tree);
Vue.use(Tabs);
Vue.use(Tag);
Vue.use(Message);
Vue.use(Modal);
Vue.use(Menu);
Vue.use(Dropdown);
Vue.use(Icon);
Vue.use(Tooltip);
Vue.use(Empty);
Vue.use(Checkbox);
Vue.use(Radio);
Vue.use(Divider);
Vue.use(Badge);
Vue.use(Select);
Vue.use(Collapse);
Vue.use(Card);
Vue.use(Progress);
Vue.use(Table);
Vue.use(DatePicker);
Vue.use(Upload);
Vue.use(Result);
Vue.use(FormModel);
Vue.use(Popover);

Vue.prototype.$message = Message;
Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$warning = Modal.warning;
Vue.prototype.$error = Modal.error;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
