<template>
  <gokb-page
    :key="version"
    :title="title"
    @valid="valid = $event"
    @submit="createPackage"
  >
    <gokb-error-component :value="error" />
    <span v-if="successMsg">
      <v-alert type="success">
        Update erfolgreich
      </v-alert>
    </span>
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
            <gokb-name-field
              v-model="allNames"
              :disabled="isReadonly"
              label="Titel"
            />
            <gokb-search-source-field
              v-model="packageItem.source"
              :readonly="isReadonly"
            />
            <gokb-url-field
              v-model="packageItem.descriptionUrl"
              :readonly="isReadonly"
            />
            <gokb-textarea-field
              v-model="packageItem.description"
              label="Beschreibung"
              :readonly="isReadonly"
            />
            <gokb-scope-field
              v-model="packageItem.scope"
              :readonly="isReadonly"
            />
            <gokb-radiobutton-group v-model="packageItem.global">
              <gokb-radiobutton-field
                value="Consortium"
                label="Konsortial"
                :readonly="isReadonly"
              />
              <gokb-radiobutton-field
                value="Global"
                label="Global"
                :readonly="isReadonly"
              />
              <gokb-radiobutton-field
                value="Regional"
                label="Regional"
                :readonly="isReadonly"
              />
              <gokb-radiobutton-field
                value="Other"
                label="Unbekannt"
                :readonly="isReadonly"
              />
            </gokb-radiobutton-group>
            <v-row>
              <gokb-checkbox-field
                v-model="packageItem.consistent"
                class="ml-3"
                label="Paketinhalt ist konsistent"
                :readonly="isReadonly"
              />
              <gokb-checkbox-field
                v-model="packageItem.breakable"
                class="ml-3"
                label="Teilbar für Lizenznehmer"
                :readonly="isReadonly"
              />
              <gokb-checkbox-field
                v-model="packageItem.fixed"
                class="ml-3"
                label="Paket ist unveränderbar"
                :readonly="isReadonly"
              />
            </v-row>
          </gokb-section>
          <gokb-identifier-section
            v-model="packageItem.ids"
            :disabled="isReadonly"
          />
          <gokb-alternate-names-section
            v-model="allNames.alts"
            :disabled="isReadonly"
          />
        </v-stepper-content>

        <v-stepper-content :step="2">
          <gokb-section
            sub-title="Provider"
          >
            <gokb-search-organisation-field
              v-model="packageItem.provider"
              :items="providerSelection"
              :readonly="isReadonly"
              label="Name"
              return-object
            />
          </gokb-section>
          <gokb-section sub-title="Plattform">
            <gokb-search-platform-field
              v-model="packageItem.nominalPlatform"
              :items="platformSelection"
              :readonly="isReadonly"
              label="Name"
              return-object
            />
          </gokb-section>
        </v-stepper-content>

        <v-stepper-content :step="3">
          <gokb-kbart-import-popup
            v-if="kbartImportPopupVisible"
            v-model="kbartImportPopupVisible"
            @add="addNewTitle"
          />
          <gokb-add-title-popup
            v-if="addTitlePopupVisible"
            v-model="addTitlePopupVisible"
            :title-type="addTitleType"
            @add="addNewTitle"
          />
          <gokb-section sub-title="Titel">
            <template
              v-if="!isReadonly"
              #buttons
            >
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
                <gokb-name-field
                  v-model="allNames"
                  label="Titel"
                  readonly
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <gokb-text-field
                  v-model="packageItem.description"
                  label="Beschreibung"
                  readonly
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <gokb-text-field
                  v-model="platformName"
                  label="Plattform"
                  readonly
                />
              </v-col>
              <v-col>
                <gokb-number-field
                  :value="totalNumberOfTitles"
                  label="Anzahl Titel im Paket"
                  readonly
                />
              </v-col>
            </v-row>
            <gokb-text-field
              v-model="providerName"
              label="Organisation"
              readonly
            />
          </gokb-section>
          <gokb-section
            v-if="maintenance"
            sub-title="Pflege"
          >
            <gokb-maintenance-cycle-field v-model="maintenanceCycle" />
            <gokb-date-field
              v-model="dueTo"
              label="Fällig am"
              disabled
            />
          </gokb-section>
          <gokb-curatory-group-section
            v-model="allCuratoryGroups"
            :disabled="isReadonly"
            sub-title="Kuratorengruppen"
          />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <template #buttons>
      <gokb-button
        v-if="!isReadonly"
        text
        @click="reload"
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
        {{ $i18n.t('btn.submit') }}
      </gokb-button>
    </template>
  </gokb-page>
</template>

