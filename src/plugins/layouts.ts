import { App } from 'vue'

const requireLayouts = require.context(
  // The relative path of the components folder
  '@/layouts',
  // Whether or not to look in sub folders
  false,
  // The regular expression used to match base component filenames
  /[A-Z|a-z]\w+\.(vue|js|ts)$/
)

export default {
  install: (app: App) => {
    requireLayouts.keys().forEach((file) => {
      const layout = requireLayouts(file).default
      app.component(layout.name, layout)
    })
  }
}
