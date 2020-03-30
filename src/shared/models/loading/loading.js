let timeoutId

const stopTimer = () => {
  timeoutId && clearTimeout(timeoutId)
}

const api = (vue) => {
  const state = vue.observable({
    loading: undefined,
  })

  return {
    isLoading () {
      return state.loading
    },
    startLoading () {
      stopTimer()
      // we only set loading, if we need more than 100 msec to call stopLoading
      timeoutId = setTimeout(() => (state.loading = true), 100)
    },
    stopLoading () {
      stopTimer()
      state.loading = false
      timeoutId = undefined
    },
  }
}

export default api
