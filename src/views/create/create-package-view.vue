<template>
  <gokb-page
    title="Paket anlegen"
    @valid="valid = $event"
    @submit="createPackage"
  >
    <gokb-error-component :value="error" />
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
            <gokb-radiobutton-group v-model="packageItem.global">
              <gokb-radiobutton-field
                value="Consortium"
                label="Konsortial"
              />
              <gokb-radiobutton-field
                value="Global"
                label="Global"
              />
              <gokb-radiobutton-field
                value="Regional"
                label="Regional"
              />
              <gokb-radiobutton-field
                value="Other"
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
              return-object
            />
          </gokb-section>
          <gokb-section sub-title="Plattform">
            <gokb-search-platform-field
              v-model="packageItem.nominalPlatform"
              label="Name"
              return-object
            />
          </gokb-section>
        </v-stepper-content>

        <v-stepper-content :step="3">
          <gokb-open-file-popup
            v-if="fileImportPopupVisible"
            v-model="fileImportPopupVisible"
            @add="addNewTitle"
          />
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
                KBart Import
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
                <gokb-number-field
                  :value="totalNumberOfTitles"
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
            v-model="allCuratoryGroups"
            sub-title="Kuratorengruppen"
          />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <template #buttons>
      <gokb-button
        text
        @click="cancelPackage"
      >
        Abbrechen
      </gokb-button>
      <gokb-button
        v-show="step !== 1"
        @click="go2PreviousStep"
      >
        Zurück
      </gokb-button>
      <v-spacer />
      <gokb-button
        v-if="!isInLastStep"
        color="accent"
        :disabled="!valid"
        @click="go2NextStep"
      >
        Weiter
      </gokb-button>
      <!-- without key, submit is executed on previous page -->
      <gokb-button
        v-else
        key="add"
        :disabled="!valid"
        default
      >
        Hinzufügen
      </gokb-button>
    </template>
  </gokb-page>
</template>

<script>
  import utils from '@/shared/utils/utils'
  import BaseComponent from '@/shared/components/base-component'
  import GokbSearchOrganisationField from '@/shared/components/simple/gokb-search-organisation-field'
  import GokbSearchPlatformField from '@/shared/components/simple/gokb-search-platform-field'
  import GokbScopeField from '@/shared/components/simple/gokb-scope-field'
  import GokbUrlField from '@/shared/components/simple/gokb-url-field'
  import GokbSearchSourceField from '@/shared/components/simple/gokb-search-source-field'
  import GokbMaintenanceCycleField from '@/shared/components/simple/gokb-maintenance-cycle-field'
  import GokbAddTitlePopup from '@/shared/popups/gokb-add-title-popup'
  import GokbOpenFilePopup from '@/shared/popups/gokb-open-file-popup'
  import GokbIdentifierSection from '@/shared/components/complex/gokb-identifier-section'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import GokbCuratoryGroupSection from '@/shared/components/complex/gokb-curatory-group-section'
  import GokbDateField from '@/shared/components/complex/gokb-date-field'
  import { HOME_ROUTE } from '@/router/route-paths'
  import packageServices from '@/shared/services/package-services'

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
      GokbOpenFilePopup,
      GokbConfirmationPopup,
      GokbCuratoryGroupSection,
      GokbMaintenanceCycleField
    },
    extends: BaseComponent,
    data () {
      return {
        valid: undefined,
        fileImportPopupVisible: false,
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
        },
        allCuratoryGroups: [],
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
      isInLastStep () {
        return this.step === 4
      },
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
        return this.maintenanceCycle ? this.maintenanceCycle.createMaintenanceDate(new Date()) : null
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
        this.messageToConfirm = 'Wollen Sie das ausgewählte Element wirklich löschen?'
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
        this.fileImportPopupVisible = true
      },
      addNewTitle (title) {
        !this.titles.find(({ id: idInAll }) => title.id === idInAll) &&
          this.titles.push(title)
      },
      cancelPackage () {
        this.$router.push(HOME_ROUTE)
      },
      async createPackage (form) {
        const valid = form.validate()
        if (valid) {
          const newPackage = {
            ...this.packageItem,
            breakable: utils.asYesNo(this.packageItem.breakable),
            consistent: utils.asYesNo(this.packageItem.consistent),
            fixed: utils.asYesNo(this.packageItem.fixed),
            nominalPlatform: this.packageItem.nominalPlatform?.id,
            provider: this.packageItem.provider?.id,
            ids: this.packageItem.ids.map(({ value, namespace: { name: namespace } }) => ({ value, namespace }))
          }
          await this.catchError({
            promise: packageServices.createOrUpdatePackage(newPackage, this.cancelToken.token),
            instance: this
          })
        }
      //   [
      //     name: "TestFullJournal",
      //   ids|identifiers: [
      //     identifierID,
      //     [namespace: namespaceID, value: "3344-5544"],
      //   [namespace: namespaceName, value: "1234435-6"]
      // ],
      //   publisher: publisherId|publisherName,
      //     publishedFrom: publishedFromDate,
      //     publishedTo: publishedToDate
      // ]
      }
    }
  }
</script>
