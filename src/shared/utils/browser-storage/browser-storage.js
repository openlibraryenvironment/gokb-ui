const api = (log, crypt) => {
  return environment => ({
    remove (key) {
      environment.removeItem(key)
    },
    get (key, isClear) {
      const value = environment.getItem(key)
      if (value === undefined) {
        return undefined
      }
      try {
        return (isClear ? value : JSON.parse(crypt.decode(value)))
      } catch (exception) {
        log.info(exception)
        // old format of data or somebody has changed it manually, so not available
        // fail silently not giving a hint
      }
    },

    set (key, value, clear) {
      environment.setItem(key, clear ? JSON.stringify(value) : crypt.encode(JSON.stringify(value)))
    },
  })
}

export default api
