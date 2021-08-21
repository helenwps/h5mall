import Vue from 'vue';
import Index from './index.vue';
import { isVNode } from '../../common/vdom';
let showToastConstructor = Vue.extend(Index);
let instance;
let instances = [];
let seed = 1;

const showToast = function(options) {
  options = options || {};
  if (typeof options === 'string') {
    options = {
      title: options
    };
  }
  let userOnClose = options.onClose;
  let id = 'showToast_' + seed++;

  options.onClose = function() {
    showToast.close(id, userOnClose);
  };
  instance = new showToastConstructor({
    data: options
  });
  instance.id = id;
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
  instance.dom = instance.vm.$el;
  instance.dom.style.zIndex = 9999;
  instances.push(instance);
  return instance.vm;
};
showToast.close = function(id, userOnClose) {
  for (let i = 0, len = instances.length; i < len; i++) {
    if (id === instances[i].id) {
      if (typeof userOnClose === 'function') {
        userOnClose(instances[i]);
      }
      instances.splice(i, 1);
      break;
    }
  }
};
export default showToast;