const api = (console, utils) => {
  const isProduction = utils.isProduction()
  const loggerFunction = level => (...optionalParams) => !isProduction && console[level](...optionalParams)

  const api = {
    LOG_LEVEL: ['log', 'info', 'debug', 'trace', 'warn', 'error', 'assert'],
  }
  api.LOG_LEVEL.forEach(level => (api[level] = loggerFunction(level)))
  return api
}

export default api
