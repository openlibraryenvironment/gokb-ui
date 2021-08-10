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
        <v-col>
          <gokb-text-field
            v-model="reference"
            :label="$t('component.provider.homepage')"
            :disabled="isReadonly"
          />
        </v-col>
        <v-col lg="2">
          <gokb-namespace-field
            v-model="titleNamespace"
            target-type="Title"
            :readonly="isReadonly"
            :label="$t('component.provider.titleNamespace')"
          />
        </v-col>
        <v-col lg="2">
          <gokb-namespace-field
            v-model="packageNamespace"
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
          <v-tabs-slider color="black" />

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
            key="identifiers"
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
              @update="addPendingChange"
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
              @update="addPendingChange"
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
              @update="addPendingChange"
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
  import accountModel from '@/shared/models/account-model'
  import loading from '@/shared/models/loading'

  export default {
    name: 'EditProviderView',
    components: { GokbErrorComponent, GokbCuratoryGroupSection, GokbAlternateNamesSection },
    extends: BaseComponent,
    props: {
      id: {
        type: [String, Number],
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        tab: null,
        pendingChanges: {},
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
        offices: [],
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
      },
      tabsView (value) {
        if (this.loggedIn) {
          accountModel.useTabbedView(value)
        }
      }
    },
    async created () {
      this.reload()

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

        const data = {
          id: this.id,
          name: this.allNames.name,
          source: this.source || null,
          status: this.status,
          reference: this.reference,
          ids: this.ids,
          variantNames: this.allAlternateNames.map(({ variantName, id }) => ({ variantName, id: typeof id === 'number' ? id : null })),
          offices: this.offices.map(office => ({ ...office, id: (typeof office.id === 'number' ? office.id : null) })),
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
            this.pendingChanges = {}
            this.reload()
          } else {
            this.$router.push('/provider/' + response.data?.id)
          }

          this.successMsg = this.isEdit
            ? this.$i18n.t('success.update', [this.$i18n.tc('component.provider.label'), this.name])
            : this.$i18n.t('success.create', [this.$i18n.tc('component.provider.label'), this.name])
        }
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
                providedPackages,
                offices
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
          this.offices = offices?.map(office => ({ ...office, typeLocal: (office.function ? this.$i18n.t('component.office.type.label') : undefined), localLanguage: (office.language?.value && office.language.value), isDeletable: !!updateUrl })) || []
          this.dateCreated = dateCreated
          this.lastUpdated = lastUpdated
          this.updateUrl = updateUrl
          this.deleteUrl = deleteUrl
          this.status = status
          this.successMsg = false

          document.title = this.$i18n.tc('component.provider.label') + ' – ' + this.allNames.name

          loading.stopLoading()
        }
      },
      addPendingChange (prop) {
        if (!this.pendingChanges[prop]) {
          this.pendingChanges[prop] = true
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
