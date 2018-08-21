import Vue from 'vue'
import HelloWorld from '@/components/HelloWorld'
import {
  shallowMount, RouterLinkStub, mount, renderToString
} from '@vue/test-utils'

// 引入工厂函数使得我们的测试更简洁更易读
const factory = (values = {}) => {
  return shallowMount(Header, {
    propsData: { ...values
    },
    stubs: {
      RouterLink: RouterLinkStub
    }
  })
}
describe('HelloWorld.vue', () => {
  // 测试不同的props渲染不同的结果
  it('测试不同的props渲染不同的结果', () => {
    const Constructor = Vue.extend(HelloWorld); //使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。
    const vm = new Constructor({propsData: {jestMessage: 'Hello'}}).$mount();
    expect(vm.$el.textContent).toContain('Hello'); //vm.$el:Vue 实例使用的根 DOM 元素。,toContain: 包含括号里面的内容
  })
  // 测试异步更新
  it('测试异步更新', done => {
    const vm = new Vue(HelloWorld).$mount()
    vm.msg = 'Hello World';
    Vue.nextTick().then(() => { //nextTick: 在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM
      expect(vm.$el.textContent).toContain('Hello World');
      done();
    })
  })
})
