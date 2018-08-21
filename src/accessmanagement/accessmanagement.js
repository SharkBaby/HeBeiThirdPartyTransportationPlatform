import Vue from 'vue'
import {
  store
} from '@/vuex/store'
import {
  isNullUndefEmpty,
  storageOperation
} from '@/common/common'
const hasAccess = Vue.directive('hasAccess', {
  inserted: function (el, binding, vnode) {
    if (!$_hasAccess(binding.value.accessId, JSON.parse(storageOperation.getItem('accessList')))) el.parentNode.removeChild(el);
  }
})

const $_hasAccess = function (CtrlId, usrAccessManagement) {
  if (isNullUndefEmpty(usrAccessManagement)) return false;
  if (isNullUndefEmpty(CtrlId)) return true;
  let hasAccess = false;
  for (let usrAccessItem of usrAccessManagement) {
    if (usrAccessItem.CtrlId === CtrlId) {
      if (usrAccessItem.RightKind) hasAccess = true;
      break;
    }
  }
  return hasAccess;
}

export {
  hasAccess,
  $_hasAccess
}