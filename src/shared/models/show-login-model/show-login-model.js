const api = (vue) => {
  const state = vue.observable({
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
