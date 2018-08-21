import Vue from 'vue'
import AccessManagementForm from '@/BaseInfo/AccessManagementForm/AccessManagementForm'
import ElementUI from 'element-ui'
// Vue.use(ElementUI)
import {
  shallowMount, RouterLinkStub, mount, renderToString, createLocalVue
} from '@vue/test-utils'

const localVue = createLocalVue() //createLocalVue 返回一个 Vue 的类供你添加组件、混入和安装插件而不会污染全局的 Vue 类。
localVue.use(ElementUI) //$route 和 $router 作为两个只读属性添加给该 localVue
// 引入工厂函数使得我们的测试更简洁更易读
const factory = (values = {}) => {
  return shallowMount(AccessManagementForm, {
    propsData: { ...values
    },
    localVue,
  })
}
describe('Home.vue', () => {
  test('更改网站名字：河北省道路运输第三方安全监测平台TEST', () => {
    // 重新设置msg的值
    const wrapper = factory();
    wrapper.setData({
      headerTitle: '河北省道路运输第三方安全监测平台TEST'
    });
    expect(wrapper.find('.submitBtn').text()).toEqual('提交');
  })
})
