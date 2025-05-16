const api = (console, utils) => {
  const isProduction = !utils.isDevelopment()
  const loggerFunction = level => (...optionalParams) => !isProduction ? console[level](...optionalParams) : (api.LOG_LEVEL.indexOf(level) >= api.LOG_LEVEL.indexOf('info') ? console[level](...optionalParams) : undefined)

  const api = {
    LOG_LEVEL: ['trace', 'debug', 'info', 'warn', 'error'],
  }
  api.LOG_LEVEL.forEach(level => (api[level] = loggerFunction(level)))
  return api
}

export default api
