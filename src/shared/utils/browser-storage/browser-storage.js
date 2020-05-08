const api = (log, crypt) => {
  return environment => ({
    remove (key) {
      environment.removeItem(key)
    },
    get (key) {
      const value = environment.getItem(key)
      if (value === undefined) {
        return undefined
      }
      try {
        return JSON.parse(crypt.decode(value))
      } catch (exception) {
        log.info(exception)
        // old format of data or somebody has changed it manually, so not available
        // fail silently not giving a hint
      }
    },
    set (key, value) {
      environment.setItem(key, crypt.encode(JSON.stringify(value)))
    },
  })
}

export default api
