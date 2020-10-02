<template>
  <gokb-section
    expandable
    :hide-default="!expanded"
    sub-title="Tipps"
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
      v-if="!disabled"
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
            {{ $t('btn.add') }}
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
    <gokb-table
      :headers="tableHeaders"
      :items="items"
      :editable="isEditable"
      :selected-items="selectedItems"
      :total-number-of-items="totalNumberOfItems"
      :options.sync="options"
      @selected-items="selectedItems = $event"
      @delete-item="confirmDeleteItem"
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
  import BaseComponent from '@/shared/components/base-component'
  import { EDIT_TITLE_ROUTE } from '@/router/route-paths'

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
        selectedItems: [],
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
      isEditable () {
        return !this.disabled
      },
      packageTypes () {
        return [
          { id: 'book', text: this.$i18n.tc('component.title.type.Book') },
          { id: 'database', text: this.$i18n.tc('component.title.type.Database') },
          { id: 'journal', text: this.$i18n.tc('component.title.type.Journal') },
        ]
      }
    },
    async created () {
      this.tableHeaders = [
        { text: 'ID', align: 'left', value: 'popup', sortable: false, width: '10%' },
        { text: this.$i18n.tc('component.title.label'), align: 'left', value: 'link', sortable: false, width: '60%' },
        { text: this.$i18n.tc('component.title.type.label'), align: 'left', value: 'titleType', sortable: false, width: '10%' },
        { text: this.$i18n.tc('component.platform.label'), align: 'left', value: 'hostPlatformName', sortable: false, width: '20%' }
      ]

      if (this.pkg) {
        this.fetchTipps(this.page)
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
        this.messageToConfirm = 'Wollen Sie die ausgewählten Elemente wirklich löschen?'
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      confirmDeleteItem ({ id }) {
        this.actionToConfirm = '_deleteItem'
        this.messageToConfirm = 'Wollen Sie das ausgewählte Element wirklich löschen?'
        this.parameterToConfirm = id
        this.confirmationPopUpVisible = true
      },
      _deleteSelectedTitles () {
        this.titles = this.titles.filter(({ id }) => !this.selectedTitles
          .find(({ id: selectedId }) => id === selectedId))
        this.selectedTitles = []
      },
      _deleteItem (idToDelete) {
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
        this.fetchTipps()
      },
      addKbartFile (options) {
        this.$emit('kbart', options)
      },
      resultPaginate (page) {
        this.successMessage = undefined
        this.fetchTipps({ page })
      },
      async fetchTipps ({ page } = { page: undefined }) {
        const result = await this.catchError({
          promise: packageServices.getTipps(this.pkg, {
            offset: page ? (page - 1) * this.options.itemsPerPage : 0,
            limit: this.options.itemsPerPage
          }, this.cancelToken.token),
          instance: this
        })

        if (result?.status === 200) {
          this.items = result.data?.data?.map(
            ({ id, url, accessStartDate, accessEndDate, title, hostPlatform, _embedded, pkg, _links }) => (
              {
                id,
                coverage: _embedded.coverageStatements,
                url,
                accessStartDate,
                accessEndDate,
                pkg,
                title,
                hostPlatform,
                titleType: title.type,
                titleId: title.id,
                popup: { value: id, label: 'tipp', type: 'GokbAddTitlePopup' },
                link: { value: title.name, route: EDIT_TITLE_ROUTE, id: 'titleId' },
                hostPlatformName: hostPlatform?.name,
                updateUrl: _links.update.href,
                deleteUrl: _links.delete.href,
                isDeletable: !!_links.delete.href,
                isRetireable: !!_links.update.href
              }
            )
          )
          this.itemCount = result?.data?._pagination?.total
        }
      }
    }
  }
</script>
