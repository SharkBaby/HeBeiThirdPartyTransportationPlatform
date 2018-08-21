import Vue from 'vue'
import HelloWorld from '@/components/HelloWorld'
import {
  shallowMount,
  RouterLinkStub,
  mount,
  renderToString
} from '@vue/test-utils'

// 引入工厂函数使得我们的测试更简洁更易读
const factory = (values = {}) => {
  return shallowMount(HelloWorld, {
    propsData: { ...values
    }
  })
}
describe('HelloWorld.vue', () => {
  // 测试是否包含h3元素
  it('测试shallowMount的结果', () => {
    const wrapper = factory({
      propsData: {
        msg: 'Hello'
      }
    });
    expect(wrapper.contains('h3')).toBe(true); //vm.$el:Vue 实例使用的根 DOM 元素。,toContain: 包含括号里面的内容
  })
  // 测试data里面的元素时候发生改变
  it('测试data里面的元素时候发生改变', () => {
    const wrapper = factory({
      propsData: {
        msg: 'Hello',
        jestMessage: 'World',
      }
    });
    wrapper.setData({
      msg: 'setData'
    });
    expect(wrapper.vm.msg).toBe('setData'); //vm.$el:Vue 实例使用的根 DOM 元素。,toContain: 包含括号里面的内容
    wrapper.setProps({ //设置 Wrapper vm 的 prop 并强制更新
      jestMessage: 'setProps'
    });
    expect(wrapper.vm.jestMessage).toBe('setProps'); //vm.$el:Vue 实例使用的根 DOM 元素。,toContain: 包含括号里面的内容
  })
  // 测试按钮被点击后
  it('测试按钮被点击后', () => {
    const wrapper = factory({
      propsData: {
        msg: 'Hello',
        jestMessage: 'World',
      }
    });
    wrapper.find('button.yes').trigger('click');
    expect(wrapper.vm.jestMessage).toBe('Yes'); //vm.$el:Vue 实例使用的根 DOM 元素。,toContain: 包含括号里面的内容
  })
})
