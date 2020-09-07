<template>
  <gokb-page
    :key="version"
    :title="title"
    @submit="update"
  >
    <gokb-error-component :value="error" />
    <span v-if="successMsg">
      <v-alert type="success">
        Update erfolgreich
      </v-alert>
    </span>
    <gokb-select-field
      v-if="!isEdit"
      v-model="currentType"
      :readonly="isReadonly"
      class="ml-4"
      :items="allTypes"
    />
    <gokb-section sub-title="Allgemein">
      <v-row>
        <v-col md="12">
          <gokb-name-field
            v-model="allNames"
            label="Name"
            :disabled="isReadonly"
          />
        </v-col>
      </v-row>
      <v-row v-if="currentType == 'Book'">
        <v-col>
          <gokb-number-field
            v-model="volumeNumber"
            :readonly="isReadonly"
            label="Band"
          />
        </v-col>
        <v-col>
          <gokb-number-field
            v-model="editionNumber"
            :readonly="isReadonly"
            label="Auflage"
          />
        </v-col>
        <v-col>
          <gokb-text-field
            v-model="editionStatement"
            label="Merkmal (Auflage)"
            :readonly="isReadonly"
          />
        </v-col>
      </v-row>
      <v-row v-if="currentType == 'Book'">
        <v-col>
          <gokb-date-field
            v-model="firstPublishedInPrint"
            :readonly="isReadonly"
            label="Veröffentlichungsdatum (Druck)"
          />
        </v-col>
        <v-col>
          <gokb-date-field
            v-model="firstPublishedOnline"
            :readonly="isReadonly"
            label="Veröffentlichungsdatum (Online)"
          />
        </v-col>
      </v-row>
      <v-row v-if="currentType == 'Journal'">
        <v-col>
          <gokb-date-field
            v-model="publishedFrom"
            :readonly="isReadonly"
            label="Veröffentlicht von"
          />
        </v-col>
        <v-col>
          <gokb-date-field
            v-model="publishedTo"
            :readonly="isReadonly"
            label="Veröffentlicht bis"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col md="4">
          <gokb-search-source-field
            v-model="source"
            :readonly="isReadonly"
          />
        </v-col>
      </v-row>
    </gokb-section>
    <gokb-identifier-section
      v-model="ids"
      :disabled="isReadonly"
    />
    <gokb-alternate-names-section
      v-model="allNames.alts"
      :disabled="isReadonly"
    />
    <template #buttons>
      <v-spacer />
      <gokb-button
        v-if="updateUrl"
        text
        @click="forceUpdate"
      >
        Abbrechen
      </gokb-button>
      <gokb-button
        v-if="updateUrl"
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

  export default {
    name: 'EditTitleView',
    components: { GokbErrorComponent, GokbAlternateNamesSection },
    extends: BaseComponent,
    props: {
      id: {
        type: String,
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
        successMsg: false,
        allTypes: [
          { name: this.$i18n.t('component.title.type.Journal'), id: 'Journal' },
          { name: this.$i18n.t('component.title.type.Book'), id: 'Book' },
          { name: this.$i18n.t('component.title.type.Database'), id: 'Database' }
        ]
      }
    },
    computed: {
      isEdit () {
        return !!this.id
      },
      title () {
        return this.$i18n.t(this.titleCode, [this.$i18n.t('component.title.label')])
      },
      titleCode () {
        return this.isEdit ? (this.updateUrl ? 'header.edit.label' : 'header.show.label') : 'header.create.label'
      },
      updateButtonText () {
        return this.id ? 'Aktualisieren' : 'Hinzufügen'
      },
      isReadonly () {
        return !accountModel.loggedIn || (this.isEdit && !this.updateUrl) || (!this.isEdit && !accountModel.hasRole('ROLE_EDITOR'))
      },
      allNames () {
        return { name: this.name, alts: this.allAlternateNames }
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
          source: this.source || null,
          ids: this.ids,
          variantNames: this.allNames.alts,
        }
        const response = await this.catchError({
          promise: titleServices.createOrUpdateTitle(data, this.cancelToken.token),
          instance: this
        })
        // todo: check error code
        if (response.status === 200) {
          this.forceUpdate()
          this.successMsg = true
        }

        window.scrollTo(0, 0)
      },
      async reload () {
        if (this.isEdit) {
          const {
            data: {
              //  data: {
              name,
              source,
              type,
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
                variantNames
              },
              _links: {
                update: { href: updateUrl }
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
          this.publishers = publisher.map(name => ({ ...name, isDeletable: !!updateUrl }))
          this.ids = ids.map(({ value, namespace: { name: namespace } }) => ({ value, namespace, isDeletable: !!updateUrl }))
          this.allAlternateNames = variantNames.map(({ variantName, id }) => ({ id, variantName, isDeletable: !!updateUrl }))
          this.editionStatement = editionStatement
          this.editionNumber = editionNumber
          this.firstPublishedInPrint = firstPublishedInPrint
          this.firstPublishedOnline = firstPublishedOnline
          this.volumeNumber = volumeNumber
          this.updateUrl = updateUrl
          this.successMsg = false
        }
      }
    },
  }
</script>
