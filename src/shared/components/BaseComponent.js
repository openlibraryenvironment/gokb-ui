import { createCancelToken, isCancelThrown } from '@/shared/services/http'

export default {
  created () {
    this.CANCELED_BY_USER = 'canceled by user'
    this.cancelToken = createCancelToken()
  },

  beforeDestroy () {
    this.cancelLastRequestsIfAvailable()
  },

  methods: {
    createCancelToken (separate) {
      // log.debug('createCancelToken', separate)
      const token = createCancelToken()
      this.cancelToken = separate ? this.cancelToken : (this.cancelLastRequestsIfAvailable(), token)
      return separate ? token : undefined
    },
    isCancelThrown (error) {
      return isCancelThrown(error)
    },
    cancelLastRequestsIfAvailable (token) {
      // log.debug('cancelLastRequestsIfAvailable', token, this.cancelToken)
      const cancelToken = token || this.cancelToken
      cancelToken && cancelToken.cancel(this.CANCELED_BY_USER)
      this.cancelToken = token ? this.cancelToken : undefined
    },
  }
}
