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
              v-model="packageItem.name"
              label="Titel"
            />
            <gokb-search-source-field
              v-model="packageItem.source"
            />
            <gokb-url-field
              v-model="packageItem.descriptionUrl"
            />
            <gokb-textarea-field
              v-model="packageItem.description"
              label="Beschreibung"
            />
            <gokb-scope-field
              v-model="packageItem.scope"
            />
            <gokb-radiobutton-group>
              <gokb-radiobutton-field
                v-model="packageItem.global"
                label="Konsortial"
              />
              <gokb-radiobutton-field
                v-model="packageItem.global"
                label="Global"
              />
              <gokb-radiobutton-field
                v-model="packageItem.global"
                label="Regional"
              />
              <gokb-radiobutton-field
                v-model="packageItem.global"
                label="Unbekannt"
              />
            </gokb-radiobutton-group>
            <v-row>
              <gokb-checkbox-field
                v-model="packageItem.consistent"
                class="ml-3"
                label="Paketinhalt ist konsistent"
              />
              <gokb-checkbox-field
                v-model="packageItem.breakable"
                class="ml-3"
                label="Teilbar für Lizenznehmer"
              />
              <gokb-checkbox-field
                v-model="packageItem.fixed"
                class="ml-3"
                label="Paket ist unveränderbar"
              />
            </v-row>
          </gokb-section>
          <gokb-identifier-section
            v-model="packageItem.ids"
          />
        </v-stepper-content>

        <v-stepper-content :step="2">
          <gokb-section
            sub-title="Organisation"
          >
            <gokb-search-organisation-field
              v-model="packageItem.provider"
              label="Name"
            />
          </gokb-section>
          <gokb-section sub-title="Plattform">
            <gokb-search-platform-field
              v-model="packageItem.nominalPlatform"
              label="Name"
            />
          </gokb-section>
        </v-stepper-content>

        <v-stepper-content :step="3">
          <gokb-add-title-popup
            v-if="addTitlePopupVisible"
            v-model="addTitlePopupVisible"
            :title-type="addTitleType"
            @add="addNewTitle"
          />
          <gokb-section sub-title="Titel">
            <template #buttons>
              <gokb-button
                class="mr-4"
                @click="showKbartImportPopup"
              >
                KBART Import
              </gokb-button>

              <v-menu
                offset-y
                open-on-hover
              >
                <template #activator="{ on }">
                  <v-btn
                    class="mr-4"
                    color="primary"
                    v-on="on"
                  >
                    <v-icon>add</v-icon>
                    Hinzufügen
                    <v-icon>keyboard_arrow_down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <template v-for="type in packageTypes">
                    <v-list-item
                      :key="type.text"
                      @click="showAddNewTitlePopup(type)"
                    >
                      <v-list-item-title>
                        {{ type.text }}
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                </v-list>
              </v-menu>

              <gokb-button
                icon-id="delete"
                @click="confirmDeleteSelectedItems"
              >
                Löschen
              </gokb-button>
            </template>
            <gokb-confirmation-popup
              v-model="confirmationPopUpVisible"
              :message="messageToConfirm"
              @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
            />
            <gokb-table
              :headers="titlesHeader"
              :items="titles"
              :selected-items="selectedTitles"
              :total-number-of-items="totalNumberOfTitles"
              :options.sync="titlesOptions"
              @selected-items="selectedTitles = $event"
              @delete-item="confirmDeleteItem"
            />
          </gokb-section>
        </v-stepper-content>

        <v-stepper-content :step="4">
          <gokb-section sub-title="Zusammenfassung">
            <v-row>
              <v-col>
                <gokb-text-field
                  v-model="packageItem.name"
                  label="Titel"
                  disabled
                />
              </v-col>
              <v-col>
                <gokb-text-field
                  v-model="packageItem.description"
                  label="Beschreibung"
                  disabled
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <gokb-text-field
                  v-model="platformName"
                  label="Plattform"
                  disabled
                />
              </v-col>
              <v-col>
                <gokb-text-field
                  v-model="totalNumberOfTitles"
                  label="Anzahl Titel im Paket"
                  disabled
                />
              </v-col>
            </v-row>
            <gokb-text-field
              v-model="providerName"
              label="Organisation"
              disabled
            />
          </gokb-section>
          <gokb-section sub-title="Pflege">
            <gokb-maintenance-cycle-field v-model="maintenanceCycle" />
            <gokb-date-field
              v-model="dueTo"
              label="Fällig am"
              disabled
            />
          </gokb-section>
          <gokb-curatory-group-section
            v-model="packageItem.allCuratoryGroups"
            sub-title="Kuratorengruppen"
          />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <template #buttons>
      <gokb-button
        v-show="step !== 1"
        @click="go2PreviousStep"
      >
        Zurück
      </gokb-button>
      <v-spacer />
      <gokb-button
        v-if="step !== 4"
        default
        @click="go2NextStep"
      >
        Weiter
      </gokb-button>
      <gokb-button
        v-else
        default
        @click="go2NextStep"
      >
        Hinzufügen
      </gokb-button>
    </template>
  </gokb-page>
