<template>
  <gokb-dialog
    v-model="localValue"
    :title="header"
    :width="1000"
    :min-height="800"
    needs-close-confirm
    @submit="submitTipp"
    @confirm-close="checkForChanges"
  >
    <v-snackbar v-model="showSnackbar" :color="messageColor" :timeout="currentSnackBarTimeout">
        {{ snackbarMessage }}
        <template #actions>
          <v-icon @click="showSnackbar = false" color="white">mdi-close</v-icon>
        </template>
    </v-snackbar>

    <v-row v-if="!init" align="center" style="height:72vh;">
      <v-col cols="12" class="text-center">
        {{ $t('default.loading') }}
      </v-col>
    </v-row>
    <v-lazy v-model="init">
      <div>
        <v-row dense>
          <v-col>
            <gokb-section
              :sub-title="$t('component.general.general')"
            >
              <v-row dense>
                <v-col>
                  <gokb-name-field
                    v-model="allNames"
                    :disabled="isReadonly"
                    dense
                    :label="$tc('component.tipp.name')"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <gokb-state-select-field
                    v-if="!!packageTitleItem.status"
                    v-model="packageTitleItem.status"
                    :deletable="!!deleteUrl"
                    :editable="!!updateUrl"
                  />
                </v-col>
                <v-col cols="6">
                  <gokb-uuid-field
                    v-if="!!packageTitleItem.status"
                    :label="$t('component.general.uuid.label')"
                    v-model="packageTitleItem.uuid"
                    path="/package-title"
                    dense
                  />
                </v-col>
              </v-row>
              <v-row
                dense
                class="mt-4"
              >
                <v-col>
                  <gokb-title-field
                    v-model="packageTitleItem.title"
                    :type-filter="titleTypeString"
                    :label="$tc('component.title.label')"
                    dense
                    show-link
                    :readonly="isReadonly"
                    return-object
                  />
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <gokb-search-package-field
                    v-if="isEdit"
                    v-model="packageTitleItem.pkg"
                    :label="$tc('component.package.label')"
                    dense
                    readonly
                    return-object
                  />
                </v-col>
              </v-row>
              <v-row class="pt-4"/>
            </gokb-section>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <gokb-section
              expandable
              :mark-required="!isReadonly"
              :sub-title="$t('component.tipp.access.label')"
              v-model="showAccessSection"
            >
              <v-row
                dense
                class="mt-4"
              >
                <v-col>
                  <gokb-search-platform-field
                    v-model="packageTitleItem.hostPlatform"
                    :label="$tc('component.platform.label')"
                    :readonly="isEdit || isReadonly"
                    required
                    return-object
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <gokb-date-field
                    v-model="packageTitleItem.accessStartDate"
                    :readonly="isReadonly"
                    :label="$t('component.tipp.accessStartDate')"
                    :api-errors="errors.accessStartDate"
                  />
                </v-col>
                <v-col cols="4">
                  <gokb-date-field
                    v-model="packageTitleItem.accessEndDate"
                    :readonly="isReadonly"
                    :label="$t('component.tipp.accessEndDate')"
                    :api-errors="errors.accessEndDate"
                  />
                </v-col>
                <v-col cols="4">
                  <gokb-state-field
                    v-model="packageTitleItem.paymentType"
                    :init-item="packageTitleItem.paymentType"
                    message-path="component.tipp.paymentType"
                    url="refdata/categories/TitleInstancePackagePlatform.PaymentType"
                    :label="$t('component.tipp.paymentType.label')"
                    :readonly="isReadonly"
                  />
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <gokb-url-field
                    ref="tippUrl"
                    v-model="packageTitleItem.url"
                    :disabled="isReadonly"
                    required
                    dense
                    :label="$tc('component.tipp.url.label')"
                  />
                </v-col>
              </v-row>
            </gokb-section>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <gokb-identifier-section
              v-model="packageTitleItem.ids"
              :target-type="titleTypeString"
              :api-errors="errors.ids"
              :mark-required="!isEdit"
              :disabled="isReadonly"
              :expanded="false"
              @update="addPendingChange"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
              <gokb-subjects-section
                v-model="packageTitleItem.subjects"
                :disabled="isReadonly"
                :api-errors="errors?.subjects"
                :expanded="false"
                @update="addPendingChange"
              />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <v-toolbar
              density="compact"
              class="ml-4"
              color="header"
              flat
            >
              <span class="text-h6">
                {{ $t('component.tipp.coverage.label') }}
              </span>
              <v-btn
                icon
                @click="doExpandCoverage"
                color="primary"
              >
                <v-icon>{{ expansionIcon }}</v-icon>
              </v-btn>
              <v-spacer />
              <v-toolbar-items class="mr-8">
                <gokb-button
                  v-if="!isReadonly && coverageExpanded"
                  icon-id="mdi-plus"
                  color="primary"
                  height="38px"
                  @click.prevent="addNewCoverage"
                >
                  {{ $t('btn.add') }}
                </gokb-button>
              </v-toolbar-items>
            </v-toolbar>
              <v-expand-transition>
                <div v-if="coverageExpanded">
                  <gokb-coverage-statements-field
                      v-model="packageTitleItem.coverageStatements"
                      :is-journal="isJournal"
                      :readonly="isReadonly"
                      @valid="updateCoverageValidState"
                      @remove="registerRemovedCoverage"
                  />
                </div>
              </v-expand-transition>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <gokb-section
              :sub-title="$t('component.tipp.other.label')"
              hide-default
              expandable
              v-model="showOtherSection"
            >
              <v-row>
                <v-col>
                  <gokb-text-field
                    v-model="packageTitleItem.publisherName"
                    :disabled="isReadonly"
                    label="KBART publisher_name"
                  />
                </v-col>
                <v-col>
                  <gokb-text-field
                    v-model="packageTitleItem.series"
                    :disabled="isReadonly"
                    :label="$t('component.tipp.series.label')"
                  />
                </v-col>
              </v-row>
              <v-row dense>
                <v-col>
                  <gokb-text-field
                    v-model="packageTitleItem.subjectArea"
                    :disabled="isReadonly"
                    dense
                    :label="$t('component.tipp.subjectArea.label')"
                  />
                </v-col>
                <v-col>
                  <gokb-state-field
                    v-model="packageTitleItem.medium"
                    :init-item="packageTitleItem.medium"
                    width="100%"
                    dense
                    message-path="component.title.medium"
                    url="refdata/categories/TitleInstancePackagePlatform.Medium"
                    :label="$t('component.title.medium.label')"
                    :readonly="isReadonly"
                  />
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="6">
                  <gokb-text-field
                    v-model="packageTitleItem.importId"
                    :disabled="isEdit"
                    dense
                    :label="$t('component.tipp.importId.label')"
                  />
                </v-col>
                <v-col>
                  <gokb-state-field
                    v-model="packageTitleItem.publicationType"
                    :init-item="packageTitleItem.publicationType || titleType"
                    width="100%"
                    dense
                    return-object
                    message-path="component.tipp.publicationType"
                    url="refdata/categories/TitleInstancePackagePlatform.PublicationType"
                    :label="$t('component.tipp.publicationType.label')"
                    :readonly="isReadonly"
                  />
                </v-col>
                <v-col>
                  <gokb-date-field
                    v-model="packageTitleItem.lastChangedExternal"
                    readonly
                    dense
                    :label="$t('component.tipp.lastChangedExternal')"
                  />
                </v-col>
              </v-row>
              <v-row
                v-if="isBook"
                dense
              >
                <v-col>
                  <gokb-date-field
                    v-model="packageTitleItem.dateFirstInPrint"
                    :readonly="isReadonly"
                    dense
                    :label="$t('component.title.firstPublishedInPrint')"
                  />
                </v-col>
                <v-col>
                  <gokb-date-field
                    v-model="packageTitleItem.dateFirstOnline"
                    :readonly="isReadonly"
                    dense
                    :label="$t('component.title.firstPublishedOnline')"
                  />
                </v-col>
              </v-row>
              <v-row
                v-if="isBook"
                dense
              >
                <v-col>
                  <gokb-text-field
                    v-model="packageTitleItem.firstAuthor"
                    :disabled="isReadonly"
                    dense
                    :label="$t('component.title.firstAuthor.label')"
                  />
                </v-col>
                <v-col>
                  <gokb-text-field
                    v-model="packageTitleItem.firstEditor"
                    :disabled="isReadonly"
                    dense
                    :label="$t('component.title.firstEditor.label')"
                  />
                </v-col>
                <v-col>
                  <gokb-text-field
                    v-model="packageTitleItem.editionStatement"
                    :disabled="isReadonly"
                    dense
                    :label="$t('component.title.editionStatement')"
                  />
                </v-col>
                <v-col cols="3">
                  <gokb-text-field
                    v-model="packageTitleItem.volumeNumber"
                    :disabled="isReadonly"
                    dense
                    :label="$t('component.title.volumeNumber')"
                  />
                </v-col>
              </v-row>
            </gokb-section>
          </v-col>
        </v-row>
      </div>
    </v-lazy>
    <template #buttons>
      <v-btn
        v-if="isEdit"
        class="ml-6"
        variant="elevated"
        :to="{ name: '/package-title', params: { id: this.packageTitleItem.id} }"
        target="_blank"
      >
        {{ $t('component.tipp.toFullView') }}
      </v-btn>
      <v-spacer />
        <div v-if="isEdit">
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
            <span class="ml-1">{{ dateCreated }}</span>
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
            <span class="ml-1">{{ lastUpdated }}</span>
          </v-chip>
        </div>
      <v-spacer />
      <gokb-button
        class="mr-6"
        color="secondary"
        @click.prevent="checkForChanges"
      >
        {{ updateUrl ? $t('btn.cancel') : $t('btn.close') }}
      </gokb-button>
      <gokb-button
        v-if="updateUrl || !packageTitleItem.status"
        :disabled="!isValid"
        class="mr-6"
        is-submit
      >
        {{ selected ? $t('btn.update') : $t('btn.add') }}
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import accountModel from '@/shared/models/account-model'
  import tippServices from '@/shared/services/tipp-services'
  import { EDIT_TITLE_ROUTE, EDIT_TIPP_ROUTE } from '@/router/route-paths'
  import utils from '@/shared/utils/utils'
  import log from '@/shared/utils/logger'

  const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/

  const TARGET_TYPES = {
    "Serial": "Journal",
    "Journal": "Journal",
    "Monograph": "Book",
    "Book": "Book",
    "Database": "Database",
    "Title": "Other",
    "Other": "Other"
  }

  export default {
    name: 'GokbAddTitlePopup',
    extends: BaseComponent,
    emits: ['update:model-value', 'edit', 'add'],
    props: {
      modelValue: {
        type: [Number, String],
        required: true,
        default: undefined
      },
      selected: {
        type: Object,
        required: false,
        default: undefined
      },
      pkg: {
        type: [Number, String],
        required: false,
        default: undefined
      },
      parentPlatform: {
        type: Object,
        required: false,
        default: undefined
      },
      titleType: {
        type: Object,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        pprops: undefined,
        errors: {},
        toDelete: false,
        urlValid: false,
        coverageExpanded: false,
        titleTypeString: undefined,
        showAccessSection: true,
        showOtherSection: false,
        init: false,
        showLoading: true,
        coverageValid: true,
        coverageObject: {
          coverageDepth: undefined, // Abstracts, Fulltext, Selected Articles
          startDate: undefined,
          endDate: undefined,
          startVolume: undefined, // number
          endVolume: undefined, // number
          startIssue: undefined, // number
          endIssue: undefined, // number
          coverageNote: undefined, // note
          embargo: undefined,
          valid: true
        },
        updateUrl: undefined,
        deleteUrl: undefined,
        successMsg: undefined,
        errorMsg: undefined,
        showSnackbar: false,
        snackbarMessage: undefined,
        messageColor: undefined,
        currentSnackBarTimeout: '-1',
        version: undefined,
        items: [],
        allNames: {
          name: undefined,
          alts: []
        },
        lastUpdated: undefined,
        dateCreated: undefined,
        lastLoad: undefined,
        pendingChanges: {},
        packageTitleItem: {
          id: undefined,
          title: undefined,
          pkg: undefined,
          hostPlatform: undefined,
          importId: undefined,
          status: undefined,
          paymentType: undefined,
          url: undefined,
          name: undefined,
          accessStartDate: undefined,
          accessEndDate: undefined,
          ids: [],
          subjects: [],
          coverageStatements: [
            {
              coverageDepth: undefined, // Abstracts, Fulltext, Selected Articles
              startDate: undefined,
              endDate: undefined,
              startVolume: undefined, // number
              endVolume: undefined, // number
              startIssue: undefined, // number
              endIssue: undefined, // number
              coverageNote: undefined, // note
              embargo: undefined,
              valid: true
            }
          ],
          series: undefined,
          subjectArea: undefined,
          publisherName: undefined,
          dateFirstInPrint: undefined,
          dateFirstOnline: undefined,
          firstAuthor: undefined,
          firstEditor: undefined,
          publicationType: undefined,
          volumeNumber: undefined,
          editionStatement: undefined,
          medium: undefined,
          lastChangedExternal: undefined
        }
      }
    },
    computed: {
      header () {
        return !this.isReadonly ?
                (this.packageTitleItem.id ?
                    (this.$i18n.t('header.edit.label', [this.$i18n.tc('component.tipp.label')]) + ' – ' + this.typeLabel) :
                    (this.$i18n.t('header.add.label', [this.$i18n.tc('component.tipp.label')]) + ' – ' + this.typeLabel)
                ) :
                (this.typeLabel + ' – ' + this.$i18n.tc('component.tipp.label'))
      },
      typeLabel () {
        return this.titleTypeString ? this.$i18n.tc('component.title.type.' + this.titleTypeString) : this.$i18n.tc('component.title.label')
      },
      isEdit () {
        return !!this.packageTitleItem?.id && !!this.version
      },
      isReadonly () {
        return !accountModel.loggedIn || !accountModel.hasRole('ROLE_EDITOR') || (this.isEdit && !this.updateUrl)
      },
      isJournal () {
        return this.titleTypeString === 'Journal' || this.packageTitleItem.publicationType?.name === 'Serial'
      },
      isBook () {
        return this.titleTypeString === 'Book' || this.packageTitleItem.publicationType?.name === 'Monograph'
      },
      isValid () {
        return (!!this.allNames.name &&
                !!this.packageTitleItem.hostPlatform &&
                (this.isEdit || this.packageTitleItem.ids.length > 0) &&
                this.packageTitleItem.url &&
                URL_REGEX.test(this.packageTitleItem.url) &&
                this.coverageValid)
      },
      expansionIcon () {
        return this.coverageExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'
      },
      isCoverageExpanded () {
        return this.coverageExpanded
      },
      localSuccessMessage () {
        return this.successMsg ? this.$i18n.t(this.successMsg, [this.$i18n.tc('component.tipp.label')]) : undefined
      },
      localErrorMessage () {
        return this.errorMsg ? this.$i18n.t(this.errorMsg, [this.$i18n.tc('component.tipp.label')]) : undefined
      },
      localValue: {
        get () {
          return !!this.modelValue
        },
        set (val) {
          this.$emit('update:model-value', val)
        }
      },
      accessInterval: {
        get () {
          return [this.packageTitleItem.accessStartDate, this.packageTitleItem.accessEndDate]
        },
        set ([from, to]) {
          this.packageTitleItem.accessStartDate = from
          this.packageTitleItem.accessEndDate = to
        }
      }
    },
    watch: {
      'packageTitleItem.title': {
        handler(title) {
          if (!this.packageTitleItem.status) {
            if (!!title && !!title._embedded) {
              this.packageTitleItem.ids = title._embedded.ids
                .filter(({ namespace }) => (
                  ['issn', 'eissn', 'isbn', 'pisbn', 'zdb'].includes(namespace.value))
                )
                .map(({ value, namespace }) => ({
                  id: this.tempId(),
                  value,
                  namespace: namespace.value,
                  nslabel: (namespace.name || namespace.value),
                  isDeletable: true
                }))
              this.allNames.name = title.name

              if (title.type === 'Book') {
                this.packageTitleItem.firstAuthor = title.firstAuthor
                this.packageTitleItem.firstEditor = title.firstEditor
                this.packageTitleItem.dateFirstInPrint = title.dateFirstInPrint
                this.packageTitleItem.dateFirstOnline = title.dateFirstOnline
                this.packageTitleItem.editionStatement = title.editionStatement
                this.packageTitleItem.volumeNumber = title.volumeNumber
              }
              this.packageTitleItem.publisherName = title.publisher?.name || undefined
            }
            else {
              this.packageTitleItem.ids = []
            }
          }
        },
        deep: true
      }
    },
    async created () {
      if (this.selected) {
        this.mapRecord(this.selected)
      } else {
        this.titleTypeString = TARGET_TYPES[this.titleType.id]
        this.packageTitleItem.hostPlatform = this.parentPlatform
        this.packageTitleItem.publicationType = this.titleType.id
      }
      this.coverageExpanded = !this.isEdit && this.titleTypeString === 'Serial'
    },
    mounted () {
      this.showLoading = false
    },
    methods: {
      checkForChanges () {
        if (this.isReadonly || !this.hasUnsavedChanges()) {
          this.close()
        }
        else {
          const confirmed = window.confirm(this.$i18n.t('popups.confirm.pendingChanges.label'))

          if (confirmed) {
            this.close()
          }
        }
      },
      addPendingChange (prop) {
        if (!this.pendingChanges[prop]) {
          this.pendingChanges[prop] = true
        }
      },
      hasUnsavedChanges () {
        log.debug("Check for unsaved changes ..")
        if (!!this.pendingChanges && Object.keys(this.pendingChanges).length > 0) {
          log.debug('hasUnsavedChanges :: pendingChanges: ' + this.pendingChanges)
          return true
        }

        if (!!this.lastLoad?.id) {
          for (var [key, val] of Object.entries(this.lastLoad)) {
            if (key === 'name' && this.allNames.name !== val) {
              return true
            }
            else if (key === 'coverageStatements') {
              if (val.length !== this.packageTitleItem.coverageStatements.length) {
                return true
              }
              else {
                for (const [idx, cs] of val.entries()) {
                  let current_cs = this.packageTitleItem.coverageStatements[idx]

                  for (var [cs_field, cs_val] of Object.entries(cs)) {
                    if (cs_field !== 'owner') {
                      if (cs_field === 'coverageDepth') {
                        if (utils.hasLinkedFieldChanged(cs_val, current_cs.coverageDepth)) {
                          log.debug('hasUnsavedChanges :: coverageStatement ' + idx + ' - ' + cs_field)
                          return true
                        }
                      }
                      else if (cs_val !== current_cs[cs_field]) {
                        log.debug('hasUnsavedChanges :: coverageStatement ' + idx + ' - ' + cs_field)
                        return true
                      }
                    }
                  }
                }
              }
            }
            else if (typeof val === 'array') {
              // Array fields will have already been handled by check for entries in this.pendingChanges
            }
            else if (typeof val === 'object') {
              if (this.packageTitleItem.hasOwnProperty(key) && utils.hasLinkedFieldChanged(val, this.packageTitleItem[key])) {
                log.debug('hasUnsavedChanges :: changed linked field ' + key + '!')
                return true
              }
            }
            else if (this.packageTitleItem.hasOwnProperty(key) && val !== this.packageTitleItem[key]) {
              log.debug('hasUnsavedChanges :: changed field ' + key + ': ' + val + '<>' + this.packageTitleItem[key])
              return true
            }
          }
        }
        else if (!!this.allNames.name || !!this.packageTitleItem.url) {
          log.debug('hasUnsavedChanges :: no lastload, pending name!')
          return true
        }

        return false
      },
      close () {
        this.localValue = false
      },
      async submitTipp () {
        this.errors = {}
        this.showSnackbar = false

        if (this.selected && typeof this.selected.id === 'number') {
          const activeGroup = accountModel.activeGroup()

          const newTipp = {
            ...this.packageTitleItem,
            name: this.allNames.name,
            ids: this.packageTitleItem.ids.map(id => ({
              value: id.value,
              type: id.namespace
            })),
            publicationType: this.packageTitleItem.publicationType ? (this.packageTitleItem.publicationType.name || this.packageTitleItem.publicationType.value) : null,
            variantNames: this.allNames.alts.map(({ variantName, id, locale, variantType }) => ({
              variantName,
              locale,
              variantType,
              id: typeof id === 'number' ? id : null
            })),
            subjects: this.packageTitleItem.subjects.map(subject => ({
              heading: subject.heading,
              scheme: subject.scheme
            })),
            status: typeof this.packageTitleItem.status === 'string' ? { name: this.packageTitleItem.status } : this.packageTitleItem.status,
            activeGroup: activeGroup
          }

          const response = await this.catchError({
            promise: tippServices.createOrUpdate(newTipp, this.cancelToken.token),
            instance: this
          })

          if (response.status < 400) {
            const edited = {
              ...this.packageTitleItem,
              popup: {
                value: (this.pkg ? (this.packageTitleItem.title ? this.packageTitleItem.title.name : this.packageTitleItem.name) : this.packageTitleItem.pkg.name),
                label: 'tipp',
                type: 'GokbAddTitlePopup'
              },
              hostPlatformName: this.packageTitleItem.hostPlatform?.name,
              titleType: this.titleTypeString,
            }
            this.$emit('edit', edited)
            this.close()
          } else {
            if (response.status === 409) {
              this.messageColor = 'error'
              this.snackbarMessage = this.$i18n.t('error.update.409', [this.$i18n.tc('component.tipp.label')])
              this.currentSnackBarTimeout = -1
              this.showSnackbar = true
            } else if (response.status === 500) {
              this.messageColor = 'error'
              this.snackbarMessage = this.$i18n.t('error.general.500', [this.$i18n.tc('component.tipp.label')]),
              this.currentSnackBarTimeout = -1
              this.showSnackbar = true
            } else {
              this.messageColor = 'error'
              this.snackbarMessage = this.$i18n.t(this.isEdit ? 'error.update.400' : 'error.create.400', [this.$i18n.tc('component.tipp.label')]),
              this.currentSnackBarTimeout = -1
              this.showSnackbar = true
              this.errors = response.data.error


              if (!!response.data.error.coverageStatements) {
                for (const [key, val] of Object.entries(response.data.error.coverageStatements)) {
                  this.packageTitleItem.coverageStatements[parseInt(key)].errors = val
                }
              }
            }
          }
        } else {
          if (this.packageTitleItem.title && !this.packageTitleItem.title.type) {
            this.packageTitleItem.title.type = this.titleTypeString
          }
          this.packageTitleItem.name = this.allNames.name

          const newTipp = {
            ...this.packageTitleItem,
            id: this.tempId(),
            connectedTitleId: this.packageTitleItem.title?.id || null,
            ids: this.packageTitleItem.ids.map(ido => ({
              value: ido.value,
              type: ido.namespace
            })),
            variantNames: this.allNames.alts.map(({ variantName, id, locale, variantType }) => ({
              variantName,
              locale,
              variantType,
              id: typeof id === 'number' ? id : null
            })),
            status: typeof this.packageTitleItem.status === 'string' ? { name: this.packageTitleItem.status } : this.packageTitleItem.status,
            publicationType: this.packageTitleItem.publicationType ? (this.packageTitleItem.publicationType.name || this.packageTitleItem.publicationType.value) : null,
            popup: { value: this.packageTitleItem.name, label: 'tipp', type: 'GokbAddTitlePopup' },
            link: { value: (this.packageTitleItem.title?.name), route: EDIT_TITLE_ROUTE, id: 'connectedTitleId' },
            hostPlatformName: this.packageTitleItem.hostPlatform?.name,
            version: this.version,
            updateUrl: '',
            deleteUrl: '',
            isDeletable: true,
            _pending: 'added'
          }

          if (this.selected?.id) {
            this.$emit('edit', newTipp)
          } else {
            this.$emit('add', newTipp)
          }
          this.close()
        }
      },
      tempId () {
        return 'tempTippId' + Math.random().toString(36).substring(2, 5)
      },
      decodeEmbargo () {
        const matches = this.packageTitleItem.coverageStatement.embargo?.match(/^([P,R]?)([0-9]*)([D,M,Y]?)$/)
        const [, type, duration, unit] = matches || []
        return { type, duration, unit }
      },
      doExpandCoverage () {
        this.coverageExpanded = !this.coverageExpanded
      },
      openDetails () {
        this.$router.push({ name: EDIT_TIPP_ROUTE, params: { id: this.packageTitleItem.id } })
      },
      addNewCoverage () {
        this.pendingChanges.coverage = true
        this.packageTitleItem.coverageStatements.push(this.coverageObject)
      },
      registerRemovedCoverage () {
        this.pendingChanges.coverage = true
      },
      updateCoverageValidState(val) {
        this.coverageValid = val
      },
      mapRecord (data) {
        const new_item_info = {
          id: data.id,
          hostPlatform: data.hostPlatform,
          name: data.name,
          pkg: data.pkg,
          title: data.title,
          url: data.url,
          uuid: data.uuid,
          paymentType: data.paymentType,
          accessStartDate: data.accessStartDate,
          accessEndDate: data.accessEndDate,
          series: data.series,
          subjectArea: data.subjectArea,
          publisherName: data.publisherName,
          dateFirstInPrint: data.dateFirstInPrint,
          dateFirstOnline: data.dateFirstOnline,
          firstAuthor: data.firstAuthor,
          firstEditor: data.firstEditor,
          publicationType: data.publicationType,
          volumeNumber: data.volumeNumber,
          editionStatement: data.editionStatement,
          medium: data.medium,
          lastChangedExternal: data.lastChangedExternal,
          status: data.status,
          importId: data.importId,
        }

        if (data?.coverageStatements?.length) {
          new_item_info.coverageStatements = data.coverageStatements.map(statement => ({
            ...statement,
            startDate: statement.startDate && this.buildDateString(statement.startDate),
            endDate: statement.endDate && this.buildDateString(statement.endDate),
            valid: true
          }))
        }

        this.lastLoad = structuredClone(utils.toRawDeep(new_item_info))

        new_item_info.subjects = data._embedded.subjects.map(subject => ({
          ...subject,
          isDeletable: !!this.updateUrl
        }))

        this.allNames = {
          name: data.name,
          alts: data.variantNames
        }

        new_item_info.ids = data.ids

        this.version = data.version
        this.lastUpdated = !!data.lastUpdated ? new Date(data.lastUpdated).toLocaleString('sv') : undefined
        this.dateCreated = !!data.dateCreated ? new Date(data.dateCreated).toLocaleString('sv') : undefined
        this.updateUrl = data.updateUrl
        this.deleteUrl = data.deleteUrl

        this.packageTitleItem = new_item_info

        if (data.title?.type) {
          this.titleTypeString = data.title.type
        }
        else {
          this.titleTypeString = this.packageTitleItem.publicationType ? TARGET_TYPES[this.packageTitleItem.publicationType.name || this.packageTitleItem.publicationType.value] : undefined
        }
      },
      markDeleted (val) {
        this.toDelete = val
      }
    }
  }
</script>
