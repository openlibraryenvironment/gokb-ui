<template>
  <gokb-section
    v-model="isExpanded"
    expandable
    :hide-default="!expanded"
    :sub-title="$tc('component.source.label')"
  >
    <gokb-url-field
      v-model="item.url"
      :label="$t('component.source.url')"
      :readonly="readonly || isImportFromExternalSource"
      replace-date
    />
    <v-row>
      <v-col cols="3">
        <gokb-state-field
          v-model="item.frequency"
          message-path="component.source.frequency"
          url="refdata/categories/Source.Frequency"
          :label="$t('component.source.frequency.label')"
          :readonly="readonly"
        />
      </v-col>
      <v-col cols="3">
        <gokb-date-field
          v-model="item.lastRun"
          readonly
          :label="$t('component.source.lastRun')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="!mixedContent">
        <v-row>
          <v-col cols="3">
            <gokb-namespace-field
              v-model="item.targetNamespace"
              target-type="Title"
              width="350px"
              :readonly="readonly"
              :label="$t('kbart.propId.label')"
              exclude-isxn
            />
          </v-col>
          <v-col>
            <gokb-checkbox-field
              v-model="mixedContent"
              class="pt-4"
              width="350px"
              :label="$t('kbart.propId.typed.label')"
              dense
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col v-else>
        <v-row>
          <v-col cols="3">
            <gokb-namespace-field
              v-model="item.titleIdSerial"
              target-type="Journal"
              width="100%"
              :label="$t('kbart.propIdSerial.label')"
              exclude-isxn
              required
            />
          </v-col>
          <v-col cols="3">
            <gokb-namespace-field
              v-model="item.titleIdMonograph"
              target-type="Book"
              width="100%"
              :label="$t('kbart.propIdMonograph.label')"
              exclude-isxn
              required
            />
          </v-col>
          <v-col>
            <gokb-checkbox-field
              v-model="mixedContent"
              class="pt-4"
              :label="$t('kbart.propId.typed.label')"
              dense
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <gokb-checkbox-field
          v-model="item.automaticUpdates"
          :disabled="activatedDisabled"
          :readonly="readonly"
          :label="$t('component.source.enableUpdate')"
          :opacity="activatedDisabled ? 0.33 : undefined"
          :error-messages="activatedErrorMessage"
          dense
        />
      </v-col>
      <v-col v-if="!readonly">
        <gokb-checkbox-field
          v-model="item.update"
          :readonly="readonly"
          :disabled="importNowDisabled"
          :label="$t('component.source.updateNow')"
          :opacity="importNowDisabled ? 0.33 : undefined"
          dense
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
    emits: ['update:model-value'],
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
      modelValue: {
        type: Object,
        required: false,
        default: undefined
      },
      provider: {
        type: Object,
        required: false,
        default: undefined
      },
      contentType: {
        type: Object,
        required: false,
        default: undefined
      },
      isImportFromExternalSource: {
        type: Boolean,
        required: false,
        default: false
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
          titleIdSerial: undefined,
          titleIdMonograph: undefined,
          automaticUpdates: undefined,
          importConfig: undefined,
          update: false
        },
        errors: [],
        mixedContent: false,
        isExpanded: true,
      }
    },
    computed: {
      importNowDisabled () {
        return !this.readonly && !this.item.url
      },
      activatedDisabled () {
        return !this.readonly && (!this.item.url || !this.item.frequency) && !this.item.automaticUpdates
      },
      activatedErrorMessage () {
        return !this.readonly && (!this.item.url || !this.item.frequency) && this.item.automaticUpdates ? this.$i18n.t("component.source.error.activatedNoInfo") : undefined
      }
    },
    watch: {
      item: {
        handler (val) {
          this.$emit('update:model-value', val)
        },
        deep: true
      },
      modelValue: {
        handler(val) {
          if (!!val && !val.id) {
            this.item.type = val.type
            this.item.url = val.url
            this.item.frequency = val.frequency
            this.item.targetNamespace = val.targetNamespace
            this.item.automaticUpdates = val.automaticUpdates
            this.item.titleIdSerial = val.titleIdSerial
            this.item.titleIdMonograph = val.titleIdMonograph
            this.item.update = val.update
            if (!!this.item.titleIdSerial || !!this.item.titleIdMonograph) {
              this.item.targetNamespace = undefined
              this.mixedContent = true
            }
          }
        },
        deep: true
      },
      provider: {
        handler(val) {
          if (!!val && !this.modelValue.id) {
            this.fetchDefaultNamespace()
          }
        },
        deep: true
      },
      mixedContent (val) {
        if (!val) {
          this.item.titleIdSerial = undefined
          this.item.titleIdMonograph = undefined
        } else {
          this.item.targetNamespace = undefined
        }
      }
    },
    async mounted () {
      this.isExpanded = this.expanded

      if (!!this.modelValue?.id) {
        this.fetch(this.modelValue.id)
      } else if (!!this.modelValue?.url) {
        this.isExpanded = true
        this.item = this.modelValue

        if (!!this.item.titleIdSerial || !!this.item.titleIdMonograph) {
          this.mixedContent = true
          this.item.targetNamespace = undefined
        }
      } else if (!!this.provider && !!this.contentType){
        this.fetchDefaultNamespace()
      }
    },
    methods: {
      async fetch (sid) {
        if (!!sid) {
          const result = await this.catchError({
            promise: sourceServices.getSource(sid, this.cancelToken.token),
            instance: this
          })

          if (result?.status === 200) {
            this.item.id = result.data.id
            this.lastRun = (result.data.lastRun ? new Date(result.data.lastRun).toLocaleString('sv') : undefined)
            this.item.targetNamespace = result.data.targetNamespace
            this.item.frequency = result.data.frequency
            this.item.name = result.data.name
            this.item.url = result.data.url
            this.item.automaticUpdates = result.data.automaticUpdates
            this.item.importConfig = result.data.importConfig
            this.item.titleIdSerial = result.data.titleIdSerial
            this.item.titleIdMonograph = result.data.titleIdMonograph
            if (!!this.item.titleIdSerial || !!this.item.titleIdMonograph) {
              this.item.targetNamespace = undefined
              this.mixedContent = true
            }
            if (!!this.item.url) {
              this.isExpanded = true
            }
          }
        }
      },
      async fetchDefaultNamespace () {
        const providerResult = await this.catchError({
          promise: providerServices.get(this.provider.id, this.cancelToken.token),
          instance: this
        })

        if (providerResult?.status === 200) {
          const fullProvider = providerResult.data

          if (!!this.contentType) {
            if ( (this.contentType.value === 'Book' || this.contentType.value === 'Mixed') && fullProvider.titleNamespaceMonograph) {
              this.titleIdMonograph = fullProvider.titleNamespaceMonograph
            }
            if ( (this.contentType.value === 'Journal' || this.contentType.value === 'Mixed') && fullProvider.titleNamespaceSerial) {
              this.titleIdSerial = fullProvider.titleNamespaceSerial
            }
            this.mixedContent = true
            //Rückfallwert
            if (!this.titleIdMonograph && !this.titleIdSerial) {
              this.mixedContent = false
              this.targetNamespace = fullProvider.titleNamespaceMonograph || fullProvider.titleNamespaceSerial || undefined
            }
          }
        }
      },
    }
  }
</script>
