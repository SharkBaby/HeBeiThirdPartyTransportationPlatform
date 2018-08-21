import Vue from 'vue'
import HelloWorld from '@/components/HelloWorld'
import {
  shallowMount
} from '@vue/test-utils'

// 引入工厂函数使得我们的测试更简洁更易读
const factory = (values = {}) => {
  return shallowMount(HelloWorld, {
    propsData: { ...values
    }
  })
}
describe('HelloWorld.vue', () => {
  // it('should render correct contents', () => {
  //   const Constructor = Vue.extend(HelloWorld)
  //   const vm = new Constructor().$mount()
  //   expect(vm.$el.querySelector('.hello h1').textContent)
  //     .toEqual('Welcome to Your Vue.js App')
  // })
  // 检查原始组件选项
  it('has a created hook', () => {
    expect(typeof HelloWorld.data).toBe('function')
  })
  // 检查原始组件选项
  test('has a created hook', ()=>{
    expect(typeof HelloWorld.data).toBe('function');
  })
  test('should render correct contents', () => {
    const wrapper = factory();
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
  // 评估原始组件选项中的函数的结果
  test('message display Welcome to Your Vue.js App', () => {
    const wrapper = factory();
    expect(HelloWorld.data().msg).toEqual('Welcome to Your Vue.js App');
  });
   // 测试created更新data里面的值
   it('测试created更新data里面的值', ()=>{
     const vm = new Vue(HelloWorld).$mount()
     expect(vm.msg).toEqual('bye!')
   })
  // 创建一个实例并检查渲染输出
  it('创建一个实例并检查渲染输出', ()=>{
    const Constructor = Vue.extend(HelloWorld); //使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。
    const vm = new Constructor().$mount();
    expect(vm.$el.textContent).toContain('bye!'); //vm.$el:Vue 实例使用的根 DOM 元素。,toContain: 包含括号里面的内容
  })
  test('改变data的值', () => {
    // 重新设置msg的值
    const wrapper = factory();
    wrapper.setData({
      msg: 'Hello World Unit Test Msg'
    });
    expect(wrapper.vm.$el.querySelector('.hello h1').textContent).toEqual('Hello World Unit Test Msg');
  })
})
