<template>
  <gokb-page
    v-if="accessible && !notFound"
    :key="version"
    :title="title"
    @submit="update"
  >
    <gokb-error-component :value="error" />
    <span v-if="successMsg">
      <v-alert
        type="success"
        dismissible
      >
        {{ successMsg }}
      </v-alert>
    </span>
    <v-row>
      <v-col>
        <gokb-select-field
          v-if="!isEdit"
          v-model="currentType"
          :readonly="isReadonly"
          :label="$t('component.title.type.label')"
          class="ml-4"
          :items="allTypes"
          required
        />
      </v-col>
      <v-spacer />
    </v-row>
    <gokb-section :no-tool-bar="true">
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
        <v-col>
          <gokb-state-select-field
            v-model="titleItem.status"
            :deletable="!!deleteUrl"
            :editable="!!updateUrl"
            :api-errors="errors.status"
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
          class="mx-4"
        >
          <v-tabs-slider color="black" />

          <v-tab
            key="identifiers"
            :style="[!!errors.ids ? { border: '1px solid red', borderRadius: '2px' } : {}]"
            :active-class="tabClass"
          >
            {{ $tc('component.identifier.label', 2) }}
            <v-chip class="ma-2">
              {{ ids.length }}
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
            key="publisher"
            :active-class="tabClass"
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
            key="variants"
            :active-class="tabClass"
          >
            {{ $tc('component.variantName.label', 2) }}
            <v-chip class="ma-2">
              {{ allAlternateNames.length }}
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
            key="reviews"
            :active-class="tabClass"
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
            key="tipps"
            :active-class="tabClass"
          >
            {{ $tc('component.tipp.label', 2) }}
            <v-chip class="ma-2">
              {{ tippCount }}
            </v-chip>
          </v-tab>
          <v-tab
            v-if="isEdit && history"
            key="history"
            :active-class="tabClass"
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
        </v-tabs>
        <v-tabs-items
          v-model="tab"
        >
          <v-tab-item
            key="identifiers"
            class="mt-4"
          >
            <gokb-identifier-section
              v-model="ids"
              :show-title="false"
              :disabled="isReadonly"
              :api-errors="errors.ids"
              @update="addPendingChange"
            />
          </v-tab-item>
          <v-tab-item
            key="publishers"
            class="mt-4"
          >
            <gokb-publisher-section
              v-model="publishers"
              :show-title="false"
              :disabled="isReadonly"
              :api-errors="errors.publisher"
              @update="addPendingChange"
            />
          </v-tab-item>
          <v-tab-item
            key="variants"
            class="mt-4"
          >
            <gokb-alternate-names-section
              v-model="allNames.alts"
              :show-title="false"
              :disabled="isReadonly"
              :api-errors="errors.variantNames"
              @update="addPendingChange"
            />
          </v-tab-item>
          <v-tab-item
            v-if="loggedIn && isContrib"
            key="reviews"
            class="mt-4"
          >
            <gokb-reviews-section
              :review-component="titleItem"
              :api-errors="errors.reviewRequests"
              @update="refreshReviewsCount"
            />
          </v-tab-item>
          <v-tab-item
            key="tipps"
            class="mt-4"
          >
            <gokb-tipps-section
              :ttl="parseInt(id)"
              :show-title="false"
              :disabled="true"
              :api-errors="errors.tipps"
              @update="updateTippCount"
            />
          </v-tab-item>
          <v-tab-item
            key="history"
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
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
    <div v-else>
      <gokb-identifier-section
        v-model="ids"
        :disabled="isReadonly"
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
        :ttl="parseInt(id)"
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
        @click="reload"
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
          {{ $t('component.general.notFound', [$tc('component.title.label')]) }}
        </div>
      </v-card-text>
    </v-card>
  </gokb-page>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import GokbErrorComponent from '@/shared/components/complex/gokb-error-component'
  import GokbAlternateNamesSection from '@/shared/components/complex/gokb-alternate-names-section'
  import titleServices from '@/shared/services/title-services'
  import accountModel from '@/shared/models/account-model'
  import { EDIT_PROVIDER_ROUTE } from '@/router/route-paths'
  import loading from '@/shared/models/loading'

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
    },
    data () {
      return {
        tab: null,
        pendingChanges: {},
        reviewsCount: undefined,
        tippCount: undefined,
        shortTitleMap: { name: undefined, id: undefined, uuid: undefined, type: undefined },
        titleItem: {
          id: undefined,
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
          type: undefined
        },
        dateCreated: undefined,
        lastUpdated: undefined,
        notFound: false,
        tabsView: true,
        publishers: [],
        history: [],
        allNames: { name: undefined, alts: [] },
        reviewRequests: [],
        version: undefined,
        reference: undefined,
        errors: {},
        ids: [],
        tipps: [],
        allAlternateNames: [],
        allCuratoryGroups: [],
        currentType: undefined,
        updateUrl: undefined,
        deleteUrl: undefined,
        successMsg: undefined,
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
        return this.currentType ? this.$i18n.t(this.titleCode, [this.typeDisplay]) : this.$i18n.t(this.titleCode, [this.$i18n.tc('component.title.label')])
      },
      titleCode () {
        return this.isEdit ? (this.updateUrl ? 'header.edit.label' : 'header.show.label') : 'header.create.label'
      },
      typeDisplay () {
        return this.currentType ? this.$i18n.tc('component.title.type.' + this.currentType) : this.$i18n.tc('component.title.label')
      },
      isReadonly () {
        return !accountModel.loggedIn || (this.isEdit && !this.updateUrl) || (!this.isEdit && !accountModel.hasRole('ROLE_EDITOR'))
      },
      isContrib () {
        return this.loggedIn && accountModel.hasRole('ROLE_CONTRIBUTOR')
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
      tabClass () {
        return this.$vuetify.theme.dark ? 'tab-dark' : ''
      },
      accessible () {
        return this.isEdit || (accountModel.loggedIn() && accountModel.hasRole('ROLE_CONTRIBUTOR'))
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
          document.title = this.$i18n.tc('component.title.type.' + this.currentType) + ' – ' + this.allNames.name
        }
      }
    },
    async created () {
      if (this.loggedIn) {
        this.tabsView = accountModel.tabbedView()
      }

      this.reload()
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      async update () {
        this.errors = {}
        var isUpdate = !!this.id

        const data = {
          id: this.id,
          name: this.allNames.name,
          ids: this.ids.map(id => ({ value: id.value, type: id.namespace })),
          variantNames: this.allNames.alts,
          publishedFrom: this.titleItem.publishedFrom,
          publishedTo: this.titleItem.publishedTo,
          dateFirstInPrint: this.titleItem.firstPublishedInPrint,
          dateFirstOnline: this.titleItem.firstPublishedOnline,
          firstAuthor: this.titleItem.firstAuthor,
          firstEditor: this.titleItem.firstEditor,
          type: this.currentType,
          volumeNumber: this.titleItem.volumeNumber,
          editionNumber: this.titleItem.editionNumber,
          editionStatement: this.titleItem.editionStatement,
          medium: this.titleItem.medium,
          OAStatus: (!this.titleItem.OAStatus || typeof this.titleItem.OAStatus === 'number') ? this.titleItem.OAStatus : this.titleItem.OAStatus.id,
          status: this.titleItem.status,
          publisher: this.publishers.map(pub => pub.id)
        }
        const response = await this.catchError({
          promise: titleServices.createOrUpdateTitle(data, this.cancelToken.token),
          instance: this
        })
        // todo: check error code
        if (response.status < 400) {
          const mappedHistory = this.history.map(({ date, from, to, id }) => ({ date, from, to, id: (typeof id === 'number' ? id : null) }))

          const hresp = await this.catchError({
            promise: titleServices.updateHistory(response.data.id, mappedHistory, this.cancelToken.token),
            instance: this
          })

          if (hresp.status >= 400) {
            this.errors.history = hresp.data.error
          } else {
            if (isUpdate) {
              this.pendingChanges = {}
              this.reload()
            } else {
              this.$router.push('/title/' + response.data?.id)
            }

            this.successMsg = this.isEdit ? this.$i18n.t('success.update', [this.typeDisplay, this.allNames.name]) : this.$i18n.t('success.create', [this.typeDisplay, this.allNames.name])
          }
        } else {
          this.errors = response.data.error
        }

        window.scrollTo(0, 0)
      },
      async reload () {
        if (this.isEdit) {
          loading.startLoading()
          const result = await this.catchError({
            promise: titleServices.getTitle(this.id, this.cancelToken.token),
            instance: this
          })

          if (result.status === 200) {
            const data = result.data
            this.titleItem.id = data.id

            if (!this.id) {
              this.id = data.id
            }
            this.updateUrl = data._links?.update?.href || null
            this.deleteUrl = data._links?.delete?.href || null
            this.titleItem.name = data.name
            this.titleItem.source = data.source
            this.version = data.version
            this.currentType = data.type
            this.titleItem.type = data.type
            this.titleItem.publishedFrom = data.publishedFrom && data.publishedFrom.substr(0, 10)
            this.titleItem.publishedTo = data.publishedTo && data.publishedTo.substr(0, 10)
            this.publishers = data._embedded.publisher.map(pub => ({ id: pub.id, name: pub.name, link: { value: pub.name, route: EDIT_PROVIDER_ROUTE, id: 'id' }, isDeletable: !!this.updateUrl }))
            this.ids = data._embedded.ids.map(({ id, value, namespace }) => ({ id, value, namespace: namespace.value, nslabel: (namespace.name || namespace.value), isDeletable: !!this.updateUrl }))
            this.tipps = data._embedded.tipps || []
            this.allAlternateNames = data._embedded.variantNames.map(variantName => ({ ...variantName, isDeletable: !!this.updateUrl }))
            this.allNames = { name: data.name, alts: this.allAlternateNames }
            this.reviewRequests = data._embedded.reviewRequests
            this.titleItem.editionStatement = data.editionStatement
            this.dateCreated = data.dateCreated
            this.lastUpdated = data.lastUpdated
            this.titleItem.firstAuthor = data.firstAuthor
            this.titleItem.firstEditor = data.firstEditor
            this.titleItem.medium = data.medium
            this.titleItem.OAStatus = data.OAStatus
            this.titleItem.editionNumber = data.editionNumber
            this.titleItem.firstPublishedInPrint = data.firstPublishedInPrint && data.firstPublishedInPrint.substr(0, 10)
            this.titleItem.firstPublishedOnline = data.firstPublishedOnline && data.firstPublishedOnline.substr(0, 10)
            this.titleItem.volumeNumber = data.volumeNumber
            this.titleItem.status = data.status
            this.history = data.history

            this.shortTitleMap = { name: data.name, id: data.id, uuid: data.uuid, type: data.type }
            this.reviewsCount = this.reviewRequests.filter(req => req.status.name === 'Open').length

            document.title = this.$i18n.tc('component.title.type.' + this.currentType) + ' – ' + this.allNames.name

            const tippsResult = await this.catchError({
              promise: titleServices.getTipps(this.id, { status: 'Current' }, this.cancelToken.token),
              instance: this
            })

            if (tippsResult.status === 200) {
              this.tippCount = tippsResult.data._pagination.total
            }
          } else {
            this.notFound = true
          }
        }
        loading.stopLoading()
      },
      addPendingChange (prop) {
        if (!this.pendingChanges[prop]) {
          this.pendingChanges[prop] = true
        }
      },
      refreshReviewsCount (count) {
        this.reviewsCount = count
      },
      updateTippCount (count) {
        this.tippCount = count
      }
    },
  }
</script>
<style>
  .v-slide-group__prev {
    margin-left: -50px;
  }
</style>
<style scoped>
  .tab-dark {
    color: rgba(255, 255, 255, 0.6);
  }
</style>
