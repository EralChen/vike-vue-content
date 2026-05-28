type VikeVueContentConfig = {
  name: string
  require: {
    vike: string
  }
}

const config = {
  name: 'vike-vue-content',
  require: {
    vike: '>=0.4.191',
  },
} satisfies VikeVueContentConfig

export default config