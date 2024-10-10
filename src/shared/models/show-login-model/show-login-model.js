const api = (reactive) => {
  const state = reactive({
    show: false,
  })

  return {
    get () {
      return state.show
    },
    set (show) {
      state.show = show
    }
  }
}

export default api
