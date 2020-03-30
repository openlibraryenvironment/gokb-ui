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
            <v-col>
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
              :disabled="importRunning"
              @click="doExport"
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
              <span v-else-if="importRunning === false && !error">Export erfolgreich ohne Fehler.</span>
              <span v-else>Bitte wählen Sie eine CSV-Datei aus und starten Sie den Export.</span>
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
      async doExport () {
        const result = await baseServices.request({
          method: 'GET',
          url: 'https://gokbt.gbv.de/gokb/packages/kbart/6196e907-59df-4cfd-94f6-91dd1e72b0b0',
        }, this.cancelToken.token)
        console.log(result)
        /*
        this.headerTypeConverter = HEADER_TYPE_CONVERTER(this.selectedOrganisationId)
        this.error = undefined
        this.importRunning = true
        this.completion = 0
        this.readerForImport = new FileReader()
        this.readerForImport.onload = this._importCompleted
        this.readerForImport.onprogress = this._importProgress
        this.readerForImport.readAsText(this.selectedFile)
         */
      },
      async _importCompleted () {
        const csvDataRows = this.readerForImport.result.split(/\r?\n/)
          .filter(row => row.trim())
        if (csvDataRows.length === 0) {
          return
        }
        try {
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
    }
  }
</script>
