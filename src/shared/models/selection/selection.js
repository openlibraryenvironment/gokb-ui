const api = (reactive) => {
  const state = reactive({
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
