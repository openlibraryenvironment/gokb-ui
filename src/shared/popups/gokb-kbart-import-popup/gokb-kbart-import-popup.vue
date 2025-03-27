<template>
  <gokb-dialog
    v-model="localValue"
    title="KBART Import"
    :width="expandWidth"
    @submit="importKbart"
  >
    <gokb-section>
      <gokb-file-input-field
        v-model="selectedFile"
        :label="$t('kbart.file.label')"
        :disabled="importRunning"
        dense
      />
      <gokb-namespace-field
        v-if="!mixedContent"
        v-model="options.selectedNamespace"
        :target-type="targetType"
        width="350px"
        :label="$t('kbart.propId.label')"
      />
      <div v-else>
        <gokb-namespace-field
          v-model="options.selectedNamespaceSerial"
          target-type="Journal"
          width="350px"
          :label="$t('kbart.propIdSerial.label')"
          exclude-isxn
        />
        <gokb-namespace-field
          v-model="options.selectedNamespaceMonograph"
          target-type="Book"
          width="350px"
          :label="$t('kbart.propIdMonograph.label')"
          exclude-isxn
        />
      </div>
      <gokb-checkbox-field
          v-model="mixedContent"
          class="pt-4"
          :label="$t('kbart.propId.typed.label')"
          :disabled="importRunning"
          dense
      />
      <gokb-checkbox-field
        v-model="options.dryRun"
        :label="$t('kbart.dryRun.label')"
        dense
      />
      <gokb-button
          text
          class="ml-n3"
          color="primary"
          @click.prevent="toggleOptions"
        >
          {{ $t('btn.moreOptions') }}
          <v-icon>
            {{ expandOtherOptions ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
          </v-icon>
      </gokb-button>
      <div v-if="expandOtherOptions">
        <gokb-checkbox-field
          v-model="options.addOnly"
          :label="$t('kbart.addOnly.label')"
          dense
        />
        <gokb-checkbox-field
          v-model="options.deleteMissing"
          :label="$t('kbart.deleteMissing.label')"
          dense
        />
      </div>
      <div v-if="importRunning">
        <v-progress-circular indeterminate />
        {{ $t('kbart.processing.started') }}
      </div>
      <div
        v-if="errors.length > 0"
      >
        <div
          v-for="er in errors"
          :key="er"
          class="ma-2 text-error font-weight-bold">
          {{ er }}
        </div>
      </div>
      <!-- <div
        v-else-if="completion === 100"
        class="ma-2"
      >
        <h4>
          {{ $t('kbart.processing.rowStats') }}
        </h4>
        {{ $t('kbart.processing.total.label') }}: {{ loadedFile.rows.total || '0' }} –
        {{ $tc('kbart.processing.warning.label', 2) }}: {{ loadedFile.rows.warning || '0' }} –
        {{ $tc('kbart.processing.error.label', 2) }}: {{ loadedFile.rows.error || '0' }}
      </div>
      -->

      <gokb-export-validator-results
        v-if="completion === 100"
        :validator-result="loadedFile"
        :selected-file="selectedFile"
      />

    </gokb-section>

    <template #buttons>
      <gokb-button
        text
        @click="close"
      >
        {{ $t('btn.cancel') }}
      </gokb-button>
      <gokb-button
        is-submit
        :disabled="!options.selectedFile || importRunning || hasErrors"
      >
        {{ completion === 100 ? $t('btn.confirm') : $t('btn.validate') }}
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import GokbNamespaceField from '@/shared/components/simple/gokb-namespace-field'
  import providerServices from '@/shared/services/provider-services'
  import kbartServices from '@/shared/services/kbart-services'
  import GokbExportValidatorResults from "../../components/complex/gokb-export-validator-results/index.js";

  export default {
    name: 'GokbKbartImportPopup',
    components: {GokbExportValidatorResults, GokbNamespaceField },
    extends: BaseComponent,
    emits: ['update:model-value', 'kbart'],
    props: {
      modelValue: {
        type: Boolean,
        required: true,
        default: true
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
      }
    },
    data () {
      return {
        errors: [],
        cancelValidation: false,
        useProprietaryNamespace: false,
        importRunning: undefined,
        mixedContent: false,
        loadedFile: {
          errors: {
            missingColumns: [],
            single: [],
            type: {}
          },
          warnings: {
            missingColumns: [],
            single: [],
            type: {}
          },
          rows: {
            total: 0,
            warning: 0,
            error: 0
          }
        },
        selectedFile: undefined,
        completion: undefined,
        options: {
          selectedFile: undefined,
          selectedNamespace: undefined,
          selectedNamespaceSerial: undefined,
          selectedNamespaceMonograph: undefined,
          lineCount: undefined,
          addOnly: false,
          dryRun: false
        },
        expandOtherOptions: false
      }
    },
    computed: {
      localValue: {
        get () {
          return this.modelValue
        },
        set (localValue) {
          this.$emit('update:model-value', localValue)
        }
      },
      progressColor () {
        return this.errors?.length > 0 ? 'error' : 'primary'
      },
      errorHeaders () {
        return [
          {
            title: this.$i18n.tc('kbart.row.label'),
            align: 'start',
            width: '10%',
            value: 'row',
            groupable: false
          },
          {
            title: this.$i18n.tc('kbart.column.label'),
            align: 'start',
            width: '15%',
            value: 'column'
          },
          {
            title: this.$i18n.tc('kbart.errors.reason.label'),
            align: 'start',
            value: 'reason'
          }
        ]
      },
      expandWidth () {
        return (this.loadedFile.rows.error > 0 || this.loadedFile.rows.warning > 0
          || this.loadedFile.errors.missingColumns.length > 0 || this.loadedFile.warnings.missingColumns.length > 0) ? 1000 : 450
      },
      hasErrors () {
        return this.errors.length > 0 || this.loadedFile.valid === false
      },
      targetType () {
        return (this.contentType?.value == 'Journal' || this.contentType?.value == 'Book') ? this.contentType?.value : 'Title'
      }
    },
    watch: {
      selectedFile (file) {
        this.errors = []
        this.options.lineCount = undefined
        this.completion = 0
        this.loadedFile.rows = { total: 0, warning: 0, error: 0 }
        this.loadedFile.errors.missingColumns = []
        this.loadedFile.errors.single = []
        this.loadedFile.errors.type = {}
        this.loadedFile.warnings.missingColumns = []
        this.loadedFile.warnings.single = []
        this.loadedFile.warnings.type = {}
        this.options.addOnly = false
        this.options.deleteMissing = false
        this.options.selectedFile = file
      },
      mixedContent (val) {
        if (!val) {
          this.options.selectedNamespaceSerial = undefined
          this.options.selectedNamespaceMonograph = undefined
        } else {
          this.options.selectedNamespace = undefined
        }
      },
      provider: {
        handler(val) {
          if (!!val) {
            this.fetchDefaultNamespace()
          }
        },
        deep: true
      }
    },
    mounted () {
      if (!!this.provider) {
        this.fetchDefaultNamespace()
      }
    },
    methods: {
      close () {
        this.localValue = false
      },
      toggleOptions () {
        this.expandOtherOptions = !this.expandOtherOptions
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
              this.options.selectedNamespaceMonograph = fullProvider.titleNamespaceMonograph
            }
            if ( (this.contentType.value === 'Journal' || this.contentType.value === 'Mixed') && fullProvider.titleNamespaceSerial) {
              this.options.selectedNamespaceSerial = fullProvider.titleNamespaceSerial
            }
            this.mixedContent = true
            //Rückfallwert
            if (!this.options.selectedNamespaceMonograph && !this.options.selectedNamespaceSerial) {
              this.mixedContent = false
              this.options.selectedNamespace = fullProvider.titleNamespaceMonograph || fullProvider.titleNamespaceSerial || undefined
            }
          }
        }
      },
      importKbart () {
        if (this.completion === 100) {
          this.$emit('kbart', this.options)
          this.close()
        } else {
          this.doImport()
        }
      },
      async doImport () {
        this.errors = []
        this.importRunning = true
        this.completion = 0
        let namespaceName = this.options.selectedNamespace ? this.options.selectedNamespace.value : undefined
        let namespaceNameSerial = this.options.selectedNamespaceSerial ? this.options.selectedNamespaceSerial.value : undefined
        let namespaceNameMonograph = this.options.selectedNamespaceMonograph ? this.options.selectedNamespaceMonograph.value : undefined

        const validationResult = await kbartServices.validate(this.options.selectedFile, namespaceName, false, namespaceNameSerial, namespaceNameMonograph, this.cancelToken.token)

        if (validationResult.status === 200 && validationResult?.data?.errors.hasOwnProperty("encoding")) {
          this.errors.push(this.$i18n.t('kbart.validator.alert.encoding'))
        }
        else if (validationResult.status === 200 && validationResult?.data?.report) {
          this.loadedFile = validationResult.data.report

          this.options.lineCount = validationResult.data.report.rows.total
          this.completion = 100
        } else {
          this.errors.push(this.$i18n.t('kbart.transmission.error.unknown'))
          this.completion = 100
        }

        this.importRunning = false
      }
    }
  }
</script>
