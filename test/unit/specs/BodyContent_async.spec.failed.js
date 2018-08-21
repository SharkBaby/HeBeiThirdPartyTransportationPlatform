import Vue from 'vue'
import BodyContent from '@/Home/container/BodyContent/BodyContent'
import flushPromises from 'flush-promises'
import {
  shallowMount, RouterLinkStub, mount, renderToString, createLocalVue
} from '@vue/test-utils'
// 模拟异步请求axios
jest.mock('axios')
import Vuex from 'vuex'
const localVue = createLocalVue()
localVue.use(Vuex)
// 引入工厂函数使得我们的测试更简洁更易读
const factory = (values = {}) => {
  return mount(BodyContent, {
    propsData: { ...values
    },
    stubs: {
      RouterLink: RouterLinkStub
    }
  })
}
describe('BodyContent.vue', () => {
  // 测试首页异步请求接口的行为
  it('测试首页异步请求接口的行为', async () => {
    const wrapper = factory();
    await flushPromises();
    expect(wrapper.vm.getCompanyCountTemp.BanxianCount).not.toBe('');
  })
})
