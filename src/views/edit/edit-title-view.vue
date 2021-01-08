<template>
  <gokb-page
    :key="version"
    :title="title"
    @submit="update"
  >
    <gokb-error-component :value="error" />
    <span v-if="successMsg">
      <v-alert type="success">
        {{ isEdit ? $t('success.create', [typeDisplay, allNames.name]) : $t('success.update', [typeDisplay, allNames.name]) }}
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
      <v-col cols="3">
        <v-switch
          v-model="tabsView"
          :label="$t('component.title.tabsView')"
        />
      </v-col>
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
        <v-col cols="4">
          <gokb-state-field
            v-model="OAStatus"
            message-path="component.title.OAStatus"
            width="100%"
            url="refdata/categories/TitleInstance.OAStatus"
            :label="$t('component.title.OAStatus.label')"
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
            key="reviews"
            :active-class="tabClass"
          >
            {{ $tc('component.review.label', 2) }}
          </v-tab>
          <v-tab
            key="tipps"
            :active-class="tabClass"
          >
            {{ $tc('component.tipp.label', 2) }}
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
        v-if="id"
        review-component="id"
      />
      <gokb-tipps-section
        :ttl="parseInt(id)"
        :disabled="true"
      />
    </div>
    <template #buttons>
      <v-spacer />
      <div v-if="id">
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
        @click="reload"
      >
        {{ $i18n.t('btn.cancel') }}
      </gokb-button>
      <gokb-button
        v-if="!isReadonly"
        default
      >
        {{ $i18n.t('btn.submit') }}
      </gokb-button>
    </template>
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
        name: undefined,
        source: undefined,
        dateCreated: undefined,
        lastUpdated: undefined,
        publishedFrom: undefined,
        publishedTo: undefined,
        publishers: [],
        status: undefined,
        tabsView: false,
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
          { name: this.$i18n.tc('component.title.type.Database'), id: 'Database' }
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
      updateButtonText () {
        return this.id ? 'Aktualisieren' : 'Hinzufügen'
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
          status: typeof this.status === 'number' ? this.status : this.status.id,
          publisher: this.publishers.map(pub => pub.id)
        }
        const response = await this.catchError({
          promise: titleServices.createOrUpdateTitle(data, this.cancelToken.token),
          instance: this
        })
        // todo: check error code
        if (response.status === 200) {
          this.successMsg = true
          this.id = response.data.id
          this.reload()
        }

        window.scrollTo(0, 0)
      },
      async reload () {
        if (this.isEdit) {
          loading.startLoading()
          const {
            data: {
              //  data: {
              id,
              name,
              source,
              type,
              status,
              medium,
              publishedFrom,
              publishedTo,
              OAStatus,
              editionStatement,
              editionNumber,
              firstPublishedInPrint,
              firstPublishedOnline,
              firstAuthor,
              firstEditor,
              dateCreated,
              lastUpdated,
              volumeNumber,
              version,
              _embedded: {
                publisher,
                ids,
                tipps,
                variantNames,
                reviewRequests
              },
              _links: {
                update: { href: updateUrl },
                delete: { href: deleteUrl }
              },
              //  }
            }
          } = await this.catchError({
            promise: titleServices.getTitle(this.id, this.cancelToken.token),
            instance: this
          })

          if (id) {
            this.id = id
            this.name = name
            this.source = source
            this.version = version
            this.currentType = type
            this.publishedFrom = publishedFrom && publishedFrom.substr(0, 10)
            this.publishedTo = publishedTo && publishedTo.substr(0, 10)
            this.publishers = publisher.map(pub => ({ id: pub.id, name: pub.name, link: { value: pub.name, route: EDIT_PROVIDER_ROUTE, id: 'id' }, isDeletable: !!updateUrl }))
            this.ids = ids.map(({ id, value, namespace }) => ({ id, value, namespace: namespace.value, nslabel: (namespace.name || namespace.value), isDeletable: !!updateUrl }))
            this.tipps = tipps || []
            this.allAlternateNames = variantNames.map(variantName => ({ ...variantName, isDeletable: !!updateUrl }))
            this.allNames = { name: name, alts: this.allAlternateNames }
            this.reviewRequests = reviewRequests
            this.editionStatement = editionStatement
            this.dateCreated = dateCreated
            this.lastUpdated = lastUpdated
            this.firstAuthor = firstAuthor
            this.firstEditor = firstEditor
            this.medium = medium
            this.OAStatus = OAStatus
            this.editionNumber = editionNumber
            this.firstPublishedInPrint = firstPublishedInPrint
            this.firstPublishedOnline = firstPublishedOnline
            this.volumeNumber = volumeNumber
            this.updateUrl = updateUrl
            this.deleteUrl = deleteUrl
            this.successMsg = false
            this.status = status
          }
          loading.stopLoading()
        }
      }
    },
  }
</script>

<style scoped>
  .tab-dark {
    color: rgba(255, 255, 255, 0.6);
  }
</style>
