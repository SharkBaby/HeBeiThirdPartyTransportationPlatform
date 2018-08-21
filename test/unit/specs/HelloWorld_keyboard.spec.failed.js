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
  return mount(HelloWorld, {
    propsData: { ...values
    }
  })
}
describe('HelloWorld.vue', () => {
  // 默认的数量是0
  it('默认的数量是0', ()=>{
    const wrapper = factory();
    expect(wrapper.vm.quantity).toBe(0);
  })
  // 上按键将数量设置为1
  it('上按键将数量设置为1', ()=>{
    const wrapper = factory();
    wrapper.trigger('keyup.up');
    expect(wrapper.vm.quantity).toBe(1);
  })
  // 下按键将数量减1
  it('下按键将数量减1', ()=>{
    const wrapper = factory();
    wrapper.vm.quantity = 5;
    wrapper.trigger('keyup.down');
    expect(wrapper.vm.quantity).toBe(4);
  })
  // ESC键键数量设置为0
  it('ESC键键数量设置为0', ()=>{
    const wrapper = factory();
    wrapper.vm.quantity = 5;
    wrapper.trigger('keyup.esc');
    expect(wrapper.vm.quantity).toBe(0);
  })
  it('魔术字符 "a" 键将数量设置为 13',()=>{
    const wrapper = factory();
    wrapper.trigger('keyup', {
      which: 65
    });
    expect(wrapper.vm.quantity).toBe(13);
  })
})
