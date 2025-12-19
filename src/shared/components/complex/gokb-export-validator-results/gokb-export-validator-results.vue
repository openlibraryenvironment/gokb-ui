<template>
  <gokb-section
    :sub-title="$t('header.results')"
  >
    <v-row
      v-if="validatorResult.errors.missingColumns.length > 0"
      class="pa-4"
    >
      <v-col>
        <h4>{{ $tc('kbart.processing.error.structure', 2) }}</h4>
        <ul>
          <li
            v-for="er in validatorResult.errors.missingColumns"
            :key="er"
            class="ml-4">
            {{ $tc('kbart.errors.missingCols' ) + ' ' + er }}
          </li>
        </ul>
      </v-col>

      <v-col>
        <v-alert type="error" v-if="!hideAlerts">
          {{ $tc('kbart.validator.alert.error' ) }}
        </v-alert>
      </v-col>
    </v-row>

    <v-row
      v-if="validatorResult.warnings.missingColumns.length > 0"
      class="pa-4"
    >
      <v-col>
        <h4>{{ $tc('kbart.processing.warning.structure', 2) }}</h4>
        <ul>
          <li
            v-for="w in validatorResult.warnings.missingColumns"
            :key="w"
            class="ml-4">
            {{ $tc('kbart.errors.missingCols' ) + ' ' + w }}
          </li>
        </ul>
      </v-col>
      <v-col>
        <v-alert type="warning" v-if="!hideAlerts">
          {{ $tc('kbart.validator.alert.warning' ) }}
        </v-alert>
      </v-col>
    </v-row>
    <v-row
      v-if="showRowResults"
      class="pa-4"
    >
      <v-col>
        <h4>
          {{ $t('kbart.processing.rowStats') }}
        </h4>
        <span class="mr-4">{{ $t('kbart.processing.total.label') }}: {{ validatorResult.rows.total || '0' }}</span>
        <span class="mr-4">{{ $tc('kbart.processing.warning.label', 2) }}: {{ validatorResult.rows.warning || '0' }}</span>
        <span class="mr-4">{{ $tc('kbart.processing.error.label', 2) }}: {{ validatorResult.rows.error || '0' }}</span>
      </v-col>
    </v-row>
    <v-row
      v-if="validatorResult.rows.error > 0"
      class="px-4"
    >
      <v-col>
        <h4>
          {{ $t('kbart.processing.error.fields') }}
        </h4>
        <ul
          v-for="(val, col) in counts.errors"
          :key="col"
          class="ml-4"
        >
          <li>
            <b>{{ col }}</b> - {{ val }}
          </li>
        </ul>
      </v-col>
      <v-col>
        <v-alert type="error" v-if="!hideAlerts">
          {{ $tc('kbart.validator.alert.rowError' )  }}
        </v-alert>
      </v-col>
    </v-row>
    <v-row
      v-if="validatorResult.rows.warning > 0"
      class="px-4"
    >
      <v-col>
        <h4>
          {{ $t('kbart.processing.warning.fields') }}
        </h4>
        <ul
          v-for="(val, col) in counts.warnings"
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
      v-if="validatorResult.rows.error > 0 || validatorResult.rows.warning > 0"
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
                :items="errors"
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
                :items="warnings"
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

  <gokb-button
    v-if="exportableDataExists"
    :color=buttonColor
    :disabled=disabled
    @click="exportResults"
  >
    {{ $t('kbart.processing.exportResult.label') }}
  </gokb-button>

</template>

