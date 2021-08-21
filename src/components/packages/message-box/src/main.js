const defaults = {
    title: null,
    message: '',
    type: '',
    iconClass: '',
    showInput: false,
    showClose: true,
    modalFade: true,
    lockScroll: true,
    closeOnClickModal: true,
    closeOnPressEscape: true,
    closeOnHashChange: true,
    inputValue: null,
    inputPlaceholder: '',
    inputType: 'text',
    inputPattern: null,
    inputValidator: null,
    inputErrorMessage: '',
    showConfirmButton: true,
    showCancelButton: false,
    confirmButtonPosition: 'right',
    confirmButtonHighlight: false,
    cancelButtonHighlight: false,
    confirmButtonText: '',
    cancelButtonText: '',
    confirmButtonClass: '',
    cancelButtonClass: '',
    customClass: '',
    beforeClose: null,
    dangerouslyUseHTMLString: false,
    center: false,
    roundButton: false,
    distinguishCancelAndClose: false
  };
  
  import Vue from 'vue';
  import msgboxVue from './main.vue';
  import merge from '../../common/merge';
  import { isVNode } from '../../common/vdom';
  
  const MessageBoxConstructor = Vue.extend(msgboxVue);
  
  let currentMsg, instance;
  let msgQueue = [];
  
  const defaultCallback = action => {
    if (currentMsg) {
      let callback = currentMsg.callback;
      if (typeof callback === 'function') {
        callback({
            'cancel':action === 'cancel' ? true : false, 
            'confirm':action === 'confirm' ? true : false
        });
      }
      if (currentMsg.resolve) {
        if (action === 'confirm') {
            currentMsg.resolve({'cancel':false,'confirm':true});
        } else if (currentMsg.reject && (action === 'cancel' || action === 'close')) {
          currentMsg.reject({'cancel':true,'confirm':false});
        }
      }
    }
  };
  
  const initInstance = () => {
    instance = new MessageBoxConstructor({
      el: document.createElement('div')
    });
  
    instance.callback = defaultCallback;
  };
  
  const showNextMsg = () => {
    if (!instance) {
      initInstance();
    }
    instance.action = '';
  
    if (!instance.visible || instance.closeTimer) {
      if (msgQueue.length > 0) {
        currentMsg = msgQueue.shift();
  
        let options = currentMsg.options;
        for (let prop in options) {
          if (options.hasOwnProperty(prop)) {
            instance[prop] = options[prop];
          }
        }
        if (options.callback === undefined) {
          instance.callback = defaultCallback;
        }
  
        let oldCb = instance.callback;
        instance.callback = (action, instance) => {
          let obj = {
            'cancel':action === 'cancel' ? true : false, 
            'confirm':action === 'confirm' ? true : false
        }
          oldCb(obj, instance);
          showNextMsg();
        };
        if (isVNode(instance.message)) {
          instance.$slots.default = [instance.message];
          instance.message = null;
        } else {
          delete instance.$slots.default;
        }
        ['modal', 'showClose', 'closeOnClickModal', 'closeOnPressEscape', 'closeOnHashChange'].forEach(prop => {
          if (instance[prop] === undefined) {
            instance[prop] = true;
          }
        });
        document.body.appendChild(instance.$el);
  
        Vue.nextTick(() => {
          instance.visible = true;
        });
      }
    }
  };
  
  const MessageBox = function(options, callback) {
    if (Vue.prototype.$isServer) return;
    if (options.callback && !callback) { 
      callback = options.callback;
    }
  
    if (typeof Promise !== 'undefined') {
      return new Promise((resolve, reject) => { // eslint-disable-line
        msgQueue.push({
          options: merge({}, defaults, MessageBox.defaults, options), 
          callback: callback,
          resolve: resolve,
          reject: reject
        });
  
        showNextMsg();
      });
    } else {
      msgQueue.push({
        options: merge({}, defaults, MessageBox.defaults, options),
        callback: callback
      });
  
      showNextMsg();
    }
  };
  
  MessageBox.setDefaults = defaults => {
    MessageBox.defaults = defaults;
  };
  

  
  MessageBox.confirm = ( options) => {
    return MessageBox(merge({
      $type: 'confirm',
      showCancelButton: true
    }, options));
  };

  
  MessageBox.close = () => {
    instance.doClose();
    instance.visible = false;
    msgQueue = [];
    currentMsg = null;
  };
  
  export default MessageBox;
  export { MessageBox };
  