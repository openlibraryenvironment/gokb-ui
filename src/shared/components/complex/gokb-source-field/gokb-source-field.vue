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
          v-model="update"
          class="mr-5"
          :readonly="readonly"
          :label="$t('component.source.updateNow')"
        />
      </v-col>
      <v-col>
        <gokb-button
          v-if="!readonly"
          @click="submit"
        >
          {{ $t('btn.submit') }}
        </gokb-button>
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
      }
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
            this.id = result.data.id
            this.titleIdNamespace = result.titleIdNamespace
            this.frequency = result.frequency
            this.name = result.data.name
            this.url = result.data.url
            this.automaticUpdates = result.data.automaticUpdates
            this.lastRun = result.data.lastRun ? new Date(result.data.lastRun).toLocaleString(this.$i18n.locale) : undefined
            this.zdbMatch = result.data.zdbMatch
            this.ezbMatch = result.data.ezbMatch
          }
        }
      },
      submit () {
        var sourceItem = {
          id: this.id,
          name: this.name,
          update: this.update,
          url: this.url,
          ezbMatch: this.ezbMatch,
          zdbMatch: this.zdbMatch,
          automaticUpdates: this.automaticUpdates,
          titleIdNamespace: this.titleIdNamespace,
          frequency: this.frequency
        }
        this.$emit('input', sourceItem)
      }
    }
  }
</script>