<script>
  import exportServices from "@/shared/services/export-services";

  export default {
    name: 'GokbExportValidatorResults',
    props: {
      validatorResult: {
        type: Object,
        required: true,
      },
      selectedFile: {
        type: File,
        required: false
      },
      label: {
        type: String,
        required: false,
        default: '',
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      buttonColor: {
        type: String,
        required: false,
        default: 'green'
      },
      hideAlerts: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
        errors: [],
        warnings: [],
        counts: {
          errors: {},
          warnings: {}
        }
      }
    },
    created () {
      let typedReport = !!this.validatorResult.errors.type

      Object.entries(this.validatorResult.errors.rows).forEach(([rownum, colobj]) => {
        Object.entries(colobj).forEach(([colname, eo]) => {
          this.errors.push({ row: rownum, column: colname, reason: this.$i18n.t(eo.messageCode, eo.args)})

          if (!this.counts.errors[colname]) {
            this.counts.errors[colname] = 1
          } else if (!typedReport) {
            this.counts.errors[colname]++
          }
        })
      })

      typedReport = !!this.validatorResult.warnings.type

      Object.entries(this.validatorResult.warnings.rows).forEach(([rownum, colobj]) => {
        Object.entries(colobj).forEach(([colname, wo]) => {
          this.warnings.push({
            row: rownum,
            column: colname,
            reason: this.$i18n.t(wo.messageCode, wo.args)
          })

          if (!this.counts.warnings[colname]) {
            this.counts.warnings[colname] = 1
          } else if (!typedReport) {
            this.counts.warnings[colname]++
          }
        })
      })
    },
    computed: {
      errorHeaders() {
        return [
          {title: this.$i18n.tc('kbart.row.label'), align: 'start', width: '10%', value: 'row', groupable: false},
          {title: this.$i18n.tc('kbart.column.label'), align: 'start', width: '15%', value: 'column'},
          {title: this.$i18n.tc('kbart.errors.reason.label'), align: 'start', value: 'reason'},
        ]
      },
      showRowResults() {
        return (this.validatorResult.errors.missingColumns.length === 0)
      },
      exportableDataExists() {
        return (this.validatorResult.errors.missingColumns.length > 0 || this.validatorResult.warnings.missingColumns.length > 0
          || this.validatorResult.warnings.single?.length > 0 || this.validatorResult.errors.single?.length > 0)
      }
    },
    methods: {
      exportResults () {
        let that = this
        let allResults = []
        let structureWarnings = []
        this.validatorResult.warnings.missingColumns.forEach(function(sw) {
          let mc = {}
          mc.column = sw
          mc.row = 'n.a.'
          mc.reason = that.$i18n.t('kbart.errors.missingCols')
          mc.type = that.$i18n.tc('kbart.processing.warning.structure', 1)
          structureWarnings.push(mc)
        })
        allResults.push(...structureWarnings)

        let structureErrors = []
        this.validatorResult.errors.missingColumns.forEach(function(se) {
          let mc = {}
          mc.column = se
          mc.row = 'n.a.'
          mc.reason = that.$i18n.t('kbart.errors.missingCols')
          mc.type = that.$i18n.tc('kbart.processing.error.structure', 1)
          structureErrors.push(mc)
        })
        allResults.push(...structureErrors)

        let warnings = this.validatorResult.warnings.single
        warnings.forEach(function(w) {
          w.type = that.$i18n.tc('kbart.processing.warning.label', 1)
        })
        allResults.push(...warnings)
        let errors = this.validatorResult.errors.single
        errors.forEach(function(e) {
          e.type = that.$i18n.tc('kbart.processing.error.label', 1)
        })
        allResults.push(...errors)

        let fileName = this.selectedFile ? 'GOKB-Validation_'.concat(this.selectedFile.name.split('.')[0]).concat('.csv') : 'GOKB-KBART-Import-Validation.csv'

        exportServices.toTsv([{
            text: this.$i18n.tc('kbart.row.label', 1),
            value: 'row'
          },
            {
              text: this.$i18n.tc('kbart.column.label', 1),
              value: 'column'
            },
            {
              text: this.$i18n.tc('kbart.errors.reason.label', 1),
              value: 'reason'
            },
            {
              text: this.$i18n.t('kbart.processing.type.label'),
              value: 'type'
            }],
          allResults,
          {'filename' : fileName}
        )

      },
    }
  }

</script>
