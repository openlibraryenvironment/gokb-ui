<template>
  <div>
    <div
      v-if="label"
      class="text-h6"
    >
      {{ label }}
    </div>
    <v-data-table-server
      ref="dtable"
      v-model="localSelectedItems"
      :headers="localHeaders"
      :items="items"
      :options="options"
      :items-length="totalNumberOfItems"
      :item-key="itemKey"
      :loading="showLoading"
      :show-select="showSelect"
      :must-sort="mustSort"
      :value-comparator="comparator"
      :item-selectable="itemSelectable"
      :items-per-page="options.itemsPerPage"
      density="compact"
      return-object
      @update:sortBy="changeSortBy"
    >
      <template #no-data>
        <v-row justify="center">
          <v-alert
            v-if="!!error"
            :value="!!error"
            type="error"
          >
            {{ error }}
          </v-alert>
          <div v-else>
            {{ noDataTableText }}
          </div>
        </v-row>
      </template>
      <template #item.link="{ item }">
        <router-link
          :style="{ color: 'primary' }"
          :to="{ name: item.link.route, params: { 'id': item[item.link.id] } }"
        >
          {{ item.link.value }}
        </router-link>
      </template>
      <template #item.linkTwo="{ item }">
        <router-link
          v-if="item.linkTwo"
          :style="{ color: 'primary' }"
          :to="{ name: item.linkTwo.route, params: { 'id': item[item.linkTwo.id] } }"
        >
          {{ item.linkTwo.value }}
        </router-link>
      </template>
      <template #item.popup="{ item }">
        <a
          :href="$route.query.page"
          :style="{ color: 'primary', textDecoration: 'underline', cursor: 'pointer' }"
          @click="editItemPopupVisible = item.id"
        >
          {{ item.popup.value }}
        </a>

        <component
          :is="item.popup.type"
          v-if="editItemPopupVisible == item.id"
          :key="`${item.popup.label}_${item.id}`"
          v-model="editItemPopupVisible"
          :items="items"
          :pprops="item.popup.otherProps"
          :selected="item"
          @edit="editItem"
        />
      </template>
      <template #item._pending="{ item }">
        <div v-if="item.markError" style="white-space:nowrap;">
          <v-icon
            class="mr-2"
            color="red"
            :title="item.markError"
          >
            mdi-alert
          </v-icon>
          <span class="text-error" style="white-space:nowrap;"> {{ item.markError }}</span>
        </div>
        <v-icon
          v-else-if="item._pending === 'added'"
          class="mr-6"
          color="green"
          :title="$t('pending.item.added')"
        >
          mdi-plus
        </v-icon>
        <v-icon
          v-else-if="item._pending === 'removed'"
          class="mr-6"
          small
        >
          mdi-minus
        </v-icon>
        <v-icon
          v-else-if="item._pending === 'existing'"
          class="mr-2"
          color="green"
          small
        >
          mdi-check-bold
        </v-icon>
        <v-icon
          v-else-if="item._pending === 'selected'"
          class="mr-2"
          small
        >
          mdi-arrow-right-bold
        </v-icon>
        <v-icon
          v-else-if="item._pending === 'unselected'"
          class="mr-2"
          color="red"
          small
        >
          mdi-close-thick
        </v-icon>
      </template>
      <template
        v-if="actions"
        #item.action="{ item }"
      >
        <component
          :is="item.popup.type"
          v-if="editItemPopupVisible == item.id"
          :key="`${item.popup.label}_${item.id}`"
          v-model="editItemPopupVisible"
          :items="items"
          :pprops="item.popup.otherProps"
          :selected="item"
          @edit="editItem"
        />
        <div class="table-action-icons">
          <a
            v-if="!!item.extlink"
            :href="item.extlink"
            target="_blank"
          >
            <v-icon
              style="cursor:pointer"
              color="primary"
              :title="$t('btn.linkext')"
              right
              small
            >
              mdi-open-in-new
            </v-icon>
          </a>
          <v-icon
            v-if="item.popup"
            class="mr-2"
            style="cursor:pointer"
            color="primary"
            :title="item.updateUrl ? $t('btn.edit') : $t('btn.details')"
            right
            small
            @click="editItemPopupVisible = item.id"
          >
            {{ item.updateUrl ? 'mdi-pencil' : 'mdi-arrow-top-left' }}
          </v-icon>
          <v-icon
            v-if="editable && item.isRetireable !== undefined"
            class="mr-2"
            :disabled="disabled || !item.isRetireable"
            color="primary"
            style="cursor:pointer"
            :title="$t('btn.retire')"
            right
            small
            @click="retireItem(item)"
          >
            mdi-close
          </v-icon>
          <v-icon
            v-if="editable && item.isDeletable !== undefined"
            :disabled="disabled || !item.isDeletable"
            color="primary"
            style="cursor:pointer"
            :title="$t('btn.delete')"
            small
            right
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
          <v-icon
            v-if="editable && item.isClosable"
            :disabled="disabled"
            color="primary"
            style="cursor:pointer"
            class="font-weight-bold"
            :title="$t('btn.close')"
            right
            small
            @click="closeReview(item)"
          >
            mdi-check-bold
          </v-icon>
        </div>
      </template>
      <template #bottom>
        <div v-if="!hidePagination && (pages > 1 || totalNumberOfItems > 10)" class="text-center pt-2 bg-card">
          <v-pagination
            v-model="options.page"
            color="primary"
            :disabled="disabled"
            :length="pages"
            :total-visible="7"
          />
          <div style="margin-top:-48px;padding-bottom:10px;text-align:right;">
            <v-btn
              class="mr-1"
              :color="options.itemsPerPage === 10 ? 'primary' : 'card'"
              text
              @click="setPageSize(10)">10</v-btn>
            <v-btn
              :color="options.itemsPerPage === 20 ? 'primary' : 'card'"
              class="mr-1"
              text
              @click="setPageSize(20)">20</v-btn>
            <v-btn
              :color="options.itemsPerPage === 50 ? 'primary' : 'card'"
              class="mr-1"
              text
              @click="setPageSize(50)">50</v-btn>
          </div>
        </div>
      </template>
    </v-data-table-server>
  </div>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import GokbEditJobPopup from '@/shared/popups/gokb-edit-job-popup'
  import GokbEditPlatformPopup from '@/shared/popups/gokb-edit-platform-popup'
  import GokbAddTitlePopup from '@/shared/popups/gokb-add-title-popup'
  import GokbReviewPopup from '@/shared/popups/gokb-review-popup'
  import GokbCuratoryGroupPopup from '@/shared/popups/gokb-curatory-group-popup'

  export default {
    name: 'GokbTable',
    components: {
      GokbEditJobPopup,
      GokbEditPlatformPopup,
      GokbAddTitlePopup,
      GokbReviewPopup,
      GokbCuratoryGroupPopup
    },
    extends: BaseComponent,
    emits: ['paginate', 'edit', 'delete-item', 'retire-item', 'close-review', 'selected-items'],
    props: {
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      editable: {
        type: Boolean,
        required: false,
        default: false,
      },
      headers: {
        type: Array,
        required: true
      },
      items: {
        type: Array,
        default: undefined
      },
      itemKey: {
        type: String,
        default: 'id'
      },
      label: {
        type: String,
        required: false,
        default: undefined
      },
      selectedItems: {
        type: Array,
        required: false,
        default: () => []
      },
      forceShowSelect: {
        type: Boolean,
        required: false,
        default: false,
      },
      hidePagination: {
        type: Boolean,
        required: false,
        default: false,
      },
      totalNumberOfItems: {
        type: Number,
        required: true,
      },
      options: {
        type: Object,
        required: true,
      },
      actions: {
        type: Boolean,
        required: false,
        default: false
      },
      mustSort: {
        type: Boolean,
        required: false,
        default: true
      },
      showLoading: {
        type: Boolean,
        required: false,
        default: false
      },
      comparator: {
        type: Function,
        required: false,
        default: (a, b) => (!!a.id && !!b.id ? a.id === b.id : a.value === b.value)
      },
      isSearchResults: {
        type: Boolean,
        required: false,
        default: false
      },
      itemSelectable: {
        type: String,
        required: false,
        default: null
      }
    },
    data () {
      return {
        editItemPopupVisible: false
      }
    },
    computed: {
      localSelectedItems: {
        get () { return [...this.selectedItems] },
        set (value) { this.$emit('selected-items', value) }
      },
      localHeaders () {
        return [
          ...this.headers,
          { value: '_pending', sortable: false },
          { value: 'action', sortable: false }
        ].filter(header => (
          (!this.editable ? header.value !== '_pending' : true) &&
          (!this.actions ? header.value !== 'action' : true)
        )) // with delete icon
      },
      pages () {
        return Math.min(Math.ceil(this.totalNumberOfItems / this.options.itemsPerPage), this.options.page + 10, 1000)
      },
      showSelect () {
        return this.forceShowSelect || this.editable
      },
      noDataTableText () {
        return this.isSearchResults ? this.$i18n.t('default.table.noData.search') : this.$i18n.t('default.table.noData.props')
      },
      pagesizeButtonActive () {
        return this.$vuetify.theme.themes[this.$vuetify.theme.dark ? 'dark' : 'light'].secondary
      },
      pagesizeButtonInactive () {
        return this.$vuetify.theme.themes[this.$vuetify.theme.dark ? 'dark' : 'light'].card
      }
    },
    watch: {
      'options.page' () {
        this.handlePaging()
      },
      '$i18n.locale' () {
        this.handlePaging()
      }
    },
    activated () {
      this.closeEdit()
    },
    methods: {
      handlePaging () {
        this.$emit('paginate', this.options)
      },
      changeSortBy (sb) {
        this.$emit('paginate', { page: this.options.page, sortBy: sb })
      },
      deleteItem (item) {
        this.$emit('delete-item', item)
      },
      retireItem (item) {
        this.$emit('retire-item', item)
      },
      closeReview (item) {
        this.$emit('close-review', item)
      },
      editItem (item) {
        this.$emit('edit', item)
      },
      closeEdit () {
        this.editItemPopupVisible = undefined
      },
      checkEditItemPopupVisible (oid) {
        return this.editItemPopupVisible === oid
      },
      clearSelection () {
        this.$refs.dtable.selection = {}
      },
      setPageSize(val) {
        this.$emit('paginate', { page: 1, itemsPerPage: val })
      },
    }
  }
</script>
<style>
  .table-action-icons {
    white-space: nowrap;
    text-align: right;
  }

  td > a {
    color: rgba(var(--v-theme-primary));
  }

  .v-data-table-header__content > span {
    color: rgba(var(--v-theme-primary));
    font-weight: 700;
    font-size: 12px !important;
    letter-spacing: 0.1px;
    white-space:nowrap;
  }

  .v-data-table__th--sorted.v-data-table__th {
    color: rgba(0, 0, 0, 0.87);
  }
</style>
