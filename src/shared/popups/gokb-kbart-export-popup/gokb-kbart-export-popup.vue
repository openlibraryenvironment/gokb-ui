<template>
  <v-dialog
    v-model="visible"
    max-width="600"
    persistent
  >
    <template #activator="{ on: { click } }">
      <gokb-button
        icon-id="import_export"
        @click.native="click"
      >
        Export
      </gokb-button>
    </template>
    <v-card class="elevation-12">
      <v-form
        @submit.prevent="visible = false"
      >
        <v-toolbar color="info">
          <v-toolbar-title>KBART/GOKb-Export</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row align="center">
            <v-col cols="6">
              <v-select
                v-model="selectedOrganisationId"
                :items="allowedOrganisations"
                label="Einrichtung"
              />
            </v-col>
            <v-col cols="6">
              <v-file-input
                v-model="selectedFile"
                label="CSV-Datei"
                prepend-icon="mdi-file-delimited"
                :disabled="importRunning"
                counter
                accept=".csv"
                show-size
              />
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-btn
              class="info"
              x-large
              :disabled="!selectedFile || importRunning"
              @click="doImport"
            >
              Exportieren
            </v-btn>
          </v-row>
          <v-progress-linear
            class="mt-5"
            :value="completion"
            height="25"
          >
            <template #default="{ value: v }">
              <strong>{{ v }}%</strong>
            </template>
          </v-progress-linear>
          <div class="mt-5">
            <v-alert
              v-if="error"
              type="error"
            >
              <span>Es sind Fehler aufgetreten.</span>
            </v-alert>
            <v-alert
              v-else
              type="info"
            >
              <span v-if="importRunning === true">Der Export wird durchgeführt.</span>
              <span v-else-if="importRunning === false && !error">Import erfolgreich ohne Fehler.</span>
              <span v-else>Bitte wählen Sie eine CSV-Datei aus und starten Sie den Import.</span>
            </v-alert>
            <v-expansion-panels v-if="error">
              <v-expansion-panel>
                <v-expansion-panel-header>{{ errorMessage }}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <code>
                    {{ errorDetails }}
                  </code>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            type="submit"
          >
            Schließen
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
  import BaseComponent from '@/shared/base-component'
  import math from '@/shared/utils/math'
  import baseServices from '@/shared/services/base-services'
  import GokbButton from '../../components/base/gokb-button/gokb-button'

  const CSV_SEPARATOR = ';'
  const HEADER_TYPE_CONVERTER = (organisationId) => ({
    doi: value => value,
    year: parseInt,
    organisation: value => organisationId || value,
  })

  export default {
    components: { GokbButton },
    extends: BaseComponent,
    readerForImport: undefined,
    data () {
      return {
        visible: false,
        selectedOrganisationId: undefined,
        allowedOrganisations: undefined,
        completion: undefined,
        selectedFile: undefined,
        importRunning: undefined,
        error: undefined,
      }
    },
    computed: {
      errorMessage () {
        return this.error?.response.data.Message
      },
      errorDetails () {
        return Object.entries(this.error?.response.data.ModelState).slice(0, 10)
          .map(([key, value]) => {
            const line = key.match(/model\[(\d*)\]/)
            return `Zeile ${line[1]}: ${value.join(', ')}`
          })
          .join('\n  ')
      },
    },
    methods: {
      doImport () {
        this.headerTypeConverter = HEADER_TYPE_CONVERTER(this.selectedOrganisationId)
        this.error = undefined
        this.importRunning = true
        this.completion = 0
        this.readerForImport = new FileReader()
        this.readerForImport.onload = this._importCompleted
        this.readerForImport.onprogress = this._importProgress
        this.readerForImport.readAsText(this.selectedFile)
      },
      async _importCompleted () {
        const csvDataRows = this.readerForImport.result.split(/\r?\n/)
          .filter(row => row.trim())
        if (csvDataRows.length === 0) {
          return
        }
        const header = csvDataRows.splice(0, 1)[0].split(CSV_SEPARATOR)
        const rowsAsJson = this._convertRows(header, csvDataRows)
        try {
          await baseServices.pubchargedb({
            initiator: this._importCompleted.name,
            data: rowsAsJson
          })
        } catch (exception) {
          this.error = exception
        } finally {
          this.completion = 100
          this.importRunning = false
        }
      },
      _importProgress ({ loaded, total }) {
        this.completion = math.asPercent(loaded / (total * 2))
      },
      _convertRows (header, csvDataRows) {
        // if (header.length !== 5) {
        return csvDataRows.map(row => row
          .split(CSV_SEPARATOR)
          .reduce((result, value, i) => {
            const converter = this.headerTypeConverter[header[i]]
            const convertedValue = converter ? converter(value) : parseFloat(value)
            if (convertedValue) {
              result[header[i]] = convertedValue
            }
            return result
          }, {}))
        // }

        // const entries = new Map()
        // csvDataRows.forEach(({ doi, year, type, value, organisation }) => {
        //   const key = { doi, year, type, value, organisation }
        // })
        // 0: {doi: "10.3390/cryst8060241", year: "2018", type: "Permission", value: "15,77", organisation: "grid.8385.6"}
      }
    }
  }
</script>
