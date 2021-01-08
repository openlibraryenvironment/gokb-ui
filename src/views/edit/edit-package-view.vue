<template>
  <gokb-page
    :key="version"
    :title="title"
    :sub-title="subTitle"
    @valid="valid = $event"
    @submit="createPackage"
  >
    <gokb-error-component :value="error" />
    <span v-if="successMsg">
      <v-alert type="success">
        {{ isEdit ? $t('success.update', [$tc('component.package.label'), packageItem.name]) : $t('success.create', [$tc('component.package.label'), packageItem.name]) }}
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
          <gokb-section
            :sub-title="$t('component.package.provider')"
          >
            <gokb-search-organisation-field
              v-model="packageItem.provider"
              :items="providerSelection"
              :readonly="isReadonly"
              return-object
            />
          </gokb-section>
          <gokb-section :sub-title="$t('component.package.platform')">
            <gokb-search-platform-field
              v-model="packageItem.nominalPlatform"
              :items="platformSelection"
              :readonly="isReadonly"
              return-object
            />
          </gokb-section>
        </v-stepper-content>

        <v-stepper-content :step="isEdit ? 3 : 2">
          <gokb-section :no-tool-bar="true">
            <v-row>
              <v-col>
                <gokb-state-field
                  v-model="packageItem.scope"
                  :init-item="packageItem.scope"
                  width="100%"
                  message-path="component.package.scope"
                  url="refdata/categories/Package.Scope"
                  :label="$t('component.package.scope.label')"
                  :readonly="isReadonly"
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
                />
              </v-col>
              <v-col>
                <gokb-state-field
                  v-model="packageItem.editStatus"
                  :init-item="packageItem.editStatus"
                  message-path="component.general.editStatus"
                  url="refdata/categories/KBComponent.EditStatus"
                  width="100%"
                  :label="$t('component.general.editStatus.label')"
                  :readonly="isReadonly"
                />
              </v-col>
              <v-col>
                <gokb-state-field
                  v-model="packageItem.listStatus"
                  :init-item="packageItem.listStatus"
                  message-path="component.package.listStatus"
                  url="refdata/categories/Package.ListStatus"
                  width="100%"
                  :label="$t('component.package.listStatus.label')"
                  :readonly="isReadonly"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="7">
                <gokb-radiobutton-group
                  v-model="packageItem.global"
                  class="mt-4"
                >
                  <gokb-radiobutton-field
                    value="Global"
                    :label="$t('component.package.global.Global.label')"
                    :readonly="isReadonly"
                  />
                  <gokb-radiobutton-field
                    value="Consortium"
                    :label="$t('component.package.global.Consortial.label')"
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
                </gokb-radiobutton-group>
              </v-col>
              <v-col cols="1">
                <v-icon
                  v-if="packageItem.global === 'Consortium' || packageItem.global === 'Regional' || packageItem.global === 'Other'"
                  class="mt-4"
                >
                  mdi-chevron-triple-right
                </v-icon>
              </v-col>
              <v-col cols="4">
                <gokb-text-field
                  v-if="packageItem.global === 'Consortium' || packageItem.global === 'Regional' || packageItem.global === 'Other'"
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
          <gokb-identifier-section
            v-model="packageItem.ids"
            target-type="Package"
            :disabled="isReadonly"
          />
          <gokb-alternate-names-section
            v-model="allNames.alts"
            :disabled="isReadonly"
          />
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
            :pkg="parseInt(id)"
            :platform="packageItem.nominalPlatform"
            :disabled="isReadonly"
            @kbart="setKbart"
            @update="updateNewTipps"
          />
          <gokb-source-field
            v-if="loggedIn"
            v-model="sourceItem"
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
                  readonly
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <gokb-state-select-field
                  v-if="packageItem.status"
                  v-model="packageItem.status"
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
                  disabled
                />
              </v-col>
              <v-col>
                <gokb-text-field
                  v-model="platformName"
                  :label="$t('component.package.platform')"
                  disabled
                />
              </v-col>
            </v-row>
            <v-row v-if="packageItem.description">
              <v-col>
                <gokb-textarea-field
                  v-model="packageItem.description"
                  :label="$t('component.package.description')"
                  disabled
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <gokb-state-field
                  v-model="packageItem.contentType"
                  :init-item="packageItem.contentType"
                  message-path="component.package.contentType"
                  url="refdata/categories/Package.ContentType"
                  :label="$t('component.package.contentType.label')"
                  readonly
                />
              </v-col>
              <v-col
                v-if="packageItem.status"
                cols="2"
              >
                <gokb-number-field
                  :value="totalNumberOfTitles"
                  :label="$tc('component.tipp.label', 2)"
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
                  readonly
                />
              </v-col>
              <v-col>
                <gokb-text-field
                  v-if="listVerifiedDate"
                  v-model="localListVerifiedDate"
                  :label="$t('component.package.listVerifiedDate.label')"
                  disabled
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col v-if="kbart && kbart.selectedFile">
                <gokb-text-field
                  v-model="kbart.selectedFile.name"
                  label="KBART"
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
          <gokb-curatory-group-section
            v-model="allCuratoryGroups"
            :disabled="isReadonly"
            :sub-title="$tc('component.curatoryGroup.label', 2)"
          />
          <gokb-reviews-section
            v-if="id"
            :review-component="id"
          />
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <template #buttons>
      <gokb-button
        v-if="!isReadonly"
        @click="reload"
      >
        {{ $t('btn.cancel') }}
      </gokb-button>
      <gokb-button
        v-show="step !== 1"
        @click="go2PreviousStep"
      >
        {{ $t('btn.back') }}
      </gokb-button>
      <v-spacer />
      <div v-if="id">
        <v-chip
          class="ma-1"
          label
        >
          <v-icon
            :title="$t('component.general.dateCreated')"
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
  import { HOME_ROUTE } from '@/router/route-paths'
  import packageServices from '@/shared/services/package-services'
  import sourceServices from '@/shared/services/source-services'
  import baseServices from '@/shared/services/base-services'
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
      GokbAlternateNamesSection
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
      }
    },
    data () {
      return {
        valid: undefined,
        step: 1,
        version: undefined,
        isCurator: false,
        urlUpdate: false,
        currentName: undefined,
        lastUpdated: undefined,
        listVerifiedDate: undefined,
        dateCreated: undefined,
        newTipps: [],
        packageItem: {
          name: undefined,
          source: undefined,
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
        return this.dateCreated ? new Date(this.dateCreated).toLocaleString(this.$i18n.locale) : ''
      },
      localLastUpdated () {
        return this.lastUpdated ? new Date(this.lastUpdated).toLocaleString(this.$i18n.locale) : ''
      },
      localListVerifiedDate () {
        return this.listVerifiedDate ? new Date(this.listVerifiedDate).toLocaleString(this.$i18n.locale) : ''
      }
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
      cancelPackage () {
        this.$router.push(HOME_ROUTE)
      },
      updateNewTipps (tipps) {
        this.newTipps = tipps
      },
      setKbart (options) {
        this.kbart = options
      },
      async createPackage (form) {
        const valid = form.validate()

        if (valid) {
          if (this.sourceItem) {
            var sourceItem = this.sourceItem

            if (!sourceItem.name || sourceItem.name !== this.packageItem.name) {
              sourceItem.name = this.packageItem.name
            }

            const sourceReponse = await this.catchError({
              promise: sourceServices.createOrUpdateSource(sourceItem, this.cancelToken.token),
              instance: this
            })

            if (sourceReponse.status < 400) {
              this.packageItem.source = sourceReponse.data
            } else {
              console.log('Source update failed!')
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
            this.id = response.data?.id

            if (this.kbart && response.data?.id) {
              const namespace = (this.kbart?.selectedNamespace?.name ? { titleIdNamespace: this.kbart?.selectedNamespace?.name } : {})
              const pars = {
                addOnly: this.kbart.addOnly,
                processOption: 'kbart',
                ...namespace,
                pkgNominalPlatformId: this.packageItem.nominalPlatform.id,
                pkgId: response.data.id
              }

              if (this.urlUpdate) {
                pars.urlUpdate = 'true'
              }

              if (response.data.updateToken) {
                pars.updateToken = response.data.updateToken
              }

              const ygorResponse = await this.catchError({
                promise: this.sendKbart(this.kbart.selectedFile, pars),
                instance: this
              })

              console.log(ygorResponse)

              this.successMsg = this.isEdit
                ? this.$i18n.t('success.update', [this.$i18n.tc('component.package.label'), this.packageItem.name]) + ' ' + this.i18n.t('success.kbart')
                : this.$i18n.t('success.create', [this.$i18n.tc('component.package.label'), this.packageItem.name]) + ' ' + this.i18n.t('success.kbart')
            } else if (this.urlUpdate && response.data?.id) {
              const ygorResponse = await this.catchError({
                promise: this.sendUrlUpdateRquest(response.data.id, response.data.updateToken),
                instance: this
              })

              if (ygorResponse?.status < 400) {
                this.successMsg = this.isEdit
                  ? (this.$i18n.t('success.update', [this.$i18n.tc('component.package.label'), this.packageItem.name]) + ' ' + this.i18n.t('success.kbart'))
                  : (this.$i18n.t('success.create', [this.$i18n.tc('component.package.label'), this.packageItem.name]) + ' ' + this.i18n.t('success.kbart'))
              }
              this.reload()
              this.step = 1
            } else {
              this.successMsg = this.isEdit
                ? this.$i18n.t('success.update', [this.$i18n.tc('component.package.label'), this.packageItem.name])
                : this.$i18n.t('success.create', [this.$i18n.tc('component.package.label'), this.packageItem.name])
              this.reload()
              this.step = 1
            }
          } else {
            console.log('GOKb status: ' + response.status)
          }
        }
      },
      async reload () {
        if (this.isEdit) {
          loading.startLoading()
          const {
            data: {
              name,
              source,
              descriptionUrl,
              contentType,
              description,
              lastUpdated,
              listStatus,
              listVerifiedDate,
              editStatus,
              dateCreated,
              scope,
              global,
              globalNote,
              status,
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
                update: { href: updateUrl },
                delete: { href: deleteUrl }
              }
            }
          } = await this.catchError({
            promise: packageServices.getPackage(this.id, this.cancelToken.token),
            instance: this
          })
          this.currentName = name
          this.packageItem.name = name
          this.packageItem.source = source
          this.packageItem.status = status
          this.packageItem.descriptionUrl = descriptionUrl
          this.packageItem.description = description
          this.packageItem.scope = scope
          this.packageItem.global = global?.name
          this.packageItem.globalNote = globalNote
          this.packageItem.consistent = consistent?.name === 'Yes'
          this.packageItem.breakable = breakable?.name === 'Yes'
          this.packageItem.fixed = fixed?.name === 'Yes'
          this.packageItem.provider = provider
          this.packageItem.nominalPlatform = nominalPlatform
          this.packageItem.contentType = contentType
          this.packageItem.listStatus = listStatus
          this.packageItem.editStatus = editStatus
          this.version = version
          this.packageItem.ids = ids.map(({ id, value, namespace }) => ({ id, value, namespace: namespace.value, nslabel: namespace.name || namespace.value, isDeletable: !!updateUrl }))
          this.allAlternateNames = variantNames.map(({ variantName, id }) => ({ id, variantName, isDeletable: !!updateUrl }))
          this.allCuratoryGroups = curatoryGroups.map(({ name, id }) => ({ id, name, isDeletable: !!updateUrl }))
          this.updateUrl = updateUrl
          this.deleteUrl = deleteUrl
          this.providerSelect = provider
          this.platformSelect = nominalPlatform
          this.titleCount = _tippCount
          this.allNames = { name: name, alts: this.allAlternateNames }
          this.sourceItem = source
          this.listVerifiedDate = listVerifiedDate
          this.lastUpdated = lastUpdated
          this.dateCreated = dateCreated
        }
        loading.stopLoading()
      },
      async sendKbart (file, parameters) {
        loading.startLoading()
        const urlParameters = baseServices.createQueryParameters(parameters)
        const data = new FormData()
        console.log(data)

        data.append('uploadFile', file)

        for (var pair of data.entries()) {
          console.log(pair[0])
          console.log(pair[1])
        }

        const url = process.env.VUE_APP_YGOR_BASE_URL + `/enrichment/processCompleteWithToken?${urlParameters}`

        axios.post(url, data)
          .then(response => {
            this.successMsg = this.isEdit
              ? this.$i18n.t('success.update', [this.$i18n.tc('component.package.label'), this.packageItem.name]) + ' ' + this.i18n.t('success.kbart')
              : this.$i18n.t('success.create', [this.$i18n.tc('component.package.label'), this.packageItem.name]) + ' ' + this.i18n.t('success.kbart')
          })
          .catch(error => {
            this.error = error
          })
        loading.stopLoading()
      },
      async sendUrlUpdateRquest (pkgId, updateToken) {
        loading.startLoading()
        const url = process.env.VUE_APP_YGOR_BASE_URL + `/enrichment/processGokbPackage?pkgId=${pkgId}&updateToken=${updateToken}`

        axios.get(url)
          .then(response => {
            this.successMsg = this.isEdit
              ? this.$i18n.t('success.update', [this.$i18n.tc('component.package.label'), this.packageItem.name]) + ' ' + this.i18n.t('success.kbart')
              : this.$i18n.t('success.create', [this.$i18n.tc('component.package.label'), this.packageItem.name]) + ' ' + this.i18n.t('success.kbart')
          })
          .catch(error => {
            this.error = error
          })
        loading.stopLoading()
      },
      triggerUpdate (checked) {
        this.urlUpdate = checked
      }
    }
  }
</script>
