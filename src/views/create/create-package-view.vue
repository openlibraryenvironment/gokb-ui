<template>
  <gokb-page
    title="Paket anlegen"
    @submit="createPackage"
  >
    <v-stepper
      v-model="step"
      alt-labels
    >
      <v-stepper-header>
        <v-stepper-step
          editable
          step="1"
        >
          Allgemein
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          editable
          step="2"
        >
          Organisation und Plattform
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          editable
          step="3"
        >
          Titel im Paket
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          editable
          step="4"
        >
          Zusammenfassung
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <gokb-section
            title="Allgemein"
            sub-title="Paket"
          >
            <gokb-text-field
              v-model="title"
              placeholder="Titel"
            />
            <gokb-combobox-field placeholder="Quelle" />
            <gokb-text-field
              v-model="url"
              placeholder="URL"
            />
            <gokb-textarea-field
              v-model="description"
              placeholder="Beschreibung"
            />
            <gokb-select-field placeholder="Umfang" />
            <gokb-radiobutton-group>
              <gokb-radiobutton-field label="Konsortial" />
              <gokb-radiobutton-field label="Global" />
              <gokb-radiobutton-field label="Unbekannt" />
            </gokb-radiobutton-group>
            <v-row>
              <gokb-checkbox-field
                class="ml-3"
                label="Paketinhalt ist konsistent"
              />
              <gokb-checkbox-field
                class="ml-3"
                label="Teilbar für Lizenznehmer"
              />
              <gokb-checkbox-field
                class="ml-3"
                label="Paket ist unveränderbar"
              />
            </v-row>
          </gokb-section>
          <gokb-section sub-title="Identifier">
            <template #buttons>
              <gokb-button
                icon="add"
              >
                Identifier hinzufügen
              </gokb-button>
            </template>
            <gokb-select-field placeholder="ISSN" />
          </gokb-section>
        </v-stepper-content>

        <v-stepper-content step="2">
          <gokb-section
            title="Organisation"
            sub-title="Allgemein"
          >
            <gokb-text-field placeholder="Name" />
            <gokb-select-field placeholder="Quelle" />
            <gokb-text-field placeholder="Referenz" />
          </gokb-section>
          <gokb-section sub-title="Identifier">
            <template #buttons>
              <gokb-button
                icon="add"
              >
                Identifier hinzufügen
              </gokb-button>
            </template>
            <gokb-select-field placeholder="DOI" />
          </gokb-section>
          <gokb-section sub-title="Alternative Namen">
            <template #buttons>
              <gokb-button
                icon="add"
                class="mr-4"
              >
                Hinzufügen
              </gokb-button>
              <gokb-button
                icon="delete"
              >
                Löschen
              </gokb-button>
            </template>
            <gokb-table
              :show-select="false"
              :headers="alternativeNamesHeader"
              :items="alternativeNames"
            />
          </gokb-section>
          <gokb-section sub-title="Kuratoren">
            <template #buttons>
              <gokb-button
                icon="add"
                class="mr-4"
              >
                Hinzufügen
              </gokb-button>
              <gokb-button
                icon="delete"
              >
                Löschen
              </gokb-button>
            </template>
            <gokb-table
              :show-select="false"
              :headers="curatoriesHeader"
              :items="curatories"
            />
          </gokb-section>
          <gokb-section title="Plattform">
            <gokb-select-field placeholder="Name" />
            <gokb-select-field placeholder="Quelle" />
            <gokb-select-field placeholder="Url" />
            <gokb-checkbox-field label="Gleicher Provider wie oben" />
            <gokb-select-field placeholder="Provider" />
          </gokb-section>
        </v-stepper-content>

        <v-stepper-content step="3">
          <gokb-section sub-title="Titel">
            <template #buttons>
              <gokb-button
                class="mr-4"
              >
                KBART Upload
              </gokb-button>
              <gokb-button
                icon="add"
                class="mr-4"
              >
                Hinzufügen
              </gokb-button>
              <gokb-button
                icon="delete"
              >
                Löschen
              </gokb-button>
            </template>
            <gokb-table
              :show-select="false"
              :headers="titlesHeader"
              :items="titles"
            />
          </gokb-section>
        </v-stepper-content>

        <v-stepper-content step="4">
          <gokb-section sub-title="Zusammenfassung">
            df
          </gokb-section>
          <gokb-section sub-title="Pflege">
            df
          </gokb-section>
          <gokb-section sub-title="Kuratoren">
            df
          </gokb-section>
          <gokb-section sub-title="Review">
            df
          </gokb-section>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <template #buttons>
      <gokb-button
        v-show="step !== 1"
        @click.native="go2PreviousStep"
      >
        Zurück
      </gokb-button>
      <v-spacer />
      <gokb-button
        v-show="step !== 4"
        default
        @click.native="go2NextStep"
      >
        Weiter
      </gokb-button>
    </template>
  </gokb-page>
</template>

<script>
  export default {
    name: 'CreatePackage',
    data () {
      return {
        step: 1,
        title: undefined,
        description: undefined,
        url: undefined,
        alternativeNamesHeader: [
          {
            text: 'Alias',
            align: 'left',
            sortable: false,
            value: 'alias'
          },
        ],
        alternativeNames: [],
        curatoriesHeader: [
          {
            text: 'Gruppe',
            align: 'left',
            sortable: false,
            value: 'group'
          },
        ],
        curatories: [],
        titlesHeader: [
          {
            text: 'Titel',
            align: 'left',
            sortable: false,
            value: 'title'
          },
          {
            text: 'Plattform',
            align: 'left',
            sortable: false,
            value: 'platform'
          },
        ],
        titles: [],
      }
    },
    methods: {
      go2NextStep () {
        this.step < 4 && this.step++
      },
      go2PreviousStep () {
        this.step > 1 && this.step--
      },
      createPackage () {
        console.log('create package')
      }
    }
  }
</script>

<style scoped>
</style>
