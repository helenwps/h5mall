import QdmButton from './button/index.js';
import showToast from './showToast/index.js';
import MessageBox from './message-box/index.js';
const components = [
  QdmButton,
  MessageBox
];
const install = function(Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
  Vue.prototype.$showToast = showToast;
  // Vue.prototype.$qdmNotify = Notification;
  // Vue.prototype.$msgbox = MessageBox;
  // Vue.prototype.$qdmAlert = MessageBox.alert;
  Vue.prototype.$qdmConfirm = MessageBox.confirm;
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export {
  install,
  QdmButton,
  showToast,
  MessageBox
}
