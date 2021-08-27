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
      />
      <gokb-namespace-field
        v-model="options.selectedNamespace"
        target-type="Title"
        :label="$t('kbart.propId.label')"
      />
      <gokb-checkbox-field
        v-model="options.addOnly"
        :label="$t('kbart.addOnly')"
      />
      <v-progress-linear
        height="25"
        :color="progressColor"
        :value="completion"
      >
        <template #default="{ value: v }">
          <strong>{{ v }}%</strong>
        </template>
      </v-progress-linear>
      <div
        v-if="error"
        class="ma-2"
      >
        {{ error }}
      </div>
      <div
        v-else-if="completion === 100"
        class="ma-2"
      >
        <h4>
          {{ $t('kbart.processing.rowStats') }}
        </h4>
        {{ $t('kbart.processing.total.label') }}: {{ loadedFile.lineStats.total || '0' }} –
        {{ $tc('kbart.processing.warning.label', 2) }}: {{ loadedFile.lineStats.warning || '0' }} –
        {{ $tc('kbart.processing.error.label', 2) }}: {{ loadedFile.lineStats.error || '0' }}
      </div>
      <div
        v-if="loadedFile.lineStats.error > 0 || loadedFile.lineStats.warning > 0"
        class="ma-2"
      >
        <h4>
          {{ $t('kbart.processing.error.fields') }}
        </h4>
        <ul
          v-for="(val, col) in loadedFile.errors.type"
          :key="col"
        >
          <li v-if="val.empty > 0 || val.invalid > 0">
            <b>{{ col }}</b> - {{ $t('kbart.processing.error.empty') }}: {{ val.empty }}, {{ $t('kbart.processing.error.invalid') }}: {{ val.invalid }}
          </li>
        </ul>
      </div>
      <div v-if="loadedFile.lineStats.error > 0 || loadedFile.lineStats.warning > 0">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>
              {{ $tc('kbart.processing.error.label', 2) }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-data-table
                :items="loadedFile.errors.single"
                :headers="errorHeaders"
                width="1000px"
                sort-by="row"
                group-by="row"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              {{ $tc('kbart.processing.warning.label', 2) }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-data-table
                :items="loadedFile.warnings.single"
                :headers="errorHeaders"
                sort-by="row"
                group-by="row"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </gokb-section>
    <template #buttons>
      <v-spacer />
      <gokb-button
        text
        @click="close"
      >
        {{ $t('btn.cancel') }}
      </gokb-button>
      <gokb-button
        default
        :disabled="!options.selectedFile || importRunning"
      >
        {{ completion === 100 ? $t('btn.close') : $t('btn.confirm') }}
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import math from '@/shared/utils/math'
  import GokbNamespaceField from '@/shared/components/simple/gokb-namespace-field'

  export default {
    name: 'GokbKbartImportPopup',
    components: { GokbNamespaceField },
    extends: BaseComponent,
    props: {
      value: {
        type: Boolean,
        required: true,
        default: true
      },
      defaultTitleNamespace: {
        type: Object,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        error: undefined,
        selectedNamespace: undefined,
        cancelValidation: false,
        useProprietaryNamespace: false,
        importRunning: undefined,
        kbartStd: {
          mandatoryColumns: {
            publication_title: {
              rules: {
                notEmpty: true
              }
            },
            title_id: {
              rules: {
                notEmpty: 'warn'
              }
            },
            online_identifier: {
              rules: {
                serial: /^\d{4}-\d{3}[\dxX]$/,
                monograph: /^(?=[0-9]{13}$|(?=(?:[0-9]+-){4})[0-9-]{17}$)97[89]-?[0-9]{1,5}-?[0-9]+-?[0-9]+-?[0-9]$/
              }
            },
            print_identifier: {
              rules: {
                serial: /^\d{4}-\d{3}[\dxX]$/,
                monograph: /^(?=[0-9]{13}$|(?=(?:[0-9]+-){4})[0-9-]{17}$)97[89]-?[0-9]{1,5}-?[0-9]+-?[0-9]+-?[0-9]$/
              }
            },
            title_url: {
              rules: {
                notEmpty: true,
                general: /^http[s]?:\/\/.*$/
              }
            },
            publication_type: {
              rules: {
                general: /^([Mm]onograph)|([Ss]erial)|([Dd]atabase)|([Oo]ther)$/
              }
            },
            access_type: {
              rules: {
                general: /^[PF]$/
              }
            }
          },
          monograph: {
            date_monograph_published_print: {
              rules: {}
            },
            date_monograph_published_online: {
              rules: {}
            },
            monograph_volume: {
              rules: {}
            },
            monograph_edition: {
              rules: {}
            },
            first_author: {
              rules: {}
            },
            first_editor: {
              rules: {}
            }
          },
          serial: {
            date_first_issue_online: {
              type: 'date',
              rules: {
                general: /^[1-9][0-9]{3}(-[01][0-9]?(-[0-3][0-9])?)?([T\s][0-2][0-9]:[0-5][0-9]:[0-5][0-9](\.[0-9]+)?Z?)?$/
              }
            },
            num_first_vol_online: {
              rules: {}
            },
            num_first_issue_online: {
              rules: {}
            },
            date_last_issue_online: {
              type: 'date',
              rules: {
                general: /^[1-9][0-9]{3}(-[01][0-9]?(-[0-3][0-9])?)?([T\s][0-2][0-9]:[0-5][0-9]:[0-5][0-9](\.[0-9]+)?Z?)?$/
              }
            },
            num_last_vol_online: {
              rules: {}
            },
            num_last_issue_online: {
              rules: {}
            }
          }
        },
        loadedFile: {
          columns: [],
          errors: {
            missingColumns: [],
            single: [],
            type: {}
          },
          warnings: {
            single: [],
            type: {}
          },
          lineStats: {
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
          lineCount: undefined,
          addOnly: false
        }
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
      progressColor () {
        return this.error ? 'error' : 'primary'
      },
      errorHeaders () {
        return [
          { text: 'Row', align: 'start', width: '10%', value: 'row', groupable: false },
          { text: 'Column', align: 'start', width: '15%', value: 'column' },
          { text: 'Reason', align: 'start', value: 'reason' },
        ]
      },
      expandWidth () {
        return (this.loadedFile.lineStats.error > 0 || this.loadedFile.lineStats.warning > 0) ? 1000 : 400
      }
    },
    watch: {
      selectedFile (file) {
        this.options.lineCount = undefined
        this.completion = 0
        this.loadedFile.columns = []
        this.loadedFile.errors.missingColumns = []
        this.loadedFile.errors.single = []
        this.loadedFile.errors.type = {}
        this.loadedFile.warnings.single = []
        this.loadedFile.warnings.type = {}
        this.loadedFile.lineStats.total = 0
        this.loadedFile.lineStats.warning = 0
        this.loadedFile.lineStats.error = 0
        this.options.addOnly = false
        this.options.selectedFile = file
      }
    },
    mounted () {
      if (this.defaultTitleNamespace) {
        this.options.selectedNamespace = this.defaultTitleNamespace
      }
    },
    methods: {
      close () {
        this.localValue = false
      },
      importKbart () {
        if (this.completion === 100) {
          this.$emit('kbart', this.options)
          this.close()
        } else {
          this.doImport()
        }
      },
      doImport () {
        this.error = undefined
        this.importRunning = true
        this.completion = 0
        this.readerForImport = new FileReader()
        this.readerForImport.onload = this._importCompleted
        this.readerForImport.onprogress = this._importProgress

        this.readerForImport.readAsText(this.options.selectedFile)
      },
      async _importCompleted () {
        const csvDataRows = this.readerForImport.result.split(/\r?\n/)
          .filter(row => row.trim())
        if (csvDataRows.length < 2) {
          return
        } else {
          const columns = csvDataRows[0].split(/\t/)

          columns.forEach(v => {
            this.loadedFile.errors.type[v] = { empty: 0, invalid: 0 }
          })

          Object.keys(this.kbartStd.mandatoryColumns).forEach(key => {
            if (!columns.includes(key)) {
              this.loadedFile.errors.missingColumns.push(key)
            }
          })

          if (this.loadedFile.errors.missingColumns.length > 0) {
            this.error = 'Missing columns:'
          } else {
            var idxr = 0
            var row

            for (row of csvDataRows) {
              if (idxr > 0) {
                var hasErrors = false
                var hasWarnings = false

                this.loadedFile.lineStats.total++

                const orderedVals = row.split(/\t/)
                var type = orderedVals[columns.indexOf('publication_type')]?.toLowerCase() || null

                if (!type) {
                  this.loadedFile.errors.type.publication_type.empty++
                  this.loadedFile.errors.single.push({ row: idxr, column: 'publication_type', reason: this.$i18n.t('kbart.errors.missingVal', ['publication_type']) })
                  hasErrors = true
                } else if (!['serial', 'monograph', 'database', 'other'].includes(type)) {
                  this.loadedFile.errors.type.publication_type.invalid++
                  this.loadedFile.errors.single.push({ row: idxr, column: 'publication_type', reason: this.$i18n.t('kbart.errors.illegalType') })
                  hasErrors = true
                } else if (type === 'serial') {
                  Object.keys(this.kbartStd.serial).forEach(key => {
                    if (!columns.includes(key)) {
                      this.loadedFile.errors.missingColumns.push(key)
                      hasErrors = true
                    }
                  })
                } else if (type === 'monograph') {
                  Object.keys(this.kbartStd.monograph).forEach(key => {
                    if (!columns.includes(key)) {
                      this.loadedFile.errors.missingColumns.push(key)
                      hasErrors = true
                    }
                  })
                }

                if (hasErrors) {
                  this.error = 'Fatal error!'
                  this.loadedFile.lineStats.error++
                  break
                } else {
                  orderedVals.forEach((col, idxc) => {
                    var colName = columns[idxc]
                    var colRules = this.kbartStd.mandatoryColumns[colName]?.rules

                    if (colRules?.notEmpty && col.length === 0) {
                      if (colRules?.notEmpty === 'warn') {
                        this.loadedFile.warnings.type[colName].empty++
                        this.loadedFile.warnings.single.push({ row: idxr, column: colName, reason: this.$i18n.t('kbart.errors.missingVal', [colName]) })
                        hasWarnings = true
                      } else {
                        this.loadedFile.errors.type[colName].empty++
                        this.loadedFile.errors.single.push({ row: idxr, column: colName, reason: this.$i18n.t('kbart.errors.missingVal', [colName]) })
                        hasErrors = true
                      }
                    }

                    if (colName === 'online_identifier') {
                      if (col.length > 0 && !this.kbartStd.mandatoryColumns.online_identifier.rules[type]?.test(col)) {
                        this.loadedFile.errors.type[colName].invalid++
                        this.loadedFile.errors.single.push({ row: idxr, column: colName, reason: this.$i18n.t('kbart.errors.illegalOnlineId', [col]) })
                        hasErrors = true
                      }
                    } else if (colName === 'print_identifier') {
                      if (col.length > 0 && !this.kbartStd.mandatoryColumns.print_identifier.rules[type]?.test(col)) {
                        this.loadedFile.errors.type[colName].invalid++
                        this.loadedFile.errors.single.push({ row: idxr, column: colName, reason: this.$i18n.t('kbart.errors.illegalPrintId', [col]) })
                        hasErrors = true
                      }
                    } else if (type === 'serial' && this.kbartStd.serial[colName]) {
                      if (this.kbartStd.serial[colName]?.rules?.notEmpty && col.length === 0) {
                        this.loadedFile.errors.type[colName].empty++
                        this.loadedFile.errors.single.push({ row: idxr, column: colName, reason: this.$i18n.t('kbart.errors.missingVal', [colName]) })
                        hasErrors = true
                      } else if (col.length > 0 && this.kbartStd.serial[colName]?.rules.general && !this.kbartStd.serial[colName]?.rules.general?.test(col)) {
                        this.loadedFile.errors.type[colName].invalid++
                        this.loadedFile.errors.single.push({ row: idxr, column: colName, reason: this.$i18n.t('kbart.errors.illegalVal', [col]) })
                        hasErrors = true
                      }
                    }
                  })

                  if (this.cancelValidation) {
                    this.cancelValidation = false
                    this.error = this.$i18n.t('kbart.processing.cancelled', [idxr])
                    break
                  }

                  if (hasErrors === true) {
                    this.loadedFile.lineStats.error++
                  }

                  if (hasWarnings === true) {
                    this.loadedFile.lineStats.warning++
                  }
                }
              }
              idxr++
            }
          }
        }

        try {
          this.options.lineCount = csvDataRows.length - 1
        } catch (exception) {
          this.error = exception
        } finally {
          this.completion = 100
          this.importRunning = false
        }
      },
      _importProgress ({ loaded, total }) {
        this.completion = math.asPercent(loaded / total)
      },
    }
  }
</script>
