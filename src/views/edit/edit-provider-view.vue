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
            :disabled="isReadonly"
            label="Titel"
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
        <v-col md="4">
          <gokb-text-field
            v-model="reference"
            label="Homepage"
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
      v-model="allAlternateNames"
      :disabled="isReadonly"
    />
    <gokb-platform-section
      v-model="allPlatforms"
      sub-title="Plattformen"
      :disabled="isReadonly"
    />
    <gokb-curatory-group-section
      v-model="allCuratoryGroups"
      sub-title="Kuratoren"
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
        {{ updateButtonText }}
      </gokb-button>
    </template>
  </gokb-page>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import GokbErrorComponent from '@/shared/components/complex/gokb-error-component'
  import GokbCuratoryGroupSection from '@/shared/components/complex/gokb-curatory-group-section'
  import GokbAlternateNamesSection from '@/shared/components/complex/gokb-alternate-names-section'
  import providerServices from '@/shared/services/provider-services'
  import accountModel from '@/shared/models/account-model'

  export default {
    name: 'EditProviderView',
    components: { GokbErrorComponent, GokbCuratoryGroupSection, GokbAlternateNamesSection },
    extends: BaseComponent,
    props: {
      id: {
        type: String,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        name: undefined,
        source: undefined,
        version: undefined,
        reference: undefined,
        ids: [],
        allAlternateNames: [],
        allCuratoryGroups: [],
        allNames: { name: undefined, alts: [] },
        allPlatforms: [],
        updateUrl: undefined,
        successMsg: false
      }
    },
    computed: {
      isEdit () {
        return !!this.id
      },
      title () {
        return this.$i18n.t(this.titleCode, [this.$i18n.t('provider.label')])
      },
      titleCode () {
        return this.isEdit ? (this.updateUrl ? 'header.edit.label' : 'header.show.label') : 'header.create.label'
      },
      updateButtonText () {
        return this.id ? 'Aktualisieren' : 'Hinzufügen'
      },
      isReadonly () {
        return !this.updateUrl
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
      if (this.isEdit) {
        const {
          data: {
            //  data: {
            name,
            source,
            version,
            homepage,
            _embedded: {
              curatoryGroups,
              ids,
              variantNames,
              providedPlatforms
            },
            _links: {
              update: { href: updateUrl },
            },
            //  }
          }
        } = await this.catchError({
          promise: providerServices.getProvider(this.id, this.cancelToken.token),
          instance: this
        })
        this.name = name
        this.source = source
        this.reference = homepage
        this.version = version
        this.ids = ids.map(({ value, namespace: { name: namespace } }) => ({ value, namespace, isDeletable: !!updateUrl }))
        this.allAlternateNames = variantNames.map(variantName => ({ ...variantName, isDeletable: !!updateUrl }))
        this.allCuratoryGroups = curatoryGroups.map(group => ({ ...group, isDeletable: !!updateUrl }))
        this.allPlatforms = providedPlatforms.map(platform => ({ ...platform, isDeletable: !!updateUrl }))
        this.allNames = { name: name, alts: this.allAlternateNames }
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
          name: this.username,
          source: this.source || null,
          reference: this.reference,
          ids: this.ids,
          variantNames: this.allAlternateNames.map(({ variantName, id }) => ({ variantName, id: typeof id === 'number' ? id : null })),
          curatoryGroups: this.allCuratoryGroups.map(({ id }) => id),
          providedPlatforms: this.allPlatforms.map(({ id }) => id)
        }
        const response = await this.catchError({
          promise: providerServices.createOrUpdateProvider(data, this.cancelToken.token),
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
      },
      async reload () {
        if (this.isEdit) {
          const {
            data: {
              //  data: {
              name,
              source,
              version,
              homepage,
              _embedded: {
                curatoryGroups,
                ids,
                variantNames,
                providedPlatforms
              },
              _links: {
                update: { href: updateUrl },
              },
              //  }
            }
          } = await this.catchError({
            promise: providerServices.getProvider(this.id, this.cancelToken.token),
            instance: this
          })
          this.name = name
          this.source = source
          this.reference = homepage
          this.version = version
          this.ids = ids.map(({ value, namespace: { name: namespace } }) => ({ value, namespace, isDeletable: !!updateUrl }))
          this.allAlternateNames = variantNames.map(variantName => ({ ...variantName, isDeletable: !!updateUrl }))
          this.allCuratoryGroups = curatoryGroups.map(group => ({ ...group, isDeletable: !!updateUrl }))
          this.allPlatforms = providedPlatforms.map(platform => ({ ...platform, isDeletable: !!updateUrl }))
          this.allNames = { name: name, alts: this.allAlternateNames }
          this.updateUrl = updateUrl
          this.successMsg = false
        }
      }
    }
  }
</script>
