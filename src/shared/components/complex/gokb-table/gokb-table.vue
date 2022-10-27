<template>
  <div>
    <div
      v-if="label"
      class="text-h6"
    >
      {{ label }}
    </div>
    <v-data-table
      v-model="localSelectedItems"
      :headers="localHeaders"
      :items="items"
      :options="options"
      :server-items-length="totalNumberOfItems"
      hide-default-footer
      :item-key="itemKey"
      :loading="showLoading"
      :show-select="showSelect"
      :must-sort="mustSort"
      dense
      @update:sort-by="changeSortBy"
      @update:sort-desc="changeSortOrder"
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
            {{ $i18n.t('search.results.empty') }}
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
          :style="{ color: 'primary', textDecoration: 'underline' }"
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
        <v-icon
          v-if="item.markError"
          class="mr-6"
          color="red"
          :title="item.markError"
        >
          mdi-alert
        </v-icon>
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
        <div style="white-space:nowrap">
          <a
            v-if="!!item.extlink"
            :href="item.extlink"
            target="_blank"
          >
            <v-icon
              style="cursor:pointer"
              :title="$t('btn.linkext')"
              small
            >
              mdi-open-in-new
            </v-icon>
          </a>
          <v-icon
            v-if="item.popup"
            class="mr-2"
            style="cursor:pointer"
            :title="item.updateUrl ? $t('btn.edit') : $t('btn.details')"
            small
            @click="editItemPopupVisible = item.id"
          >
            {{ item.updateUrl ? 'mdi-pencil' : 'mdi-arrow-top-left' }}
          </v-icon>
          <v-icon
            v-if="editable && item.isRetireable !== undefined"
            class="mr-2"
            :disabled="disabled || !item.isRetireable"
            style="cursor:pointer"
            :title="$t('btn.retire')"
            small
            @click="retireItem(item)"
          >
            mdi-close
          </v-icon>
          <v-icon
            v-if="editable && item.isDeletable !== undefined"
            :disabled="disabled || !item.isDeletable"
            style="cursor:pointer"
            :title="$t('btn.delete')"
            small
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
          <v-icon
            v-if="editable && item.isClosable"
            :disabled="disabled"
            style="cursor:pointer"
            class="font-weight-bold"
            :title="$t('btn.close')"
            small
            @click="closeReview(item)"
          >
            mdi-check-bold
          </v-icon>
        </div>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination
        v-model="options.page"
        color="secondary"
        :disabled="disabled"
        :length="pages"
        :total-visible="7"
      />
    </div>
  </div>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import GokbEditJobPopup from '@/shared/popups/gokb-edit-job-popup'
  import GokbEditPlatformPopup from '@/shared/popups/gokb-edit-platform-popup'
  import GokbAddTitlePopup from '@/shared/popups/gokb-add-title-popup'
  import GokbAddReviewPopup from '@/shared/popups/gokb-add-review-popup'
  import GokbCuratoryGroupPopup from '@/shared/popups/gokb-curatory-group-popup'

  export default {
    name: 'GokbTable',
    components: { GokbEditJobPopup, GokbEditPlatformPopup, GokbAddTitlePopup, GokbAddReviewPopup, GokbCuratoryGroupPopup },
    extends: BaseComponent,
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
      hideSelect: {
        type: Boolean,
        required: false,
        default: true,
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
      }
    },
    data () {
      return {
        editItemPopupVisible: false,
      }
    },
    computed: {
      localSelectedItems: {
        get () { return [...this.selectedItems] },
        set (value) { this.$emit('selected-items', value) }
      },
      localHeaders () {
        return [...this.headers, { value: '_pending', sortable: false }, { value: 'action', sortable: false }].filter(header => ((!this.editable ? header.value !== '_pending' : true) && (!this.actions ? header.value !== 'action' : true))) // with delete icon
      },
      pages () {
        return Math.min(Math.ceil(this.totalNumberOfItems / this.options.itemsPerPage), this.options.page + 10, 1000)
      },
      showSelect () {
        return this.editable || !this.hideSelect
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
      changeSortOrder (desc) {
        this.$emit('paginate', { page: this.options.page, desc: desc })
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
      }
    }
  }
</script>
