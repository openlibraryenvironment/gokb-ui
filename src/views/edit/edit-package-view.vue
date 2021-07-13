<template>
  <gokb-page
    v-if="!notFound"
    :key="version"
    :title="title"
    :sub-title="subTitle"
    @valid="valid = $event"
    @submit="showCreatePackageConfirm"
  >
    <gokb-error-component :value="error" />
    <span v-if="successMsg">
      <v-alert
        type="success"
        dismissible
      >
        {{ localSuccessMessage }}
      </v-alert>
    </span>
    <span v-if="kbartResult === 'success' || kbartStatus === 'success'">
      <v-alert
        type="success"
        dismissible
      >
        {{ $t('kbart.transmission.started') }}
      </v-alert>
    </span>
    <span v-else-if="kbartResult === 'error' || kbartStatus === 'error'">
      <v-alert
        type="error"
        dismissible
      >
        {{ $t('kbart.transmission.failure') }}
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
          {{ isEdit ? $t('component.package.navigation.step4') : $t('component.package.navigation.step1') }}
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          editable
          :step="2"
        >
          {{ isEdit ? $t('component.package.navigation.step1') : $t('component.package.navigation.step2') }}
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          editable
          :step="3"
        >
          {{ isEdit ? $t('component.package.navigation.step2') : $t('component.package.navigation.step3') }}
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          editable
          :step="4"
        >
          {{ isEdit ? $t('component.package.navigation.step3') : $t('component.package.navigation.step4') }}
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content :step="isEdit ? 2 : 1">
          <gokb-section :no-tool-bar="true">
            <gokb-name-field
              v-model="allNames"
              :disabled="isReadonly"
            />
            <gokb-url-field
              v-model="packageItem.descriptionUrl"
              :disabled="isReadonly"
              :label="$t('component.package.descriptionUrl')"
            />
            <gokb-textarea-field
              v-model="packageItem.description"
              :label="$t('component.package.description')"
              :disabled="isReadonly"
            />
          </gokb-section>
          <v-row>
            <v-col
              cols="12"
              xl="6"
            >
              <gokb-section
                :sub-title="$t('component.package.provider')"
              >
                <gokb-search-organisation-field
                  v-model="packageItem.provider"
                  :items="providerSelection"
                  :show-link="true"
                  :readonly="isReadonly"
                  return-object
                />
              </gokb-section>
            </v-col>
            <v-col
              cols="12"
              xl="6"
            >
              <gokb-section :sub-title="$t('component.package.platform')">
                <gokb-search-platform-field
                  v-model="packageItem.nominalPlatform"
                  :items="platformSelection"
                  :readonly="isReadonly"
                  return-object
                />
              </gokb-section>
            </v-col>
          </v-row>
        </v-stepper-content>

        <v-stepper-content :step="isEdit ? 3 : 2">
          <gokb-section :no-tool-bar="true">
            <v-row
              class="pt-4"
              dense
            >
              <v-col>
                <gokb-state-field
                  v-model="packageItem.scope"
                  :init-item="packageItem.scope"
                  width="100%"
                  message-path="component.package.scope"
                  url="refdata/categories/Package.Scope"
                  :label="$t('component.package.scope.label')"
                  :readonly="isReadonly"
                  dense
                />
              </v-col>
              <v-col>
                <gokb-state-field
                  v-model="packageItem.contentType"
                  :init-item="packageItem.contentType"
                  width="100%"
                  message-path="component.package.contentType"
                  url="refdata/categories/Package.ContentType"
                  :label="$t('component.package.contentType.label')"
                  :readonly="isReadonly"
                  dense
                />
              </v-col>
              <v-col>
                <gokb-state-field
                  v-if="!!id"
                  v-model="packageItem.editStatus"
                  :init-item="packageItem.editStatus"
                  message-path="component.general.editStatus"
                  url="refdata/categories/KBComponent.EditStatus"
                  width="100%"
                  :label="$t('component.general.editStatus.label')"
                  :readonly="isReadonly"
                  dense
                />
              </v-col>
              <v-col>
                <gokb-state-field
                  v-if="!!id"
                  v-model="packageItem.listStatus"
                  message-path="component.package.listStatus"
                  url="refdata/categories/Package.ListStatus"
                  width="100%"
                  :label="$t('component.package.listStatus.label')"
                  :readonly="isReadonly"
                  dense
                />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="7">
                <div>
                  <label for="validity">{{ $t('component.package.global.label') }}</label>
                </div>
                <gokb-radiobutton-group
                  id="validity"
                  v-model="packageItem.global"
                >
                  <gokb-radiobutton-field
                    value="Global"
                    :label="$t('component.package.global.Global.label')"
                    :readonly="isReadonly"
                  />
                  <gokb-radiobutton-field
                    value="Consortium"
                    :label="$t('component.package.global.Consortium.label')"
                    :readonly="isReadonly"
                  />
                  <gokb-radiobutton-field
                    value="Regional"
                    :label="$t('component.package.global.Regional.label')"
                    :readonly="isReadonly"
                  />
                  <gokb-radiobutton-field
                    value="Other"
                    :label="$t('component.package.global.Unknown.label')"
                    :readonly="isReadonly"
                  />
                  <gokb-radiobutton-field
                    value="Local"
                    :label="$t('component.package.global.Local.label')"
                    :readonly="isReadonly"
                  />
                </gokb-radiobutton-group>
              </v-col>
              <v-col cols="1">
                <v-icon
                  v-if="packageItem.global === 'Consortium' || packageItem.global === 'Regional' || packageItem.global === 'Other' || packageItem.global === 'Local'"
                  class="mt-6"
                >
                  mdi-chevron-triple-right
                </v-icon>
              </v-col>
              <v-col cols="4">
                <gokb-text-field
                  v-if="packageItem.global === 'Consortium' || packageItem.global === 'Regional' || packageItem.global === 'Other' || packageItem.global === 'Local'"
                  v-model="packageItem.globalNote"
                  :label="$t('component.package.globalNote.label')"
                  :disabled="isReadonly"
                />
              </v-col>
            </v-row>
            <v-row>
              <gokb-checkbox-field
                v-model="packageItem.consistent"
                class="ml-3"
                :label="$t('component.package.consistent')"
                :readonly="isReadonly"
              />
              <gokb-checkbox-field
                v-model="packageItem.breakable"
                class="ml-3"
                :label="$t('component.package.breakable')"
                :readonly="isReadonly"
              />
              <gokb-checkbox-field
                v-model="packageItem.fixed"
                class="ml-3"
                :label="$t('component.package.fixed')"
                :readonly="isReadonly"
              />
            </v-row>
          </gokb-section>
          <v-row>
            <v-col
              cols="12"
              xl="6"
            >
              <gokb-identifier-section
                v-model="packageItem.ids"
                target-type="Package"
                :disabled="isReadonly"
              />
            </v-col>
            <v-col
              cols="12"
              xl="6"
            >
              <gokb-alternate-names-section
                v-model="allNames.alts"
                :disabled="isReadonly"
              />
            </v-col>
          </v-row>
        </v-stepper-content>

        <v-stepper-content :step="isEdit ? 4 : 3">
          <v-row v-if="kbart && kbart.selectedFile">
            <v-col>
              <v-chip
                class="ml-6"
                close
                @click:close="kbart = undefined"
              >
                {{ kbart.selectedFile.name }} ({{ kbart.lineCount }} {{ $tc('kbart.row.label', kbart.lineCount) }})
              </v-chip>
            </v-col>
          </v-row>
          <gokb-tipps-section
            ref="tipps"
            :pkg="parseInt(id)"
            :expanded="isEdit"
            :platform="packageItem.nominalPlatform"
            :default-title-namespace="providerTitleNamespace"
            :disabled="isReadonly"
            @kbart="setKbart"
            @update="updateNewTipps"
          />
          <gokb-source-field
            v-if="loggedIn"
            ref="source"
            v-model="sourceItem"
            :default-title-namespace="providerTitleNamespace"
            :expanded="false"
            :readonly="isReadonly"
            @enable="triggerUpdate"
          />
        </v-stepper-content>

        <v-stepper-content :step="isEdit ? 1 : 4">
          <gokb-section :no-tool-bar="true">
            <v-row>
              <v-col>
                <gokb-name-field
                  v-model="allNames"
                  dense
                  readonly
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <gokb-state-select-field
                  v-if="packageItem.status"
                  v-model="packageItem.status"
                  dense
                  :deletable="!!deleteUrl"
                  :editable="!!updateUrl"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <gokb-text-field
                  v-model="providerName"
                  :label="$t('component.package.provider')"
                  dense
                  disabled
                />
              </v-col>
              <v-col>
                <gokb-text-field
                  v-model="platformName"
                  :label="$t('component.package.platform')"
                  dense
                  disabled
                />
              </v-col>
            </v-row>
            <v-row v-if="packageItem.description">
              <v-col>
                <gokb-textarea-field
                  v-model="packageItem.description"
                  :label="$t('component.package.description')"
                  dense
                  disabled
                />
              </v-col>
            </v-row>
            <v-row v-if="id">
              <v-col cols="3">
                <gokb-state-field
                  v-model="packageItem.contentType"
                  :init-item="packageItem.contentType"
                  message-path="component.package.contentType"
                  url="refdata/categories/Package.ContentType"
                  :label="$t('component.package.contentType.label')"
                  dense
                  readonly
                />
              </v-col>
              <v-col cols="2">
                <gokb-number-field
                  :value="totalNumberOfTitles"
                  :label="$tc('component.tipp.label', 2)"
                  dense
                  disabled
                />
              </v-col>
              <v-col cols="3">
                <gokb-state-field
                  v-model="packageItem.listStatus"
                  :init-item="packageItem.listStatus"
                  message-path="component.package.listStatus"
                  url="refdata/categories/Package.ListStatus"
                  :label="$t('component.package.listStatus.label')"
                  dense
                  readonly
                />
              </v-col>
              <v-col>
                <gokb-text-field
                  v-if="listVerifiedDate"
                  v-model="localListVerifiedDate"
                  :label="$t('component.package.listVerifiedDate.label')"
                  dense
                  disabled
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col v-if="kbart && kbart.selectedFile">
                <gokb-text-field
                  v-model="kbart.selectedFile.name"
                  label="KBART"
                  dense
                  disabled
                />
              </v-col>
            </v-row>
          </gokb-section>
          <gokb-section
            v-if="maintenance"
            :sub-title="$tc('component.maintenance.label', 2)"
          >
            <gokb-maintenance-cycle-field v-model="maintenanceCycle" />
            <gokb-date-field
              v-model="dueTo"
              label="Fällig am"
              disabled
            />
          </gokb-section>
          <v-row>
            <v-col
              cols="12"
              xl="4"
            >
              <gokb-curatory-group-section
                v-model="allCuratoryGroups"
                :disabled="isReadonly"
                :expandable="false"
                :sub-title="$tc('component.curatoryGroup.label', 2)"
              />
            </v-col>
            <v-col
              cols="12"
              xl="8"
            >
              <gokb-reviews-section
                v-if="id && isContrib"
                :expandable="false"
                :review-component="packageItem"
              />
            </v-col>
          </v-row>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <template #buttons>
      <gokb-confirmation-popup
        v-model="showSubmitConfirm"
        :message="submitConfirmationMessage"
        @confirmed="createPackage"
      />
      <gokb-button
        v-if="!isReadonly"
        @click="reload"
      >
        {{ $t('btn.reset') }}
      </gokb-button>
      <gokb-button
        v-show="step !== 1"
        @click="go2PreviousStep"
      >
        {{ $t('btn.back') }}
      </gokb-button>
      <v-spacer />
      <div v-if="id && !notFound">
        <v-chip
          class="ma-1"
          label
        >
          <v-icon
            :title="$t('component.general.dateCreated')"
            class="pb-1"
            medium
          >
            mdi-file-plus-outline
          </v-icon>
          <span class="ml-1">{{ localDateCreated }}</span>
        </v-chip>
        <v-chip
          class="ma-1"
          label
        >
          <v-icon
            :title="$t('component.general.lastUpdated')"
            class="pb-1"
            label
            medium
          >
            mdi-refresh
          </v-icon>
          <span class="ml-1">{{ localLastUpdated }}</span>
        </v-chip>
      </div>
      <v-spacer />
      <gokb-button
        v-if="!isInLastStep"
        color="accent"
        :disabled="!valid"
        @click="go2NextStep"
      >
        {{ $t('btn.next') }}
      </gokb-button>
      <!-- without key, submit is executed on previous page -->
      <gokb-button
        v-else-if="!isReadonly"
        key="add"
        :disabled="!valid"
        default
      >
        {{ $i18n.t('btn.submit') }}
      </gokb-button>
    </template>
  </gokb-page>
  <gokb-page
    v-else
    title=""
  >
    <v-card>
      <v-card-text>
        <div class="text-h4 primary--text">
          {{ $t('component.general.notFound', [$tc('component.title.label')]) }}
        </div>
      </v-card-text>
    </v-card>
  </gokb-page>
