<template>
  <gokb-dialog
    v-model="localValue"
    :title="header"
    :width="1000"
    @submit="submitTipp"
  >
    <v-snackbars :objects.sync="eventMessages">
      <template #action="{ close }">
        <v-btn icon @click="close()"><v-icon>mdi-close</v-icon></v-btn>
      </template>
    </v-snackbars>

    <v-row v-if="!init" align="center" style="height:200px;">
      <v-col cols="12" class="text-center">
        {{ $t('default.loading') }}
      </v-col>
    </v-row>
    <v-lazy v-model="init">
      <div>
        <v-row dense>
          <v-col>
            <gokb-section
              expandable
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
                    v-if="status"
                    v-model="packageTitleItem.status"
                    :deletable="!!deleteUrl"
                    :editable="!!updateUrl"
                  />
                </v-col>
                <v-col cols="6">
                  <gokb-uuid-field
                    v-if="id"
                    :label="$t('component.general.uuid.label')"
                    :value="uuid"
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
              <v-row class="pt-4" />
            </gokb-section>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <gokb-section
              expandable
              :mark-required="!isReadonly"
              :sub-title="$t('component.tipp.access.label')"
              hide-default
            >
              <v-row
                dense
                class="mt-4"
              >
                <v-col>
                  <gokb-search-platform-field
                    v-model="packageTitleItem.hostPlatform"
                    :items="platformSelection"
                    :label="$tc('component.platform.label')"
                    :readonly="isEdit || isReadonly"
                    required
                    dense
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
                  />
                </v-col>
                <v-col cols="4">
                  <gokb-date-field
                    v-model="packageTitleItem.accessEndDate"
                    :readonly="isReadonly"
                    :label="$t('component.tipp.accessEndDate')"
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
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
              <gokb-subjects-section
                v-model="packageTitleItem.subjects"
                :disabled="isReadonly"
                :api-errors="errors?.subjects"
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
              >
                <v-icon>{{ expansionIcon }}</v-icon>
              </v-btn>
              <v-spacer />
              <v-toolbar-items class="pa-2">
                <gokb-button
                  v-if="!isReadonly && coverageExpanded"
                  icon-id="mdi-plus"
                  is-submit
                  @click="addNewCoverage"
                >
                  {{ $t('btn.add') }}
                </gokb-button>
              </v-toolbar-items>
            </v-toolbar>
              <v-expand-transition>
                <div v-if="coverageExpanded">
                  <v-row
                    v-for="(statement, idx) in packageTitleItem.coverageStatements"
                    :key="idx"
                    dense
                  >
                    <v-col>
                      <gokb-section no-tool-bar>
                        <v-row>
                          <v-col cols="4">
                            <gokb-state-field
                              v-model="statement.coverageDepth"
                              :readonly="isReadonly"
                              :init-item="statement.coverageDepth"
                              :label="$t('component.tipp.coverage.depth.label')"
                              message-path="component.tipp.coverage.depth"
                              url="refdata/categories/TIPPCoverageStatement.CoverageDepth"
                            />
                          </v-col>
                          <v-col>
                            <gokb-textarea-field
                              v-model="statement.coverageNote"
                              :disabled="isReadonly"
                              :label="$t('component.tipp.coverage.note')"
                            />
                          </v-col>
                          <v-col
                            v-if="!isReadonly"
                            cols="1"
                            class="pt-6 mr-2"
                          >
                            <v-btn
                              icon
                              :title="$t('btn.delete')"
                              @click="removeCoverage(idx)"
                            >
                              <v-icon>
                                mdi-delete
                              </v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-row v-if="isJournal">
                          <v-col md="4">
                            <gokb-date-field
                              v-model="statement.startDate"
                              :readonly="isReadonly"
                              dense
                              :label="$t('component.tipp.coverage.startDate')"
                            />
                          </v-col>
                          <v-col md="4">
                            <gokb-text-field
                              v-model="statement.startVolume"
                              :disabled="isReadonly"
                              dense
                              :label="$t('component.tipp.coverage.startVolume')"
                            />
                          </v-col>
                          <v-col md="4">
                            <gokb-text-field
                              v-model="statement.startIssue"
                              :disabled="isReadonly"
                              dense
                              :label="$t('component.tipp.coverage.startIssue')"
                            />
                          </v-col>
                        </v-row>
                        <v-row v-if="isJournal">
                          <v-col md="4">
                            <gokb-date-field
                              v-model="statement.endDate"
                              :readonly="isReadonly"
                              dense
                              :label="$t('component.tipp.coverage.endDate')"
                            />
                          </v-col>
                          <v-col md="4">
                            <gokb-text-field
                              v-model="statement.endVolume"
                              :disabled="isReadonly"
                              dense
                              :label="$t('component.tipp.coverage.endVolume')"
                            />
                          </v-col>
                          <v-col md="4">
                            <gokb-text-field
                              v-model="statement.endIssue"
                              :disabled="isReadonly"
                              dense
                              :label="$t('component.tipp.coverage.endIssue')"
                            />
                          </v-col>
                        </v-row>
                        <v-row dense>
                          <v-col>
                            <gokb-embargo-field
                              v-model="statement.embargo"
                              :readonly="isReadonly"
                            />
                          </v-col>
                        </v-row>
                      </gokb-section>
                    </v-col>
                  </v-row>
                </div>
              </v-expand-transition>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <gokb-prices-section
              v-model="packageTitleItem.prices"
              :disabled="isReadonly"
              :expanded="false"
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <gokb-section
              :sub-title="$t('component.tipp.other.label')"
              hide-default
              expandable
            >
              <v-row>
                <v-col>
                  <gokb-text-field
                    v-model="packageTitleItem.publisherName"
                    :disabled="isReadonly"
                    :label="$tc('component.title.publisher.label')"
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
        :to="{ name: '/package-title', params: { id: id} }"
        target="_blank"
      >
        {{ $t('component.tipp.toFullView') }}
      </v-btn>
      <v-spacer />
      <v-spacer />
      <gokb-button
        class="mr-6"
        color="secondary"
        @click="close"
      >
        {{ updateUrl ? $t('btn.cancel') : $t('btn.close') }}
      </gokb-button>
      <gokb-button
        v-if="updateUrl || !id"
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
  import VSnackbars from 'v-snackbars'
  import { EDIT_TITLE_ROUTE, EDIT_TIPP_ROUTE } from '@/router/route-paths'

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
    components: { VSnackbars },
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
        platformSelection: [],
        coverageExpanded: false,
        titleTypeString: undefined,
        init: false,
        showLoading: true,
        coverageObject: {
          coverageDepth: undefined, // Abstracts, Fulltext, Selected Articles
          startDate: undefined,
          endDate: undefined,
          startVolume: undefined, // number
          endVolume: undefined, // number
          startIssue: undefined, // number
          endIssue: undefined, // number
          coverageNote: undefined, // note
          embargo: undefined
        },
        updateUrl: undefined,
        deleteUrl: undefined,
        successMsg: undefined,
        errorMsg: undefined,
        eventMessages: [],
        status: undefined,
        version: undefined,
        items: [],
        id: undefined,
        uuid: undefined,
        allNames: {
          name: undefined,
          alts: []
        },
        lastUpdated: undefined,
        dateCreated: undefined,
        packageTitleItem: {
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
          prices: [],
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
              embargo: undefined
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
                (this.id ?
                    (this.$i18n.t('header.edit.label', [this.$i18n.tc('component.tipp.label')]) + ' – ' + this.typeLabel) :
                    (this.$i18n.t('header.add.label', [this.$i18n.tc('component.tipp.label')]) + ' – ' + this.typeLabel)
                ) :
                (this.typeLabel + ' – ' + this.$i18n.tc('component.tipp.label'))
      },
      typeLabel () {
        return this.titleTypeString ? this.$i18n.tc('component.title.type.' + this.titleTypeString) : this.$i18n.tc('component.title.label')
      },
      isEdit () {
        return !!this.id && !!this.version
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
        return !!this.allNames.name && !!this.packageTitleItem.hostPlatform && (this.isEdit || this.packageTitleItem.ids.length > 0) && this.packageTitleItem.url && URL_REGEX.test(this.packageTitleItem.url)
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
        set () {
          this.$emit('update:model-value', false)
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
      'packageTitleItem.title'(title) {
        if (!!title && !this.isEdit) {
          if (this.packageTitleItem.ids?.length == 0) {
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
          }
          if (!this.allNames.name) {
            this.allNames.name = title.name
          }

          if (!!title.firstAuthor) {
            this.packageTitleItem.firstAuthor = title.firstAuthor
          }

          if (!!title.firstEditor) {
            this.packageTitleItem.firstEditor = title.firstEditor
          }

          if (!!title.dateFirstInPrint) {
            this.packageTitleItem.dateFirstInPrint = title.dateFirstInPrint
          }

          if (!!title.dateFirstOnline) {
            this.packageTitleItem.dateFirstOnline = title.dateFirstOnline
          }

          if (!this.packageTitleItem.publisherName && !!title.publisher) {
            this.packageTitleItem.publisherName = title.publisher.name
          }
        }
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
      async submitTipp () {
        console.log("Submit ..")
        this.errors = {}
        this.eventMessages = []

        if (this.selected && typeof this.selected.id === 'number') {
          const activeGroup = accountModel.activeGroup()

          const newTipp = {
            ...this.packageTitleItem,
            name: this.allNames.name,
            ids: this.packageTitleItem.ids.map(id => ({
              value: id.value,
              type: id.namespace
            })),
            prices: this.packageTitleItem.prices.map(price => ({
              ...price,
              id: (typeof price.id === 'number' ? price.id : null)
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
            id: this.id,
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
              this.eventMessages.push({
                message: this.$i18n.t('error.update.409'),
                color: 'error',
                timeout: -1
              })
            } else if (response.status === 500) {
              this.eventMessages.push({
                message: this.$i18n.t('error.general.500'),
                color: 'error',
                timeout: -1
              })
            } else {
              this.eventMessages.push({
                message: this.$i18n.t(this.isEdit ? 'error.update.400' : 'error.create.400'),
                color: 'error',
                timeout: -1
              })
              this.errors = response.data.error
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
            prices: this.packageTitleItem.prices.map(price => ({
              ...price,
              type: price.priceType,
              id: (typeof price.id === 'number' ? price.id : null)
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
      close () {
        this.localValue = false
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
        this.$router.push({ name: EDIT_TIPP_ROUTE, params: { id: this.id } })
      },
      addNewCoverage () {
        this.packageTitleItem.coverageStatements.push(this.coverageObject)
      },
      removeCoverage (idx) {
        this.packageTitleItem.coverageStatements.splice(idx, 1)

        if (this.packageTitleItem.coverageStatements.length === 0) {
          this.packageTitleItem.coverageStatements.push(this.coverageObject)
        }
      },
      mapRecord (data) {
        this.packageTitleItem.hostPlatform = data.hostPlatform
        this.packageTitleItem.name = data.name
        this.packageTitleItem.pkg = data.pkg
        this.packageTitleItem.title = data.title
        this.packageTitleItem.url = data.url
        this.packageTitleItem.uuid = data.uuid
        this.packageTitleItem.paymentType = data.paymentType
        this.packageTitleItem.accessStartDate = data.accessStartDate
        this.packageTitleItem.accessEndDate = data.accessEndDate
        this.packageTitleItem.ids = data.ids
        this.packageTitleItem.prices = data.prices
        this.packageTitleItem.series = data.series
        this.packageTitleItem.subjects = data.subjects
        this.packageTitleItem.subjectArea = data.subjectArea
        this.packageTitleItem.publisherName = data.publisherName
        this.packageTitleItem.dateFirstInPrint = data.dateFirstInPrint
        this.packageTitleItem.dateFirstOnline = data.dateFirstOnline
        this.packageTitleItem.firstAuthor = data.firstAuthor
        this.packageTitleItem.firstEditor = data.firstEditor
        this.packageTitleItem.publicationType = data.publicationType
        this.packageTitleItem.volumeNumber = data.volumeNumber
        this.packageTitleItem.editionStatement = data.editionStatement
        this.packageTitleItem.medium = data.medium
        this.packageTitleItem.lastChangedExternal = data.lastChangedExternal
        this.packageTitleItem.status = data.status
        this.packageTitleItem.importId = data.importId
        this.updateUrl = data.updateUrl
        this.deleteUrl = data.deleteUrl
        this.platformSelection.push(data.hostPlatform)
        this.status = data.status
        this.version = data.version
        this.lastUpdated = data.lastUpdated
        this.dateCreated = data.dateCreated
        this.allNames.name = data.name
        this.allNames.alts = data.variantNames

        if (data?.coverageStatements?.length) {
          this.packageTitleItem.coverageStatements = data.coverageStatements.map(statement => ({
            ...statement,
            startDate: statement.startDate && this.buildDateString(statement.startDate),
            endDate: statement.endDate && this.buildDateString(statement.endDate)
          }))
        }

        this.id = data.id
        this.uuid = data.uuid
        this.packageTitleItem.id = this.id

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
