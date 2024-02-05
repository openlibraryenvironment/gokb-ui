<template>
  <gokb-section
    expandable
    filters
    :sub-title="localTitle"
    :errors="!!apiErrors"
  >
    <template #buttons>
      <v-btn
        icon
        :title="$t('btn.refresh')"
        @click="retrievePackages"
      >
        <v-icon>
          mdi-refresh
        </v-icon>
      </v-btn>
    </template>
    <template #search>
      <gokb-text-field
        v-model="searchFilters.q"
        :label="$t('component.general.name')"
      />
      <v-spacer class="ms-4" />
      <gokb-search-platform-field
        v-model="searchFilters.nominalPlatform"
        :label="$tc('component.platform.label')"
      />
      <v-spacer class="ms-4" />
      <gokb-search-provider-field
        v-if="!providerId"
        v-model="searchFilters.provider"
        :label="$tc('component.provider.label')"
      />
      <v-spacer class="ms-4" />
      <gokb-state-field
        v-model="searchFilters.contentType"
        width="150px"
        message-path="component.package.contentType"
        url="refdata/categories/Package.ContentType"
        :label="$t('component.package.contentType.label')"
        return-object
      />
      <v-spacer class="ms-4" />
      <gokb-state-field
        v-model="searchFilters.status"
        width="150px"
        init-item="Current"
        message-path="component.general.status"
        :label="$t('component.general.status.label')"
        return-object
      />
    </template>
    <gokb-confirmation-popup
      v-model="confirmationPopUpVisible"
      :message="messageToConfirm"
      @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
    />
    <gokb-table
      :items="packages"
      :headers="resultHeaders"
      :total-number-of-items="totalNumberOfResults"
      :show-loading="isLoading"
      :options.sync="resultOptions"
      @selected-items="selectedItems = $event"
      @paginate="resultPaginate"
    />
  </gokb-section>
</template>

