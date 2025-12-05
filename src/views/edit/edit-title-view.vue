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
    >
      <gokb-error-component :value="error" />
      <v-row>
        <v-col>
          <gokb-select-field
            v-if="!isEdit"
            v-model="currentType"
            :readonly="isReadonly"
            :label="$t('component.title.type.label')"
            class="ml-4"
            :static-items="allTypes"
            :init-item="currentType"
            required
          />
        </v-col>
        <v-spacer />
      </v-row>
      <gokb-section no-tool-bar>
        <v-row>
          <v-col col="7">
            <gokb-name-field
              v-model="allNames"
              :label="$t('component.general.name')"
              :disabled="isReadonly"
              :api-errors="errors.name"
            />
          </v-col>
        </v-row>
        <v-row v-if="id">
          <v-col cols="6">
            <gokb-state-select-field
              v-model="titleItem.status"
              :deletable="!isReadonly"
              :editable="!isReadonly"
              :api-errors="errors.status"
              @delete="markDeleted"
            />
          </v-col>
          <v-col cols="6" xl="3">
            <gokb-uuid-field
              v-if="id"
              :label="$t('component.general.uuid.label')"
              v-model="titleItem.uuid"
              path="/title"
              dense
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <gokb-state-field
              v-model="titleItem.OAStatus"
              message-path="component.title.OAStatus"
              width="100%"
              url="refdata/categories/TitleInstance.OAStatus"
              :label="$t('component.title.OAStatus.label')"
              :readonly="isReadonly"
              :api-errors="errors.OAStatus"
              :init-item="titleItem.OAStatus"
              dense
            />
          </v-col>
          <v-col cols="3">
            <gokb-state-field
              v-model="titleItem.medium"
              message-path="component.title.medium"
              width="100%"
              url="refdata/categories/TitleInstance.Medium"
              :label="$t('component.title.medium.label')"
              :readonly="isReadonly"
              :api-errors="errors.medium"
              :init-item="titleItem.medium"
              dense
            />
          </v-col>
          <v-col v-if="currentType == 'Book'">
            <gokb-text-field
              v-model="titleItem.firstAuthor"
              :label="$t('component.title.firstAuthor.label')"
              :disabled="isReadonly"
              :api-errors="errors.firstAuthor"
              dense
            />
          </v-col>
          <v-col v-if="currentType == 'Book'">
            <gokb-text-field
              v-model="titleItem.firstEditor"
              :label="$t('component.title.firstEditor.label')"
              :disabled="isReadonly"
              :api-errors="errors.firstEditor"
              dense
            />
          </v-col>
          <v-col v-if="currentType == 'Journal'">
            <gokb-date-field
              v-model="titleItem.publishedFrom"
              :readonly="isReadonly"
              :label="$t('component.title.publishedFrom')"
              :api-errors="errors.publishedFrom"
              dense
            />
          </v-col>
          <v-col v-if="currentType == 'Journal'">
            <gokb-date-field
              v-model="titleItem.publishedTo"
              :readonly="isReadonly"
              :label="$t('component.title.publishedTo')"
              :api-errors="errors.publishedTo"
              dense
            />
          </v-col>
        </v-row>
        <v-row v-if="currentType == 'Book'">
          <v-col cols="3">
            <gokb-number-field
              v-model="titleItem.volumeNumber"
              :disabled="isReadonly"
              :label="$t('component.title.volumeNumber')"
              :api-errors="errors.volumeNumber"
              dense
            />
          </v-col>
          <v-col>
            <gokb-text-field
              v-model="titleItem.editionStatement"
              :label="$t('component.title.editionStatement')"
              :disabled="isReadonly"
              :api-errors="errors.editionStatement"
              dense
            />
          </v-col>
          <v-col>
            <gokb-date-field
              v-model="titleItem.firstPublishedInPrint"
              :readonly="isReadonly"
              :label="$t('component.title.firstPublishedInPrint')"
              :api-errors="errors.firstPublishedInPrint"
              dense
            />
          </v-col>
          <v-col>
            <gokb-date-field
              v-model="titleItem.firstPublishedOnline"
              :readonly="isReadonly"
              :label="$t('component.title.firstPublishedOnline')"
              :api-errors="errors.firstPublishedOnline"
              dense
            />
          </v-col>
        </v-row>
      </gokb-section>
      <v-row
        v-if="tabsView"
        style="min-height:350px"
      >
        <v-col>
          <v-tabs
            v-model="tab"
          >
            <v-tab
              value="identifiers"
              :style="[!!errors.ids ? { border: '1px solid red', borderRadius: '2px' } : {}]"
              class="font-weight-bold"
            >
              {{ $tc('component.identifier.label', 2) }}
              <v-chip class="ma-2">
                {{ titleItem.ids.length }}
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
              value="publishers"
              class="font-weight-bold"
            >
              {{ $tc('component.title.publisher.label', 2) }}
              <v-chip class="ma-2">
                {{ publishers.length }}
              </v-chip>
              <v-icon
                v-if="pendingChanges.publisher"
                :title="$t('pending.lists.changed')"
                small
              >
                mdi-alert-decagram
              </v-icon>
            </v-tab>
            <v-tab
              value="variants"
              class="font-weight-bold"
            >
              {{ $tc('component.variantName.label', 2) }}
              <v-chip class="ma-2">
                {{ allNames.alts.length }}
              </v-chip>
              <v-icon
                v-if="pendingChanges.variants"
                :title="$t('pending.lists.changed')"
                small
              >
                mdi-alert-decagram
              </v-icon>
            </v-tab>
            <v-tab
              v-if="id && isContrib"
              value="reviews"
              class="font-weight-bold"
            >
              {{ $tc('component.review.label', 2) }}
              <v-chip class="ma-2">
                {{ reviewsCount }}
              </v-chip>
              <v-icon
                v-if="pendingChanges.reviews"
                :title="$t('pending.lists.changed')"
                small
              >
                mdi-alert-decagram
              </v-icon>
            </v-tab>
            <v-tab
              v-if="id"
              value="tipps"
              class="font-weight-bold"
            >
              {{ $tc('component.tipp.label', 2) }}
              <v-chip class="ma-2">
                {{ tippCount }}
              </v-chip>
            </v-tab>
            <v-tab
              v-if="isEdit && history"
              value="history"
              class="font-weight-bold"
            >
              {{ $t('component.title.history.label') }}
              <v-chip class="ma-2">
                {{ history.length }}
              </v-chip>
              <v-icon
                v-if="pendingChanges.history"
                :title="$t('pending.lists.changed')"
                small
              >
                mdi-alert-decagram
              </v-icon>
            </v-tab>
            <v-tab
              value="subjects"
              class="font-weight-bold"
            >
              {{ $tc('component.subject.label', 2) }}
              <v-chip class="ma-2">
                {{ titleItem.subjects.length }}
              </v-chip>
              <v-icon
                v-if="pendingChanges.subjects"
                :title="$t('pending.lists.changed')"
                small
              >
                mdi-alert-decagram
              </v-icon>
            </v-tab>
          </v-tabs>
          <v-window
            v-model="tab"
          >
            <v-window-item
              value="identifiers"
              class="mt-4"
            >
              <gokb-identifier-section
                v-model="titleItem.ids"
                :show-title="false"
                :target-type="currentType"
                :disabled="isReadonly || !currentType"
                :api-errors="errors.ids"
                @update="addPendingChange"
              />
            </v-window-item>
            <v-window-item
              value="publishers"
              class="mt-4"
            >
              <gokb-publisher-section
                v-model="publishers"
                :show-title="false"
                :disabled="isReadonly"
                :api-errors="errors.publisher"
                @update="addPendingChange"
              />
            </v-window-item>
            <v-window-item
              value="variants"
              class="mt-4"
            >
              <gokb-alternate-names-section
                v-model="allNames.alts"
                :show-title="false"
                :disabled="isReadonly"
                :api-errors="errors.variantNames"
                @update="addPendingChange"
              />
            </v-window-item>
            <v-window-item
              value="subjects"
              class="mt-4"
            >
              <gokb-subjects-section
                v-model="titleItem.subjects"
                :disabled="isReadonly"
                :api-errors="errors?.subjects"
                :expandable="false"
                @update="addPendingChange"
              />
            </v-window-item>
            <v-window-item
              v-if="loggedIn && isContrib"
              value="reviews"
              class="mt-4"
            >
              <gokb-reviews-section
                :review-component="titleItem"
                :show-title="false"
                :api-errors="errors.reviewRequests"
                :expandable="false"
                hide-select
                @update="refreshReviewsCount"
              />
            </v-window-item>
            <v-window-item
              value="tipps"
              class="mt-4"
            >
              <gokb-tipps-section
                :ttl="id"
                :show-title="false"
                :api-errors="errors.tipps"
                disabled
                @count="updateTippCount"
              />
            </v-window-item>
            <v-window-item
              value="history"
              class="mt-4"
            >
              <gokb-title-history-section
                v-model="history"
                :title-info="shortTitleMap"
                :show-title="false"
                :disabled="isReadonly"
                :api-errors="errors.history"
                @update="addPendingChange"
              />
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>
      <div v-else>
        <gokb-identifier-section
          v-model="titleItem.ids"
          :disabled="isReadonly"
          :target-type="currentType"
          :api-errors="errors.ids"
        />
        <gokb-publisher-section
          v-model="publishers"
          :disabled="isReadonly"
          :api-errors="errors.publisher"
        />
        <gokb-alternate-names-section
          v-model="allNames.alts"
          :disabled="isReadonly"
          :api-errors="errors.variantNames"
        />
        <gokb-reviews-section
          v-if="id && loggedIn"
          :review-component="titleItem"
          :api-errors="errors.reviewRequests"
        />
        <gokb-tipps-section
          v-if="id"
          :ttl="id"
          :disabled="true"
          :api-errors="errors.tipps"
        />
        <gokb-title-history-section
          v-if="currentType === 'Journal'"
          v-model="history"
          :title-info="shortTitleMap"
          :disabled="isReadonly"
          :api-errors="errors.history"
        />
      </div>
      <template #buttons>
        <gokb-button
          v-if="!isReadonly"
          @click.prevent="reset"
        >
          {{ $i18n.t('btn.reset') }}
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
        <v-switch
          v-model="tabsView"
          class="pt-4 pr-6"
          :label="$t('component.title.tabsView')"
        />
        <gokb-button
          v-if="!isReadonly"
          is-submit
          @click="update"
          :disabled="!isValid"
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
            {{ $t('component.general.notFound', [$tc('component.title.label')]) }}
          </div>
        </v-card-text>
      </v-card>
    </gokb-page>
  </div>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import GokbErrorComponent from '@/shared/components/complex/gokb-error-component'
  import GokbAlternateNamesSection from '@/shared/components/complex/gokb-alternate-names-section'
  import titleServices from '@/shared/services/title-services'
  import accountModel from '@/shared/models/account-model'
  import { EDIT_PROVIDER_ROUTE } from '@/router/route-paths'
  import loading from '@/shared/models/loading'
  import log from '@/shared/utils/logger'
  import utils from '@/shared/utils/utils'

  export default {
    name: 'EditTitleView',
    components: { GokbErrorComponent, GokbAlternateNamesSection },
    extends: BaseComponent,
    props: {
      id: {
        type: [Number, String],
        required: false,
        default: undefined
      },
      initLocale: {
        type: String,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        tab: null,
        pendingChanges: {},
        reviewsCount: undefined,
        tippCount: undefined,
        shortTitleMap: {
          name: undefined,
          id: undefined,
          uuid: undefined,
          type: undefined
        },
        titleItem: {
          id: undefined,
          uuid: undefined,
          name: undefined,
          source: undefined,
          publishedFrom: undefined,
          publishedTo: undefined,
          status: undefined,
          firstPublishedOnline: undefined,
          firstPublishedInPrint: undefined,
          firstAuthor: undefined,
          firstEditor: undefined,
          editionNumber: undefined,
          editionStatement: undefined,
          volumeNumber: undefined,
          OAStatus: undefined,
          medium: undefined,
          type: undefined,
          subjects: [],
          ids: []
        },
        dateCreated: undefined,
        lastUpdated: undefined,
        notFound: false,
        tabsView: true,
        toDelete: false,
        publishers: [],
        history: [],
        allNames: {
          name: undefined,
          alts: []
        },
        lastLoad: undefined,
        reviewRequests: [],
        version: undefined,
        reference: undefined,
        errors: {},
        currentType: undefined,
        updateUrl: undefined,
        deleteUrl: undefined,
        showSnackbar: false,
        snackbarMessage: undefined,
        messageColor: undefined,
        currentSnackBarTimeout: '-1',
        allTypes: [
          { name: this.$i18n.tc('component.title.type.Journal'), id: 'Journal' },
          { name: this.$i18n.tc('component.title.type.Book'), id: 'Book' },
          { name: this.$i18n.tc('component.title.type.Database'), id: 'Database' },
          { name: this.$i18n.tc('component.title.type.Title'), id: 'Other' }
        ]
      }
    },
    computed: {
      isEdit () {
        return !!this.id
      },
      title () {
        return this.$i18n.t(this.titleCode, [this.$i18n.tc('component.title.label')])
      },
      titleCode () {
        return this.isEdit ? (this.isReadonly ? 'header.show.label' : 'header.edit.label') : 'header.create.label'
      },
      typeDisplay () {
        return this.currentType ? this.$i18n.tc('component.title.type.' + this.currentType) : this.$i18n.tc('component.title.label')
      },
      isReadonly () {
        return !accountModel.loggedIn() || (this.isEdit && !this.updateUrl) || !accountModel.hasRole('ROLE_EDITOR') || (this.isEdit && this.isDeleted && !accountModel.hasRole('ROLE_ADMIN'))
      },
      isDeleted () {
        return !this.toDelete && (this.titleItem.status === 'Deleted' || this.titleItem.status?.name === 'Deleted')
      },
      isContrib () {
        return this.loggedIn && accountModel.hasRole('ROLE_CONTRIBUTOR')
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
      accessible () {
        return this.isEdit || (accountModel.loggedIn() && accountModel.hasRole('ROLE_EDITOR'))
      },
      isValid () {
        return !!this.allNames.name && !!this.currentType
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
        if (this.isEdit) {
          document.title = this.$i18n.tc('component.title.label') + ' – ' + this.allNames.name
        }
      },
      tab (val) {
        history.replaceState({}, "", window.location.toString().split('?')[0] + (!!val ? ('?tab=' + val) : ''))
      }
    },
    async created () {
      if (this.loggedIn) {
        this.tabsView = accountModel.tabbedView()
      }

      this.reload()

      let pars = history.state

      if (!!pars.initMessageCode) {
        if (pars.initMessageCode.includes('success')) {
          this.messageColor = 'success'
          this.snackbarMessage = this.$i18n.t(pars.initMessageCode, [this.$i18n.tc('component.title.label'), this.allNames.name])
          this.currentSnackBarTimeout = 5000
          this.showSnackbar = true
        } else if (pars.initMessageCode.includes('failure')) {
          this.messageColor = 'error'
          this.snackbarMessage = this.$i18n.t(pars.initMessageCode, [this.$i18n.tc('component.title.label')])
          this.currentSnackBarTimeout = 5000
          this.showSnackbar = true
        } else if (pars.initMessageCode.includes('warning')) {
          this.messageColor = 'warning'
          this.snackbarMessage = this.$i18n.t(pars.initMessageCode, [this.$i18n.tc('component.title.label'), this.allNames.name])
          this.currentSnackBarTimeout = 5000
          this.showSnackbar = true
        }

        history.replaceState({}, "")
      }
    },
    mounted () {
      this.tab = this.$route.query.tab || 'identifiers'
      window.addEventListener('beforeunload', this.checkForChanges)
    },
    unmounted() {
      window.removeEventListener('beforeunload', this.checkForChanges)
    },
    beforeRouteLeave (to, from) {
      if (this.hasUnsavedChanges()) {
        const answer = window.confirm(this.$i18n.t('popups.confirm.pendingChanges.label'))

        return answer
      }
      else {
        log.debug('No Changes ..')
      }
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      checkForChanges (e) {
        if (this.hasUnsavedChanges()) {
          e.preventDefault()
          e.returnValue = this.$i18n.t('popups.confirm.pendingChanges.label')
        }
      },
      hasUnsavedChanges () {
        log.debug("Check for unsaved changes ..")
        if (Object.keys(this.pendingChanges).length > 0) {
          log.debug('hasUnsavedChanges :: pendingChanges!')
          return true
        }

        if (!!this.lastLoad?.id) {
          for (var [key, val] of Object.entries(this.lastLoad)) {
            if (key === 'name' && this.allNames.name !== val) {
              return true
            }
            else if (typeof val === 'array') {
              // Array fields will have already been handled by check for entries in this.pendingChanges
            }
            else if (typeof val === 'object') {
              if (this.titleItem.hasOwnProperty(key) && utils.hasLinkedFieldChanged(val, this.titleItem[key])) {
                log.debug('hasUnsavedChanges :: changed linked field ' + key + '!')
                return true
              }
            }
            else if (this.titleItem.hasOwnProperty(key) && val !== this.titleItem[key]) {
              log.debug('hasUnsavedChanges :: changed field ' + key + ': ' + val + '<>' + this.titleItem[key])
              return true
            }
          }
        }
        else if (!!this.allNames.name) {
          log.debug('hasUnsavedChanges :: no lastload, pending name!')
          return true
        }

        return false
      },
      async update () {
        this.errors = {}
        this.showSnackbar = false
        this.snackbarMessage = undefined
        var isUpdate = !!this.id

        const activeGroup = accountModel.activeGroup()

        const data = {
          ...this.titleItem,
          name: this.allNames.name,
          ids: this.titleItem.ids.map(id => ({
            value: id.value,
            type: id.namespace
          })),
          variantNames: this.allNames.alts.map(({ variantName, id, locale, variantType }) => ({
            variantName,
            locale,
            variantType,
            id: typeof id === 'number' ? id : null
          })),
          subjects: this.titleItem.subjects.map(subject => ({
            heading: subject.heading,
            scheme: subject.scheme
          })),
          type: this.currentType,
          version: this.version,
          OAStatus: (!this.titleItem.OAStatus || typeof this.titleItem.OAStatus === 'number') ? this.titleItem.OAStatus : this.titleItem.OAStatus.id,
          publisher: this.publishers.map(pub => pub.id),
          activeGroup: activeGroup
        }
        const response = await this.catchError({
          promise: titleServices.createOrUpdate(data, this.cancelToken.token),
          instance: this
        })
        // todo: check error code
        if (response.status < 400) {
          const mappedHistory = this.history.map(({ date, from, to, id }) => ({
            date,
            from,
            to,
            id: (typeof id === 'number' ? id : null)
          }))

          const hresp = await this.catchError({
            promise: titleServices.updateHistory(response.data.id, mappedHistory, this.cancelToken.token),
            instance: this
          })

          if (hresp.status >= 400) {
            this.errors.history = hresp.data.error
          } else {
            if (isUpdate) {
              await this.reload()

              this.messageColor = 'success'
              this.snackbarMessage = this.$i18n.t('success.update', [this.$i18n.tc('component.title.label'), this.allNames.name])
              this.currentSnackBarTimeout = 5000
              this.showSnackbar = true
            } else {
              this.allNames.name = undefined
              this.pendingChanges = {}
              this.$router.push({
                name: '/title',
                state: {
                  initMessageCode: 'success.create'
                },
                params: {
                  id: response.data?.id
                }
              })
            }
          }
        } else {
          if (response.status === 409) {
            this.messageColor = 'error'
            this.snackbarMessage = this.$i18n.t('error.update.409', [this.$i18n.tc('component.title.label')])
            this.currentSnackBarTimeout = -1
            this.showSnackbar = true
          } else if (response.status === 500) {
            this.messageColor = 'error'
            this.snackbarMessage = this.$i18n.t('error.general.500', [this.$i18n.tc('component.title.label')]),
            this.currentSnackBarTimeout = -1
            this.showSnackbar = true
          } else {
            this.messageColor = 'error'
            this.snackbarMessage = this.$i18n.t(this.isEdit ? 'error.update.400' : 'error.create.400', [this.$i18n.tc('component.title.label')]),
            this.currentSnackBarTimeout = -1
            this.showSnackbar = true
            this.errors = response.data.error
          }
        }

        window.scrollTo(0, 0)
      },
      reset () {
        this.pendingChanges = {}
        this.showSnackbar = false
        this.reviewsCount = undefined
        this.tippCount = undefined
        this.shortTitleMap = {
          name: undefined,
          id: undefined,
          uuid: undefined,
          type: undefined
        }
        this.titleItem = {
          id: undefined,
          uuid: undefined,
          name: undefined,
          status: undefined,
          ids: [],
          subjects: [],
          source: undefined,
          publishedFrom: undefined,
          publishedTo: undefined,
          firstPublishedOnline: undefined,
          firstPublishedInPrint: undefined,
          firstAuthor: undefined,
          firstEditor: undefined,
          editionNumber: undefined,
          editionStatement: undefined,
          volumeNumber: undefined,
          OAStatus: undefined,
          medium: undefined,
          type: undefined
        }
        this.dateCreated = undefined
        this.lastUpdated = undefined
        this.notFound = false
        this.tabsView = true
        this.publishers = []
        this.history = []
        this.allNames = {
          name: undefined,
          alts: []
        }
        this.reviewRequests = []
        this.version = undefined
        this.reference = undefined
        this.errors = {}
        this.currentType = undefined
        this.updateUrl = undefined
        this.deleteUrl = undefined
        this.reload()
      },
      async reload () {
        if (this.isEdit) {
          loading.startLoading()
          this.errors = {}
          this.toDelete = false
          this.pendingChanges = {}

          const result = await this.catchError({
            promise: titleServices.get(this.id, this.cancelToken.token),
            instance: this
          })

          if (result?.status === 200) {
            this.lastLoad = {}
            this.mapRecord(result.data)
          } else {
            this.notFound = true
          }
        }
        loading.stopLoading()
      },
      async mapRecord (data) {
        this.updateUrl = data._links?.update?.href || null
        this.deleteUrl = data._links?.delete?.href || null
        this.version = data.version
        this.currentType = data.type
        this.dateCreated = data.dateCreated
        this.lastUpdated = data.lastUpdated

        this.history = data.history

        const new_item_info = {
          id: data.id,
          uuid: data.uuid,
          name: data.name,
          source: data.source,
          type: data.type,
          publishedFrom: this.buildDateString(data.publishedFrom),
          publishedTo: this.buildDateString(data.publishedTo),
          editionStatement: data.editionStatement,
          firstAuthor: data.firstAuthor,
          firstEditor: data.firstEditor,
          medium: data.medium,
          OAStatus: data.OAStatus,
          editionNumber: data.editionNumber,
          firstPublishedInPrint: this.buildDateString(data.dateFirstInPrint),
          firstPublishedOnline: this.buildDateString(data.dateFirstOnline),
          volumeNumber: data.volumeNumber,
          status: data.status,
        }

        this.lastLoad = structuredClone(new_item_info)

        new_item_info.ids = data._embedded.ids.map(({ id, value, namespace }) => ({
          id,
          value,
          namespace: namespace.value,
          nslabel: (namespace.name || namespace.value),
          isDeletable: !!this.updateUrl
        }))
        new_item_info.subjects = data._embedded.subjects.map(subject => ({
          ...subject,
          isDeletable: !!this.updateUrl
        }))

        this.titleItem = new_item_info

        this.allNames = {
          name: data.name,
          alts: data._embedded.variantNames.map(variantName => ({
            ...variantName,
            isDeletable: !!this.updateUrl
          }))
        }

        this.publishers = data._embedded.publisher.map(pub => ({
          id: pub.id,
          name: pub.name,
          link: {
            value: pub.name,
            route: EDIT_PROVIDER_ROUTE,
            id: 'id'
          },
          isDeletable: !!this.updateUrl
        }))

        this.shortTitleMap = {
          name: data.name,
          id: data.id,
          uuid: data.uuid,
          type: data.type
        }


        this.reviewRequests = data._embedded.reviewRequests
        this.reviewsCount = this.reviewRequests.filter(req => req.status.name === 'Open').length

        document.title = this.$i18n.tc('component.title.label') + ' – ' + this.allNames.name

        const tippsResult = await this.catchError({
          promise: titleServices.getTipps(this.id, { status: 'Current' }, this.cancelToken.token),
          instance: this
        })

        if (tippsResult.status === 200) {
          this.tippCount = tippsResult.data._pagination.total
        }
      },
      addPendingChange (prop) {
        if (!this.pendingChanges[prop]) {
          this.pendingChanges[prop] = true
        }
      },
      refreshReviewsCount (count) {
        this.reviewsCount = count
        this.reset()
      },
      updateTippCount (count) {
        this.tippCount = count
      },
      markDeleted (val) {
        this.toDelete = val
      }
    },
  }
</script>
<style>
  .v-tab.v-btn--size-default {
    padding-left: 8px;
    padding-right: 8px;
  }
  .v-slide-group__prev {
    margin-left: -20px;
  }
</style>
