<template>
  <div>
    <v-snackbar v-model="showSnackbar" :color="messageColor" :timeout="currentSnackBarTimeout">
        {{ snackbarMessage }}
        <template #actions>
          <v-icon @click="showSnackbar = false" color="white">mdi-close</v-icon>
        </template>
    </v-snackbar>
    <gokb-page
      v-if="accessible && !notFound"
      :key="version"
      :title="title"
      :sub-title="subTitle"
    >
      <gokb-error-component :value="error" />
      <span v-if="importStatus === 'success'">
        <v-alert
          type="success"
          closable
        >
          {{ importJob.dryRun ? $t('kbart.dryRun.success') : $t('kbart.transmission.success') }}
          <gokb-button class="ml-2" style="margin-top:-2px;" :label="$t('kbart.transmission.showResults')" @click="showJobPopup(importJob.id, 'import')">
            {{ $t('kbart.transmission.showResults') }}
          </gokb-button>
        </v-alert>
      </span>
      <span v-if="importStatus === 'error'">
        <v-alert
          type="error"
          closable
        >
          {{ $t('kbart.transmission.error.processing') }}
          <gokb-button class="ml-2" style="margin-top:-2px;" :label="$t('kbart.transmission.showResults')" @click="showJobPopup(importJob.id, 'import')">
            {{ $t('kbart.transmission.showResults') }}
          </gokb-button>
        </v-alert>
      </span>
      <span v-if="importStatus === 'warn'">
        <v-alert
          type="warning"
          closable
        >
          {{ $t('kbart.transmission.warn.skipped') }}
          <gokb-button class="ml-2" style="margin-top:-2px;" :label="$t('kbart.transmission.showResults')" @click="showJobPopup(importJob.id, 'import')">
            {{ $t('kbart.transmission.showResults') }}
          </gokb-button>
        </v-alert>
      </span>
      <span v-else-if="importStatus === 'info'">
        <v-alert
          type="info"
          closable
        >
          <span>
            {{ importJob.dryRun ? $t('kbart.dryRun.started') : $t('kbart.transmission.started') }} {{ !!importProgress ? '(' + importProgress + '%)' : '' }}
            <v-progress-linear
              v-if="importRunning"
              v-model="importProgress"
            />
            <div v-else>
              {{ $t('kbart.transmission.preparing') }}
            </div>
          </span>
        </v-alert>
      </span>
      <span v-if="matchStatus === 'success'">
        <v-alert
          type="success"
          class="mt-2"
          closable
        >
          {{ $t('kbart.titleMatch.success') }}
          <gokb-button class="ml-2" style="margin-top:-2px;" :label="$t('kbart.transmission.showResults')" @click="showJobPopup(matchingJob.id, 'matching')">
            {{ $t('kbart.transmission.showResults') }}
          </gokb-button>
        </v-alert>
      </span>
      <span v-if="matchStatus === 'error'">
        <v-alert
          type="error"
          class="mt-2"
          closable
        >
          {{ $t(matchingJob.messageCode) }}
          <gokb-button class="ml-2" style="margin-top:-2px;" :label="$t('kbart.transmission.showResults')" @click="showJobPopup(matchingJob.id, 'matching')">
            {{ $t('kbart.transmission.showResults') }}
          </gokb-button>
        </v-alert>
      </span>
      <span v-else-if="matchStatus === 'info'">
        <v-alert
          type="info"
          class="mt-2"
          closable
        >
          <span>
            {{ $t('kbart.titleMatch.started') }} {{ !!matchProgress ? '(' + matchProgress + '%)' : '' }}
            <v-progress-linear
              v-if="matchRunning"
              v-model="matchProgress"
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
        :non-linear="isEdit"
      >
        <v-stepper-header>
          <v-stepper-item
            :value="1"
            :editable="isEdit"
            @selected="setActiveStep(1)"
          >
            {{ isEdit ? $t('component.package.navigation.step4') : $t('component.package.navigation.step1') }}

            <template #icon="props">
              <span>1</span>
            </template>
          </v-stepper-item>
          <v-divider />
          <v-stepper-item
            :class="{ error: step2Error }"
            :error="step2Error"
            :value="2"
            :editable="isEdit"
            @selected="setActiveStep(2)"
          >
            {{ isEdit ? $t('component.package.navigation.step1') : $t('component.package.navigation.step2') }}
            <template #icon="props">
              <span v-if="!step2Error">2</span>
              <v-icon v-else icon="mdi-close-thick"/>
            </template>
          </v-stepper-item>
          <v-divider />
          <v-stepper-item
            :class="{ error: step3Error }"
            :error="step3Error"
            :value="3"
            :editable="isEdit"
            @selected="setActiveStep(3)"
          >
            {{ isEdit ? $t('component.package.navigation.step2') : $t('component.package.navigation.step3') }}
            <template #icon="props">
              <span v-if="!step3Error">3</span>
              <v-icon v-else icon="mdi-close-thick"/>
            </template>
          </v-stepper-item>
          <v-divider />
          <v-stepper-item
            :value="4"
            :editable="isEdit"
            @selected="setActiveStep(4)"
          >
            {{ isEdit ? $t('component.package.navigation.step3') : $t('component.package.navigation.step4') }}
            <template #icon="props">
              <span>4</span>
            </template>
          </v-stepper-item>
        </v-stepper-header>

        <v-stepper-window>
          <v-stepper-window-item
            :key="`${isEdit ? 2 : 1}-content`"
            :value="isEdit ? 2 : 1"
          >
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
                ref="descEdit"
                v-model="packageItem.description"
                :label="$t('component.package.description')"
                :disabled="isReadonly"
              />
            </gokb-section>
            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <gokb-section
                  :sub-title="$t('component.package.provider')"
                  :mark-required="!isReadonly"
                >
                  <gokb-search-organisation-field
                    v-model="packageItem.provider"
                    :show-link="true"
                    :readonly="isReadonly"
                    return-object
                  />
                </gokb-section>
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <gokb-section
                  :sub-title="$t('component.package.platform')"
                  :mark-required="!isReadonly"
                >
                  <gokb-search-platform-field
                    v-model="packageItem.nominalPlatform"
                    :readonly="isReadonly"
                    return-object
                    only-current
                  />
                </gokb-section>
              </v-col>
            </v-row>
          </v-stepper-window-item>

          <v-stepper-window-item
            :key="`${isEdit ? 3 : 2}-content`"
            :value="isEdit ? 3 : 2"
          >
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
                    :init-item="packageItem.listStatus"
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
                    <label class="text-primary text-caption ml-2" for="validity">{{ $t('component.package.global.label') }}</label>
                  </div>
                  <gokb-radiobutton-group
                    id="validity"
                    :disabled="isReadonly"
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
                md="6"
              >
                <gokb-identifier-section
                  v-model="packageItem.ids"
                  target-type="Package"
                  :disabled="isReadonly"
                  :api-errors="errors?.ids"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <gokb-alternate-names-section
                  v-model="allNames.alts"
                  :disabled="isReadonly"
                  :api-errors="errors?.variantNames"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <gokb-subjects-section
                  v-model="packageItem.subjects"
                  :disabled="isReadonly"
                  :api-errors="errors?.subjects"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <gokb-curatory-group-section
                  v-if="isAdmin"
                  v-model="allCuratoryGroups"
                  :filter-align="false"
                  :expandable="false"
                  :sub-title="$tc('component.curatoryGroup.label', 2)"
                />
              </v-col>
            </v-row>
          </v-stepper-window-item>

          <v-stepper-window-item
            :key="`${isEdit ? 4 : 3}-content`"
            :value="isEdit ? 4 : 3"
          >
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
              :api-errors="errors?.tipps"
              @kbart="setKbart"
              @update="updateNewTipps"
            />
            <gokb-source-field
              v-if="loggedIn"
              ref="source"
              v-model="sourceItem"
              :default-title-namespace="providerTitleNamespace"
              :expanded="false"
              :api-errors="errors?.source"
              :readonly="isReadonly"
              @enable="triggerUpdate"
            />
          </v-stepper-window-item>

          <v-stepper-window-item
            :key="`${isEdit ? 1 : 4}-content`"
            :value="isEdit ? 1 : 4"
          >
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
              <v-row dense>
                <v-col cols="6">
                  <gokb-state-select-field
                    v-if="packageItem.status"
                    v-model="packageItem.status"
                    class="mt-1"
                    dense
                    :deletable="!isReadonly"
                    :editable="!isReadonly"
                    @delete="markDeleted"
                  />
                </v-col>
                <v-col cols="6" xl="3">
                  <gokb-uuid-field
                    v-if="uuid"
                    label="UUID"
                    class="mt-2"
                    v-model="uuid"
                    path="/package"
                  />
                </v-col>
              </v-row>
              <v-row dense>
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
                    ref="descInfo"
                    v-model="packageItem.description"
                    :label="$t('component.package.description')"
                    dense
                    disabled
                  />
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="2">
                  <gokb-curatory-group-popup
                    v-model="showGroupInfoPopup"
                    :selected="selectedGroupPopup"
                  />
                  <div class="text-caption text-medium-emphasis" style="margin-top:-2px">
                    {{ $tc('component.curatoryGroup.label', allCuratoryGroups.length || 1) }}
                  </div>
                  <v-chip-group
                    v-model="selectedGroupPopup"
                    id="cgroups"
                    variant="elevated"
                    color="primary"
                    mandatory
                    style="margin-top:-7px"
                  >
                    <v-chip
                      v-for="group in allCuratoryGroups"
                      :key="group.id"
                      :text="group.name"
                      :value="group"
                      class="text-button"
                      rounded="lg"
                      density="compact"
                      @click="showGroupDetails"
                    />
                  </v-chip-group>
                </v-col>
                <v-col cols="2">
                  <gokb-state-field
                    v-model="overviewStates.contentType"
                    :init-item="overviewStates.contentType"
                    message-path="component.package.contentType"
                    url="refdata/categories/Package.ContentType"
                    :label="$t('component.package.contentType.label')"
                    readonly
                  />
                </v-col>
                <v-col cols="2">
                  <gokb-state-field
                    v-model="overviewStates.global"
                    :init-item="overviewStates.global"
                    message-path="component.package.global"
                    url="refdata/categories/Package.Global"
                    :label="$t('component.package.global.label')"
                    readonly
                  />
                </v-col>
                <v-col cols="2">
                  <gokb-text-field
                    v-model="totalNumberOfTitles"
                    :label="$t('component.package.count')"
                    disabled
                  />
                </v-col>
                <v-col cols="2">
                  <gokb-state-field
                    v-model="overviewStates.listStatus"
                    :init-item="overviewStates.listStatus"
                    message-path="component.package.listStatus"
                    url="refdata/categories/Package.ListStatus"
                    :label="$t('component.package.listStatus.label')"
                    :api-errors="errors?.listStatus"
                    readonly
                  />
                </v-col>
                <v-col cols="1">
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
                    :label="kbartLabel"
                    dense
                    disabled
                  />
                </v-col>
              </v-row>
            </gokb-section>
            <v-row>
              <v-col>
                <gokb-reviews-section
                  v-if="id && isContrib"
                  :expandable="false"
                  :review-component="packageItem"
                  :api-errors="errors?.listStatus"
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
          </v-stepper-window-item>
        </v-stepper-window>
      </v-stepper>

      <template #buttons>
        <gokb-confirmation-popup
          v-model="showSubmitConfirm"
          :message="submitConfirmationMessage"
          @confirmed="submitPackage"
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
          color="primary"
          @click="showSubmitPackageConfirm"
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
        <v-card-text align="center">
          <div class="text-h5 primary--text">
            {{ $t('component.general.notFound', [$tc('component.package.label')]) }}
          </div>
        </v-card-text>
      </v-card>
    </gokb-page>
  </div>
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
  import GokbCuratoryGroupPopup from '@/shared/popups/gokb-curatory-group-popup'
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
      GokbCuratoryGroupPopup,
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
        waiting: false,
        notFound: false,
        version: undefined,
        errors: {},
        toDelete: false,
        showSnackbar: false,
        snackbarMessage: undefined,
        messageColor: undefined,
        currentSnackBarTimeout: '-1',
        uuid: undefined,
        isCurator: false,
        showSubmitConfirm: false,
        selectedGroupPopup: undefined,
        showGroupInfoPopup: false,
        submitConfirmationMessage: undefined,
        editJobPopupVisible: false,
        urlUpdate: false,
        currentName: undefined,
        lastUpdated: undefined,
        listVerifiedDate: undefined,
        dateCreated: undefined,
        importRunning: false,
        importProgress: undefined,
        importStatus: undefined,
        importJob: {
          id: undefined,
          dryRun: undefined,
          dismissed: false
        },
        matchingJob: {
          id: undefined,
          messageCode: undefined,
          dismissed: false
        },
        matchRunning: false,
        matchProgress: undefined,
        matchStatus: undefined,
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
          subjects: [],
          listStatus: undefined,
          editStatus: undefined,
          ids: [],
          provider: undefined, // organisation
          nominalPlatform: undefined,
        },
        overviewStates: {
          contentType: undefined,
          listStatus: undefined,
          global: undefined
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
        allNames: {
          name: undefined,
          alts: []
        },
        titleCount: 0,
        maintenanceCycle: undefined,
        step3Error: false,
        step2Error: false,
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
        return (!!this.allNames.name && !!this.packageItem.nominalPlatform && !!this.packageItem.provider && !this.importRunning && !this.matchRunning)
      },
      activeGroup () {
        return this.loggedIn && accountModel.activeGroup()
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

        this.showSnackbar = false
      },
      '$i18n.locale' (l) {
        if (this.isEdit) {
          document.title = this.$i18n.tc('component.package.label') + ' – ' + this.allNames.name
        }

        this.showSnackbar = false
      },
      'packageItem.provider' (prov) {
        if (prov) {
          this.fetchDefaultNamespace(prov.id)
        }
      },
      step (val) {
        this.$refs?.descInfo?.refreshRows()
        this.$refs?.descEdit?.refreshRows()

        history.pushState({}, "", window.location.toString().split('?')[0] + '?step=' + val)
      },
      isValid (val) {
        if (!val) {
          this.updateStepErrors()
        }
      }
    },
    async created () {
      await this.reload()

      if (!!this.initMessageCode) {
        if (this.initMessageCode.includes('success')) {
          this.messageColor = 'success'
          this.snackbarMessage = this.$i18n.t(this.initMessageCode, [this.$i18n.tc('component.package.label'), this.allNames.name])
          this.currentSnackBarTimeout = 4000
          this.showSnackbar = true
        } else if (this.initMessageCode.includes('error')) {
          this.messageColor = 'error'
          this.snackbarMessage = this.$i18n.t(this.initMessageCode, [this.$i18n.tc('component.package.label')])
          this.currentSnackBarTimeout = -1
          this.showSnackbar = true
        } else if (this.initMessageCode.includes('warning')) {
          this.messageColor = 'warning'
          this.snackbarMessage = this.$i18n.t(this.initMessageCode, [this.$i18n.tc('component.package.label'), this.allNames.name])
          this.currentSnackBarTimeout = -1
          this.showSnackbar = true
        }
      }

      if (!!this.kbartJob) {
        this.loadImportJobStatus(this.kbartJob)
      } else if (this.isEdit && !this.isReadonly) {
        this.getActiveJobs()
      }
    },
    mounted () {
      document.addEventListener('keydown', this.handleKeyboardNav.bind(this))

      this.step = parseInt(this.$route.query.step) || 1
    },
    beforeDestroy() {
      document.removeEventListener("keydown", this.handleKeyboardNav)
    },
    methods: {
      go2NextStep () {
        if (this.step < 4) {
          this.step = this.step + 1
        }
      },
      go2PreviousStep () {
        if (this.step > 1) {
          this.step = this.step - 1
        }
      },
      setActiveStep (i) {
        this.step = i
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
          this.step = parseInt(e.key)
        }
      },
      setKbart (options) {
        this.kbart = options
        this.showSnackbar = false

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
          this.messageColor = 'warn'
          this.snackbarMessage = this.$i18n.t('kbart.transmission.warn.sourceNamespaceConflict')
          this.currentSnackBarTimeout = -1
          this.showSnackbar = true
        }
      },
      showSubmitPackageConfirm (form) {
        if (this.isValid) {
          if (this.kbart?.selectedFile) {
            let code = this.kbart.dryRun ? 'component.package.navigation.confirm.kbartDryRun.label' : 'component.package.navigation.confirm.kbartLocal.label'
            this.submitConfirmationMessage = {
              text: code,
              vars: [this.allNames.name, this.kbart.selectedFile.name]
            }
          } else if (this.urlUpdate) {
            this.submitConfirmationMessage = {
              text: 'component.package.navigation.confirm.sourceUpdate.label',
              vars: [this.allNames.name, this.sourceItem.url]
              }
          } else {
            this.submitConfirmationMessage = {
              text: 'component.package.navigation.confirm.noTipps.label',
              vars: [this.allNames.name]
            }
          }
          this.showSubmitConfirm = true
        }
      },
      showJobPopup(uuid, type) {
        this.selectedJob = { id: uuid, archived: type === 'import' }
        this.editJobPopupVisible = true
      },
      async submitPackage () {
        loading.startLoading()
        var isUpdate = !!this.id
        this.showSnackbar = false
        this.errors = {}
        this.updateStepErrors()

        if (this.importStatus !== 'info') {
          this.importStatus = undefined
          this.importJob.id = undefined
          this.importJob.dryRun = undefined
          this.importJob.dismissed = false
        }

        if (this.matchingStatus !== 'info') {
          this.matchStatus = undefined
          this.matchingJob.id = undefined
          this.matchingJob.messageCode = undefined
          this.matchingJob.dismissed = false
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
            ...(this.newTipps.length > 0 ? {
              tipps: this.newTipps.map(tipp => ({
                ...tipp,
                id: typeof id === 'number' ? id : null
              }))
            } : {}),
            name: this.allNames.name,
            version: this.version,
            variantNames: this.allNames.alts.map(({ variantName, id, locale, variantType }) => ({
              variantName,
              locale,
              variantType,
              id: typeof id === 'number' ? id : null
            })),
            curatoryGroups: this.allCuratoryGroups,
            ids: this.packageItem.ids.map(id => ({
              value: id.value,
              type: id.namespace
            })),
            subjects: this.packageItem.subjects.map(subject => ({
              heading: subject.heading,
              scheme: subject.scheme
            })),
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
            promise: packageServices.createOrUpdate(newPackage, this.cancelToken.token),
            instance: this
          })

          if (response?.status < 400) {
            this.packageItem.id = response.data.id

            if (this.kbart) {
              const kbartPars = {
                activeGroup: this.activeGroup?.id,
                titleIdNamespace: this.kbart.selectedNamespace?.id || this.sourceItem?.targetNamespace?.id,
                dryRun: this.kbart.dryRun,
                addOnly: this.kbart.addOnly,
                deleteMissing: this.kbart.deleteMissing
              }
              const kbartResult = await this.catchError({
                promise: packageServices.ingestKbart(response.data.id, this.kbart.selectedFile, kbartPars, this.cancelToken.token),
                instance: this
              })

              this.kbart = undefined
              let kbartMessage = undefined

              if (kbartResult.status === 403) {
                kbartMessage = 'kbart.transmission.error.denied'
                this.messageColor = 'error'
                this.snackbarMessage = this.$i18n.t(kbartMessage)
                this.currentSnackBarTimeout = -1
              } else if (kbartResult.status >= 400 && kbartResult.status < 500) {
                kbartMessage = 'kbart.transmission.error.processing'
                this.messageColor = 'error'
                this.snackbarMessage = this.$i18n.t('kbart.transmission.error.processing')
                this.currentSnackBarTimeout = -1
              } else if (kbartResult.status >= 500) {
                kbartMessage = 'kbart.transmission.error.unknown'
                this.messageColor = 'error'
                this.snackbarMessage = this.$i18n.t('kbart.transmission.error.unknown')
                this.currentSnackBarTimeout = -1
              }

              if (isUpdate) {
                this.step = 1

                if (kbartResult.status === 200) {
                  this.messageColor = 'success'
                  this.snackbarMessage = this.$i18n.t(this.isEdit ? 'success.update' : 'success.create', [this.$i18n.tc('component.package.label'), this.allNames.name])
                  this.currentSnackBarTimeout = 4000
                }
                this.showSnackbar = true
                this.reload()

                if (kbartResult?.data?.jobId) {
                  this.loadImportJobStatus(kbartResult?.data?.jobId)
                }
              } else {
                this.$router.push({
                  name: '/package',
                  params: {
                    id: this.packageItem.id,
                    kbartJob: kbartResult?.data?.jobId,
                    initMessageCode: kbartResult.status === 200 ? 'success.create' : kbartMessage
                  }
                })
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
                kbartMessage = 'kbart.transmission.error.denied'
                this.messageColor = 'error'
                this.snackbarMessage = this.$i18n.t(kbartMessage)
                this.currentSnackBarTimeout = -1
              } else if (sourceUpdateResult.status >= 400 && sourceUpdateResult.status < 500) {
                kbartMessage = 'kbart.transmission.error.processing'
                this.messageColor = 'error'
                this.snackbarMessage = this.$i18n.t(kbartMessage)
                this.currentSnackBarTimeout = -1
              } else if (sourceUpdateResult.status >= 500) {
                kbartMessage = 'kbart.transmission.error.unknown'
                this.messageColor = 'error'
                this.snackbarMessage = this.$i18n.t(kbartMessage)
                this.currentSnackBarTimeout = -1
              } else if (sourceUpdateResult.data?.status === 'SKIPPED' || sourceUpdateResult.data?.result === 'SKIPPED') {
                kbartMessage = sourceUpdateResult.data.messageCode
                this.messageColor = 'warn'
                this.snackbarMessage = this.$i18n.t(kbartMessage)
                this.currentSnackBarTimeout = -1
              }

              if (isUpdate) {
                this.step = 1

                if (sourceUpdateResult.status === 200) {
                  this.messageColor = 'success'
                  this.snackbarMessage = this.$i18n.t(this.isEdit ? 'success.update' : 'success.create', [this.$i18n.tc('component.package.label'), this.allNames.name])
                  this.currentSnackBarTimeout = 4000
                }
                this.showSnackbar = true

                this.reload()

                if (sourceUpdateResult?.data?.jobId) {
                  this.loadImportJobStatus(sourceUpdateResult?.data?.jobId)
                }
              } else {
                this.$router.push({
                  name: '/package',
                  params: {
                    id: this.packageItem.id,
                    kbartJob: sourceUpdateResult?.data?.jobId,
                    initMessageCode: sourceUpdateResult.status === 200 ? 'success.create' : kbartMessage
                  }
                })
              }
            } else {
              if (isUpdate) {
                this.step = 1
                this.reload()

                this.messageColor = 'success'
                this.snackbarMessage = this.$i18n.t(this.isEdit ? 'success.update' : 'success.create', [this.$i18n.tc('component.package.label'), this.allNames.name])
                this.currentSnackBarTimeout = 4000
                this.showSnackbar = true
              } else {
                this.$router.push({
                  name: '/package',
                  params: {
                    id: this.packageItem.id,
                    initMessageCode: 'success.create'
                  }
                })
              }
            }
          } else {
            if (response.status === 409) {
              this.messageColor = 'error'
              this.snackbarMessage = this.$i18n.t('error.update.409', [this.$i18n.tc('component.package.label')])
              this.currentSnackBarTimeout = -1
              this.showSnackbar = true
            } else if (response.status === 500) {
              this.messageColor = 'error'
              this.snackbarMessage = this.$i18n.t('error.general.500', [this.$i18n.tc('component.package.label')]),
              this.currentSnackBarTimeout = -1
              this.showSnackbar = true
            } else {
              this.messageColor = 'error'
              this.snackbarMessage = this.$i18n.t(this.isEdit ? 'error.update.400' : 'error.create.400', [this.$i18n.tc('component.package.label')]),
              this.currentSnackBarTimeout = -1
              this.showSnackbar = true
              this.errors = response?.data?.error || {}
              this.updateStepErrors()
              this.step = 1
            }
          }
        }
        else {
          this.messageColor = 'error'
          this.snackbarMessage = this.$i18n.t('validation.hasErrors'),
          this.currentSnackBarTimeout = -1
          this.showSnackbar = true
        }

        loading.stopLoading()
      },
      updateStepErrors () {
        if ((this.isEdit && (!!this.errors?.variantNames || !!this.errors?.ids)) || (!this.isEdit && !!this.errors?.tipps)) {
          this.step3Error = true
        } else {
          this.step3Error = false
        }

        if ((this.isEdit && !this.isReadonly && !this.isValid) || (!this.isEdit && (!!this.errors?.variantNames || !!this.errors?.ids))) {
          this.step2Error = true
        } else {
          this.step2Error = false
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
          this.packageItem.subjects = []
          this.packageItem.provider = undefined // organisation
          this.packageItem.nominalPlatform = undefined
          this.allNames = { name: undefined, alts: [] }
        }
        this.kbart = undefined
        this.showSnackbar = false
        this.reload(true)
      },
      async reload () {
        if (this.isEdit) {
          if(!loading.isLoading()) {
            loading.startLoading()
          }

          this.errors = {}
          this.toDelete = false
          this.showSnackbar = false
          this.newTipps = []

          const result = await this.catchError({
            promise: packageServices.get(this.id, this.cancelToken.token),
            instance: this
          })

          if (result?.status === 200) {
            this.mapRecord(result.data)
            this.updateStepErrors()

            if (this.providerSelect) {
              const providerResult = await this.catchError({
                promise: providerServices.get(this.providerSelect.id, this.cancelToken.token),
                instance: this
              })

              if (providerResult?.status === 200) {
                const fullProvider = providerResult.data

                if (fullProvider.titleNamespace) {
                  this.providerTitleNamespace = fullProvider.titleNamespace
                }
              }
            }
          } else if (result.status === 404) {
            this.notFound = true
          } else {
            this.$router.push({name: '/error'})
          }

          if (!!this.$refs.tipps) {
            await this.$refs.tipps.fetchTipps()
          }

          loading.stopLoading()
        } else {
          if (this.loggedIn && !!this.activeGroup) {
            this.allCuratoryGroups = [this.activeGroup]
          }
        }
      },
      async fetchDefaultNamespace (providerId) {
        const providerResult = await this.catchError({
          promise: providerServices.get(providerId, this.cancelToken.token),
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
        this.importJob.dismissed = false

        while (!finished) {
          const jobResult = await this.catchError({
            promise: jobServices.get(jobId, false, this.cancelToken.token),
            instance: this
          })

          this.importJob.id = jobId

          if (jobResult?.status < 400) {
            this.importProgress = jobResult.data.progress

            if (jobResult.data.finished) {
              this.importRunning = false
              this.importProgress = undefined
              this.importJob.dryRun = jobResult.data.job_result.dryRun

              if (jobResult.data.status === 'ERROR' || jobResult.data.status === 'CANCELLED') {
                this.importStatus = 'error'
              } else if (!!jobResult.data.job_result?.badrows || jobResult.data.job_result.result === 'SKIPPED') {
                this.importStatus = 'warn'

                if (jobResult.data.job_result.matchingJob) {
                  this.loadMatchingJobStatus(jobResult.data.job_result.matchingJob)
                }
              } else {
                this.importStatus = 'success'

                if (jobResult.data.job_result.matchingJob) {
                  this.loadMatchingJobStatus(jobResult.data.job_result.matchingJob)
                }
              }

              this.reload()

              finished = true
            } else {
              this.importRunning = true
              this.importStatus = 'info'
              await this.wait(500)
            }
          } else {
            this.importStatus = 'error'
            finished = true
          }
        }
      },
      async loadMatchingJobStatus (jobId) {
        var finished = false
        this.matchingJob.dismissed = false

        while (!finished) {
          const jobResult = await this.catchError({
            promise: jobServices.get(jobId, false, this.cancelToken?.token),
            instance: this
          })

          this.matchingJob.id = jobId

          if (jobResult.status < 400) {
            this.matchProgress = jobResult.data.progress

            if (jobResult.data.finished) {
              this.matchRunning = false
              this.matchProgress = undefined

              if (jobResult.data.status === 'ERROR' || jobResult.data.status === 'CANCELLED') {
                this.matchStatus = 'error'
                this.matchingJob.messageCode = jobResult.data.job_result?.messageCode || 'kbart.titleMatch.failure'
              } else {
                this.matchStatus = 'success'
              }

              finished = true
            } else {
              this.matchRunning = true
              this.matchStatus = 'info'
              await this.wait(500)
            }
          } else {
            this.matchStatus = 'error'
            finished = true
          }
        }
      },
      async getActiveJobs () {
        const jobResult = await this.catchError({
          promise: jobServices.search({ linkedItem: this.packageItem.id }, this.cancelToken.token),
          instance: this
        })

        if (jobResult.status < 400) {
          if (jobResult.data?.data.length > 0) {
            this.activeJobs = true

            jobResult.data.data.forEach((job) => {
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
        this.packageItem.ids = data._embedded.ids.map(({ id, value, namespace }) => ({
          id,
          value,
          namespace: namespace.value,
          nslabel: namespace.name || namespace.value,
          isDeletable: !!this.updateUrl
        }))
        this.allAlternateNames = data._embedded.variantNames.map(variantName => ({
          ...variantName,
          isDeletable: !!this.updateUrl
        }))
        this.allCuratoryGroups = data._embedded.curatoryGroups.map(({ name, id }) => ({
          id,
          name,
          isDeletable: !!this.updateUrl
        }))
        this.reviewRequests = data._embedded.reviewRequests
        this.providerSelect = data.provider
        this.platformSelect = data.nominalPlatform
        this.titleCount = data._tippCount
        this.allNames = {
          name: data.name,
          alts: this.allAlternateNames
        }
        this.packageItem.subjects = data._embedded.subjects.map(subject => ({
          ...subject,
          isDeletable: !!this.updateUrl
        }))
        this.listVerifiedDate = data.listVerifiedDate

        if (!!data.source) {
          this.sourceItem = data.source

          if (!!this.$refs.source) {
            this.$refs.source.fetch(this.sourceItem.id)
          }
        }

        this.lastUpdated = data.lastUpdated
        this.dateCreated = data.dateCreated

        this.overviewStates.listStatus = data.listStatus
        this.overviewStates.contentType = data.contentType
        this.overviewStates.global = data.global

        document.title = this.$i18n.tc('component.package.label') + ' – ' + data.name
      },
      triggerUpdate (checked) {
        this.urlUpdate = checked
      },
      wait (ms) {
        return new Promise((resolve) => { setTimeout(resolve, ms) })
      },
      markDeleted (val) {
        this.toDelete = val
      },
      showGroupDetails (info) {
        this.showGroupInfoPopup = true
      }
    }
  }
</script>