<script>
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import searchServices from '@/shared/services/search-services'
  import BaseComponent from '@/shared/components/base-component'
  import { EDIT_PACKAGE_ROUTE, EDIT_PROVIDER_ROUTE } from '@/router/route-paths'
  import account from '@/shared/models/account-model'

  const ROWS_PER_PAGE = 10

  export default {
    name: 'GokbPackagesSection',
    components: {
      GokbConfirmationPopup
    },
    extends: BaseComponent,
    emits: [
      'update'
    ],
    props: {
      user: {
        type: Boolean,
        required: false,
        default: false
      },
      groupId: {
        type: Number,
        required: false,
        default: undefined
      },
      defaultSortField: {
        type: String,
        required: false,
        default: undefined
      },
      defaultSortOrder: {
        type: String,
        required: false,
        default: undefined
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      showTitle: {
        type: Boolean,
        required: false,
        default: true
      },
      title: {
        type: String,
        required: false,
        default: undefined
      },
      apiErrors: {
        type: Array,
        required: false,
        default: undefined
      },
      providerId: {
        type: Number,
        required: false,
        default: undefined
      },
      hideLocal: {
        type: Boolean,
        required: false,
        default: true
      }
    },
    data () {
      return {
        rawPackages: undefined,
        confirmationPopUpVisible: false,
        selectedItems: [],
        loading: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: undefined,
        resultOptions: {
          page: 1,
          mustSort: true,
          sortBy: ['name'],
          desc: false,
          itemsPerPage: ROWS_PER_PAGE
        },
        searchFilters: {
          status: undefined,
          provider: undefined,
          contentType: undefined,
          nominalPlatform: undefined,
          q: undefined
        }
      }
    },
    computed: {
      isDeleteSelectedDisabled () {
        return !this.selectedItems.length
      },
      localTitle () {
        return this.showTitle ? (this.title || this.$i18n.tc('component.package.label', 2)) : undefined
      },
      packages () {
        const packages = this.rawPackages?.data?.data
        return packages?.map(({
          id,
          name,
          provider,
          lastUpdated,
          uuid,
          status,
          contentType,
          nominalPlatform,
          tippcount,
          _tippCount,
          _links
        }) => ({
          id,
          uuid,
          lastUpdated: lastUpdated ? new Date(lastUpdated).toLocaleString('sv').substr(0, 10) : undefined,
          status,
          link: { value: name, route: EDIT_PACKAGE_ROUTE, id: 'id' },
          linkTwo: provider ? { value: provider.name, route: EDIT_PROVIDER_ROUTE, id: 'providerId' } : undefined,
          providerId: provider?.id || undefined,
          statusLabel: status ? this.$i18n.t('component.general.status.' + status.name + '.label') : undefined,
          nominalPlatform: nominalPlatform?.name || undefined,
          contentType: contentType ? this.$i18n.t('component.package.contentType.' + contentType.name + '.label') : '',
          count: _tippCount || tippcount,
          deleteUrl: undefined,
          retireUrl: undefined
        }))
      },
      totalNumberOfResults () {
        return this.rawPackages?.data?._pagination?.total || 0
      },
      isContrib () {
        return this.loggedIn && account.hasRole('ROLE_CONTRIBUTOR')
      },
      resultHeaders () {
        return [
          {
            text: this.$i18n.t('component.general.name'),
            align: 'start',
            sortable: true,
            value: 'link'
          },
          {
            text: (this.providerId ? this.$i18n.tc('component.platform.label') : this.$i18n.tc('component.provider.label')),
            align: 'start',
            sortable: true,
            width: '20%',
            value: (this.providerId ? 'nominalPlatform' : 'linkTwo')
          },
          {
            text: this.$i18n.tc('component.package.contentType.label'),
            align: 'start',
            sortable: true,
            width: '15%',
            value: 'contentType'
          },
          {
            text: this.$i18n.tc('component.package.count'),
            align: 'start',
            sortable: false,
            width: '150px',
            value: 'count'
          },
          {
            text: this.$i18n.tc('component.general.lastUpdated'),
            align: 'end',
            sortable: true,
            width: '18%',
            value: 'lastUpdated'
          }
        ]
      },
      isLoading () {
        return this.loading
      }
    },
    watch: {
      searchFilters: {
        handler (val) {
          this.resultOptions.page = 1
          this.retrievePackages()
        },
        deep: true
      }
    },
    async created () {
      this.linkSearchParameterValues = {
        link: 'name',
        linkTwo: 'provider'
      }
      if (this.defaultSortOrder === 'desc') {
        this.resultOptions.desc = true
      }

      if (this.defaultSortField) {
        this.resultOptions.sortBy[0] = this.defaultSortField
      }
    },
    mounted () {
      this.searchFilters.provider = this.providerId
      this.retrievePackages()
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      resultPaginate (options) {
        if (options.sortBy) {
          this.resultOptions.sortBy = [options.sortBy]
        }
        if (typeof options.desc === 'boolean') {
          this.resultOptions.desc = options.desc
        }

        this.retrievePackages(options)
      },
      async retrievePackages (options) {
        const sort = this.resultOptions.sortBy.length > 0 ? (this.linkSearchParameterValues[this.resultOptions.sortBy[0]] || this.resultOptions.sortBy[0]) : this.defaultSortField
        const order = this.resultOptions.desc[0] ? 'desc' : 'asc'
        const searchServiceIncludes = 'id,uuid,name,status,provider,nominalPlatform,_links,contentType,lastUpdated'
        const searchParams = {}

        Object.keys(this.searchFilters).forEach(key => {
          if (typeof this.searchFilters[key] === 'string' || typeof this.searchFilters[key] === 'number') {
            searchParams[key] = this.searchFilters[key]
          } else if (this.searchFilters[key] instanceof Object) {
            if (this.searchFilters[key].id) {
              searchParams[key] = this.searchFilters[key].id
            } else if (this.searchFilters[key].value) {
              searchParams[key] = this.searchFilters[key].value
            }
          }
        })

        this.loading = true

        this.rawPackages = await this.catchError({
          promise: searchServices('rest/packages').search({
            ...(searchParams || {}),
            ...((sort && { _sort: sort }) || {}),
            ...(this.hideLocal ? { global: ['Global', 'Consortium', 'Regional', 'Unknown'] } : {}),
            _order: (this.resultOptions.desc ? 'desc' : 'asc'),
            _include: searchServiceIncludes,
            offset: this.resultOptions.page ? (this.resultOptions.page - 1) * this.resultOptions.itemsPerPage : 0,
            limit: this.resultOptions.itemsPerPage
          }, this.cancelToken.token),
          instance: this
        })

        this.$emit('update', this.totalNumberOfResults)

        this.loading = false
      }
    }
  }
</script>
