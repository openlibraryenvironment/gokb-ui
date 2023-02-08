<template>
  <gokb-page
    v-if="accessible && !notFound"
    :key="version"
    :title="title"
    :sub-title="subTitle"
    @submit="showCreatePackageConfirm"
  >
    <gokb-error-component :value="error" />
    <v-snackbars ref="snackbars" :objects.sync="eventMessages"></v-snackbars>
    <span v-if="importJob?.result === 'success'">
      <v-alert
        type="success"
        dismissible
      >
        {{ importJob.dryRun ? $t('kbart.dryRun.success') : $t('kbart.transmission.success') }}
        <gokb-button class="ml-2" style="margin-top:-2px;" :label="$t('kbart.transmission.showResults')" @click="showJobPopup(importJob.id)">{{ $t('kbart.transmission.showResults') }}</gokb-button>
      </v-alert>
    </span>
    <span v-if="importJob?.result === 'error'">
      <v-alert
        type="error"
        dismissible
      >
        {{ $t('kbart.transmission.error.processing') }}
        <gokb-button class="ml-2" style="margin-top:-2px;" :label="$t('kbart.transmission.showResults')" @click="showJobPopup(importJob.id)">{{ $t('kbart.transmission.showResults') }}</gokb-button>
      </v-alert>
    </span>
    <span v-if="importJob?.result === 'warn'">
      <v-alert
        type="warning"
        dismissible
      >
        {{ $t('kbart.transmission.warn.skipped') }}
        <gokb-button class="ml-2" style="margin-top:-2px;" :label="$t('kbart.transmission.showResults')" @click="showJobPopup(importJob.id)">{{ $t('kbart.transmission.showResults') }}</gokb-button>
      </v-alert>
    </span>
    <span v-else-if="importJob?.result === 'info'">
      <v-alert
        type="info"
        dismissible
      >
        <span>
          {{ importJob.dryRun ? $t('kbart.dryRun.started') : $t('kbart.transmission.started') }} {{ '(' + importJob.progress + '%)' }}
          <v-progress-linear
            v-if="!!importJob.progress"
            v-model="importJob.progress"
          />
          <div v-else>
            {{ $t('kbart.transmission.preparing') }}
          </div>
        </span>
      </v-alert>
    </span>
    <span v-if="matchingJob?.result === 'success'">
      <v-alert
        type="success"
        dismissible
      >
        {{ $t('kbart.titleMatch.success') }}
        <gokb-button class="ml-2" style="margin-top:-2px;" :label="$t('kbart.transmission.showResults')" @click="showJobPopup(matchingJob.id)">{{ $t('kbart.transmission.showResults') }}</gokb-button>
      </v-alert>
    </span>
    <span v-if="matchingJob?.result === 'error'">
      <v-alert
        type="error"
        dismissible
      >
        {{ $t(matchingJob.messageCode) }}
        <gokb-button class="ml-2" style="margin-top:-2px;" :label="$t('kbart.transmission.showResults')" @click="showJobPopup(matchingJob.id)">{{ $t('kbart.transmission.showResults') }}</gokb-button>
      </v-alert>
    </span>
    <span v-else-if="matchingJob?.result === 'info'">
      <v-alert
        type="info"
        dismissible
      >
        <span>
          {{ $t('kbart.titleMatch.started') }} {{ '(' + matchingJob.progress + '%)' }}
          <v-progress-linear
            v-if="!!matchingJob.progress"
            v-model="matchingJob.progress"
          />
          <div v-else>
            {{ $t('kbart.transmission.preparing') }}
          </div>
        </span>
      </v-alert>
    </span>
    <gokb-edit-job-popup
      v-if="editJobPopupVisible"
      v-model="editJobPopupVisible"
      :selected="selectedJob"
    />
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
          :editable="currentStepValid"
          :class="{ error: !!step2Error }"
          :step="2"
        >
          {{ isEdit ? $t('component.package.navigation.step1') : $t('component.package.navigation.step2') }}
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          :editable="currentStepValid"
          :class="{ error: !!step3Error }"
          :step="3"
        >
          {{ isEdit ? $t('component.package.navigation.step2') : $t('component.package.navigation.step3') }}
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          :editable="currentStepValid"
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
              :required="!isReadonly"
              check-dupes="Package"
              :item-id="packageItem.id"
            />
            <gokb-url-field
              v-model="packageItem.descriptionURL"
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
                :mark-required="!isReadonly"
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
              <gokb-section
                :sub-title="$t('component.package.platform')"
                :mark-required="!isReadonly"
              >
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
                    :label="$t('component.package.global.Other.label')"
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
                :api-errors="errors.ids"
              />
            </v-col>
            <v-col
              cols="12"
              xl="6"
            >
              <gokb-alternate-names-section
                v-model="allNames.alts"
                :disabled="isReadonly"
                :api-errors="errors.variantNames"
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
                <v-icon
                  v-if="kbart.dryRun"
                  class="ml-1"
                  :title="$t('kbart.dryRun.label')"
                  small
                >
                  mdi-content-save-off
                </v-icon>
              </v-chip>
            </v-col>
          </v-row>
          <gokb-tipps-section
            ref="tipps"
            :pkg="id"
            :filter-align="isEdit"
            :platform="packageItem.nominalPlatform"
            :provider="packageItem.provider"
            :disabled="isReadonly"
            :api-errors="errors.tipps"
            @kbart="setKbart"
            @update="updateNewTipps"
          />
          <gokb-source-field
            v-if="loggedIn"
            ref="source"
            v-model="sourceItem"
            :default-title-namespace="providerTitleNamespace"
            :expanded="false"
            :api-errors="errors.source"
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
              <v-col cols="6">
                <gokb-state-select-field
                  v-if="packageItem.status"
                  v-model="packageItem.status"
                  dense
                  :deletable="!!deleteUrl"
                  :editable="!!updateUrl"
                />
              </v-col>
              <v-col cols="6" xl="3">
                <gokb-uuid-field
                  v-if="uuid"
                  label="UUID"
                  :value="uuid"
                  path="/package"
                  dense
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
                  v-model="overviewStates.contentType"
                  :init-item="overviewStates.contentType"
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
                  v-model="overviewStates.listStatus"
                  :init-item="overviewStates.listStatus"
                  message-path="component.package.listStatus"
                  url="refdata/categories/Package.ListStatus"
                  :label="$t('component.package.listStatus.label')"
                  :api-errors="errors.listStatus"
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
                  :label="kbartLabel"
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
              xl="5"
            >
              <gokb-curatory-group-section
                v-model="allCuratoryGroups"
                :disabled="!isAdmin"
                :filter-align="false"
                :expandable="false"
                :sub-title="$tc('component.curatoryGroup.label', 2)"
              />
            </v-col>
            <v-col
              cols="12"
              xl="7"
            >
              <gokb-reviews-section
                v-if="id && isContrib"
                :expandable="false"
                :review-component="packageItem"
                :api-errors="errors.listStatus"
                @update=reload
              />
            </v-col>
          </v-row>
          <v-row v-if="id && !isReadonly">
            <v-col>
              <gokb-jobs-section
                :linked-component="id"
                :hide-default="true"
                :auto-refresh="false"
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
        @click="reset"
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
      <div v-if="id">
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
        color="primary"
        :disabled="!currentStepValid"
        @click="go2NextStep"
      >
        {{ $t('btn.next') }}
      </gokb-button>
      <!-- without key, submit is executed on previous page -->
      <gokb-button
        v-else-if="!isReadonly"
        key="add"
        :disabled="!isValid"
        default
      >
        {{ $i18n.t('btn.submit') }}
      </gokb-button>
    </template>
  </gokb-page>
  <gokb-no-access-field v-else-if="!accessible" />
  <gokb-page
    v-else
    title=""
  >
    <v-card>
      <v-card-text>
        <div class="text-h5 primary--text">
          {{ $t('component.general.notFound', [$tc('component.package.label')]) }}
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
  import GokbEditJobPopup from '@/shared/popups/gokb-edit-job-popup'
  import { HOME_ROUTE } from '@/router/route-paths'
  import packageServices from '@/shared/services/package-services'
  import jobServices from '@/shared/services/job-services'
  import providerServices from '@/shared/services/provider-services'
  import sourceServices from '@/shared/services/source-services'
  import loading from '@/shared/models/loading'
  import VSnackbars from 'v-snackbars'

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
      GokbConfirmationPopup,
      GokbEditJobPopup,
      VSnackbars
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
      kbartJob: {
        type: String,
        required: false,
        default: undefined
      },
      initMessageCode: {
        type: String,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        valid: false,
        step: 1,
        step2Error: false,
        waiting: false,
        notFound: false,
        version: undefined,
        errors: {},
        eventMessages: [],
        uuid: undefined,
        isCurator: false,
        showSubmitConfirm: false,
        submitConfirmationMessage: undefined,
        editJobPopupVisible: false,
        urlUpdate: false,
        currentName: undefined,
        lastUpdated: undefined,
        listVerifiedDate: undefined,
        dateCreated: undefined,
        importJob: {},
        matchingJob: {},
        selectedJob: undefined,
        kbartProgress: undefined,
        providerTitleNamespace: undefined,
        newTipps: [],
        packageItem: {
          id: undefined,
          name: undefined,
          source: undefined,
          type: 'package',
          status: undefined,
          descriptionURL: undefined,
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
        overviewStates: {
          contentType: undefined,
          listStatus: undefined
        },
        allCuratoryGroups: [],
        sourceItem: undefined,
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
      isAdmin () {
        return this.loggedIn && accountModel.hasRole('ROLE_ADMIN')
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
        return this.dateCreated ? new Date(this.dateCreated).toLocaleString('sv') : ''
      },
      localLastUpdated () {
        return this.lastUpdated ? new Date(this.lastUpdated).toLocaleString('sv') : ''
      },
      localListVerifiedDate () {
        return this.listVerifiedDate ? this.buildDateString(this.listVerifiedDate) : ''
      },
      accessible () {
        return this.isEdit || (accountModel.loggedIn() && accountModel.hasRole('ROLE_CONTRIBUTOR'))
      },
      currentStepValid () {
        return this.isReadonly || (this.isEdit && (this.step !== 2 || this.isValid)) || (!this.isEdit && (this.step !== 1 || this.isValid))
      },
      isValid () {
        return (!!this.allNames.name && !!this.packageItem.nominalPlatform && !!this.packageItem.provider)
      },
      activeGroup () {
        return this.loggedIn && accountModel.activeGroup()
      },
      step3Error () {
        return (this.isEdit && this.errors?.variantNames && this.errors?.ids) || (!this.isEdit && this.errors?.tipps)
      },
      kbartLabel () {
        return 'KBART' + (this.kbart?.dryRun ? ' (' + this.$i18n.t('kbart.dryRun.label') + ')' : '')
      }
    },
    watch: {
      loggedIn (value) {
        if (value) {
          this.reload()
        }

        this.eventMessages = []
      },
      '$i18n.locale' (l) {
        if (this.isEdit) {
          document.title = this.$i18n.tc('component.package.label') + ' – ' + this.allNames.name
        }

        this.eventMessages = []
      },
      isValid (valid) {
        if (this.isEdit && !this.isReadonly && !valid) {
          this.step2Error = true
        } else {
          this.step2Error = false
        }
      },
      'packageItem.provider' (prov) {
        if (prov) {
          this.fetchDefaultNamespace(prov.id)
        }
      }
    },
    async created () {
      this.reload()

      if (this.initMessageCode) {
        if (this.initMessageCode.includes('success')) {
          this.eventMessages.push({ message: this.$i18n.t(this.initMessageCode, [this.$i18n.tc('component.package.label'), this.allNames.name]), color: 'success' })
        } else if (this.initMessageCode.includes('failure')) {
          this.eventMessages.push({ message: this.$i18n.t(this.initMessageCode, [this.$i18n.tc('component.package.label')]), color: 'error', timeout: -1 })
        } else if (this.initMessageCode.includes('warning')) {
          this.eventMessages.push({ message: this.$i18n.t(this.initMessageCode, [this.$i18n.tc('component.package.label')]), color: 'warning', timeout: -1 })
        }
      }

      if (this.kbartJob) {
        this.loadImportJobStatus(this.kbartJob)
      } else if (this.isEdit && this.accessible) {
        this.getActiveJobs()
      }
    },
    mounted () {
      document.addEventListener('keydown', this.handleKeyboardNav.bind(this))
    },
    beforeDestroy() {
      document.removeEventListener("keydown", this.handleKeyboardNav)
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
      handleKeyboardNav (e) {
        if (this.step > 1 && e.key === "ArrowLeft" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            this.go2PreviousStep()
        } else if (this.step < 4 && e.key === "ArrowRight" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault()
          this.go2NextStep()
        } else if (['1', '2', '3', '4'].includes(e.key) && (e.ctrlKey || e.metaKey)) {
          e.preventDefault()
          this.step = e.key
        }
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
            automaticUpdates: false,
            targetNamespace: options.selectedNamespace,
            duration: undefined,
            unit: undefined,
          }
        } else if (!!this.sourceItem.targetNamespace &&
                    !!this.sourceItem.update &&
                    !!options.selectedNamespace &&
                    options.selectedNamespace.id != this.sourceItem.targetNamespace.id
        ) {
          this.eventMessages.push({ message: this.$i18n.t('kbart.transmission.warn.sourceNamespaceConflict'), color: 'warn', timeout: -1 })
        }
      },
      showCreatePackageConfirm (form) {
        if (this.isValid) {
          if (this.kbart?.selectedFile) {
            let code = this.kbart.dryRun ? 'component.package.navigation.confirm.kbartDryRun.label' : 'component.package.navigation.confirm.kbartLocal.label'
            this.submitConfirmationMessage = { text: code, vars: [this.allNames.name, this.kbart.selectedFile.name] }
          } else if (this.urlUpdate) {
            this.submitConfirmationMessage = { text: 'component.package.navigation.confirm.sourceUpdate.label', vars: [this.allNames.name, this.sourceItem.url] }
          } else {
            this.submitConfirmationMessage = { text: 'component.package.navigation.confirm.noTipps.label', vars: [this.allNames.name] }
          }
          this.showSubmitConfirm = true
        }
      },
      showJobPopup(uuid) {
        this.selectedJob = { id: uuid, archived: false }
        this.editJobPopupVisible = true
      },
      async createPackage () {
        loading.startLoading()
        var isUpdate = !!this.id
        this.eventMessages = []

        if (this.importJob?.status !== 'info') {
          this.importJob = {}
        }

        if (this.matchingJob?.status !== 'info') {
          this.matchingJob = {}
        }

        if (this.isValid) {
          if (this.sourceItem) {
            var sourceItem = this.sourceItem

            if (sourceItem.name !== this.allNames.name) {
              sourceItem.name = this.allNames.name
            }

            if (this.sourceItem?.update) {
              this.urlUpdate = true
            }

            const sourceResponse = await this.catchError({
              promise: sourceServices.createOrUpdateSource(sourceItem, this.cancelToken.token),
              instance: this
            })

            if (sourceResponse.status < 400) {
              this.packageItem.source = sourceResponse.data
              this.sourceItem = sourceResponse.data
            } else {
              this.errors.source = sourceResponse?.data?.data
            }
          }

          const newPackage = {
            ...this.packageItem,
            ...(this.newTipps.length > 0 ? { tipps: this.newTipps.map(tipp => ({ ...tipp, id: typeof id === 'number' ? id : null })) } : {}),
            name: this.allNames.name,
            version: this.version,
            variantNames: this.allNames.alts.map(({ variantName, id, locale, variantType }) => ({ variantName, locale, variantType, id: typeof id === 'number' ? id : null })),
            curatoryGroups: this.allCuratoryGroups,
            ids: this.packageItem.ids.map(id => ({ value: id.value, type: id.namespace })),
            breakable: utils.asYesNo(this.packageItem.breakable),
            consistent: utils.asYesNo(this.packageItem.consistent),
            fixed: utils.asYesNo(this.packageItem.fixed),
            nominalPlatform: this.packageItem.nominalPlatform?.id,
            provider: this.packageItem.provider?.id,
            activeGroup: this.activeGroup
          }

          if (!this.isUpdate || this.kbart || this.urlUpdate) {
            newPackage.generateToken = true
          }

          const response = await this.catchError({
            promise: packageServices.createOrUpdatePackage(newPackage, this.cancelToken.token),
            instance: this
          })

          if (response?.status < 400) {
            this.packageItem.id = response.data.id

            if (this.kbart) {
              const kbartPars = {
                activeGroup: this.activeGroup?.id,
                titleIdNamespace: this.kbart.selectedNamespace?.id || this.sourceItem?.targetNamespace?.id,
                dryRun: this.kbart.dryRun,
                addOnly: this.kbart.addOnly
              }
              const kbartResult = await this.catchError({
                promise: packageServices.ingestKbart(response.data.id, this.kbart.selectedFile, kbartPars, this.cancelToken.token),
                instance: this
              })

              this.kbart = undefined

              if (kbartResult.status === 403) {
                this.eventMessages.push({ message: this.$i18n.t('kbart.transmission.error.denied'), color: 'error', timeout: -1 })
              } else if (kbartResult.status >= 400 && kbartResult.status < 500) {
                this.eventMessages.push({ message: this.$i18n.t('kbart.transmission.error.processing'), color: 'error', timeout: -1 })
              } else if (kbartResult.status >= 500) {
                this.eventMessages.push({ message: this.$i18n.t('kbart.transmission.error.unknown'), color: 'error', timeout: -1 })
              }

              if (isUpdate) {
                this.step = 1
                this.eventMessages.push({ message: this.$i18n.t(this.isEdit ? 'success.update' : 'success.create', [this.$i18n.tc('component.package.label'), this.allNames.name]), color: 'success' })
                this.reload()

                if (kbartResult?.data?.jobId) {
                  this.loadImportJobStatus(kbartResult?.data?.jobId)
                }
              } else {
                this.$router.push({ name: '/package', params: { id: this.packageItem.id, kbartJob: kbartResult?.data?.jobId, initMessageCode: 'success.create' } })
              }
            } else if (this.urlUpdate) {
              const updateParams = {
                activeGroup: this.activeGroup?.id
              }
              const sourceUpdateResult = await this.catchError({
                promise: packageServices.triggerSourceUpdate(response.data.id, updateParams, this.cancelToken.token),
                instance: this
              })

              if (sourceUpdateResult.status === 403) {
                this.eventMessages.push({ message: this.$i18n.t('kbart.transmission.error.denied', [this.$i18n.tc('component.package.label')]), color: 'error', timeout: -1 })
              } else if (sourceUpdateResult.status >= 400 && sourceUpdateResult.status < 500) {
                this.eventMessages.push({ message: this.$i18n.t('kbart.transmission.error.processing', [this.$i18n.tc('component.package.label')]), color: 'error', timeout: -1 })
              } else if (sourceUpdateResult.status >= 500) {
                this.eventMessages.push({ message: this.$i18n.t('kbart.transmission.error.unknown', [this.$i18n.tc('component.package.label')]), color: 'error', timeout: -1 })
              } else if (sourceUpdateResult.data?.result === 'SKIPPED') {
                this.eventMessages.push({ message: this.$i18n.t(sourceUpdateResult.data.messageCode), color: 'warn', timeout: -1 })
              }

              if (isUpdate) {
                this.step = 1
                this.eventMessages.push({ message: this.$i18n.t(this.isEdit ? 'success.update' : 'success.create', [this.$i18n.tc('component.package.label'), this.allNames.name]), color: 'success' })
                this.reload()

                if (sourceUpdateResult?.data?.jobId) {
                  this.loadImportJobStatus(sourceUpdateResult?.data?.jobId)
                }
              } else {
                this.$router.push({ name: '/package', params: { id: this.packageItem.id, kbartJob: sourceUpdateResult?.data?.jobId, initMessageCode: 'success.create' } })
              }
            } else {

              if (isUpdate) {
                this.step = 1
                this.reload()
                this.eventMessages.push({ message: this.$i18n.t((this.isEdit ? 'success.update' : 'success.create'), [this.$i18n.tc('component.package.label'), this.allNames.name]), color: 'success', timeout: -1 })
              } else {
                this.$router.push({ name: '/package', params: { id: this.packageItem.id, initMessageCode: 'success.create' } })
              }
            }
          } else {
            if (response.status === 409) {
              this.eventMessages.push({ message: this.$i18n.t('error.update.409', [this.$i18n.tc('component.package.label')]), color: 'error', timeout: -1 })
            } else if (response.status === 500) {
              this.eventMessages.push({ message: this.$i18n.t('error.update.500', [this.$i18n.tc('component.package.label')]), color: 'error', timeout: -1 })
            } else {
              this.eventMessages.push({ message: this.$i18n.t(this.isEdit ? 'error.update.400' : 'error.create.400', [this.$i18n.tc('component.package.label')]), color: 'error', timeout: -1 })
              this.errors = response.data.error
              this.step = 1
            }
          }
        }
        else {
          this.eventMessages.push({message: this.$i18n.t('validation.hasErrors'), color: 'error', timeout: -1})
        }

        if (loading.isLoading()) {
          loading.stopLoading()
        }
      },
      reset () {
        if (!this.isEdit) {
          this.packageItem.id = undefined
          this.packageItem.name = undefined
          this.packageItem.source = undefined
          this.packageItem.status = undefined
          this.packageItem.descriptionURL = undefined
          this.packageItem.description = undefined
          this.packageItem.scope = undefined
          this.packageItem.global = undefined
          this.packageItem.globalNote = undefined
          this.packageItem.contentType = undefined
          this.packageItem.consistent = undefined
          this.packageItem.breakable = undefined
          this.packageItem.fixed = undefined
          this.packageItem.listStatus = undefined
          this.packageItem.editStatus = undefined
          this.packageItem.ids = []
          this.packageItem.provider = undefined // organisation
          this.packageItem.nominalPlatform = undefined
          this.allNames = { name: undefined, alts: [] }
        }
        this.kbart = undefined
        this.reload(true)
      },
      async reload () {
        if (this.isEdit) {
          if(!loading.isLoading()) {
            loading.startLoading()
          }

          this.errors = {}
          this.newTipps = []

          const result = await this.catchError({
            promise: packageServices.getPackage(this.id, this.cancelToken.token),
            instance: this
          })

          if (result.status === 200) {
            this.mapRecord(result.data)
          } else if (result.status === 401) {
            accountModel.logout()
            const retry = await this.catchError({
              promise: packageServices.getPackage(this.id, this.cancelToken.token),
              instance: this
            })

            if (retry.status > 200) {
              this.accessible = false
            } else {
              this.mapRecord(retry.data)
            }
          } else if (result.status === 404) {
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
          this.$refs.tipps.fetchTipps()

          loading.stopLoading()
        } else {
          if (this.loggedIn && this.activeGroup) {
            this.allCuratoryGroups = [this.activeGroup]
          }
        }
      },
      async fetchDefaultNamespace (providerId) {
        const providerResult = await this.catchError({
          promise: providerServices.getProvider(providerId, this.cancelToken.token),
          instance: this
        })

        if (providerResult?.status === 200) {
          const fullProvider = providerResult.data

          if (fullProvider.titleNamespace) {
            this.providerTitleNamespace= fullProvider.titleNamespace
          }
        }
      },
      async loadImportJobStatus (jobId) {
        var finished = false
        var jobInfo = {
          id: jobId,
          progress: undefined,
          result: 'info',
          dryRun: undefined,
          dismissed: false
        }

        while (!finished) {
          const jobResult = await this.catchError({
            promise: jobServices.getJob(jobId, false, this.cancelToken.token),
            instance: this
          })

          if (jobResult.status < 400) {
            jobInfo.progress = jobResult.data.progress

            if (jobResult.data.finished) {
              jobInfo.progress = undefined
              jobInfo.dryRun = jobResult.data.job_result.dryRun

              if (jobResult.data.status === 'ERROR' || jobResult.data.status === 'CANCELLED') {
                jobInfo.result = 'error'
                this.eventMessages.push({ message: this.$i18n.t('kbart.transmission.error.processing'), color: 'error', importResult: true })
              } else if (jobResult.data.job_result?.badrows) {
                jobInfo.result = 'warn'
                this.eventMessages.push({ message: this.$i18n.t('kbart.transmission.warn.skipped'), color: 'warn', importResult: true })

                if (jobResult.data.job_result.matchingJob) {
                  this.loadMatchingJobStatus(jobResult.data.job_result.matchingJob)
                }
              } else {
                jobInfo.result = 'success'
                this.eventMessages.push({ message: this.$i18n.t(jobInfo.dryRun ? 'kbart.dryRun.success' : 'kbart.transmission.success'), color: 'success', importResult: true })

                if (jobResult.data.job_result.matchingJob) {
                  this.loadMatchingJobStatus(jobResult.data.job_result.matchingJob)
                }
              }
              this.reload()

              finished = true
            } else {
              await this.wait(500)
            }
          } else {
            jobInfo.result = 'error'
            finished = true
          }

          this.importJob = jobInfo
        }
      },
      async loadMatchingJobStatus (jobId) {
        var finished = false
        var jobInfo = {
          id: jobId,
          progress: undefined,
          result: 'info',
          messageCode: undefined,
          dismissed: false
        }

        while (!finished) {
          const jobResult = await this.catchError({
            promise: jobServices.getJob(jobId, false, this.cancelToken.token),
            instance: this
          })

          if (jobResult.status < 400) {
            jobInfo.progress = jobResult.data.progress

            if (jobResult.data.finished) {
              jobInfo.progress = undefined

              if (jobResult.data.status === 'ERROR' || jobResult.data.status === 'CANCELLED') {
                jobInfo.result = 'error'
                jobInfo.messageCode = jobResult.data.job_result?.messageCode || 'kbart.titleMatch.failure'
                this.eventMessages.push({ message: this.$i18n.t(jobResult.data.job_result?.messageCode), color: 'error', timeout: -1, matchingResult: true })
              } else {
                jobInfo.result = 'success'
                this.eventMessages.push({ message: this.$i18n.t('kbart.titleMatch.success'), color: 'success', timeout: -1, importResult: true })
              }

              finished = true
            } else {
              await this.wait(500)
            }
          } else {
            jobInfo.result = 'error'
            finished = true
          }

          this.matchingJob = jobInfo
        }
      },
      async getActiveJobs () {
        const jobResult = await this.catchError({
          promise: jobServices.get({ linkedItem: this.id }, this.cancelToken.token),
          instance: this
        })

        if (jobResult.status < 400) {
          if (jobResult.data?.data.length > 0) {
            this.activeJobs = true

            jobResult.data.data.forEach((job) => {
              console.log(job)
              if (job.type?.value === 'PackageTitleMatch') {
                this.loadMatchingJobStatus(job.uuid, job.type.value)
              }
              else {
                this.loadImportJobStatus(job.uuid, job.type.value)
              }
            })
          }
        }
      },
      mapRecord (data) {
        this.updateUrl = data._links?.update?.href || null
        this.deleteUrl = data._links?.delete?.href || null
        this.packageItem.id = data.id
        this.uuid = data.uuid
        this.currentName = data.name
        this.packageItem.name = data.name
        this.packageItem.source = data.source
        this.packageItem.status = data.status
        this.packageItem.descriptionURL = data.descriptionURL
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
        this.packageItem.ids = data._embedded.ids.map(({ id, value, namespace }) => (
          { id, value, namespace: namespace.value, nslabel: namespace.name || namespace.value, isDeletable: !!this.updateUrl }))
        this.allAlternateNames = data._embedded.variantNames.map(variantName => ({ ...variantName, isDeletable: !!this.updateUrl }))
        this.allCuratoryGroups = data._embedded.curatoryGroups.map(({ name, id }) => ({ id, name, isDeletable: !!this.updateUrl }))
        this.reviewRequests = data._embedded.reviewRequests
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

        this.overviewStates.listStatus = data.listStatus
        this.overviewStates.contentType = data.contentType

        document.title = this.$i18n.tc('component.package.label') + ' – ' + data.name
      },
      triggerUpdate (checked) {
        this.urlUpdate = checked
      },
      wait (ms) {
        return new Promise((resolve) => { setTimeout(resolve, ms) })
      }
    }
  }
</script>
