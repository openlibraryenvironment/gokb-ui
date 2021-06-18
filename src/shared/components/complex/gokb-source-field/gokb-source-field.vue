<template>
  <gokb-section
    expandable
    :hide-default="!expanded"
    :sub-title="$tc('component.source.label')"
  >
    <gokb-url-field
      v-model="url"
      :label="$t('component.source.url')"
      :readonly="readonly"
    />
    <v-row>
      <v-col cols="3">
        <gokb-state-field
          v-model="frequency"
          message-path="component.source.frequency"
          url="refdata/categories/Source.Frequency"
          :label="$t('component.source.frequency.label')"
          :readonly="readonly"
        />
      </v-col>
      <v-col cols="3">
        <gokb-namespace-field
          v-model="targetNamespace"
          :items="[targetNamespace]"
          target-type="Title"
          :readonly="readonly"
          :label="$t('kbart.propId.label')"
        />
      </v-col>
      <v-col cols="3">
        <gokb-date-field
          v-model="lastRun"
          readonly
          :label="$t('component.source.lastRun')"
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
          v-model="update"
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
        menu: false,
        lastRun: undefined,
        item: {
          id: undefined,
          name: undefined,
          frequency: undefined,
          url: undefined,
          targetNamespace: undefined,
          ezbMatch: undefined,
          zdbMatch: undefined,
          automaticUpdates: undefined,
          update: false
        },
        errors: []
      }
    },
    computed: {
      frequency: {
        get () {
          return this.item.frequency
        },
        set (val) {
          this.item.frequency = val
          this.$emit('input', this.item)
        }
      },
      url: {
        get () {
          return this.item.url
        },
        set (val) {
          this.item.url = val
          this.$emit('input', this.item)
        }
      },
      targetNamespace: {
        get () {
          return this.item.targetNamespace
        },
        set (val) {
          this.item.targetNamespace = val
          this.$emit('input', this.item)
        }
      },
      ezbMatch: {
        get () {
          return this.item.ezbMatch
        },
        set (val) {
          this.item.ezbMatch = val
          this.$emit('input', this.item)
        }
      },
      zdbMatch: {
        get () {
          return this.item.zdbMatch
        },
        set (val) {
          this.item.zdbMatch = val
          this.$emit('input', this.item)
        }
      },
      automaticUpdates: {
        get () {
          return this.item.automaticUpdates
        },
        set (val) {
          this.item.automaticUpdates = val
          this.$emit('input', this.item)
        }
      },
      update: {
        get () {
          return this.item.update
        },
        set (val) {
          this.item.update = val
          this.$emit('input', this.item)
        }
      },
    },
    async mounted () {
      if (this.value?.id) {
        this.fetch(this.value.id)
      }
    },
    methods: {
      async fetch (sid) {
        if (sid) {
          const result = await this.catchError({
            promise: sourceServices.getSource(sid, this.cancelToken.token),
            instance: this
          })

          if (result?.status === 200) {
            this.item.id = result.data.id
            this.lastRun = (result.data.lastRun ? new Date(result.data.lastRun).toLocaleString(this.$i18n.locale, { timeZone: 'UTC' }) : undefined)
            this.item.targetNamespace = result.data.targetNamespace
            this.item.frequency = result.data.frequency
            this.item.name = result.data.name
            this.item.url = result.data.url
            this.item.automaticUpdates = result.data.automaticUpdates
            this.item.zdbMatch = result.data.zdbMatch
            this.item.ezbMatch = result.data.ezbMatch
          }
        }
      }
    }
  }
</script>
