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
          <gokb-number-field label="Band" />
        </v-col>
        <v-col>
          <gokb-number-field label="Auflage" />
        </v-col>
        <v-col>
          <gokb-text-field label="Merkmal (Auflage)" />
        </v-col>
      </v-row>
      <v-row v-if="currentType == 'Book'">
        <v-col>
          <gokb-date-field label="Veröffentlichungsdatum (Druck)" />
        </v-col>
        <v-col>
          <gokb-date-field label="Veröffentlichungsdatum (Online)" />
        </v-col>
      </v-row>
      <v-row v-if="currentType == 'Journal'">
        <v-col>
          <gokb-date-field
            v-model="publishedFrom"
            label="Veröffentlicht von"
          />
        </v-col>
        <v-col>
          <gokb-date-field
            v-model="publishedTo"
            label="Veröffentlicht bis"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col md="4">
          <gokb-search-source-field
            v-model="source"
            :disabled="isReadonly"
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
        {{ updateButtonText }} {{ currentTypeLabel }}
      </gokb-button>
    </template>
  </gokb-page>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import GokbErrorComponent from '@/shared/components/complex/gokb-error-component'
  import GokbAlternateNamesSection from '@/shared/components/complex/gokb-alternate-names-section'
  import titleServices from '@/shared/services/title-services'

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
      currentType: {
        type: String,
        required: false,
        default: 'Journal'
      }
    },
    data () {
      return {
        name: undefined,
        source: undefined,
        publishedFrom: undefined,
        publishedTo: undefined,
        version: undefined,
        reference: undefined,
        ids: [],
        allAlternateNames: [],
        allCuratoryGroups: [],
        updateUrl: undefined,
        successMsg: false
      }
    },
    computed: {
      isEdit () {
        return !!this.id
      },
      title () {
        return this.isEdit ? (this.updateUrl ? this.$i18n.t('edit.label', [this.$i18n.t('title.type.' + this.currentType)]) : this.$i18n.t('title.type.' + this.currentType)) : this.$i18n.t('create.label', [this.$i18n.t('title.type.' + this.currentType)])
      },
      updateButtonText () {
        return this.id ? 'Aktualisieren' : 'Hinzufügen'
      },
      isReadonly () {
        return !this.updateUrl
      },
      allNames () {
        return { name: this.name, alts: this.allAlternateNames }
      },
      allTypes () {
        return [this.$i18n.t('journal.label'), this.$i18n.t('book.label'), this.$i18n.t('database.label')]
      },
      currentTypeLabel () {
        return this.$i18n.t('title.type.' + this.currentType)
      }
    },
    async created () {
      if (this.isEdit) {
        const {
          data: {
            //  data: {
            name,
            source,
            type,
            publishedFrom,
            publishedTo,
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
        this.updateUrl = updateUrl
        this.successMsg = false
      }
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
      forceUpdate () {
        this.version += 1
      }
    }
  }
</script>
