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
          <gokb-section
            :title="$t('component.general.general')"
          >
            <gokb-name-field
              v-model="allNames"
              :disabled="isReadonly"
            />
            <gokb-url-field
              v-model="packageItem.descriptionUrl"
              :disabled="isReadonly"
            />
            <gokb-textarea-field
              v-model="packageItem.description"
              :label="$t('component.package.description')"
              :disabled="isReadonly"
            />
            <gokb-state-field
              v-model="packageItem.scope"
              :init-item="packageItem.scope"
              message-path="component.package.scope"
              url="refdata/categories/Package.Scope"
              :label="$t('component.package.scope.label')"
              :readonly="isReadonly"
            />
            <gokb-state-field
              v-model="packageItem.contentType"
              :init-item="packageItem.contentType"
              message-path="component.package.contentType"
              url="refdata/categories/Package.ContentType"
              :label="$t('component.package.contentType.label')"
              :readonly="isReadonly"
            />
            <gokb-radiobutton-group v-model="packageItem.global">
              <gokb-radiobutton-field
                value="Consortium"
                :label="$t('component.package.global.Consortial')"
                :readonly="isReadonly"
              />
              <gokb-radiobutton-field
                value="Global"
                :label="$t('component.package.global.Global')"
                :readonly="isReadonly"
              />
              <gokb-radiobutton-field
                value="Regional"
                :label="$t('component.package.global.Regional')"
                :readonly="isReadonly"
              />
              <gokb-radiobutton-field
                value="Other"
                :label="$t('component.package.global.Unknown')"
                :readonly="isReadonly"
              />
            </gokb-radiobutton-group>
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
        </v-stepper-content>

        <v-stepper-content :step="isEdit ? 3 : 2">
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
          <gokb-identifier-section
            v-model="packageItem.ids"
            :disabled="isReadonly"
          />
          <gokb-alternate-names-section
            v-model="allNames.alts"
            :disabled="isReadonly"
          />
        </v-stepper-content>

        <v-stepper-content :step="isEdit ? 4 : 3">
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
            :readonly="isReadonly"
          />
        </v-stepper-content>

        <v-stepper-content :step="isEdit ? 1 : 4">
          <gokb-section :sub-title="$t('component.package.navigation.step4')">
            <v-row>
              <v-col>
                <gokb-name-field
                  v-model="allNames"
                  readonly
                />
              </v-col>
            </v-row>
            <v-row v-if="status">
              <v-col>
                <gokb-state-select-field
                  v-model="status"
                  :deletable="!!deleteUrl"
                  :editable="!!updateUrl"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <gokb-text-field
                  v-model="packageItem.description"
                  :label="$t('component.package.description')"
                  disabled
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <gokb-text-field
                  v-model="platformName"
                  :label="$t('component.package.platform')"
                  disabled
                />
              </v-col>
              <v-col>
                <gokb-state-field
                  v-model="packageItem.contentType"
                  :init-item="packageItem.contentType"
                  message-path="component.package.contentType"
                  url="refdata/categories/Package.ContentType"
                  :label="$t('component.package.contentType.label')"
                  readonly
                />
              </v-col>
              <v-col v-if="status">
                <gokb-number-field
                  :value="totalNumberOfTitles"
                  :label="$tc('component.tipp.label', 2)"
                  disabled
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col v-if="kbart && !status">
                <gokb-text-field
                  v-model="kbart.selectedFile.name"
                  label="KBART"
                  disabled
                />
              </v-col>
            </v-row>
            <gokb-text-field
              v-model="providerName"
              :label="$t('component.package.provider')"
              disabled
            />
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
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <template #buttons>
      <gokb-button
        v-if="!isReadonly"
        text
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
  import kbartServices from '@/shared/services/kbart-services'
  import tokenModel from '@/shared/models/token-model'

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
        status: undefined,
        version: undefined,
        urlUpdate: false,
        currentName: undefined,
        newTipps: [],
        packageItem: {
          name: undefined,
          source: undefined,
          descriptionUrl: undefined,
          description: undefined,
          scope: undefined,
          global: undefined,
          contentType: undefined,
          consistent: undefined,
          breakable: undefined,
          fixed: undefined,
          ids: [],
          provider: undefined, // organisation
          nominalPlatform: undefined,
        },
        allCuratoryGroups: [],
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
        return accountModel.loggedIn()
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
          if (this.packageItem.source) {
            var sourceItem = this.sourceItem

            if (!sourceItem.name) {
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
            if ((this.kbart || this.urlUpdate) && response.data.pkgId) {
              const pars = {
                addOnly: this.kbart.addOnly,
                authToken: tokenModel.getToken(),
                processOption: 'kbart',
                titleIdNamespace: this.kbart.selectedNamespace,
                pkgNominalPlatform: this.packageItem.nominalPlatform.id,
                pkgId: response.data.pkgId,
                pkgTitle: this.packageItem.name
              }

              if (this.urlUpdate) {
                pars.urlUpdate = 'true'
              }

              if (response.data.updateToken) {
                pars.updateToken = response.data.updateToken
              }

              const ygorResponse = await this.catchError({
                promise: kbartServices.upload(this.kbart.selectedFile, pars, this.cancelToken.token),
                instance: this
              })

              if (ygorResponse.status === 200) {
                this.successMsg = this.isEdit
                  ? (this.$i18n.t('success.update', [this.$i18n.tc('component.package.label'), this.packageItem.name]) + ' ' + this.i18n.t('success.kbart'))
                  : (this.$i18n.t('success.create', [this.$i18n.tc('component.package.label'), this.packageItem.name]) + ' ' + this.i18n.t('success.kbart'))
              }
            } else {
              this.successMsg = this.isEdit
                ? this.$i18n.t('success.update', [this.$i18n.tc('component.package.label'), this.packageItem.name])
                : this.$i18n.t('success.create', [this.$i18n.tc('component.package.label'), this.packageItem.name])
              this.reload()
            }
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
              contentType,
              description,
              scope,
              global,
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
          this.packageItem.descriptionUrl = descriptionUrl
          this.packageItem.description = description
          this.packageItem.scope = scope
          this.packageItem.global = global?.name
          this.packageItem.consistent = consistent?.name === 'Yes'
          this.packageItem.breakable = breakable?.name === 'Yes'
          this.packageItem.fixed = fixed?.name === 'Yes'
          this.packageItem.provider = provider
          this.packageItem.nominalPlatform = nominalPlatform
          this.packageItem.contentType = contentType
          this.version = version
          this.packageItem.ids = ids.map(({ value, namespace: { name: namespace } }) => ({ value, namespace, isDeletable: !!updateUrl }))
          this.allAlternateNames = variantNames.map(({ variantName, id }) => ({ id, variantName, isDeletable: !!updateUrl }))
          this.allCuratoryGroups = curatoryGroups.map(({ name, id }) => ({ id, name, isDeletable: !!updateUrl }))
          this.updateUrl = updateUrl
          this.deleteUrl = deleteUrl
          this.providerSelect = provider
          this.platformSelect = nominalPlatform
          this.titleCount = _tippCount
          this.allNames = { name: name, alts: this.allAlternateNames }
          this.sourceItem = source
          this.status = status
        }
      }
    }
  }
</script>
