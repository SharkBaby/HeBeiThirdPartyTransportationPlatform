/**
 * 失败原因如下：
 * TypeError: Cannot read property 'style' of null

 62 | // 注释原因：当前session都是有效的换肤
   63 |
   var initElemtColor = function (elemtId, crntColor) { >
     64 | document.getElementById(elemtId).style.backgroundColor = crntColor; |
     ^
     65 |
   }
 66 |
   export {
     67 | packageZone,
 */

import Vue from 'vue'
import Header from '@/components/Header/Header'
import {
  shallowMount, RouterLinkStub, mount, renderToString, createLocalVue
} from '@vue/test-utils'
import VueRouter from 'vue-router'

const localVue = createLocalVue() //createLocalVue 返回一个 Vue 的类供你添加组件、混入和安装插件而不会污染全局的 Vue 类。
localVue.use(VueRouter) //$route 和 $router 作为两个只读属性添加给该 localVue
const router = new VueRouter()
// 引入工厂函数使得我们的测试更简洁更易读
const factory = (values = {}) => {
  return shallowMount(Header, {
    propsData: { ...values
    },
    stubs: ['router-link', 'router-view'],
    localVue,
    router
  })
}
describe('BodyContent.vue', () => {
  // 测试首页异步请求接口的行为
  it('测试首页异步请求接口的行为', async () => {
    const wrapper = factory();
    expect(wrapper.vm.$router.path).toBe('/Home/Dashboard');
  })
})
