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
        v-if="!contentType || contentType.value !== 'Mixed'"
        v-model="options.selectedNamespace"
        :target-type="contentType"
        width="350px"
        :label="$t('kbart.propId.label')"
      />
      <div v-else>
        <gokb-namespace-field
          v-model="options.selectedNamespaceSerial"
          target-type="Journal"
          width="350px"
          :label="$t('kbart.propIdSerial.label')"
        />
        <gokb-namespace-field
          v-model="options.selectedNamespaceMonograph"
          target-type="Book"
          width="350px"
          :label="$t('kbart.propIdMonograph.label')"
        />
      </div>
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
      <div
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
      <div
        v-if="loadedFile.rows.error > 0"
        class="ma-2"
      >
        <h4>
          {{ $t('kbart.processing.error.fields') }}
        </h4>
        <ul
          v-for="(val, col) in loadedFile.errors.type"
          :key="col"
        >
          <li class="ml-4">
            <b>{{ col }}</b> - {{ val }}
          </li>
        </ul>
      </div>
      <div
        v-if="loadedFile.rows.warning > 0"
        class="ma-2"
      >
        <h4>
          {{ $t('kbart.processing.warning.fields') }}
        </h4>
        <ul
          v-for="(val, col) in loadedFile.warnings.type"
          :key="col"
        >
          <li>
            <b>{{ col }}</b> - {{ val }}
          </li>
        </ul>
      </div>
      <div v-if="loadedFile.rows.error > 0 || loadedFile.rows.warning > 0">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title>
              {{ $tc('kbart.processing.error.label', 2) }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-data-table
                :items="loadedFile.errors.single"
                :headers="errorHeaders"
                width="1000px"
                :sort-by="[{key: 'row', order: 'asc'}]"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title>
              {{ $tc('kbart.processing.warning.label', 2) }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-data-table
                :items="loadedFile.warnings.single"
                :headers="errorHeaders"
                :sort-by="[{key: 'row', order: 'asc'}]"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
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

  export default {
    name: 'GokbKbartImportPopup',
    components: { GokbNamespaceField },
    extends: BaseComponent,
    emits: ['update:model-value', 'kbart'],
    props: {
      modelValue: {
        type: Boolean,
        required: true,
        default: true
      },
      defaultTitleNamespace: {
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
      }
    },
    data () {
      return {
        errors: [],
        cancelValidation: false,
        useProprietaryNamespace: false,
        importRunning: undefined,
        loadedFile: {
          errors: {
            missingColumns: [],
            single: [],
            type: {}
          },
          warnings: {
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
        return (this.loadedFile.rows.error > 0 || this.loadedFile.rows.warning > 0) ? 1000 : 450
      },
      hasErrors () {
        return this.errors.length > 0
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
        this.loadedFile.warnings.single = []
        this.loadedFile.warnings.type = {}
        this.options.addOnly = false
        this.options.deleteMissing = false
        this.options.selectedFile = file
      }
    },
    mounted () {
      if (this.provider) {
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

          if (fullProvider.titleNamespace) {
            this.options.selectedNamespace = fullProvider.titleNamespace
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

        if (validationResult.status === 200 && validationResult?.data?.report) {

          if (!!validationResult.data.errors?.missingColumns) {
            this.errors.push(this.$i18n.t('kbart.errors.missingCols', [validationResult.data.errors.missingColumns.join(', ')]))
            this.loadedFile = validationResult.data.report
          } else {
            this.loadedFile = validationResult.data.report

            this.loadedFile.errors.single = []
            Object.entries(this.loadedFile.errors.rows).forEach(([rownum, colobj]) =>
              Object.entries(colobj).forEach(([colname, eo]) =>
                this.loadedFile.errors.single.push({ row: rownum, column: colname, reason: this.$i18n.t(eo.messageCode, eo.args)})
              )
            )

            if (this.loadedFile.errors.single.length > 0) {
              this.errors.push(this.$i18n.t('kbart.processing.error.general'))
            }

            this.loadedFile.warnings.single = []
            Object.entries(this.loadedFile.warnings.rows).forEach(([rownum, colobj]) =>
              Object.entries(colobj).forEach(([colname, wo]) =>
                this.loadedFile.warnings.single.push({ row: rownum, column: colname, reason: this.$i18n.t(wo.messageCode, wo.args)})
              )
            )

            this.options.lineCount = validationResult.data.report.rows.total
          }
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
