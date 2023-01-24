<template>
  <v-select
    v-model="localValue"
    item-text="name"
    item-value="id"
    :items="localizedItems"
    :label="label"
    :no-data-text="$t('search.results.empty')"
    :dense="dense"
  />
</template>
<script>
  import GokbSelectField from '@/shared/components/base/gokb-select-field'
  import accountModel from '@/shared/models/account-model'
  import languageServices from '@/shared/services/language-services'
  import { createCancelToken } from '@/shared/services/http'

  export default {
    name: 'GokbSelectLanguageField',
    extends: GokbSelectField,
    props: {
      label: {
        type: String,
        required: false,
        default: 'Status',
      },
      messagePath: {
        type: String,
        required: false,
        default: 'component.general.status'
      },
      dense: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
        items: undefined,
        cancelToken: undefined
      }
    },
    computed: {
      localName () {
        return (!!this.messagePath && !!this.localValue) ? this.$i18n.t(this.messagePath + '.' + (this.localValue?.value || this.localValue?.name) + '.label') : this.localValue?.name
      },
      localizedItems () {
        return this.items.map(({ id, value, type }) => ({ id, value, name: !!value ? this.$i18n.t(this.messagePath + '.' + value + '.label') : undefined, type: 'Refdata Value' }))
      }
    },
    watch: {
      '$i18n.locale' (l) {
        this.fetch()
      }
    },
    async beforeCreate () {
      this.cancelToken = createCancelToken()
      languageServices.fetchLanguagesList(this.cancelToken.token)
    },
    async created () {
      const locale = this.$i18n.locale
      this.items = languageServices.getLanguages(locale)
    },
    methods: {
      transform (result) {
        if (result?.data?._embedded) {
          const { data: { _embedded: { values } } } = result
          return values
        } else {
          return []
        }
      }
    }
  }
</script>