<script>
  import utils from '@/shared/utils/utils'
  import accountModel from '@/shared/models/account-model'
  import BaseComponent from '@/shared/components/base-component'
  import GokbSearchOrganisationField from '@/shared/components/simple/gokb-search-organisation-field'
  import GokbSearchPlatformField from '@/shared/components/simple/gokb-search-platform-field'
  import GokbScopeField from '@/shared/components/simple/gokb-scope-field'
  import GokbUrlField from '@/shared/components/simple/gokb-url-field'
  import GokbSearchSourceField from '@/shared/components/simple/gokb-search-source-field'
  import GokbMaintenanceCycleField from '@/shared/components/simple/gokb-maintenance-cycle-field'
  import GokbAddTitlePopup from '@/shared/popups/gokb-add-title-popup'
  import GokbKbartImportPopup from '@/shared/popups/gokb-kbart-import-popup'
  import GokbIdentifierSection from '@/shared/components/complex/gokb-identifier-section'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import GokbAlternateNamesSection from '@/shared/components/complex/gokb-alternate-names-section'
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
    name: 'EditPackageView',
    components: {
      GokbDateField,
      GokbIdentifierSection,
      GokbSearchOrganisationField,
      GokbSearchPlatformField,
      GokbScopeField,
      GokbUrlField,
      GokbSearchSourceField,
      GokbAddTitlePopup,
      GokbKbartImportPopup,
      GokbConfirmationPopup,
      GokbCuratoryGroupSection,
      GokbMaintenanceCycleField,
      GokbAlternateNamesSection
    },
    extends: BaseComponent,
    props: {
      id: {
        type: String,
        required: false,
        default: undefined
      },
      maintenance: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
        valid: undefined,
        kbartImportPopupVisible: false,
        step: 1,
        version: undefined,
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
          { id: 'mixed', text: 'Gemischt' },
        ],
        addTitlePopupVisible: false,
        successMsg: false,
        titlesHeader: TITLES_HEADER,
        titlesOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
        providerSelect: [],
        platformSelect: [],
        selectedTitles: [],
        allAlternateNames: [],
        allNames: { name: undefined, alts: [] },
        titles: [],
        titleCount: 0,
        maintenanceCycle: undefined,
        confirmationPopUpVisible: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: undefined,
        updateUrl: undefined,
      }
    },
    computed: {
      title () {
        return this.$i18n.t(this.titleCode, [this.$i18n.t('component.package.label')])
      },
      titleCode () {
        return this.isEdit ? (this.updateUrl ? 'header.edit.label' : 'header.show.label') : 'header.create.label'
      },
      isEdit () {
        return !!this.id
      },
      isReadonly () {
        return !accountModel.loggedIn || (this.isEdit && !this.updateUrl) || (!this.isEdit && !accountModel.hasRole('ROLE_EDITOR'))
      },
      isInLastStep () {
        return this.step === 4
      },
      providerSelection () {
        return this.providerSelect
      },
      platformSelection () {
        return this.platformSelect
      },
      providerName () {
        return this.packageItem?.provider?.name
      },
      platformName () {
        return this.packageItem?.nominalPlatform?.name
      },
      totalNumberOfTitles () {
        return this.titleCount
      },
      dueTo () {
        return this.maintenanceCycle ? this.maintenanceCycle.createMaintenanceDate(new Date()) : null
      },
      loggedIn () {
        return accountModel.loggedIn
      },
    },
    watch: {
      loggedIn (value) {
        if (value) {
          this.reload()
        }
      }
    },
    async created () {
      this.reload()
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
        this.kbartImportPopupVisible = true
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
            id: this.id,
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

          if (newPackage.status === 200) {
            this.successMsg = true
            this.reload()
          }
        }
      },
      async reload () {
        if (this.isEdit) {
          const {
            data: {
              name,
              source,
              descriptionUrl,
              description,
              scope,
              global,
              consistent,
              breakable,
              fixed,
              provider,
              nominalPlatform,
              _tippCount,
              version,
              _embedded: {
                ids,
                variantNames,
                curatoryGroups
              },
              _links: {
                update: { href: updateUrl }
              }
            }
          } = await this.catchError({
            promise: packageServices.getPackage(this.id, this.cancelToken.token),
            instance: this
          })
          this.packageItem.name = name
          this.packageItem.source = source
          this.packageItem.descriptionUrl = descriptionUrl
          this.packageItem.description = description
          this.packageItem.scope = scope
          this.packageItem.global = global?.name
          this.packageItem.consistent = consistent?.name === 'Yes'
          this.packageItem.breakable = breakable?.name === 'Yes'
          this.packageItem.fixed = fixed?.name === 'Yes'
          this.packageItem.provider = provider
          this.packageItem.nominalPlatform = nominalPlatform
          this.version = version
          this.packageItem.ids = ids.map(({ value, namespace: { name: namespace } }) => ({ value, namespace, isDeletable: !!updateUrl }))
          this.allAlternateNames = variantNames.map(({ variantName, id }) => ({ id, variantName, isDeletable: !!updateUrl }))
          this.allCuratoryGroups = curatoryGroups.map(({ name, id }) => ({ id, name, isDeletable: !!updateUrl }))
          this.updateUrl = updateUrl
          this.providerSelect = provider
          this.platformSelect = nominalPlatform
          this.titleCount = _tippCount
          this.allNames = { name: name, alts: this.allAlternateNames }
        }
      }
    }
  }
</script>