</template>

<script>
  import GokbSearchOrganisationField from '@/shared/components/simple/gokb-search-organisation-field'
  import GokbSearchPlatformField from '@/shared/components/simple/gokb-search-platform-field'
  import GokbScopeField from '@/shared/components/simple/gokb-scope-field'
  import GokbUrlField from '@/shared/components/simple/gokb-url-field'
  import GokbSearchSourceField from '@/shared/components/simple/gokb-search-source-field'
  import GokbMaintenanceCycleField from '@/shared/components/simple/gokb-maintenance-cycle-field'
  import GokbAddTitlePopup from '@/shared/popups/gokb-add-title-popup'
  import GokbIdentifierSection from '@/shared/components/complex/gokb-identifier-section'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import GokbCuratoryGroupSection from '@/shared/components/complex/gokb-curatory-group-section'
  import GokbDateField from '@/shared/components/complex/gokb-date-field'

  const ROWS_PER_PAGE = 10

  const TITLES_HEADER = [
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
  ]

  export default {
    name: 'CreatePackage',
    components: {
      GokbDateField,
      GokbIdentifierSection,
      GokbSearchOrganisationField,
      GokbSearchPlatformField,
      GokbScopeField,
      GokbUrlField,
      GokbSearchSourceField,
      GokbAddTitlePopup,
      GokbConfirmationPopup,
      GokbCuratoryGroupSection,
      GokbMaintenanceCycleField
    },
    data () {
      return {
        kbartImportPopupVisible: false,
        step: 1,
        packageItem: {
          name: undefined,
          source: undefined,
          descriptionUrl: undefined,
          description: undefined,
          scope: undefined,
          global: undefined,
          consistent: undefined,
          breakable: undefined,
          fixed: undefined,
          ids: [],
          provider: undefined, // organisation
          nominalPlatform: undefined,
          allCuratoryGroups: [],
        },
        packageTypes: [
          { id: 'book', text: 'Buch' },
          { id: 'database', text: 'Datenbank' },
          { id: 'journal', text: 'Journal' },
          { id: 'monograph', text: 'Monographie' },
        ],
        addTitlePopupVisible: false,
        titlesOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
        selectedTitles: [],
        titles: [],
        maintenanceCycle: undefined,

        confirmationPopUpVisible: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: undefined,
      }
    },
    computed: {
      providerName () {
        return this.packageItem?.provider?.name
      },
      platformName () {
        return this.packageItem?.nominalPlatform?.name
      },
      totalNumberOfTitles () {
        return this.titles.length
      },
      dueTo () {
        return this.maintenanceCycle?.createMaintenanceDate(new Date())
      }
    },
    created () {
      this.titlesHeader = TITLES_HEADER
    },
    methods: {
      go2NextStep () {
        this.step < 4 && this.step++
      },
      go2PreviousStep () {
        this.step > 1 && this.step--
      },
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      confirmDeleteSelectedItems () {
        this.actionToConfirm = '_deleteSelectedCuratoryGroups'
        this.messageToConfirm = 'Wollen Sie die ausgewählten Elemente wirklich löschen?'
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      confirmDeleteItem ({ id }) {
        this.actionToConfirm = '_deleteItem'
        this.messageToConfirm = 'Wollen Sie das ausgewählte Elemente wirklich löschen?'
        this.parameterToConfirm = id
        this.confirmationPopUpVisible = true
      },
      _deleteSelectedTitles () {
        this.titles = this.titles.filter(({ id }) => !this.selectedTitles
          .find(({ id: selectedId }) => id === selectedId))
        this.selectedTitles = []
      },
      _deleteItem (idToDelete) {
        this.titles = this.titles.filter(({ id }) => id !== idToDelete)
        this.selectedTitles = this.selectedTitles.filter(({ id }) => id !== idToDelete)
      },
      showAddNewTitlePopup (titleType) {
        this.addTitleType = titleType
        this.addTitlePopupVisible = true
      },
      showKbartImportPopup () {
        this.kbartImportPopupVisible = true
      },
      addNewTitle (title) {
        !this.titles.find(({ id: idInAll }) => title.id === idInAll) &&
          this.titles.push(title)
      },
      createPackage () {
        console.log('create package')
      }
    }
  }
</script>

<style scoped>
</style>
