import { h, createApp } from 'vue'
import singleSpaVue from 'single-spa-vue'
// import Components from './plugins/components'
import ElementPlusPlugin from './plugins/element-plus'
import App from './App.vue'
import router from './router'
import store from './store'

const vueLifeCycles = singleSpaVue({
  createApp,
  appOptions: {
    render() {
      return h(App, {
        // single-spa props are available on the "this" object. Forward them to your component as needed.
        // https://single-spa.js.org/docs/building-applications#lifecycle-props
        // if you uncomment these, remember to add matching prop definitions for them in your App.vue file.
        /*
        name: this.name,
        mountParcel: this.mountParcel,
        singleSpa: this.singleSpa,
        */
      })
    },
  },
  handleInstance(app) {
    app.use(router).use(store).use(ElementPlusPlugin)
  },
})

export const bootstrap = vueLifeCycles.bootstrap
export const mount = vueLifeCycles.mount
export const unmount = vueLifeCycles.unmount
