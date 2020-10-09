<template>
  <gokb-page
    :key="version"
    :title="title"
    @submit="update"
  >
    <gokb-error-component :value="error" />
    <span v-if="successMsg">
      <v-alert type="success">
        {{ isEdit ? $t('success.update', [$tc('component.provider.label'), name]) : $t('success.create', [$tc('component.provider.label'), name]) }}
      </v-alert>
    </span>
    <gokb-section :sub-title="$t('component.general.general')">
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
        <v-col md="12">
          <gokb-text-field
            v-model="reference"
            :label="$t('component.provider.homepage')"
            :disabled="isReadonly"
          />
        </v-col>
      </v-row>
    </gokb-section>
    <gokb-alternate-names-section
      v-model="allAlternateNames"
      :expanded="allAlternateNames.length > 0"
      :disabled="isReadonly"
    />
    <gokb-identifier-section
      v-model="ids"
      :expanded="ids.length > 0"
      :disabled="isReadonly"
    />
    <gokb-platform-section
      v-model="allPlatforms"
      :expanded="allPlatforms.length > 0"
      :sub-title="$tc('component.platform.label', 2)"
      :disabled="isReadonly"
    />
    <gokb-curatory-group-section
      v-model="allCuratoryGroups"
      :expanded="allCuratoryGroups.length > 0"
      :sub-title="$tc('component.curatoryGroup.label', 2)"
      :disabled="isReadonly"
    />
    <template #buttons>
      <v-spacer />
      <gokb-button
        v-if="!isReadonly"
        text
        @click="reload"
      >
        {{ $t('btn.cancel') }}
      </gokb-button>
      <gokb-button
        v-if="!isReadonly"
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
        allPackages: [],
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
        return this.$i18n.t(this.titleCode, [this.$i18n.tc('component.provider.label')])
      },
      titleCode () {
        return this.isEdit ? (this.updateUrl ? 'header.edit.label' : 'header.show.label') : 'header.create.label'
      },
      updateButtonText () {
        return this.id ? this.$i18n.t('btn.update') : this.$i18n.t('btn.create')
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
          this.reload()
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
              version,
              homepage,
              _embedded: {
                curatoryGroups,
                ids,
                variantNames,
                providedPlatforms,
                providedPackages
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
          this.allPackages = providedPackages
          this.allNames = { name: name, alts: this.allAlternateNames }
          this.updateUrl = updateUrl
          this.successMsg = false
        }
      }
    }
  }
</script>
