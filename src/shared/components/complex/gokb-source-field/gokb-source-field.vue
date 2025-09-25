<template>
  <gokb-section
    v-model="isExpanded"
    expandable
    :hide-default="!expanded"
    :sub-title="$tc('component.source.label')"
  >

    <v-row>
      <v-col cols="3">
        <gokb-state-field
          v-model="item.transferMethod"
          :init-item="item.transferMethod"
          url="refdata/categories/Source.TransferMethod"
          :label="$t('component.source.transferMethod.label')"
          message-path="component.source.transferMethod"
          return-object
          dense
        />
      </v-col>
    </v-row>

    <v-row v-if="isFTPTransfer">
      <v-col cols="3">
        <gokb-webendpoint-field
          v-model="item.webEndpoint"
          filterByProtocol="FTP"
          width="100%"
          return-object
        />
      </v-col>
      <v-col cols="8">
        <gokb-text-field
          v-model="item.ftpUrl"
          :label="$t('component.source.filePath')"
          :disabled="readonly"
        />
        <span>
            <!-- <v-icon class="pb-1" color="error">
              mdi-close-thick
            </v-icon> -->
            Complete Path: {{ fullFtpUrl }}
          </span>
      </v-col>
    </v-row>

    <gokb-url-field
      v-else
      v-model="item.url"
      :label="$t('component.source.url')"
      :readonly="readonly || isImportFromExternalSource"
      replace-date
    />
    <v-row>
      <v-col cols="3">
        <gokb-state-field
          v-model="item.frequency"
          :init-item="item.frequency"
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
      <v-col v-if="!ignoreLegacyTitleID">
        <v-row>
          <v-col cols="3">
            <gokb-namespace-field
              v-model="item.targetNamespace"
              target-type="Title"
              width="350px"
              :readonly="readonly"
              :label="$t('kbart.propId.label')"
              gokb-tooltip="kbart.propId.tooltip"
              exclude-isxn
            />
          </v-col>
          <v-col>
            <gokb-checkbox-field
              v-if="mixedContentVisible"
              v-model="mixedContent"
              class="pt-4"
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
              v-if="serialVisible"
              v-model="item.titleIdSerial"
              target-type="Journal"
              width="100%"
              :label="$t('kbart.propIdSerial.label')"
              exclude-isxn
              gokb-tooltip="kbart.propIdSerial.tooltip"
            />
          </v-col>
          <v-col cols="3">
            <gokb-namespace-field
              v-if="monographVisible"
              v-model="item.titleIdMonograph"
              target-type="Book"
              width="100%"
              :label="$t('kbart.propIdMonograph.label')"
              exclude-isxn
              gokb-tooltip="kbart.propIdMonograph.tooltip"
            />
          </v-col>
          <v-col>
            <gokb-checkbox-field
              v-if="mixedContentVisible"
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
  import providerServices from '@/shared/services/provider-services'
  import BaseComponent from '@/shared/components/base-component'
  import GokbWebendpointField from "../../simple/gokb-webendpoint-field/gokb-webendpoint-field.vue";
  import GokbEntityField from "../../simple/gokb-entity-field/gokb-entity-field.vue";
  import GokbSelectField from "../../base/gokb-select-field/gokb-select-field.vue";

  export default {
    name: 'GokbSourceField',
    components: {GokbSelectField, GokbEntityField, GokbWebendpointField},
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
          update: false,
          webEndpoint: undefined,
          transferMethod: undefined,
          ftpUrl: undefined,
        },
        errors: [],
        mixedContent: false,
        isExpanded: true,
        serialVisible: true,
        monographVisible: true,
        mixedContentVisible: true,
        ignoreLegacyTitleID: true,
        isFTPTransfer: false
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
      },
      fullFtpUrl () {
        return this.formatFtpPath()
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
            this.item.automaticUpdates = val.automaticUpdates
            this.item.update = val.update

            if (!this.ignoreLegacyTitleID) {
              this.item.targetNamespace = val.targetNamespace
            }
            else if (this.mixedContent) {
              this.item.titleIdSerial = val.titleIdSerial
              this.item.titleIdMonograph = val.titleIdMonograph
            }
            else {
              this.item.titleIdSerial = this.serialVisible ? val.titleIdSerial : undefined
              this.item.titleIdMonograph = this.monographVisible ? val.titleIdMonograph : undefined
            }
          }
        },
        deep: true
      },
      provider: {
        handler(val) {
          if (!!val && !this.modelValue?.id) {
            this.fetchDefaultNamespace()
          } else {
            this.setVisibleStatusForTitleIdFields()
          }
        },
        deep: true
      },
      contentType: {
        handler(val) {
          if (!!val && !this.modelValue?.id) {
            this.fetchDefaultNamespace()
          } else {
            this.setVisibleStatusForTitleIdFields()
          }
        },
        deep: true
      },
      mixedContent () {
        this.setVisibleStatusForTitleIdFields()
      },
      'item.transferMethod': {
        handler(val) {
          if (!!val && (this.item?.transferMethod?.value === 'FTP' || this.item?.transferMethod?.name === 'FTP')) {
            this.isFTPTransfer = true
          }
          else {
            this.isFTPTransfer = false
          }
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
      } else if (!!this.provider){
        this.fetchDefaultNamespace()
      }

      console.log("mounted: ", this.item?.transferMethod)
      if (this.item?.transferMethod?.value === 'FTP') {
        console.log("iss FTP")
        this.isFTPTransfer = true
      }

    },
    created () {
      console.log("created: ", this.item?.transferMethod)
    },
    methods: {
      formatFtpPath () {
        let result = this.item.webEndpoint?.url ? this.item.webEndpoint.url + '' + (this.item.ftpUrl ? this.item.ftpUrl : '') : ''
        /* TODO:
        if (this.item.selectedWebEndpoint?.url) {
          let serverParts = this.item.selectedWebEndpoint.url.split('/')
          let fileParts = this.item.ftpUrl?.split('/')
        } */
        return result
      },
      setVisibleStatusForTitleIdFields () {
        if (this.mixedContent) {
          this.serialVisible = true
          this.monographVisible = true
          this.ignoreLegacyTitleID = true
        }
        else {
          if (!!this.item.targetNamespace && !this.item.titleIdSerial && !this.item.titleIdMonograph) {
            this.ignoreLegacyTitleID = false
          }
          else if (!!this.contentType) {
            let ctype = this.contentType.value || this.contentType.name
            this.serialVisible = (ctype === 'Journal' || ctype === 'Mixed' || ctype === 'Database')
            this.monographVisible = (ctype === 'Book' || ctype === 'Mixed' || ctype === 'Database')
          }
        }
      },
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
            this.item.frequency = !!result.data.frequency ? { value: result.data.frequency.name, name: this.$i18n.t('component.source.frequency.' + result.data.frequency.name + '.label'), id: result.data.frequency.id } : undefined
            this.item.name = result.data.name
            this.item.url = result.data.url
            this.item.automaticUpdates = result.data.automaticUpdates
            this.item.importConfig = result.data.importConfig
            this.item.titleIdSerial = result.data.titleIdSerial
            this.item.titleIdMonograph = result.data.titleIdMonograph

            this.item.ftpUrl = result.data.ftpUrl
            this.item.transferMethod = result.data.transferMethod
            this.item.webEndpoint = result.data.webEndpoint
            console.log("fetch: ", this.item.transferMethod)
            if (this.item.transferMethod?.value === 'FTP' || this.item.transferMethod?.name === 'FTP') {
              this.isFTPTransfer = true
            }

            if (!!this.item.targetNamespace && !this.item.titleIdSerial && !this.item.titleIdMonograph) {
              this.ignoreLegacyTitleID = false
            }
            else if (!!this.item.titleIdSerial && !!this.item.titleIdMonograph) {
              this.mixedContent = true
            }
            if (!!this.item.url) {
              this.isExpanded = true
            }
            this.setVisibleStatusForTitleIdFields()
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

            this.item.titleIdMonograph = fullProvider.titleNamespaceMonograph
            this.item.titleIdSerial = fullProvider.titleNamespaceSerial

            if (!!this.contentType) {

              let ctype = this.contentType.value || this.contentType.name

              this.mixedContent = (ctype === 'Mixed')
              this.mixedContentVisible = true

            } else {
              this.mixedContent = true
              this.mixedContentVisible = false
            }
            this.setVisibleStatusForTitleIdFields()
        }
      },
    }
  }
</script>
