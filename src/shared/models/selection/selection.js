const api = (vue) => {
  const state = vue.observable({
    selectedItems: undefined,
  })

  return {
    get () {
      return state.selectedItems
    },
    set (selectedItems) {
      state.selectedItems = selectedItems
    }
  }
}

export default api
