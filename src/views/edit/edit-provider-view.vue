<template>
  <gokb-page
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
        <v-col md="12">
          <gokb-name-field
            v-model="allNames"
            :disabled="isReadonly"
            label="Titel"
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
        <v-col md="12">
          <gokb-text-field
            v-model="reference"
            :label="$t('component.provider.homepage')"
            :disabled="isReadonly"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col md="4">
          <gokb-namespace-field
            v-model="titleNamespace"
            target-type="Title"
            :readonly="isReadonly"
            :label="$t('component.provider.titleNamespace')"
          />
        </v-col>
        <v-col md="4">
          <gokb-namespace-field
            v-model="packageNamespace"
            target-type="Package"
            :readonly="isReadonly"
            :label="$t('component.provider.packageNamespace')"
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
            key="variants"
            :active-class="tabClass"
          >
            {{ $tc('component.variantName.label', 2) }}
          </v-tab>
          <v-tab
            key="identifiers"
            :active-class="tabClass"
          >
            {{ $tc('component.identifier.label', 2) }}
          </v-tab>
          <v-tab
            key="platforms"
            :active-class="tabClass"
          >
            {{ $tc('component.platform.label', 2) }}
          </v-tab>
          <v-tab
            key="curators"
            :active-class="tabClass"
          >
            {{ $tc('component.curatoryGroup.label', 2) }}
          </v-tab>
        </v-tabs>
        <v-tabs-items
          v-model="tab"
        >
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
            key="platforms"
            class="mt-4"
          >
            <gokb-platform-section
              v-model="allPlatforms"
              :show-title="false"
              :disabled="isReadonly"
            />
          </v-tab-item>
          <v-tab-item
            key="curators"
            class="mt-4"
          >
            <gokb-curatory-group-section
              v-model="allCuratoryGroups"
              :show-title="false"
              :disabled="isReadonly"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
    <div v-else>
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
    </div>
    <template #buttons>
      <v-spacer />
      <div v-if="id">
        <v-chip
          class="ma-2"
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
  import loading from '@/shared/models/loading'

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
        tab: null,
        name: undefined,
        source: undefined,
        version: undefined,
        tabsView: false,
        status: undefined,
        dateCreated: undefined,
        lastUpdated: undefined,
        deleteUrl: undefined,
        titleNamespace: undefined,
        packageNamespace: undefined,
        reference: undefined,
        ids: [],
        allAlternateNames: [],
        allCuratoryGroups: [],
        allPackages: [],
        allNames: { name: undefined, alts: [] },
        allPlatforms: [],
        updateUrl: undefined,
        successMsg: undefined
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
        var isUpdate = !!this.id

        const data = {
          id: this.id,
          name: this.name,
          source: this.source || null,
          status: typeof this.status === 'number' ? this.status : this.status.id,
          reference: this.reference,
          ids: this.ids,
          variantNames: this.allAlternateNames.map(({ variantName, id }) => ({ variantName, id: typeof id === 'number' ? id : null })),
          curatoryGroups: this.allCuratoryGroups.map(({ id }) => id),
          providedPlatforms: this.allPlatforms.map(({ name, primaryUrl, id }) => ({ name, primaryUrl, id: typeof id === 'number' ? id : null }))
        }
        const response = await this.catchError({
          promise: providerServices.createOrUpdateProvider(data, this.cancelToken.token),
          instance: this
        })
        // todo: check error code
        if (response.status === 200) {
          if (isUpdate) {
            this.reload()
          } else {
            this.$router.push('/provider/' + response.data?.id)
          }

          this.successMsg = this.isEdit
            ? this.$i18n.t('success.update', [this.$i18n.tc('component.provider.label'), this.name])
            : this.$i18n.t('success.create', [this.$i18n.tc('component.provider.label'), this.name])
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
              status,
              titleNamespace,
              packageNamespace,
              version,
              dateCreated,
              lastUpdated,
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
                delete: { href: deleteUrl }
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
          this.ids = ids.map(({ id, value, namespace }) => ({ id, value, namespace: namespace.value, nslabel: namespace.name || namespace.value, isDeletable: !!updateUrl }))
          this.allAlternateNames = variantNames.map(variantName => ({ ...variantName, isDeletable: !!updateUrl }))
          this.allCuratoryGroups = curatoryGroups.map(group => ({ ...group, isDeletable: !!updateUrl }))
          this.allPlatforms = providedPlatforms.map(platform => ({ ...platform, isDeletable: !!updateUrl }))
          this.titleNamespace = titleNamespace
          this.packageNamespace = packageNamespace
          this.allPackages = providedPackages
          this.allNames = { name: name, alts: this.allAlternateNames }
          this.dateCreated = dateCreated
          this.lastUpdated = lastUpdated
          this.updateUrl = updateUrl
          this.deleteUrl = deleteUrl
          this.status = status
          this.successMsg = false
          loading.stopLoading()
        }
      }
    }
  }
</script>

<style scoped>
  .tab-dark {
    color: rgba(255, 255, 255, 0.6);
  }
</style>
