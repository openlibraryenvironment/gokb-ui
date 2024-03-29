<template>
  <div>
    <v-snackbars :objects.sync="eventMessages">
      <template #action="{ close }">
        <v-btn icon @click="close()"><v-icon>mdi-close</v-icon></v-btn>
      </template>
    </v-snackbars>
    <gokb-page
      v-if="!notFound"
      :key="version"
      :title="$tc('component.tipp.label')"
      @submit="update"
    >
      <gokb-error-component :value="error" />
      <gokb-section :sub-title="$t('component.general.general')">
        <v-row>
          <v-col>
            <gokb-name-field
              v-model="allNames"
              :disabled="isReadonly"
              :label="$tc('component.tipp.name')"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <gokb-state-select-field
              v-if="status"
              v-model="packageTitleItem.status"
              :deletable="!isReadonly"
              :editable="!isReadonly"
              @delete="markDeleted"
            />
          </v-col>
          <v-col cols="6" xl="3">
            <gokb-uuid-field
              v-if="id"
              :label="$t('component.general.uuid.label')"
              :value="uuid"
              path="/package-title"
              dense
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <gokb-title-field
              v-model="packageTitleItem.title"
              :label="titleLabel"
              :readonly="isReadonly"
              return-object
              show-link
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <gokb-search-package-field
              v-model="packageTitleItem.pkg"
              :label="$tc('component.package.label')"
              :readonly="true"
              return-object
            />
          </v-col>
        </v-row>
        <v-row class="pb-4" />
      </gokb-section>
      <v-row style="min-height:410px">
        <v-col>
          <v-tabs
            v-model="tab"
            class="mx-4"
          >
            <v-tabs-slider color="black" />
            <v-tab
              key="access"
              :active-class="tabClass"
            >
              {{ $t('component.tipp.access.label') }}
            </v-tab>
            <v-tab
              key="coverage"
              :active-class="tabClass"
            >
              {{ $t('component.tipp.coverage.label') }}
              <v-icon
                v-if="pendingChanges.coverage"
                class="pb-1"
                :title="$t('pending.lists.changed')"
                small
              >
                mdi-alert-decagram
              </v-icon>
            </v-tab>
            <v-tab
              key="identifiers"
              :style="[!!errors.ids ? { border: '1px solid red', borderRadius: '2px' } : {}]"
              :active-class="tabClass"
            >
              {{ $tc('component.identifier.label', 2) }}
              <v-chip
                v-if="id"
                class="ma-2"
              >
                {{ idsTotal }}
              </v-chip>
              <v-icon
                v-if="pendingChanges.ids"
                :title="$t('pending.lists.changed')"
                small
              >
                mdi-alert-decagram
              </v-icon>
            </v-tab>
            <v-tab
              key="subjects"
              :active-class="tabClass"
            >
              {{ $tc('component.subject.label', 2) }}
              <v-chip class="ma-2">
                {{ packageTitleItem.subjects.length }}
              </v-chip>
              <v-icon
                v-if="pendingChanges.subjects"
                :title="$t('pending.lists.changed')"
                small
              >
                mdi-alert-decagram
              </v-icon>
            </v-tab>
            <v-tab
              v-if="id && loggedIn"
              key="reviews"
              :active-class="tabClass"
            >
              {{ $tc('component.review.label', 2) }}
              <v-chip
                v-if="id"
                class="ma-2"
              >
                {{ reviewsCount }}
              </v-chip>
            </v-tab>
            <v-tab
              key="other"
              :active-class="tabClass"
            >
              {{ $t('component.tipp.other.label') }}
            </v-tab>
            <v-tab
              key="prices"
              :active-class="tabClass"
            >
              {{ $tc('component.tipp.prices.label', 2) }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item key="access">
              <gokb-section no-tool-bar>
                <v-row dense>
                  <v-col>
                    <gokb-search-platform-field
                      v-model="packageTitleItem.hostPlatform"
                      :items="platformSelection"
                      :label="$tc('component.platform.label')"
                      :readonly="isEdit || isReadonly"
                      :query-fields="platformQueryFields"
                      return-object
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <gokb-date-field
                      v-model="packageTitleItem.accessStartDate"
                      :readonly="isReadonly"
                      :label="$t('component.tipp.accessStartDate')"
                    />
                  </v-col>
                  <v-col>
                    <gokb-date-field
                      v-model="packageTitleItem.accessEndDate"
                      :readonly="isReadonly"
                      :label="$t('component.tipp.accessEndDate')"
                    />
                  </v-col>
                  <v-col>
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
                <v-row>
                  <v-col>
                    <gokb-url-field
                      v-model="packageTitleItem.url"
                      :disabled="isReadonly"
                      :label="$tc('component.tipp.url.label')"
                    />
                  </v-col>
                </v-row>
              </gokb-section>
            </v-tab-item>
            <v-tab-item key="coverage">
              <v-toolbar
                dense
                flat
              >
                <span class="text-h6">
                  {{ $t('component.tipp.coverage.label') }}
                </span>
                <v-spacer />
                <v-toolbar-items class="pa-2">
                  <gokb-button
                    v-if="!isReadonly"
                    icon-id="mdi-plus"
                    @click="addNewCoverage"
                  >
                    {{ $t('btn.add') }}
                  </gokb-button>
                </v-toolbar-items>
              </v-toolbar>
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
                        class="pt-6"
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
                    <v-row
                      v-if="isJournal"
                      dense
                    >
                      <v-col cols="4">
                        <gokb-date-field
                          v-model="statement.startDate"
                          :readonly="isReadonly"
                          dense
                          :label="$t('component.tipp.coverage.startDate')"
                        />
                      </v-col>
                      <v-col cols="4">
                        <gokb-text-field
                          v-model="statement.startVolume"
                          :disabled="isReadonly"
                          dense
                          :label="$t('component.tipp.coverage.startVolume')"
                        />
                      </v-col>
                      <v-col cols="4">
                        <gokb-text-field
                          v-model="statement.startIssue"
                          :disabled="isReadonly"
                          dense
                          :label="$t('component.tipp.coverage.startIssue')"
                        />
                      </v-col>
                    </v-row>
                    <v-row
                      v-if="isJournal"
                      dense
                    >
                      <v-col cols="4">
                        <gokb-date-field
                          v-model="statement.endDate"
                          :readonly="isReadonly"
                          dense
                          :label="$t('component.tipp.coverage.endDate')"
                        />
                      </v-col>
                      <v-col cols="4">
                        <gokb-text-field
                          v-model="statement.endVolume"
                          :disabled="isReadonly"
                          dense
                          :label="$t('component.tipp.coverage.endVolume')"
                        />
                      </v-col>
                      <v-col cols="4">
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
                          dense
                          :readonly="isReadonly"
                        />
                      </v-col>
                    </v-row>
                  </gokb-section>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item key="ids">
              <gokb-identifier-section
                v-model="packageTitleItem.ids"
                :target-type="titleTypeString"
                :api-errors="errors.ids"
                :disabled="isReadonly"
                no-tool-bar
                @update="addPendingChange"
              />
            </v-tab-item>
            <v-tab-item
              key="subjects"
              class="mt-4"
            >
              <gokb-subjects-section
                v-model="packageTitleItem.subjects"
                :disabled="isReadonly"
                :api-errors="errors?.subjects"
                no-tool-bar
                @update="addPendingChange"
              />
            </v-tab-item>
            <v-tab-item
              v-if="id && loggedIn"
              key="reviews"
            >
              <gokb-reviews-section
                :review-component="packageTitleItem"
                :show-title="false"
                :api-errors="errors.reviewRequests"
                :expandable="false"
                @update="refreshReviewsCount"
              />
            </v-tab-item>
            <v-tab-item
              key="other"
            >
              <gokb-section no-tool-bar>
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
                      v-model="importId"
                      disabled
                      dense
                      :label="$t('component.tipp.importId.label')"
                    />
                  </v-col>
                  <v-col>
                    <gokb-state-field
                      v-model="packageTitleItem.publicationType"
                      :init-item="packageTitleItem.publicationType"
                      width="100%"
                      dense
                      return-object
                      message-path="component.tipp.publicationType"
                      url="refdata/categories/TitleInstancePackagePlatform.PublicationType"
                      :label="$t('component.tipp.publicationType.label')"
                      readonly
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
                  <v-col>
                    <gokb-text-field
                      v-model="packageTitleItem.volumeNumber"
                      :disabled="isReadonly"
                      dense
                      :label="$t('component.title.volumeNumber')"
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
                </v-row>
              </gokb-section>
            </v-tab-item>
            <v-tab-item key="prices">
              <gokb-prices-section
                v-model="packageTitleItem.prices"
                :disabled="isReadonly"
                no-tool-bar
                @update="addPendingChange"
              />
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
      <template #buttons>
        <gokb-button
          v-if="!isReadonly"
          @click="reset"
        >
          {{ $t('btn.reset') }}
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
          v-if="updateUrl || !id"
          :disabled="!packageTitleItem.title"
          class="mr-6"
          default
        >
          {{ $t('btn.update') }}
        </gokb-button>
      </template>
    </gokb-page>
    <gokb-page
      v-else
      title=""
    >
      <v-card>
        <v-card-text>
          <div class="text-h5 primary--text">
            {{ $t('component.general.notFound', [$tc('component.tipp.label')]) }}
          </div>
        </v-card-text>
      </v-card>
    </gokb-page>
  </div>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import GokbErrorComponent from '@/shared/components/complex/gokb-error-component'
  import tippServices from '@/shared/services/tipp-services'
  import accountModel from '@/shared/models/account-model'
  import loading from '@/shared/models/loading'
  import VSnackbars from 'v-snackbars'

  export default {
    name: 'EditTippView',
    components: { GokbErrorComponent, VSnackbars },
    extends: BaseComponent,
    props: {
      id: {
        type: [Number, String],
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
        tab: null,
        pprops: undefined,
        pendingChanges: {},
        platformSelection: [],
        reviewsCount: undefined,
        version: undefined,
        errors: {},
        notFound: false,
        reviewRequests: [],
        coverageExpanded: true,
        selectedTitle: undefined,
        selectedItem: undefined,
        eventMessages: [],
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
        status: undefined,
        items: [],
        allNames: {},
        titleType: undefined,
        importId: undefined,
        lastUpdated: undefined,
        dateCreated: undefined,
        uuid: undefined,
        packageTitleItem: {
          id: undefined,
          title: undefined,
          pkg: undefined,
          hostPlatform: undefined,
          status: undefined,
          paymentType: undefined,
          prices: [],
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
        },
        platformQueryFields: ['name', 'primaryUrl']
      }
    },
    computed: {
      header () {
        return !this.isReadonly ? (this.id ? (this.$i18n.t('header.edit.label', [this.$i18n.tc('component.tipp.label')]) + ' – ' + this.typeLabel) : (this.$i18n.t('header.add.label', [this.$i18n.tc('component.tipp.label')]) + ' – ' + this.typeLabel)) : (this.typeLabel + ' – ' + this.$i18n.tc('component.tipp.label'))
      },
      titleLabel () {
        return this.$i18n.tc('component.title.label') + ' (' + this.typeLabel + ')'
      },
      typeLabel () {
        return this.titleType ? this.$i18n.tc('component.title.type.' + this.titleType) : undefined
      },
      isEdit () {
        return !!this.id
      },
      loggedIn () {
        return accountModel.loggedIn()
      },
      isReadonly () {
        return !accountModel.loggedIn || !accountModel.hasRole('ROLE_EDITOR') || (this.isEdit && !this.updateUrl) || (this.isDeleted && !accountModel.hasRole('ROLE_ADMIN'))
      },
      isJournal () {
        return this.packageTitleItem.title?.type === 'Journal' || this.packageTitleItem.title?.type?.id === 'journal' || this.packageTitleItem.publicationType?.name === 'Serial'
      },
      isBook () {
        return this.packageTitleItem.title?.type === 'Book' || this.packageTitleItem.title?.type?.id === 'book' || this.packageTitleItem.title?.type === 'Monograph' || this.packageTitleItem.title?.type?.id === 'monograph' || this.packageTitleItem.publicationType?.name === 'Monograph'
      },
      isDeleted () {
        return this.packageTitleItem.status === 'Deleted' || this.packageTitleItem.status?.name === 'Deleted'
      },
      titleTypeString () {
        return (typeof this.packageTitleItem.title?.type === 'object' ? this.packageTitleItem.title?.type?.id : this.packageTitleItem.title?.type)
      },
      expansionIcon () {
        return this.coverageExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'
      },
      localDateCreated () {
        return this.dateCreated ? new Date(this.dateCreated).toLocaleString('sv') : ''
      },
      localLastUpdated () {
        return this.lastUpdated ? new Date(this.lastUpdated).toLocaleString('sv') : ''
      },
      tabClass () {
        return this.$vuetify.theme.dark ? 'tab-dark' : ''
      },
      idsTotal () {
        return this.packageTitleItem.ids?.length
      },
      localValue: {
        get () {
          return !!this.value
        },
        set (localValue) {
          this.$emit('input', null)
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
      loggedIn (value) {
        if (value) {
          this.reload()
        }
      },
      tabsView (value) {
        if (this.loggedIn) {
          accountModel.useTabbedView(value)
        }
      },
      '$i18n.locale' (l) {
        document.title = this.$i18n.tc('component.tipp.label') + ' – ' + this.packageTitleItem.name
      },
      tab (val) {
        history.pushState({}, "", window.location.toString().split('?')[0] + (!!val ? ('?tab=' + val) : ''))
      }
    },
    async mounted () {
      this.reload()

      if (this.initMessageCode) {
        if (this.initMessageCode.includes('success')) {
          this.eventMessages.push({
            message: this.$i18n.t(this.initMessageCode, [this.$i18n.tc('component.tipp.label')]),
            color: 'success',
            timeout: 3000
          })
        } else if (this.initMessageCode.includes('failure')) {
          this.eventMessages.push({
            message: this.$i18n.t(this.initMessageCode, [this.$i18n.tc('component.title.label')]),
            color: 'error',
            timeout: -1
          })
        } else if (this.initMessageCode.includes('warning')) {
          this.eventMessages.push({
            message: this.$i18n.t(this.initMessageCode, [this.$i18n.tc('component.title.label')]),
            color: 'warning',
            timeout: -1
          })
        }
      }

      this.tab = parseInt(this.$route.query.tab) || null
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      async update () {
        const activeGroup = accountModel.activeGroup()
        this.eventMessages = []

        const newTipp = {
          ...this.packageTitleItem,
          ids: this.packageTitleItem.ids.map(id => ({
            value: id.value,
            type: id.namespace
          })),
          prices: this.packageTitleItem.prices.map(price => ({
            ...price,
            type: (price.type || price.priceType),
            id: (typeof price.id === 'number' ? price.id : null)
          })),
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
          name: this.allNames.name,
          version: this.version,
          publicationType: this.packageTitleItem.publicationType && this.packageTitleItem.publicationType.name,
          id: this.id,
          activeGroup: activeGroup
        }

        const response = await this.catchError({
          promise: tippServices.createOrUpdate(newTipp, this.cancelToken.token),
          instance: this
        })

        if (response.status < 400) {
          if (this.isEdit) {
            this.eventMessages.push({
              message: this.$i18n.t('success.update', [this.$i18n.tc('component.tipp.label'), this.allNames.name]),
              color: 'success',
              timeout: 3000
            })
            this.reload()
          } else {
            this.$router.push({
              name: '/package-title',
              params: {
                id: response.data?.id,
                initMessageCode: 'success.create'
              }
            })
          }
        } else {
          if (response.status === 409) {
            this.eventMessages.push({
              message: this.$i18n.t('error.update.409', [this.$i18n.tc('component.tipp.label')]),
              color: 'error',
              timeout: -1
            })
          } else if (response.status === 500) {
            this.eventMessages.push({
              message: this.$i18n.t('error.general.500', [this.$i18n.tc('component.tipp.label')]),
              color: 'error',
              timeout: -1
            })
          } else {
            this.eventMessages.push({
              message: this.$i18n.t(this.isEdit ? 'error.update.400' : 'error.create.400', [this.$i18n.tc('component.tipp.label')]),
              color: 'error',
              timeout: -1
            })
            this.errors = response.data.error
          }
        }
      },
      reset () {
        this.tab = null
        this.pprops = undefined
        this.pendingChanges = {}
        this.platformSelection = []
        this.reviewsCount = undefined
        this.version = undefined
        this.errors = {}
        this.notFound = false
        this.reviewRequests = []
        this.coverageExpanded = true
        this.selectedTitle = undefined
        this.selectedItem = undefined
        this.eventMessages = []
        this.coverageObject = {
          coverageDepth: undefined,
          startDate: undefined,
          endDate: undefined,
          startVolume: undefined,
          endVolume: undefined,
          startIssue: undefined,
          endIssue: undefined,
          coverageNote: undefined,
          embargo: undefined
        },
        this.updateUrl = undefined
        this.deleteUrl = undefined
        this.status = undefined
        this.items = []
        this.allNames = {}
        this.titleType = undefined
        this.importId = undefined
        this.lastUpdated = undefined
        this.dateCreated = undefined
        this.uuid = undefined
        this.packageTitleItem = {
          id: undefined,
          title: undefined,
          pkg: undefined,
          hostPlatform: undefined,
          status: undefined,
          paymentType: undefined,
          prices: [],
          url: undefined,
          name: undefined,
          accessStartDate: undefined,
          accessEndDate: undefined,
          ids: [],
          subjects: [],
          coverageStatements: [
            {
              coverageDepth: undefined,
              startDate: undefined,
              endDate: undefined,
              startVolume: undefined,
              endVolume: undefined,
              startIssue: undefined,
              endIssue: undefined,
              coverageNote: undefined,
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
        this.reload()
      },
      async reload () {
        loading.startLoading()
        this.errors = {}
        this.pendingChanges = {}
        this.toDelete = false

        const result = await this.catchError({
          promise: tippServices.get(this.id, this.cancelToken.token),
          instance: this
        })

        if (result.status === 200) {
          this.mapRecord(result.data)
        } else if (result.status === 401) {
          accountModel.logout()
          const retry = await this.catchError({
            promise: tippServices.get(this.id, this.cancelToken.token),
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
        loading.stopLoading()
      },
      mapRecord (data) {
        this.packageTitleItem.id = data.id
        this.updateUrl = data._links?.update?.href || null
        this.deleteUrl = data._links?.delete?.href || null
        this.packageTitleItem.name = data.name
        this.packageTitleItem.pkg = data.pkg
        this.packageTitleItem.title = data.title
        this.packageTitleItem.hostPlatform = data.hostPlatform
        this.version = data.version
        this.status = data.status
        this.packageTitleItem.publisherName = data.publisherName
        this.packageTitleItem.ids = data._embedded.ids.map(({ id, value, namespace }) => ({
          id,
          value,
          namespace: namespace.value,
          nslabel: (namespace.name || namespace.value),
          isDeletable: !!this.updateUrl
        }))
        this.reviewRequests = data._embedded.reviewRequests
        this.editionStatement = data.editionStatement
        this.importId = data.importId
        this.uuid = data.uuid
        this.dateCreated = data.dateCreated
        this.lastUpdated = data.lastUpdated
        this.packageTitleItem.paymentType = data.paymentType
        this.packageTitleItem.url = data.url
        this.packageTitleItem.accessStartDate = this.buildDateString(data.accessStartDate)
        this.packageTitleItem.accessEndDate = this.buildDateString(data.accessEndDate)
        this.packageTitleItem.series = data.series
        this.packageTitleItem.subjectArea = data.subjectArea
        this.packageTitleItem.publisherName = data.publisherName
        this.packageTitleItem.dateFirstInPrint = this.buildDateString(data.dateFirstInPrint)
        this.packageTitleItem.dateFirstOnline = this.buildDateString(data.dateFirstOnline)
        this.packageTitleItem.firstAuthor = data.firstAuthor
        this.packageTitleItem.firstEditor = data.firstEditor
        this.packageTitleItem.publicationType = data.publicationType
        this.packageTitleItem.volumeNumber = data.volumeNumber
        this.packageTitleItem.editionStatement = data.editionStatement
        this.packageTitleItem.medium = data.medium
        this.packageTitleItem.lastChangedExternal = data.lastChangedExternal
        this.packageTitleItem.status = data.status
        this.history = data.history
        this.allNames = {
          name: data.name,
          alts: data._embedded.variantNames.map(variantName => ({
            ...variantName,
            isDeletable: !!this.updateUrl
          }))
        }

        this.packageTitleItem.subjects = data._embedded.subjects.map(subject => ({
          ...subject,
          isDeletable: !!this.updateUrl
        }))

        this.reviewsCount = this.reviewRequests.filter(req => req.status.name === 'Open').length

        if (data._embedded.coverageStatements?.length) {
          this.packageTitleItem.coverageStatements = data._embedded.coverageStatements.map(statement => ({
            ...statement,
            startDate: statement.startDate && this.buildDateString(statement.startDate),
            endDate: statement.endDate && this.buildDateString(statement.endDate),
          }))
        }

        if (data._embedded.prices?.length) {
          this.packageTitleItem.prices = data._embedded.prices.map(pobj => ({
            ...pobj,
            type: pobj.priceType,
            startDate: this.buildDateString(pobj.startDate),
            endDate: this.buildDateString(pobj.endDate)
          }))
        }



        this.titleType = data.title?.type || data.publicationType?.name

        document.title = this.$i18n.tc('component.tipp.label') + ' – ' + (data.name || data.title?.name)
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
      addPendingChange (prop) {
        if (!this.pendingChanges[prop]) {
          this.pendingChanges[prop] = true
        }
      },
      addNewCoverage () {
        this.pendingChanges.coverage = true
        this.packageTitleItem.coverageStatements.push(this.coverageObject)
      },
      removeCoverage (idx) {
        this.pendingChanges.coverage = true
        this.packageTitleItem.coverageStatements.splice(idx, 1)

        if (this.packageTitleItem.coverageStatements.length === 0) {
          this.packageTitleItem.coverageStatements.push(this.coverageObject)
        }
      },
      refreshReviewsCount (count) {
        this.reviewsCount = count
        this.reload()
      },
      markDeleted (val) {
        this.toDelete = val
      }
    },
  }
</script>

<style scoped>
  .tab-dark {
    color: rgba(255, 255, 255, 0.6);
  }
</style>
