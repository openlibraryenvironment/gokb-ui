const api = (reactive) => {
  const states = reactive({})

  return {
    getCategory(label) {
      return states[label]
    },
    addCategory(label, val) {
      if (!states[label]) {
        states[label] = val
      }
    },
    hasCategory(label) {
      return !!states[label]
    }
  }
}

export default api
