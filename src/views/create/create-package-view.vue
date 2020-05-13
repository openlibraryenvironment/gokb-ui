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
          :step="1"
        >
          Allgemein
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          editable
          :step="2"
        >
          Organisation und Plattform
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          editable
          :step="3"
        >
          Titel im Paket
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          editable
          :step="4"
        >
          Zusammenfassung
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content :step="1">
          <gokb-section
            title="Allgemein"
            sub-title="Paket"
          >
            <gokb-text-field
              v-model="title"
              label="Titel"
            />
            <gokb-combobox-field label="Quelle" />
            <gokb-text-field
              v-model="url"
              label="URL"
            />
            <gokb-textarea-field
              v-model="description"
              label="Beschreibung"
            />
            <gokb-select-field label="Umfang" />
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
                icon-id="add"
              >
                Identifier hinzufügen
              </gokb-button>
            </template>
            <gokb-select-field label="ISSN" />
          </gokb-section>
        </v-stepper-content>

        <v-stepper-content :step="2">
          <gokb-section
            title="Organisation"
            sub-title="Allgemein"
          >
            <gokb-text-field label="Name" />
            <gokb-select-field label="Quelle" />
            <gokb-text-field label="Referenz" />
          </gokb-section>
          <gokb-section sub-title="Identifier">
            <template #buttons>
              <gokb-button
                icon-id="add"
              >
                Identifier hinzufügen
              </gokb-button>
            </template>
            <gokb-select-field label="DOI" />
          </gokb-section>
          <gokb-section sub-title="Alternative Namen">
            <template #buttons>
              <gokb-button
                icon-id="add"
                class="mr-4"
              >
                Hinzufügen
              </gokb-button>
              <gokb-button
                icon-id="delete"
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
                icon-id="add"
                class="mr-4"
              >
                Hinzufügen
              </gokb-button>
              <gokb-button
                icon-id="delete"
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
            <gokb-select-field label="Name" />
            <gokb-select-field label="Quelle" />
            <gokb-select-field label="Url" />
            <gokb-checkbox-field label="Gleicher Provider wie oben" />
            <gokb-select-field label="Provider" />
          </gokb-section>
        </v-stepper-content>

        <v-stepper-content :step="3">
          <gokb-add-title-popup
            v-if="addTitlePopupVisible"
            v-model="addTitlePopupVisible"
            @add="addNewTitle"
          />
          <gokb-kbart-import-popup
            v-if="kbartImportPopupVisible"
            v-model="kbartImportPopupVisible"
          />
          <gokb-section sub-title="Titel">
            <template #buttons>
              <gokb-button
                class="mr-4"
                @click.native="showKbartImportPopup"
              >
                KBART Import
              </gokb-button>
              <gokb-button
                icon-id="add"
                class="mr-4"
                @click.native="showAddNewTitlePopup"
              >
                Hinzufügen
              </gokb-button>
              <gokb-button
                icon-id="delete"
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

        <v-stepper-content :step="4">
          <gokb-section sub-title="Zusammenfassung">
            <v-row>
              <v-col>
                <gokb-text-field
                  v-model="title"
                  label="Titel"
                  disabled
                />
              </v-col>
              <v-col>
                <gokb-text-field
                  v-model="description"
                  label="Beschreibung"
                  disabled
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <gokb-text-field
                  label="Plattform"
                  disabled
                />
              </v-col>
              <v-col>
                <gokb-text-field
                  label="Anzahl Titel im Paket"
                  disabled
                />
              </v-col>
            </v-row>
            <gokb-text-field
              label="Organisation"
              disabled
            />
          </gokb-section>
          <gokb-section sub-title="Pflege">
            <gokb-select-field label="Tunus" />
            <gokb-text-field
              label="Fällig am"
              disabled
            />
          </gokb-section>
          <gokb-section sub-title="Kuratoren">
            <template #buttons>
              <gokb-button @click.native="showAddNewCuratoryGroup">
                Hinzufügen
              </gokb-button>
              <gokb-button @click.native="deleteSelectedCuratoryGroups">
                Löschen
              </gokb-button>
            </template>
            <gokb-table
              :added-items="addedCuratoryGroups"
              :deleted-items="deletedCuratoryGroups"
              :headers="curatoryGroupsTableHeaders"
              :items="curatoryGroups"
              :selected-items="selectedCuratoryGroups"
            />
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
        v-if="step !== 4"
        default
        @click.native="go2NextStep"
      >
        Weiter
      </gokb-button>
      <gokb-button
        v-else
        default
        @click.native="go2NextStep"
      >
        Hinzufügen
      </gokb-button>
    </template>
  </gokb-page>
</template>

<script>
  import GokbAddTitlePopup from '@/shared/popups/gokb-add-title-popup'
  import GokbKbartImportPopup from '@/shared/popups/gokb-kbart-import-popup'

  export default {
    name: 'CreatePackage',
    components: {
      GokbAddTitlePopup,
      GokbKbartImportPopup
    },
    data () {
      return {
        kbartImportPopupVisible: false,
        step: 1,
        title: 'Springer Medical Best',
        description: 'Best Journal of Springer Medical',
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
        addTitlePopupVisible: false,
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

        curatoryGroups: undefined,
        selectedCuratoryGroups: [],
        deletedCuratoryGroups: [],
        addedCuratoryGroups: [],
        curatoryGroupsTableHeaders: [
          { text: 'Gruppe', align: 'left', value: 'name', sortable: false, width: '100%' },
        ]
      }
    },
    methods: {
      go2NextStep () {
        this.step < 4 && this.step++
      },
      go2PreviousStep () {
        this.step > 1 && this.step--
      },
      showAddNewTitlePopup () {
        this.addTitlePopupVisible = true
      },
      showKbartImportPopup () {
        this.kbartImportPopupVisible = true
      },
      addNewTitle () {
        console.log('addNewTitle')
      },
      createPackage () {
        console.log('create package')
      }
    }
  }
</script>

<style scoped>
</style>
