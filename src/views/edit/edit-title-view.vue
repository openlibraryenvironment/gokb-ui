<template>
  <gokb-page
    v-if="!notFound"
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
        {{ isEdit ? $t('success.update', [typeDisplay, allNames.name]) : $t('success.create', [typeDisplay, allNames.name]) }}
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
          />
        </v-col>
      </v-row>
      <v-row v-if="id">
        <v-col>
          <gokb-state-select-field
            v-model="status"
            :deletable="!!deleteUrl"
            :editable="!!updateUrl"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3">
          <gokb-state-field
            v-model="OAStatus"
            message-path="component.title.OAStatus"
            width="100%"
            url="refdata/categories/TitleInstance.OAStatus"
            :label="$t('component.title.OAStatus.label')"
            :readonly="isReadonly"
          />
        </v-col>
        <v-col cols="3">
          <gokb-state-field
            v-if="currentType == 'Other'"
            v-model="OAStatus"
            message-path="component.title.Medium"
            width="100%"
            url="refdata/categories/TitleInstance.Medium"
            :label="$t('component.title.Medium.label')"
            :readonly="isReadonly"
          />
        </v-col>
        <v-col v-if="currentType == 'Book'">
          <gokb-text-field
            v-model="firstAuthor"
            :label="$t('component.title.firstAuthor.label')"
            :disabled="isReadonly"
          />
        </v-col>
        <v-col v-if="currentType == 'Book'">
          <gokb-text-field
            v-model="firstEditor"
            :label="$t('component.title.firstEditor.label')"
            :disabled="isReadonly"
          />
        </v-col>
        <v-col v-if="currentType == 'Journal'">
          <gokb-date-field
            v-model="publishedFrom"
            :readonly="isReadonly"
            :label="$t('component.title.publishedFrom')"
          />
        </v-col>
        <v-col v-if="currentType == 'Journal'">
          <gokb-date-field
            v-model="publishedTo"
            :readonly="isReadonly"
            :label="$t('component.title.publishedTo')"
          />
        </v-col>
      </v-row>
      <v-row v-if="currentType == 'Book'">
        <v-col>
          <gokb-number-field
            v-model="volumeNumber"
            :disabled="isReadonly"
            :label="$t('component.title.volumeNumber')"
          />
        </v-col>
        <v-col>
          <gokb-number-field
            v-model="editionNumber"
            :disabled="isReadonly"
            :label="$t('component.title.editionNumber')"
          />
        </v-col>
        <v-col>
          <gokb-text-field
            v-model="editionStatement"
            :label="$t('component.title.editionStatement')"
            :disabled="isReadonly"
          />
        </v-col>
      </v-row>
      <v-row v-if="currentType == 'Book'">
        <v-col>
          <gokb-date-field
            v-model="firstPublishedInPrint"
            :readonly="isReadonly"
            :label="$t('component.title.firstPublishedInPrint')"
          />
        </v-col>
        <v-col>
          <gokb-date-field
            v-model="firstPublishedOnline"
            :readonly="isReadonly"
            :label="$t('component.title.firstPublishedOnline')"
          />
        </v-col>
      </v-row>
    </gokb-section>
    <v-row
      v-if="tabsView"
      style="min-height:400px"
    >
      <v-col>
        <v-tabs
          v-model="tab"
          class="mx-4"
        >
          <v-tabs-slider color="black" />

          <v-tab
            key="identifiers"
            :active-class="tabClass"
          >
            {{ $tc('component.identifier.label', 2) }}
          </v-tab>
          <v-tab
            key="publisher"
            :active-class="tabClass"
          >
            {{ $tc('component.title.publisher.label', 2) }}
          </v-tab>
          <v-tab
            key="variants"
            :active-class="tabClass"
          >
            {{ $tc('component.variantName.label', 2) }}
          </v-tab>
          <v-tab
            v-if="loggedIn && id"
            key="reviews"
            :active-class="tabClass"
          >
            {{ $tc('component.review.label', 2) }}
          </v-tab>
          <v-tab
            v-if="id"
            key="tipps"
            :active-class="tabClass"
          >
            {{ $tc('component.tipp.label', 2) }}
          </v-tab>
          <v-tab
            v-if="isEdit"
            key="history"
            :active-class="tabClass"
          >
            {{ $t('component.title.history.label') }}
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
            />
          </v-tab-item>
          <v-tab-item
            v-if="loggedIn"
            key="reviews"
            class="mt-4"
          >
            <gokb-reviews-section
              :review-component="id"
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
            />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
    <div v-else>
      <gokb-identifier-section
        v-model="ids"
        :disabled="isReadonly"
      />
      <gokb-publisher-section
        v-model="publishers"
        :disabled="isReadonly"
      />
      <gokb-alternate-names-section
        v-model="allNames.alts"
        :disabled="isReadonly"
      />
      <gokb-reviews-section
        v-if="id && loggedIn"
        :review-component="id"
      />
      <gokb-tipps-section
        v-if="id"
        :ttl="parseInt(id)"
        :disabled="true"
      />
      <gokb-title-history-section
        v-if="currentType === 'Journal'"
        v-model="history"
        :title-info="shortTitleMap"
        :disabled="isReadonly"
      />
    </div>
    <v-row justify="end">
      <v-col cols="3">
        <v-switch
          v-model="tabsView"
          :label="$t('component.title.tabsView')"
        />
      </v-col>
    </v-row>
    <template #buttons>
      <gokb-button
        v-if="!isReadonly"
        @click="reload"
      >
        {{ $i18n.t('btn.cancel') }}
      </gokb-button>
      <v-spacer />
      <div v-if="id && !notFound">
        <v-chip
          class="mr-2"
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
          class="mr-2"
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
        v-if="!isReadonly"
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
        <div class="display-1 primary--text">
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
        shortTitleMap: { name: undefined, id: undefined, uuid: undefined, type: undefined },
        name: undefined,
        notFound: false,
        source: undefined,
        dateCreated: undefined,
        lastUpdated: undefined,
        publishedFrom: undefined,
        publishedTo: undefined,
        publishers: [],
        status: undefined,
        tabsView: true,
        history: [],
        allNames: { name: undefined, alts: [] },
        reviewRequests: [],
        firstPublishedOnline: undefined,
        firstPublishedInPrint: undefined,
        firstAuthor: undefined,
        firstEditor: undefined,
        editionNumber: undefined,
        editionStatement: undefined,
        volumeNumber: undefined,
        OAStatus: undefined,
        medium: undefined,
        version: undefined,
        reference: undefined,
        ids: [],
        tipps: [],
        allAlternateNames: [],
        allCuratoryGroups: [],
        currentType: undefined,
        updateUrl: undefined,
        deleteUrl: undefined,
        successMsg: false,
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
        return this.isEdit ? (this.updateUrl ? 'header.edit.label' : 'header.show.label') : 'header.create.label'
      },
      typeDisplay () {
        return this.$i18n.tc('component.title.type.' + this.currentType)
      },
      isReadonly () {
        return !accountModel.loggedIn || (this.isEdit && !this.updateUrl) || (!this.isEdit && !accountModel.hasRole('ROLE_EDITOR'))
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
      tabClass () {
        return this.$vuetify.theme.dark ? 'tab-dark' : ''
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
        this.successMsg = false

        const data = {
          id: this.id,
          name: this.allNames.name,
          ids: this.ids.map(id => ({ value: id.value, type: id.namespace })),
          variantNames: this.allNames.alts,
          publishedFrom: this.publishedFrom,
          publishedTo: this.publishedTo,
          firstPublishedInPrint: this.firstPublishedInPrint,
          firstPublishedOnline: this.firstPublishedOnline,
          firstAuthor: this.firstAuthor,
          firstEditor: this.firstEditor,
          type: this.currentType,
          volumeNumber: this.volumeNumber,
          editionNumber: this.editionNumber,
          editionStatement: this.editionStatement,
          OAStatus: (!this.OAStatus || typeof this.OAStatus === 'number') ? this.OAStatus : this.OAStatus.id,
          status: this.status,
          publisher: this.publishers.map(pub => pub.id)
        }
        const response = await this.catchError({
          promise: titleServices.createOrUpdateTitle(data, this.cancelToken.token),
          instance: this
        })
        // todo: check error code
        if (response.status === 200) {
          this.successMsg = true

          const mappedHistory = this.history.map(({ date, from, to, id }) => ({ date, from, to, id: (typeof id === 'number' ? id : null) }))

          const hresp = await this.catchError({
            promise: titleServices.updateHistory(response.data.id, mappedHistory, this.cancelToken.token),
            instance: this
          })

          if (hresp.status !== 200) {
            console.log('history error')
          }

          this.reload()
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

            if (!this.id) {
              this.id = data.id
            }
            this.updateUrl = data._links?.update?.href || null
            this.deleteUrl = data._links?.delete?.href || null
            this.name = data.name
            this.source = data.source
            this.version = data.version
            this.currentType = data.type
            this.publishedFrom = data.publishedFrom && data.publishedFrom.substr(0, 10)
            this.publishedTo = data.publishedTo && data.publishedTo.substr(0, 10)
            this.publishers = data._embedded.publisher.map(pub => ({ id: pub.id, name: pub.name, link: { value: pub.name, route: EDIT_PROVIDER_ROUTE, id: 'id' }, isDeletable: !!this.updateUrl }))
            this.ids = data._embedded.ids.map(({ id, value, namespace }) => ({ id, value, namespace: namespace.value, nslabel: (namespace.name || namespace.value), isDeletable: !!this.updateUrl }))
            this.tipps = data._embedded.tipps || []
            this.allAlternateNames = data._embedded.variantNames.map(variantName => ({ ...variantName, isDeletable: !!this.updateUrl }))
            this.allNames = { name: this.name, alts: this.allAlternateNames }
            this.reviewRequests = data._embedded.reviewRequests
            this.editionStatement = data.editionStatement
            this.dateCreated = data.dateCreated
            this.lastUpdated = data.lastUpdated
            this.firstAuthor = data.firstAuthor
            this.firstEditor = data.firstEditor
            this.medium = data.medium
            this.OAStatus = data.OAStatus
            this.editionNumber = data.editionNumber
            this.firstPublishedInPrint = data.firstPublishedInPrint
            this.firstPublishedOnline = data.firstPublishedOnline
            this.volumeNumber = data.volumeNumber
            this.status = data.status
            this.history = data.history

            this.shortTitleMap = { name: data.name, id: data.id, uuid: data.uuid, type: data.type }
          } else {
            this.notFound = true
          }
        }
        loading.stopLoading()
      }
    },
  }
</script>

<style scoped>
  .tab-dark {
    color: rgba(255, 255, 255, 0.6);
  }
</style>
