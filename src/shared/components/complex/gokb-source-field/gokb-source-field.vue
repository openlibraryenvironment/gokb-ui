<template>
  <gokb-section
    expandable
    :hide-default="!expanded"
    :sub-title="$tc('component.source.label')"
  >
    <gokb-url-field
      v-model="currentUrl"
      :label="$t('component.source.url')"
      :readonly="readonly"
    />
    <v-row>
      <v-col cols="3">
        <gokb-state-field
          v-model="currentFreq"
          message-path="component.source.frequency"
          url="refdata/categories/Source.Frequency"
          :label="$t('component.source.frequency.label')"
          :readonly="readonly"
        />
      </v-col>
      <v-col cols="3">
        <gokb-namespace-field
          v-model="titleIdNamespace"
          target-type="Title"
          :readonly="readonly"
          :label="$t('kbart.propId.label')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-checkbox
          v-model="ezbMatch"
          class="mr-5"
          :readonly="readonly"
          :label="$t('component.source.ezbMatch')"
        />
      </v-col>
      <v-col>
        <v-checkbox
          v-model="zdbMatch"
          class="mr-5"
          :readonly="readonly"
          :label="$t('component.source.zdbMatch')"
        />
      </v-col>
      <v-col class="d-flex flex-row-reverse">
        <v-checkbox
          v-model="automaticUpdates"
          class="mr-5"
          :readonly="readonly"
          :label="$t('component.source.enableUpdate')"
        />
      </v-col>
      <v-col class="d-flex flex-row-reverse">
        <v-checkbox
          v-model="updateStatus"
          class="mr-5"
          :readonly="readonly"
          :label="$t('component.source.updateNow')"
        />
      </v-col>
    </v-row>
  </gokb-section>
</template>

<script>
  import sourceServices from '@/shared/services/source-services'
  import BaseComponent from '@/shared/components/base-component'

  export default {
    name: 'GokbSourceField',
    extends: BaseComponent,
    props: {
      label: {
        type: String,
        required: false,
        default: '',
      },
      readonly: {
        type: Boolean,
        required: false,
        default: false
      },
      expanded: {
        type: Boolean,
        required: false,
        default: true
      },
      value: {
        type: Object,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        id: undefined,
        name: undefined,
        menu: false,
        update: false,
        url: undefined,
        lastRun: undefined,
        ezbMatch: true,
        zdbMatch: true,
        automaticUpdates: false,
        titleIdNamespace: undefined,
        frequency: undefined,
        errors: []
      }
    },
    computed: {
      localValue: {
        get () {
          return this.value
        },
        set (localValue) {
          this.$emit('input', localValue)
        }
      },
      currentFreq: {
        get () {
          const freq = this.frequency
          return freq
        },
        set (freq) {
          this.frequency = freq

          this.localValue = {
            url: this.url,
            automaticUpdates: this.automaticUpdates,
            titleIdNamespace: this.titleIdNamespace,
            lastRun: this.lastRun,
            ezbMatch: this.ezbMatch,
            zdbMatch: this.zdbMatch,
            id: this.id,
            name: this.name,
            frequency: this.frequency
          }
        }
      },
      currentUrl: {
        get () {
          const url = this.url
          return url
        },
        set (url) {
          this.url = url

          this.localValue = {
            url: this.url,
            automaticUpdates: this.automaticUpdates,
            titleIdNamespace: this.titleIdNamespace,
            lastRun: this.lastRun,
            ezbMatch: this.ezbMatch,
            zdbMatch: this.zdbMatch,
            id: this.id,
            name: this.name,
            frequency: this.frequency
          }
        }
      },
      updateStatus: {
        get () {
          return this.update
        },
        set (update) {
          this.update = update
          this.$emit('enable', update)
        }
      }
    },
    async mounted () {
      if (this.value?.id) {
        this.fetch()
      }
    },
    methods: {
      async fetch () {
        const result = await this.catchError({
          promise: sourceServices.getSource(this.value.id, this.cancelToken.token),
          instance: this
        })

        if (result?.status === 200) {
          this.id = result.data.id
          this.titleIdNamespace = result.titleIdNamespace
          this.frequency = result.frequency
          this.name = result.data.name
          this.url = result.data.url
          this.automaticUpdates = result.data.automaticUpdates
          this.lastRun = result.data.lastRun ? new Date(result.data.lastRun).toLocaleString(this.$i18n.locale) : undefined
          this.zdbMatch = result.data.zdbMatch
          this.ezbMatch = result.data.ezbMatch

          this.localValue = {
            url: this.url,
            automaticUpdates: this.automaticUpdates,
            titleIdNamespace: this.titleIdNamespace,
            lastRun: this.lastRun,
            ezbMatch: this.ezbMatch,
            zdbMatch: this.zdbMatch,
            id: this.id,
            name: this.name,
            frequency: this.frequency
          }
        }
      }
    }
  }
</script>
