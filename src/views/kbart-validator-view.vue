<template>
  <gokb-page
    :title="$t('kbart.validator.label')"
    @submit="doImport"
  >
    <v-container fluid>
      <v-alert type="info">
        {{ $t('kbart.validator.info') }}
      </v-alert>
    </v-container>


    <gokb-section>
      <v-row class="px-4">
        <v-col xl="6">
          <v-alert border variant="elevated">
            {{ $t('kbart.validator.advice') }}
          </v-alert>
        </v-col>
      </v-row>
      <v-row class="px-4">
        <v-col xl="6">
          <gokb-file-input-field
            v-model="selectedFile"
            :label="$t('kbart.file.label')"
            :disabled="importRunning"
            :truncateLength="80"
          />
        </v-col>
        <v-col xl="6">
          <gokb-checkbox-field
            v-model="useStrict"
            class="pt-4"
            :label="$t('kbart.validator.mode')"
            :disabled="importRunning"
          />
        </v-col>
      </v-row>
      <v-row
        v-if="selectedFile"
        class="px-12"
      >
        <v-col>
          <gokb-namespace-field
            v-model="options.selectedNamespace"
            target-type="Title"
            width="400px"
            :label="$t('kbart.propId.label')"
          />
        </v-col>
      </v-row>
    </gokb-section>
    <v-row
      v-if="importRunning"
      class="px-12"
    >
      <v-col>
        <v-progress-circular indeterminate />
        <span class="pl-4">{{ $t('kbart.processing.started') }}</span>
      </v-col>
    </v-row>

    <v-row v-if="errors.length > 0">
      <v-col>
        <v-alert type="error" >
          {{ $tc('kbart.validator.alert.encoding' ) }}
        </v-alert>
      </v-col>
      <v-col>

      </v-col>
    </v-row>

    <gokb-export-validator-results
      v-if="showResults"
      :disabled="!executedOnce"
      :validator-result="loadedFile"
      :selected-file="selectedFile"
    />

    <template #buttons>
      <v-spacer />

      <gokb-button
        text
        @click.prevent="reset"
      >
        {{ $t('btn.reset') }}
      </gokb-button>
      <gokb-button
        color="primary"
        is-submit
        :disabled="!selectedFile || importRunning || completion === 100 || errors.length > 0"
      >
        {{ $t('btn.validate') }}
      </gokb-button>
    </template>
  </gokb-page>
</template>

<script>
import baseComponent from '@/shared/components/base-component'
import kbartServices from '@/shared/services/kbart-services'
import exportServices from '@/shared/services/export-services'
import GokbExportValidatorResults
  from "../shared/components/complex/gokb-export-validator-results/gokb-export-validator-results.vue";

export default {
  name: 'KbartValidatorView',
  components: {GokbExportValidatorResults},
  extends: baseComponent,
  data () {
    return {
      errors: [],
      selectedNamespace: undefined,
      importRunning: false,
      executedOnce: false,
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
      useStrict: true,
      completion: undefined,
      options: {
        selectedNamespace: undefined,
        lineCount: undefined,
        addOnly: false,
        dryRun: false
      }
    }
  },
  computed: {
    /* errorHeaders () {
      return [
        { title: this.$i18n.tc('kbart.row.label'), align: 'start', width: '10%', value: 'row', groupable: false },
        { title: this.$i18n.tc('kbart.column.label'), align: 'start', width: '15%', value: 'column' },
        { title: this.$i18n.tc('kbart.errors.reason.label'), align: 'start', value: 'reason' },
      ]
    }, */
    expandWidth () {
      return (this.loadedFile.rows.error > 0 || this.loadedFile.rows.warning > 0) ? 1000 : 400
    },
    showResults () {
      return (this.completion === 100 || (this.completion === 0 && this.executedOnce))
    },
    /*showRowResults () {
      return (this.loadedFile.errors.missingColumns.length === 0 && this.errors.length === 0)
    } */
  },
  watch: {
    selectedFile () {
      this.options.lineCount = undefined
      this.completion = 0
      this.loadedFile.rows = { total: 0, warning: 0, error: 0 }
      this.loadedFile.errors.missingColumns = []
      this.loadedFile.errors.single = []
      this.loadedFile.errors.type = {}
      this.loadedFile.warnings.missingColumns = []
      this.loadedFile.warnings.single = []
      this.loadedFile.warnings.type = {}
      this.executedOnce = false
    },
    '$i18n.locale' () {
      if (!!this.selectedFile) {
        this.doImport()
      }
    },
    useStrict () {
      this.completion = 0
    },
    'options.selectedNamespace' () {
      this.completion = 0
    }
  },
  methods: {
    reset() {
      this.errors = []
      this.selectedFile = null
      this.completion = 0
    },
    async doImport () {
      this.errors = []
      this.importRunning = true
      this.completion = 0
      var namespaceName = this.options.selectedNamespace ? this.options.selectedNamespace.value : undefined

      const validationResult = await kbartServices.validate(this.selectedFile, namespaceName, this.useStrict, this.cancelToken.token)

      if (validationResult.status === 200 && validationResult?.data?.errors.hasOwnProperty("encoding")) {
        this.errors.push(this.$i18n.t('kbart.errors.encoding'))
      }
      else if (validationResult.status === 200 && validationResult?.data?.report) {
        this.loadedFile = validationResult.data.report

        let typedReport = !!this.loadedFile.errors.type

        this.loadedFile.errors.single = []
        Object.entries(this.loadedFile.errors.rows).forEach(([rownum, colobj]) => {
          Object.entries(colobj).forEach(([colname, eo]) => {
            this.loadedFile.errors.single.push({ row: rownum, column: colname, reason: this.$i18n.t(eo.messageCode, eo.args)})

            if (!this.loadedFile.errors.type[colname]) {
              this.loadedFile.errors.type[colname] = 1
            } else if (!typedReport) {
              this.loadedFile.errors.type[colname]++
            }
          })
        })

        typedReport = !!this.loadedFile.warnings.type

        this.loadedFile.warnings.single = []
        Object.entries(this.loadedFile.warnings.rows).forEach(([rownum, colobj]) => {
          Object.entries(colobj).forEach(([colname, wo]) => {
            this.loadedFile.warnings.single.push({
              row: rownum,
              column: colname,
              reason: this.$i18n.t(wo.messageCode, wo.args)
            })

            if (!this.loadedFile.warnings.type[colname]) {
              this.loadedFile.warnings.type[colname] = 1
            } else if (!typedReport) {
              this.loadedFile.warnings.type[colname]++
            }
          })
        })

        this.options.lineCount = validationResult.data.report.rows.total
        this.completion = 100
        this.executedOnce = true
      } else {
        this.errors.push(this.$i18n.t('kbart.transmission.error.unknown'))
        this.completion = 100
        this.executedOnce = true
      }

      this.importRunning = false
    }
  }
}
</script>
