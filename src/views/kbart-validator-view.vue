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
    <gokb-section
      :sub-title="$t('header.results')"
      v-if="showResults"
    >

      <v-row
        v-if="loadedFile.errors.missingColumns.length > 0"
        class="pa-4"
      >
        <v-col>
          <h4>{{ $tc('kbart.processing.error.structure') }}</h4>
          <ul>
            <li
              v-for="er in errors"
              :key="er"
              class="ml-4">
              {{ er }}
            </li>
          </ul>
        </v-col>

        <v-alert type="warning">
          Pakete mit Dateistruktur-Fehlern können nicht in die GOKb importiert werden.
          Außerdem verhindern die Fehler in der Dateistruktur
        </v-alert>

      </v-row>

      <v-row
        v-if="loadedFile.warnings.missingColumns.length > 0"
        class="pa-4"
      >
        <v-col>
          <h4>{{ $tc('kbart.processing.warning.structure') }}</h4>
          <ul>
            <li
              v-for="w in loadedFile.warnings.missingColumns"
              :key="w">
              {{ $tc('kbart.errors.missingCols' ) + ' ' + w }}
            </li>
          </ul>
        </v-col>


          <v-alert type="info">
            Dateien mit Warnungen können zwar in aller Regel in die GOKb importiert werden, es wird aber dringend empfohlen, diese vor dem Import zu beseitigen.
          </v-alert>


      </v-row>

      <v-row
        v-if="showRowResults"
        class="pa-4"
      >
        <v-col>
          <h4>
            {{ $t('kbart.processing.rowStats') }}
          </h4>
          <span class="mr-4">{{ $t('kbart.processing.total.label') }}: {{ loadedFile.rows.total || '0' }}</span>
          <span class="mr-4">{{ $tc('kbart.processing.warning.label', 2) }}: {{ loadedFile.rows.warning || '0' }}</span>
          <span class="mr-4">{{ $tc('kbart.processing.error.label', 2) }}: {{ loadedFile.rows.error || '0' }}</span>
        </v-col>
      </v-row>
      <v-row
        v-if="loadedFile.rows.error > 0"
        class="px-4"
      >
        <v-col>
          <h4>
            {{ $t('kbart.processing.error.fields') }}
          </h4>
          <ul
            v-for="(val, col) in loadedFile.errors.type"
            :key="col"
            class="ml-4"
          >
            <li>
              <b>{{ col }}</b> - {{ val }}
            </li>
          </ul>
        </v-col>
      </v-row>
      <v-row
        v-if="loadedFile.rows.warning > 0"
        class="px-4"
      >
        <v-col>
          <h4>
            {{ $t('kbart.processing.warning.fields') }}
          </h4>
          <ul
            v-for="(val, col) in loadedFile.warnings.type"
            :key="col"
            class="ml-4"
          >
            <li>
              <b>{{ col }}</b> - {{ val }}
            </li>
          </ul>
        </v-col>
      </v-row>
      <v-row
        v-if="loadedFile.rows.error > 0 || loadedFile.rows.warning > 0"
        class="pa-4"
      >
        <v-col>
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
                >
                </v-data-table>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </gokb-section>
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
        :disabled="!selectedFile || importRunning || completion === 100"
      >
        {{ $t('btn.validate') }}
      </gokb-button>
    </template>
  </gokb-page>
</template>

<script>
  import baseComponent from '@/shared/components/base-component'
  import kbartServices from '@/shared/services/kbart-services'

  export default {
    name: 'KbartValidatorView',
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
      errorHeaders () {
        return [
          { title: this.$i18n.tc('kbart.row.label'), align: 'start', width: '10%', value: 'row', groupable: false },
          { title: this.$i18n.tc('kbart.column.label'), align: 'start', width: '15%', value: 'column' },
          { title: this.$i18n.tc('kbart.errors.reason.label'), align: 'start', value: 'reason' },
        ]
      },
      expandWidth () {
        return (this.loadedFile.rows.error > 0 || this.loadedFile.rows.warning > 0) ? 1000 : 400
      },
      showResults () {
        return (this.completion === 100 || (this.completion === 0 && this.executedOnce))
      },
      showRowResults () {
        return (this.loadedFile.errors.missingColumns.length === 0 && this.errors.length === 0)
      }
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

        if (validationResult.status === 200 && validationResult?.data?.report) {
          /*if (validationResult.data.errors.missingColumns?.length > 0) {
            validationResult.data.errors.missingColumns.forEach(error => {
              this.errors.push(this.$i18n.t('kbart.errors.missingCols', [error] ))
            })
          } */

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
