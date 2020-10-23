<template>
  <gokb-section
    expandable
    :hide-default="!expanded"
    filters
    :sub-title="$tc('component.tipp.label', 2)"
    :items-total="totalNumberOfItems"
  >
    <span v-if="successMessage">
      <v-alert type="success">
        {{ successMessage }}
      </v-alert>
    </span>
    <gokb-kbart-import-popup
      v-if="kbartImportPopupVisible"
      v-model="kbartImportPopupVisible"
      @kbart="addKbartFile"
    />
    <gokb-add-title-popup
      v-if="addTitlePopupVisible"
      v-model="addTitlePopupVisible"
      :title-type="addTitleType"
      :pkg="pkg"
      :parent-platform="platform"
      @add="addNewTitle"
    />
    <template
      v-if="isEditable"
      #buttons
    >
      <gokb-button
        class="mr-4"
        @click="showKbartImportPopup"
      >
        KBART Import
      </gokb-button>
      <v-menu
        offset-y
        open-on-hover
      >
        <template #activator="{ on }">
          <v-btn
            class="mr-4"
            color="primary"
            v-on="on"
          >
            <v-icon>add</v-icon>
            {{ $t('btn.new') }}
            <v-icon>keyboard_arrow_down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <template v-for="type in packageTypes">
            <v-list-item
              :key="type.text"
              @click="showAddNewTitlePopup(type)"
            >
              <v-list-item-title>
                {{ type.text }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </v-menu>

      <gokb-button
        :disabled="selectedItems.length == 0"
        class="mr-4"
        icon-id="close"
        @click="confirmRetireSelectedItems"
      >
        {{ $t('btn.retire') }}
      </gokb-button>
      <gokb-button
        :disabled="selectedItems.length == 0"
        icon-id="delete"
        @click="confirmDeleteSelectedItems"
      >
        {{ $t('btn.delete') }}
      </gokb-button>
    </template>
    <gokb-confirmation-popup
      v-model="confirmationPopUpVisible"
      :message="messageToConfirm"
      @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
    />
    <template #search>
      <gokb-title-field
        v-if="pkg"
        v-model="searchFilters.title"
        :label="$tc('component.title.label')"
      />
      <gokb-search-package-field
        v-else
        v-model="searchFilters.pkg"
        :label="$tc('component.package.label')"
      />
      <v-spacer class="ms-4" />
      <gokb-state-field
        v-model="searchFilters.status"
        width="150px"
        :init-item="$t('component.general.status.Current.label')"
        message-path="component.general.status"
        :label="$t('component.general.status.label')"
        return-object
      />
    </template>
    <gokb-table
      v-if="(!pkg && !ttl) || newTipps.length > 0"
      :headers="tableHeaders"
      :items="newTipps"
      :label="$t('component.package.navigation.newTitles')"
      :editable="isEditable"
      :selected-items="selectedNewItems"
      :total-number-of-items="totalNumberOfNewItems"
      :options.sync="newOptions"
      @selected-items="selectedNewItems = $event"
      @delete-item="confirmDeleteNew"
      @paginate="resultNewPaginate"
      @edit="editTitle"
    />
    <v-divider
      v-if="newTipps.length > 0"
      class="mb-5"
    />
    <gokb-table
      v-if="ttl || pkg"
      :headers="tableHeaders"
      :items="items"
      :editable="isEditable"
      :selected-items="selectedItems"
      :total-number-of-items="totalNumberOfItems"
      :options.sync="options"
      @selected-items="selectedItems = $event"
      @delete-item="confirmDeleteItem"
      @retire-item="confirmRetireItem"
      @paginate="resultPaginate"
      @edit="editTitle"
    />
  </gokb-section>
</template>

<script>
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import GokbAddTitlePopup from '@/shared/popups/gokb-add-title-popup'
  import GokbKbartImportPopup from '@/shared/popups/gokb-kbart-import-popup'
  import packageServices from '@/shared/services/package-services'
  import titleServices from '@/shared/services/title-services'
  import BaseComponent from '@/shared/components/base-component'
  import accountModel from '@/shared/models/account-model'

  const ROWS_PER_PAGE = 10

  export default {
    name: 'GokbTippsSection',
    components: {
      GokbConfirmationPopup,
      GokbAddTitlePopup,
      GokbKbartImportPopup
    },
    extends: BaseComponent,
    props: {
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      pkg: {
        type: Number,
        required: false,
        default: undefined
      },
      ttl: {
        type: Number,
        required: false,
        default: undefined
      },
      expanded: {
        type: Boolean,
        required: false,
        default: true
      },
      platform: {
        type: Object,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        options: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
        newOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
        selectedItems: [],
        selectedNewItems: [],
        searchFilters: {
          status: undefined,
          title: undefined,
          pkg: undefined
        },
        newTipps: [],
        successMessage: undefined,
        items: [],
        addTitleType: undefined,
        kbartImportPopupVisible: false,
        confirmationPopUpVisible: false,
        addTitlePopupVisible: undefined,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: undefined,
        itemCount: 0,
        newItemCount: 0,
        interval: null
      }
    },
    computed: {
      isDeleteSelectedDisabled () {
        return !this.selectedItems.length
      },
      totalNumberOfItems () {
        return this.itemCount
      },
      totalNumberOfNewItems () {
        return this.newTipps.length
      },
      isEditable () {
        return !this.disabled && !this.title
      },
      packageTypes () {
        return [
          { id: 'book', text: this.$i18n.tc('component.title.type.Book') },
          { id: 'database', text: this.$i18n.tc('component.title.type.Database') },
          { id: 'journal', text: this.$i18n.tc('component.title.type.Journal') },
        ]
      },
      loggedIn () {
        return accountModel.loggedIn()
      },
    },
    watch: {
      loggedIn (value) {
        if (value) {
          this.fetchTipps(this.options.page)
        }
      },
      searchFilters: {
        handler (val) {
          this.options.page = 1
          this.fetchTipps()
        },
        deep: true
      }
    },
    async created () {
      this.tableHeaders = [
        { text: 'Details', align: 'left', value: 'popup', sortable: false },
        { text: this.$i18n.tc('component.general.status.label'), align: 'left', value: 'statusLocal', sortable: false, width: '10%' },
        { text: this.$i18n.tc('component.title.type.label'), align: 'left', value: 'titleType', sortable: false, width: '10%' },
        { text: this.$i18n.tc('component.platform.label'), align: 'left', value: 'hostPlatformName', sortable: false, width: '20%' }
      ]

      if (this.pkg || this.ttl) {
        this.fetchTipps()
      }

      // this.interval = setInterval(function () {
      //   this.fetchTipps(this.page)
      // }.bind(this), 2000)
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      confirmDeleteSelectedItems () {
        this.actionToConfirm = '_deleteSelectedTitles'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: [this.selectedItems.length, this.$i18n.tc('component.tipp.label', this.selectedItems.length)] }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      confirmDeleteItem ({ id }) {
        this.actionToConfirm = '_deleteItem'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: [this.$i18n.tc('component.tipp.label'), id] }
        this.parameterToConfirm = id
        this.confirmationPopUpVisible = true
      },
      confirmRetireSelectedItems () {
        this.actionToConfirm = '_retireSelectedTitles'
        this.messageToConfirm = { text: 'popups.confirm.retire.list', vars: [this.selectedItems.length, this.$i18n.tc('component.tipp.label', this.selectedItems.length)] }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      confirmRetireItem ({ id }) {
        this.actionToConfirm = '_retireItem'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: [this.$i18n.tc('component.tipp.label'), id] }
        this.parameterToConfirm = id
        this.confirmationPopUpVisible = true
      },
      confirmDeleteNew ({ id }) {
        this.actionToConfirm = '_deleteItem'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: [this.$i18n.tc('component.tipp.label'), id] }
        this.parameterToConfirm = id
        this.confirmationPopUpVisible = true
      },
      _deleteSelectedTitles () {
        this.titles = this.titles.filter(({ id }) => !this.selectedTitles
          .find(({ id: selectedId }) => id === selectedId))
        this.selectedTitles = []
      },
      _retireSelectedTitles () {
        this.titles = this.titles.filter(({ id }) => !this.selectedTitles
          .find(({ id: selectedId }) => id === selectedId))
        this.selectedTitles = []
      },
      _deleteItem (idToDelete) {
      },
      _retireItem (idToRetire) {
        this.fetchTipps()
      },
      showAddNewTitlePopup (titleType) {
        this.addTitleType = titleType
        this.successMessage = undefined
        this.addTitlePopupVisible = 1
      },
      showKbartImportPopup () {
        this.successMessage = undefined
        this.kbartImportPopupVisible = true
      },
      editTitle (tipp) {
        this.successMessage = this.$i18n.t('success.update', [this.$i18n.tc('component.title.label'), tipp.title.name])
        this.fetchTipps()
      },
      addNewTitle (tipp) {
        this.successMessage = this.$i18n.t('success.add', [this.$i18n.tc('component.title.label'), tipp.title.name])
        this.newTipps.push(tipp)
        this.$emit('update', this.newTipps)
      },
      addKbartFile (options) {
        this.$emit('kbart', options)
      },
      resultPaginate (page) {
        this.successMessage = undefined
        this.fetchTipps({ page })
      },
      resultNewPaginate (page) {
        this.successMessage = undefined
      },
      async fetchTipps ({ page } = { page: undefined }) {
        if (this.pkg || this.ttl) {
          const reqId = this.pkg || this.ttl
          const searchService = this.pkg ? packageServices : titleServices
          const searchParams = {}

          Object.keys(this.searchFilters).forEach(key => {
            if (this.searchFilters[key] instanceof String || typeof this.searchFilters[key] === 'number') {
              searchParams[key] = this.searchFilters[key]
            } else if (this.searchFilters[key] instanceof Object) {
              if (this.searchFilters[key].id) {
                searchParams[key] = this.searchFilters[key].id
              } else if (this.searchFilters[key].value) {
                searchParams[key] = this.searchFilters[key].value
              }
            }
          })

          const result = await this.catchError({
            promise: searchService.getTipps(reqId, {
              ...(searchParams || {}),
              offset: page ? (page - 1) * this.options.itemsPerPage : 0,
              limit: this.options.itemsPerPage
            }, this.cancelToken.token),
            instance: this
          })

          if (result?.status === 200) {
            this.items = result.data?.data?.map(
              ({ id, url, accessStartDate, status, accessEndDate, title, hostPlatform, _embedded, pkg, _links }) => (
                {
                  id,
                  coverageStatements: _embedded.coverageStatements,
                  statusLocal: this.$i18n.t('component.general.status.' + status.name + '.label'),
                  status: status,
                  url,
                  accessStartDate: accessStartDate && accessStartDate.substr(0, 10),
                  accessEndDate: accessEndDate && accessEndDate.substr(0, 10),
                  pkg,
                  title,
                  hostPlatform,
                  updateUrl: _links.update.href,
                  deleteUrl: _links.delete.href,
                  titleType: title.type,
                  titleId: title.id,
                  ids: _embedded.ids.map(({ id, value, namespace: { name: namespace } }) => ({ id, value, namespace, isDeletable: !!_links.delete.href })),
                  popup: { value: (this.ttl ? pkg.name : title.name), label: 'tipp', type: 'GokbAddTitlePopup' },
                  hostPlatformName: hostPlatform?.name
                }
              )
            )
            this.itemCount = result?.data?._pagination?.total
          }
        }
      }
    }
  }
</script>
