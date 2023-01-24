<template>
  <gokb-page
    v-if="accessible && !notFound"
    :key="version"
    :title="title"
    @valid="valid = $event"
    @submit="update"
  >
    <gokb-error-component :value="error" />
    <v-snackbars :objects.sync="eventMessages"></v-snackbars>
    <gokb-section :no-tool-bar="true">
      <v-row>
        <v-col md="12">
          <gokb-name-field
            v-model="allNames"
            :disabled="isReadonly"
            :label="$t('component.general.name')"
            check-dupes="Org"
            :item-id="providerObject.id"
          />
        </v-col>
      </v-row>
      <v-row v-if="id">
        <v-col cols="6">
          <gokb-state-select-field
            v-model="providerObject.status"
            :deletable="!!deleteUrl"
            :editable="!!updateUrl"
          />
        </v-col>
        <v-col cols="6" xl="3">
          <gokb-uuid-field
            v-if="id"
            :label="$t('component.general.uuid.label')"
            :value="uuid"
            path="/provider"
            dense
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <gokb-text-field
            v-model="providerObject.homepage"
            :label="$t('component.provider.homepage')"
            :disabled="isReadonly"
          />
        </v-col>
        <v-col cols="3" xl="2">
          <gokb-namespace-field
            v-model="providerObject.titleNamespace"
            target-type="Title"
            :readonly="isReadonly"
            :label="$t('component.provider.titleNamespace')"
          />
        </v-col>
        <v-col cols="3" xl="2">
          <gokb-namespace-field
            v-model="providerObject.packageNamespace"
            target-type="Package"
            :readonly="isReadonly"
            :label="$t('component.provider.packageNamespace')"
          />
        </v-col>
        <v-col lg="2" />
      </v-row>
    </gokb-section>
    <v-row
      v-if="tabsView"
      :style="{ minHeight:'330px' }"
    >
      <v-col>
        <v-tabs
          v-model="tab"
          class="mx-4"
        >
          <v-tabs-slider color="primary" />

          <v-tab
            key="variants"
            :active-class="tabClass"
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
            key="identifiers"
            :active-class="tabClass"
          >
            {{ $tc('component.identifier.label', 2) }}
            <v-chip class="ma-2">
              {{ providerObject.ids.length }}
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
            key="platforms"
            :active-class="tabClass"
          >
            {{ $tc('component.platform.label', 2) }}
            <v-chip class="ma-2">
              {{ allPlatforms.length }}
            </v-chip>
            <v-icon
              v-if="pendingChanges.platforms"
              :title="$t('pending.lists.changed')"
              small
            >
              mdi-alert-decagram
            </v-icon>
          </v-tab>
          <v-tab
            v-if="!!id"
            key="packages"
            :active-class="tabClass"
          >
            {{ $tc('component.package.label', 2) }}
            <v-chip class="ma-2">
              {{ packageCount }}
            </v-chip>
          </v-tab>
          <v-tab
            key="curators"
            :active-class="tabClass"
          >
            {{ $tc('component.curatoryGroup.label', 2) }}
            <v-chip class="ma-2">
              {{ allCuratoryGroups.length }}
            </v-chip>
            <v-icon
              v-if="pendingChanges.curators"
              :title="$t('pending.lists.changed')"
              small
            >
              mdi-alert-decagram
            </v-icon>
          </v-tab>
          <v-tab
            key="offices"
            :active-class="tabClass"
          >
            {{ $tc('component.office.label', 2) }}
            <v-chip class="ma-2">
              {{ offices.length }}
            </v-chip>
            <v-icon
              v-if="pendingChanges.offices"
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
            key="identifiers"
            class="mt-4"
          >
            <gokb-identifier-section
              v-model="providerObject.ids"
              :show-title="false"
              :disabled="isReadonly"
              :api-errors="errors.ids"
              @update="addPendingChange"
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
              :api-errors="errors.providedPlatforms"
              :provider-id="providerObject.id"
              @update="addPendingChange"
            />
          </v-tab-item>
          <v-tab-item
            v-if="!!id"
            key="packages"
            class="mt-4"
          >
            <gokb-packages-section
              :show-title="false"
              disabled
              :api-errors="errors.providedPackages"
              :provider-id="providerObject.id"
              @update="updatePackageCount"
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
              :api-errors="errors.curatoryGroups"
              @update="addPendingChange"
            />
          </v-tab-item>
          <v-tab-item
            key="offices"
            class="mt-4"
          >
            <gokb-offices-section
              v-model="offices"
              :show-title="false"
              :disabled="isReadonly"
              :api-errors="errors.offices"
              @update="addPendingChange"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
    <div v-else>
      <gokb-alternate-names-section
        v-model="allNames.alts"
        :expanded="allNames.alts.length > 0"
        :disabled="isReadonly"
      />
      <gokb-identifier-section
        v-model="providerObject.ids"
        :expanded="providerObject.ids.length > 0"
        :disabled="isReadonly"
      />
      <gokb-platform-section
        v-model="allPlatforms"
        :expanded="allPlatforms.length > 0"
        :sub-title="$tc('component.platform.label', 2)"
        :disabled="isReadonly"
      />
      <gokb-packages-section
        v-if="!!id"
        :sub-title="$tc('component.package.label', 2)"
        :expanded="packageCount > 0"
        disabled
      />
      <gokb-curatory-group-section
        v-model="allCuratoryGroups"
        :expanded="allCuratoryGroups.length > 0"
        :sub-title="$tc('component.curatoryGroup.label', 2)"
        :disabled="isReadonly"
      />
      <gokb-offices-section
        v-model="offices"
        :expanded="offices.length > 0"
        :sub-title="$tc('component.office.label', 2)"
        :disabled="isReadonly"
      />
    </div>
    <template #buttons>
      <gokb-button
        v-if="!isReadonly"
        @click="reload"
      >
        {{ $t('btn.reset') }}
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
        :disabled="!valid"
        default
      >
        {{ updateButtonText }}
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
          {{ $t('component.general.notFound', [$tc('component.provider.label')]) }}
        </div>
      </v-card-text>
    </v-card>
  </gokb-page>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import GokbErrorComponent from '@/shared/components/complex/gokb-error-component'
  import GokbCuratoryGroupSection from '@/shared/components/complex/gokb-curatory-group-section'
  import GokbAlternateNamesSection from '@/shared/components/complex/gokb-alternate-names-section'
  import providerServices from '@/shared/services/provider-services'
  import searchServices from '@/shared/services/search-services'
  import accountModel from '@/shared/models/account-model'
  import loading from '@/shared/models/loading'
  import VSnackbars from 'v-snackbars'
  import { createCancelToken } from '@/shared/services/http'
  import languageServices from '@/shared/services/language-services'

  export default {
    name: 'EditProviderView',
    components: { GokbErrorComponent, GokbCuratoryGroupSection, GokbAlternateNamesSection, VSnackbars },
    extends: BaseComponent,
    props: {
      id: {
        type: [String, Number],
        required: false,
        default: undefined
      },
      initMessageCode: {
        type: String,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        tab: null,
        uuid: undefined,
        pendingChanges: {},
        valid: true,
        notFound: false,
        tabsView: true,
        dateCreated: undefined,
        lastUpdated: undefined,
        deleteUrl: undefined,
        allAlternateNames: [],
        allCuratoryGroups: [],
        packageCount: 0,
        allNames: { name: undefined, alts: [] },
        allPlatforms: [],
        offices: [],
        errors: {},
        updateUrl: undefined,
        eventMessages: [],
        version: undefined,
        providerObject: {
          id: undefined,
          ids: [],
          status: undefined,
          source: undefined,
          titleNamespace: undefined,
          packageNamespace: undefined,
          homepage: undefined,
        }
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
        return this.dateCreated ? new Date(this.dateCreated).toLocaleString('sv') : ''
      },
      localLastUpdated () {
        return this.lastUpdated ? new Date(this.lastUpdated).toLocaleString('sv') : ''
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
      '$i18n.locale' (l) {
        if (this.isEdit) {
          document.title = this.$i18n.tc('component.provider.label') + ' – ' + this.allNames.name
        }
        languageServices.fetchLanguagesList(createCancelToken().token)
      },
      tabsView (value) {
        if (this.loggedIn) {
          accountModel.useTabbedView(value)
        }
      }
    },
    async created () {
      this.reload()

      if (this.initMessageCode) {
        if (this.initMessageCode.includes('success')) {
          this.eventMessages.push({ message: this.$i18n.t(this.initMessageCode, [this.$i18n.tc('component.provider.label'), this.allNames.name]), color: 'success' })
        } else if (this.initMessageCode.includes('failure')) {
          this.eventMessages.push({ message: this.$i18n.t(this.initMessageCode, [this.$i18n.tc('component.provider.label')]), color: 'error', timeout: -1 })
        } else if (this.initMessageCode.includes('warning')) {
          this.eventMessages.push({ message: this.$i18n.t(this.initMessageCode, [this.$i18n.tc('component.provider.label'), this.allNames.name]), color: 'warning', timeout: -1 })
        }
      }

      if (this.loggedIn) {
        this.tabsView = accountModel.tabbedView()
      }
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      async update () {
        var isUpdate = !!this.id
        this.eventMessages = []
        const activeGroup = accountModel.activeGroup()

        const data = {
          ...this.providerObject,
          name: this.allNames.name,
          version: this.version,
          variantNames: this.allNames.alts.map(({ variantName, id, locale, variantType }) => ({ variantName, locale, variantType, id: typeof id === 'number' ? id : null })),
          offices: this.offices.map(office => ({ ...office, id: (typeof office.id === 'number' ? office.id : null) })),
          ids: this.providerObject.ids.map(id => ({ value: id.value, type: id.namespace })),
          curatoryGroups: this.allCuratoryGroups.map(({ id }) => id),
          providedPlatforms: this.allPlatforms.map(({ name, primaryUrl, id }) => ({ name, primaryUrl, id: typeof id === 'number' ? id : null })),
          activeGroup: activeGroup
        }
        const response = await this.catchError({
          promise: providerServices.createOrUpdateProvider(data, this.cancelToken.token),
          instance: this
        })
        // todo: check error code
        if (response?.status < 400) {
          if (isUpdate) {
            this.reload()
            this.eventMessages.push({ message: this.$i18n.t('success.update', [this.$i18n.tc('component.provider.label'), this.allNames.name]), color: 'success' })
          } else {
            this.$router.push({ name: '/provider', params: { id: response.data?.id, initMessageCode: 'success.create' } })
          }
        } else {
          if (response.status === 409) {
            this.eventMessages.push({ message: this.$i18n.t('error.update.409', [this.$i18n.tc('component.provider.label')]), color: 'error' })
          } else if (response.status === 500) {
            this.eventMessages.push({ message: this.$i18n.t('error.general.500', [this.$i18n.tc('component.provider.label')]), color: 'error' })
          } else {
            this.eventMessages.push({ message: this.$i18n.t(this.isEdit ? 'error.update.400' : 'error.create.400', [this.$i18n.tc('component.provider.label')]), color: 'error' })
            this.errors = response.data.error
          }
        }
      },
      async reload () {
        if (this.isEdit) {
          loading.startLoading()
          this.errors = {}
          this.pendingChanges = {}

          const result = await this.catchError({
            promise: providerServices.getProvider(this.id, this.cancelToken.token),
            instance: this
          })

          if (result.status === 200) {
            this.mapRecord(result.data)
          } else if (result.status === 401) {
            accountModel.logout()
            const retry = await this.catchError({
              promise: providerServices.getProvider(this.id, this.cancelToken.token),
              instance: this
            })

            if (retry.status > 200) {
              this.accessible = false
            } else {
              this.mapRecord(retry.data)
            }
          } else if (result.status === 404) {
            this.notFound = true
          }

          loading.stopLoading()
        }
      },
      addPendingChange (prop) {
        if (!this.pendingChanges[prop]) {
          this.pendingChanges[prop] = true
        }
      },
      async mapRecord (data) {
        this.name = data.name
        this.providerObject.source = data.source
        this.providerObject.homepage = data.homepage
        this.version = data.version
        this.updateUrl = data._links?.update?.href || null
        this.deleteUrl = data._links?.delete?.href || null
        this.providerObject.id = data.id
        this.providerObject.ids = data._embedded.ids.map(({ id, value, namespace }) => ({ id, value, namespace: namespace.value, nslabel: namespace.name || namespace.value, isDeletable: !!this.updateUrl }))
        this.allAlternateNames = data._embedded.variantNames.map(variantName => ({ ...variantName, isDeletable: !!this.updateUrl }))
        this.allCuratoryGroups = data._embedded.curatoryGroups.map(group => ({ ...group, isDeletable: !!this.updateUrl }))
        this.allPlatforms = data._embedded.providedPlatforms.map(platform => ({ ...platform, updateUrl: platform._links.update.href, isDeletable: !!this.updateUrl }))
        this.providerObject.titleNamespace = data.titleNamespace
        this.providerObject.packageNamespace = data.packageNamespace
        this.allNames = { name: data.name, alts: this.allAlternateNames }
        this.offices = data._embedded.offices?.map(office => ({ ...office, typeLocal: (office.function ? this.$i18n.t('component.office.type.label') : undefined), localLanguage: (office.language?.value && office.language.value), isDeletable: !!this.updateUrl })) || []
        this.dateCreated = data.dateCreated
        this.lastUpdated = data.lastUpdated
        this.providerObject.status = data.status
        this.uuid = data.uuid

        document.title = this.$i18n.tc('component.provider.label') + ' – ' + this.allNames.name

        const pkgResult = await this.catchError({
          promise: searchServices('rest/packages').search({ status: 'Current', provider: data.id, es: true }, this.cancelToken.token),
          instance: this
        })

        if (pkgResult.status === 200) {
          this.packageCount = pkgResult.data._pagination.total
        }
      },
      updatePackageCount (count) {
        this.packageCount = count
      }
    }
  }
</script>

<style scoped>
  .tab-dark {
    color: rgba(255, 255, 255, 0.6);
  }
</style>
