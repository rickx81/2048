import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import App from '../App.vue'

describe('App', () => {
  it('mounts renders properly', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
        stubs: {
          RouterView: { template: '<div><slot /></div>' }
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.app').exists()).toBe(true)
  })
})
