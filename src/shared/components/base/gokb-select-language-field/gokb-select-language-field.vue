<template>
  <v-select
    v-model="localValue"
    item-text="name"
    item-value="iso3"
    :items="localizedItems"
    :label="label"
    :no-data-text="$t('search.results.empty')"
  />
</template>
<script>
  import GokbSelectField from '@/shared/components/base/gokb-select-field'
  import languageServices from '@/shared/services/language-services'

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
        items: undefined
      }
    },
    computed: {
      localizedItems () {
        if (!!this.items && this.items.length > 0) {
          return this.items.sort(({ name: first }, { name: second }) => (first > second) ? 1 : (second > first) ? -1 : 0)
        }
        else {
          return []
        }
      },
      localValue: {
        get () {
          return this.value
        },
        set (localValue) {
          this.$emit('input', localValue)
        }
      }
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
