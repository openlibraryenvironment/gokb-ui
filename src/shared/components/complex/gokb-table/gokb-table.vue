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
      :show-select="showSelect"
      :must-sort="true"
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
          :style="{ color: '#f2994a' }"
          :to="{ name: item.link.route, params: { 'id': item[item.link.id] } }"
        >
          {{ item.link.value }}
        </router-link>
      </template>
      <template #item.linkTwo="{ item }">
        <router-link
          v-if="item.linkTwo"
          :style="{ color: '#f2994a' }"
          :to="{ name: item.linkTwo.route, params: { 'id': item[item.linkTwo.id] } }"
        >
          {{ item.linkTwo.value }}
        </router-link>
      </template>
      <template #item.popup="{ item }">
        <a
          :href="$route.query.page"
          :style="{ color: '#f2994a', textDecoration: 'underline' }"
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
          @edit="editItem(item)"
        />
      </template>
      <template #item.action="{ item }">
        <div style="white-space:nowrap">
          <v-icon
            v-if="editable && item.isRetireable !== undefined"
            class="mr-2"
            :disabled="disabled || !item.isRetireable"
            :title="$t('btn.retire')"
            small
            @click="retireItem(item)"
          >
            close
          </v-icon>
          <v-icon
            v-if="editable && item.isDeletable !== undefined"
            :disabled="disabled || !item.isDeletable"
            :title="$t('btn.delete')"
            small
            @click="deleteItem(item)"
          >
            delete
          </v-icon>
        </div>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination
        v-model="options.page"
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
  import GokbAddTitlePopup from '@/shared/popups/gokb-add-title-popup'
  import GokbAddReviewPopup from '@/shared/popups/gokb-add-review-popup'

  export default {
    name: 'GokbTable',
    components: { GokbEditJobPopup, GokbAddTitlePopup, GokbAddReviewPopup },
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
        default: true,
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
        default: false,
      },
      totalNumberOfItems: {
        type: Number,
        required: true,
      },
      options: {
        type: Object,
        required: true,
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
        return [...this.headers, { value: 'action', sortable: false }] // with delete icon
      },
      pages () {
        return Math.ceil(this.totalNumberOfItems / this.options.itemsPerPage)
      },
      showSelect () {
        return !this.hideSelect && this.editable
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
      editItem (item) {
        this.$emit('paginate', this.options.page)
      },
      closeEdit () {
        this.editItemPopupVisible = false
      },
      checkEditItemPopupVisible (oid) {
        return this.editItemPopupVisible === oid
      }
    }
  }
</script>
