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
  import jschardet from 'jschardet'
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
        charsetError: false,
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
                notEmpty: true
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
            }
          },
          monograph: {
            date_monograph_published_print: {
              rules: {
                general: /^[1-9][0-9]{3}(-[01][0-9]?(-[0-3][0-9])?)?([T\s][0-2][0-9]:[0-5][0-9]:[0-5][0-9](\.[0-9]+)?Z?)?$/
              }
            },
            date_monograph_published_online: {
              rules: {
                general: /^[1-9][0-9]{3}(-[01][0-9]?(-[0-3][0-9])?)?([T\s][0-2][0-9]:[0-5][0-9]:[0-5][0-9](\.[0-9]+)?Z?)?$/
              }
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
          },
          database: {},
          other: {},
          general: {
            access_type: {
              rules: {
                general: /^(P|F)$/
              }
            },
            coverage_depth: {
              rules: {
                general: /^[Ff]ulltext$/
              }
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
        this.charsetError = false
        this.importRunning = true
        this.completion = 0
        this.charsetReader = new FileReader()
        this.charsetReader.onload = this._checkCharset

        this.charsetReader.readAsBinaryString(this.options.selectedFile)

        this.readerForImport = new FileReader()
        this.readerForImport.onload = this._importCompleted
        this.readerForImport.onprogress = this._importProgress

        this.readerForImport.readAsText(this.options.selectedFile)
      },
      _checkCharset () {
        const csvResult = this.charsetReader.result.split(/\r|\n|\r\n/)
        const encoding = jschardet.detect(csvResult.toString()).encoding

        if (encoding !== 'UTF-8' && encoding !== 'ascii') {
          console.log(jschardet.detectAll(csvResult.toString()))
          this.charsetError = true
          this.error = this.$i18n.t('kbart.errors.encoding')
        }
      },
      async _importCompleted () {
        const csvDataRows = this.readerForImport.result.split(/\r?\n/)
          .filter(row => row.trim())
        if (csvDataRows.length < 2) {
          return
        } else {
          const columns = csvDataRows[0].split(/\t/).map(col => col.toLowerCase())
          columns.forEach(v => {
            this.loadedFile.errors.type[v] = { empty: 0, invalid: 0 }
          })

          Object.keys(this.kbartStd.mandatoryColumns).forEach(key => {
            if (!columns.includes(key)) {
              this.loadedFile.errors.missingColumns.push(key)
            }
          })

          if (this.loadedFile.errors.missingColumns.length > 0) {
            this.error = this.$i18n.t('kbart.errors.missingCols', [this.loadedFile.errors.missingColumns])
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

                    if (hasErrors) {
                      this.error = this.$i18n.t('kbart.errors.missingCols', [this.loadedFile.errors.missingColumns])
                    }
                  })
                } else if (type === 'monograph') {
                  Object.keys(this.kbartStd.monograph).forEach(key => {
                    if (!columns.includes(key)) {
                      this.loadedFile.errors.missingColumns.push(key)
                      hasErrors = true
                    }

                    if (hasErrors) {
                      this.error = this.$i18n.t('kbart.errors.missingCols', [this.loadedFile.errors.missingColumns])
                    }
                  })
                } else if (orderedVals[columns.indexOf('publication_title')]?.indexOf('�') >= 0) {
                  hasErrors = true
                  this.loadedFile.errors.single.push({ row: idxr, column: 'publication_title', reason: this.$i18n.t('kbart.errors.encoding'), value: orderedVals[columns.indexOf('publication_title')] })
                  break
                }

                if (hasErrors) {
                  this.loadedFile.lineStats.error++
                  break
                } else {
                  orderedVals.forEach((col, idxc) => {
                    var colName = columns[idxc]
                    var colRules = this.kbartStd.mandatoryColumns[colName]?.rules

                    if (colRules?.notEmpty && col.trim().length === 0) {
                      if (colRules?.notEmpty === 'warn') {
                        this.ensureFieldCounter(colName, 'warnings', 'empty')
                        this.loadedFile.warnings.single.push({ row: idxr, column: colName, reason: this.$i18n.t('kbart.errors.missingVal', [colName]) })
                        hasWarnings = true
                      } else {
                        this.ensureFieldCounter(colName, 'errors', 'empty')
                        this.loadedFile.errors.single.push({ row: idxr, column: colName, reason: this.$i18n.t('kbart.errors.missingVal', [colName]) })
                        hasErrors = true
                      }
                    }

                    if (col.trim().length > 0 && this.kbartStd.general[colName]?.rules.general && !this.kbartStd.general[colName]?.rules.general?.test(col.trim())) {
                      this.ensureFieldCounter(colName, 'errors', 'invalid')
                      this.loadedFile.errors.single.push({ row: idxr, column: colName, reason: this.$i18n.t('kbart.errors.illegalVal', [col]) })
                      hasErrors = true
                    }

                    if (colName === 'online_identifier') {
                      if (col.trim().length > 0 && !this.kbartStd.mandatoryColumns.online_identifier.rules[type]?.test(col.trim())) {
                        this.ensureFieldCounter(colName, 'errors', 'invalid')
                        this.loadedFile.errors.single.push({ row: idxr, column: colName, reason: this.$i18n.t('kbart.errors.illegalOnlineId', [col]) })
                        hasErrors = true
                      }
                    } else if (colName === 'print_identifier') {
                      if (col.trim().length > 0 && !this.kbartStd.mandatoryColumns.print_identifier.rules[type]?.test(col.trim())) {
                        this.ensureFieldCounter(colName, 'errors', 'invalid')
                        this.loadedFile.errors.single.push({ row: idxr, column: colName, reason: this.$i18n.t('kbart.errors.illegalPrintId', [col]) })
                        hasErrors = true
                      }
                    } else if (this.kbartStd[type][colName]) {
                      if (col.trim().length === 0 && this.kbartStd[type][colName]?.rules?.notEmpty) {
                        this.ensureFieldCounter(colName, 'errors', 'empty')
                        this.loadedFile.errors.single.push({ row: idxr, column: colName, reason: this.$i18n.t('kbart.errors.missingVal', [colName]) })
                        hasErrors = true
                      } else if (col.trim().length > 0 && this.kbartStd[type][colName]?.rules.general && !this.kbartStd[type][colName]?.rules.general?.test(col.trim())) {
                        this.ensureFieldCounter(colName, 'errors', 'invalid')
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
      ensureFieldCounter (colName, severity, type) {
        if (!this.loadedFile[severity][colName]) {
          this.loadedFile[severity][colName] = {}
        }

        if (!this.loadedFile[severity][colName][type]) {
          this.loadedFile[severity][colName][type] = 1
        } else {
          this.loadedFile[severity][colName][type]++
        }
      },
      _importProgress ({ loaded, total }) {
        this.completion = math.asPercent(loaded / total)
      },
    }
  }
</script>