</template>

<script>
  import utils from '@/shared/utils/utils'
  import accountModel from '@/shared/models/account-model'
  import BaseComponent from '@/shared/components/base-component'
  import GokbSearchOrganisationField from '@/shared/components/simple/gokb-search-organisation-field'
  import GokbSearchPlatformField from '@/shared/components/simple/gokb-search-platform-field'
  import GokbUrlField from '@/shared/components/simple/gokb-url-field'
  import GokbSourceField from '@/shared/components/complex/gokb-source-field'
  import GokbMaintenanceCycleField from '@/shared/components/simple/gokb-maintenance-cycle-field'
  import GokbIdentifierSection from '@/shared/components/complex/gokb-identifier-section'
  import GokbAlternateNamesSection from '@/shared/components/complex/gokb-alternate-names-section'
  import GokbCuratoryGroupSection from '@/shared/components/complex/gokb-curatory-group-section'
  import GokbDateField from '@/shared/components/complex/gokb-date-field'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import { HOME_ROUTE } from '@/router/route-paths'
  import packageServices from '@/shared/services/package-services'
  import providerServices from '@/shared/services/provider-services'
  import sourceServices from '@/shared/services/source-services'
  import baseServices from '@/shared/services/base-services'
  import profileServices from '@/shared/services/profile-services'
  import loading from '@/shared/models/loading'
  import axios from 'axios'

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
      GokbUrlField,
      GokbSourceField,
      GokbCuratoryGroupSection,
      GokbMaintenanceCycleField,
      GokbAlternateNamesSection,
      GokbConfirmationPopup
    },
    extends: BaseComponent,
    props: {
      id: {
        type: [Number, String],
        required: false,
        default: undefined
      },
      maintenance: {
        type: Boolean,
        required: false,
        default: false
      },
      kbartStatus: {
        type: String,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        valid: undefined,
        step: 1,
        notFound: false,
        version: undefined,
        isCurator: false,
        showSubmitConfirm: false,
        submitConfirmationMessage: undefined,
        urlUpdate: false,
        currentName: undefined,
        lastUpdated: undefined,
        listVerifiedDate: undefined,
        dateCreated: undefined,
        providerTitleNamespace: undefined,
        newTipps: [],
        packageItem: {
          id: undefined,
          name: undefined,
          source: undefined,
          type: 'package',
          status: undefined,
          descriptionUrl: undefined,
          description: undefined,
          scope: undefined,
          global: undefined,
          globalNote: undefined,
          contentType: undefined,
          consistent: undefined,
          breakable: undefined,
          fixed: undefined,
          listStatus: undefined,
          editStatus: undefined,
          ids: [],
          provider: undefined, // organisation
          nominalPlatform: undefined,
        },
        allCuratoryGroups: [],
        userCuratoryGroups: [],
        sourceItem: undefined,
        packageTypes: [
          { id: 'book', text: 'Buch' },
          { id: 'database', text: 'Datenbank' },
          { id: 'journal', text: 'Journal' },
          { id: 'mixed', text: 'Gemischt' },
        ],
        successMsg: undefined,
        kbartResult: undefined,
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
        titleCount: 0,
        maintenanceCycle: undefined,
        updateUrl: undefined,
        deleteUrl: undefined,
        kbart: undefined
      }
    },
    computed: {
      title () {
        return this.$i18n.t(this.titleCode, [this.$i18n.tc('component.package.label')])
      },
      subTitle () {
        return this.currentName
      },
      titleCode () {
        return this.isEdit ? (this.updateUrl ? 'header.edit.label' : 'header.show.label') : 'header.create.label'
      },
      isEdit () {
        return !!this.id
      },
      isReadonly () {
        return !this.loggedIn || (this.isEdit && !this.updateUrl) || (!this.isEdit && !accountModel.hasRole('ROLE_EDITOR'))
      },
      isContrib () {
        return this.loggedIn && accountModel.hasRole('ROLE_CONTRIBUTOR')
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
        return accountModel.loggedIn()
      },
      localDateCreated () {
        return this.dateCreated ? new Date(this.dateCreated).toLocaleString(this.$i18n.locale, { timeZone: 'UTC' }) : ''
      },
      localLastUpdated () {
        return this.lastUpdated ? new Date(this.lastUpdated).toLocaleString(this.$i18n.locale, { timeZone: 'UTC' }) : ''
      },
      localListVerifiedDate () {
        return this.listVerifiedDate ? new Date(this.listVerifiedDate).toISOString().substr(0, 10) : ''
      },
      localSuccessMessage () {
        return this.successMsg ? this.$i18n.t(this.successMsg, [this.$i18n.tc('component.package.label'), this.packageItem.name]) : undefined
      }
    },
    watch: {
      loggedIn (value) {
        if (value) {
          this.reload()
        }
      },
      '$i18n.locale' (l) {
        if (this.isEdit) {
          document.title = this.$i18n.tc('component.package.label') + ' – ' + this.allNames.name
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
      cancelPackage () {
        this.$router.push(HOME_ROUTE)
      },
      updateNewTipps (tipps) {
        this.newTipps = tipps
      },
      setKbart (options) {
        this.kbart = options

        if (!this.sourceItem) {
          this.sourceItem = {
            name: undefined,
            menu: false,
            update: false,
            url: undefined,
            ezbMatch: false,
            zdbMatch: false,
            automaticUpdates: false,
            targetNamespace: options.selectedNamespace,
            duration: undefined,
            unit: undefined,
          }
        }
      },
      showCreatePackageConfirm (form) {
        this.valid = form.validate()

        if (this.valid) {
          if (this.kbart?.selectedFile) {
            this.submitConfirmationMessage = { text: 'component.package.navigation.confirm.kbartLocal.label', vars: [this.allNames.name, this.kbart.selectedFile.name] }
          } else if (this.urlUpdate) {
            this.submitConfirmationMessage = { text: 'component.package.navigation.confirm.sourceUpdate.label', vars: [this.allNames.name, this.sourceItem.url] }
          } else {
            this.submitConfirmationMessage = { text: 'component.package.navigation.confirm.noTipps.label', vars: [this.allNames.name] }
          }
          this.showSubmitConfirm = true
        }
      },
      async createPackage () {
        loading.startLoading()
        var isUpdate = !!this.id
        this.successMsg = undefined
        this.kbartResult = undefined

        if (this.valid) {
          if (this.sourceItem) {
            var sourceItem = this.sourceItem

            if (sourceItem.name !== this.allNames.name) {
              sourceItem.name = this.allNames.name
            }

            if (this.sourceItem?.update) {
              this.urlUpdate = true
            }

            const sourceReponse = await this.catchError({
              promise: sourceServices.createOrUpdateSource(sourceItem, this.cancelToken.token),
              instance: this
            })

            if (sourceReponse.status < 400) {
              this.packageItem.source = sourceReponse.data
              this.sourceItem = sourceReponse.data
            }
          }

          const newPackage = {
            ...this.packageItem,
            id: this.id,
            ...(this.newTipps.length > 0 ? { tipps: this.newTipps } : {}),
            name: this.allNames.name,
            variantNames: this.allAlternateNames,
            curatoryGroups: this.allCuratoryGroups,
            ids: this.packageItem.ids.map(id => ({ value: id.value, type: id.namespace })),
            breakable: utils.asYesNo(this.packageItem.breakable),
            consistent: utils.asYesNo(this.packageItem.consistent),
            fixed: utils.asYesNo(this.packageItem.fixed),
            nominalPlatform: this.packageItem.nominalPlatform?.id,
            provider: this.packageItem.provider?.id,
          }

          if (this.kbart || this.urlUpdate) {
            newPackage.generateToken = true
          }

          const response = await this.catchError({
            promise: packageServices.createOrUpdatePackage(newPackage, this.cancelToken.token),
            instance: this
          })

          if (response.status < 400) {
            this.successMsg = this.isEdit ? 'success.update' : 'success.create'

            if (this.kbart || this.urlUpdate) {
              const namespace = (this.kbart?.selectedNamespace?.value ? { titleIdNamespace: this.kbart?.selectedNamespace?.value } : {})
              var pars = {
                processOption: 'kbart',
                ...namespace,
                pkgId: response.data.id
              }

              if (this.kbart) {
                pars.addOnly = this.kbart.addOnly ? 'true' : 'false'
                pars.localFile = 'true'
              } else if (this.urlUpdate) {
                pars.urlUpdate = 'true'
              }

              if (response.data.updateToken) {
                pars.updateToken = response.data.updateToken
              }

              const file = this.kbart?.selectedFile || null

              const ygorResponse = await this.catchError({
                promise: this.sendKbartUpdateRquest(pars, file),
                instance: this
              })

              if (ygorResponse?.status === 'STARTED') {
                const ygorJobStatusResponse = await this.catchError({
                  promise: this.getYgorJobStatus(ygorResponse.jobId),
                  instance: this
                })

                console.log(ygorJobStatusResponse.status)

                if (ygorJobStatusResponse.status === 400) {
                  this.kbartResult = 'error'
                } else {
                  this.kbartResult = 'success'
                }

                this.kbart = undefined
                loading.stopLoading()

                if (isUpdate) {
                  this.step = 1
                  this.reload()
                } else {
                  this.$router.push({ path: '/package/', props: { id: response.data?.id, kbartStatus: this.kbartResult } })
                }
              } else {
                loading.stopLoading()
                this.kbartResult = 'error'
              }
            } else {
              loading.stopLoading()
              if (isUpdate) {
                this.step = 1
                this.reload()
              } else {
                this.$router.push('/package/' + response.data?.id)
              }
            }
          } else {
            console.log('GOKb status: ' + response.status)
          }
        }
      },
      async reload () {
        if (this.isEdit) {
          loading.startLoading()
          this.newTipps = []
          const result = await this.catchError({
            promise: packageServices.getPackage(this.id, this.cancelToken.token),
            instance: this
          })

          if (result.status === 200) {
            const data = result.data
            this.packageItem.id = data.id

            if (!this.id) {
              this.id = data.id
            }
            this.currentName = data.name
            this.packageItem.name = data.name
            this.packageItem.source = data.source
            this.packageItem.status = data.status
            this.packageItem.descriptionUrl = data.descriptionUrl
            this.packageItem.description = data.description
            this.packageItem.scope = data.scope
            this.packageItem.global = data.global?.name
            this.packageItem.globalNote = data.globalNote
            this.packageItem.consistent = data.consistent?.name === 'Yes'
            this.packageItem.breakable = data.breakable?.name === 'Yes'
            this.packageItem.fixed = data.fixed?.name === 'Yes'
            this.packageItem.provider = data.provider
            this.packageItem.nominalPlatform = data.nominalPlatform
            this.packageItem.contentType = data.contentType
            this.packageItem.listStatus = data.listStatus
            this.packageItem.editStatus = data.editStatus
            this.version = data.version
            this.packageItem.ids = data._embedded.ids.map(({ id, value, namespace }) => ({ id, value, namespace: namespace.value, nslabel: namespace.name || namespace.value, isDeletable: !!this.updateUrl }))
            this.allAlternateNames = data._embedded.variantNames.map(({ variantName, id }) => ({ id, variantName, isDeletable: !!this.updateUrl }))
            this.allCuratoryGroups = data._embedded.curatoryGroups.map(({ name, id }) => ({ id, name, isDeletable: !!this.updateUrl }))
            this.reviewRequests = data._embedded.reviewRequests
            this.updateUrl = data._links?.update?.href || null
            this.deleteUrl = data._links?.delete?.href || null
            this.providerSelect = data.provider
            this.platformSelect = data.nominalPlatform
            this.titleCount = data._tippCount
            this.allNames = { name: data.name, alts: this.allAlternateNames }
            this.listVerifiedDate = data.listVerifiedDate
            if (data.source && this.$refs.source) {
              this.sourceItem = data.source
              this.$refs.source.fetch(data.source.id)
            }
            this.lastUpdated = data.lastUpdated
            this.dateCreated = data.dateCreated

            document.title = this.$i18n.tc('component.package.label') + ' – ' + data.name
          } else {
            this.notFound = true
          }

          if (this.providerSelect) {
            const providerResult = await this.catchError({
              promise: providerServices.getProvider(this.providerSelect.id, this.cancelToken.token),
              instance: this
            })

            if (providerResult?.status === 200) {
              const fullProvider = providerResult.data

              if (fullProvider.titleNamespace) {
                this.providerTitleNamespace = fullProvider.titleNamespace
              }
            }
          }

          loading.stopLoading()
        } else {
          if (this.loggedIn) {
            this.loadUserGroups()
          }
        }
      },
      async sendKbartUpdateRquest (parameters, file) {
        const urlParameters = baseServices.createQueryParameters(parameters)
        const data = new FormData()

        if (file) {
          data.append('uploadFile', file)
        }

        const url = process.env.VUE_APP_YGOR_BASE_URL + `/enrichment/processGokbPackage?${urlParameters}`

        const resp = await axios.post(url, data).then(response => response.data)
        console.log(resp)

        return resp
      },
      async getYgorJobStatus (jobId) {
        const url = process.env.VUE_APP_YGOR_BASE_URL + `/enrichment/getStatus?jobId=${jobId}`
        let resp = {}
        let status = 'PREPARATION'

        while (status === 'PREPARATION') {
          resp = await axios.get(url).then(response => response.data)
          status = resp.status
        }

        return resp
      },
      async loadUserGroups () {
        const {
          data: {
            data: {
              curatoryGroups
            }
          }
        } = await this.catchError({
          promise: profileServices.getProfile(this.cancelToken.token),
          instance: this
        })
        this.allCuratoryGroups = curatoryGroups
      },
      triggerUpdate (checked) {
        this.urlUpdate = checked
      }
    }
  }
</script>
