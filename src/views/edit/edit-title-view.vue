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
    <gokb-select-field
      v-if="!isEdit"
      v-model="currentType"
      :readonly="isReadonly"
      :label="$t('component.title.type.label')"
      class="ml-4"
      :items="allTypes"
    />
    <gokb-section :sub-title="$t('component.general.general')">
      <v-row>
        <v-col md="12">
          <gokb-name-field
            v-model="allNames"
            :label="$t('component.general.name')"
            :disabled="isReadonly"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col md="12">
          <gokb-state-select-field
            v-model="status"
            :deletable="!!deleteUrl"
            :editable="!!updateUrl"
          />
        </v-col>
      </v-row>
      <v-row v-if="currentType == 'Book'">
        <v-col>
          <gokb-number-field
            v-model="volumeNumber"
            :readonly="isReadonly"
            :label="$t('component.title.volumeNumber')"
          />
        </v-col>
        <v-col>
          <gokb-number-field
            v-model="editionNumber"
            :readonly="isReadonly"
            :label="$t('component.title.editionNumber')"
          />
        </v-col>
        <v-col>
          <gokb-text-field
            v-model="editionStatement"
            :label="$t('component.title.editionStatement')"
            :readonly="isReadonly"
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
      <v-row v-if="currentType == 'Journal'">
        <v-col>
          <gokb-date-field
            v-model="publishedFrom"
            :readonly="isReadonly"
            :label="$t('component.title.publishedFrom')"
          />
        </v-col>
        <v-col>
          <gokb-date-field
            v-model="publishedTo"
            :readonly="isReadonly"
            :label="$t('component.title.publishedTo')"
          />
        </v-col>
      </v-row>
    </gokb-section>
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
      :expanded="allNames.alts.length > 0"
    />
    <gokb-tipps-section
      :ttl="parseInt(id)"
      :disabled="true"
    />
    <template #buttons>
      <v-spacer />
      <gokb-button
        v-if="!isReadonly"
        text
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
        name: undefined,
        source: undefined,
        publishedFrom: undefined,
        publishedTo: undefined,
        publishers: [],
        status: undefined,
        allNames: { name: undefined, alts: [] },
        reviewRequests: [],
        firstPublishedOnline: undefined,
        firstPublishedInPrint: undefined,
        editionNumber: undefined,
        editionStatement: undefined,
        volumeNumber: undefined,
        version: undefined,
        reference: undefined,
        ids: [],
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
      }
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
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      async update () {
        const data = {
          id: this.id,
          name: this.allNames.name,
          ids: this.ids,
          variantNames: this.allNames.alts,
        }
        const response = await this.catchError({
          promise: titleServices.createOrUpdateTitle(data, this.cancelToken.token),
          instance: this
        })
        // todo: check error code
        if (response.status === 200) {
          this.successMsg = true
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
              name,
              source,
              type,
              status,
              publishedFrom,
              publishedTo,
              editionStatement,
              editionNumber,
              firstPublishedInPrint,
              firstPublishedOnline,
              volumeNumber,
              version,
              _embedded: {
                publisher,
                ids,
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
          this.name = name
          this.source = source
          this.version = version
          this.currentType = type
          this.publishedFrom = publishedFrom && publishedFrom.substr(0, 10)
          this.publishedTo = publishedTo && publishedTo.substr(0, 10)
          this.publishers = publisher.map(pub => ({ id: pub.id, name: pub.name, link: { value: pub.name, route: EDIT_PROVIDER_ROUTE, id: 'id' }, isDeletable: !!updateUrl }))
          this.ids = ids.map(({ id, value, namespace }) => ({ id, value, namespace: namespace.value, nslabel: namespace.name || namespace.value, isDeletable: !!updateUrl }))
          this.allAlternateNames = variantNames.map(variantName => ({ ...variantName, isDeletable: !!updateUrl }))
          this.allNames = { name: name, alts: this.allAlternateNames }
          this.reviewRequests = reviewRequests
          this.editionStatement = editionStatement
          this.editionNumber = editionNumber
          this.firstPublishedInPrint = firstPublishedInPrint
          this.firstPublishedOnline = firstPublishedOnline
          this.volumeNumber = volumeNumber
          this.updateUrl = updateUrl
          this.deleteUrl = deleteUrl
          this.successMsg = false
          this.status = status
          loading.stopLoading()
        }
      }
    },
  }
</script>
