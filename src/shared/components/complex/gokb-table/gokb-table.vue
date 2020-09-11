<template>
  <div>
    <v-data-table
      v-model="localSelectedItems"
      :headers="localHeaders"
      :items="items"
      :options="options"
      :server-items-length="totalNumberOfItems"
      hide-default-footer
      item-key="id"
      :show-select="showSelect"
      dense
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
          :to="{ name: item.link.route, params: { [item.link.id]: item[item.link.id] } }"
        >
          {{ item.link.value }}
        </router-link>
      </template>
      <template #item.popup="{ item }">
        <a
          href="#"
          @click="editItemPopupVisible = true"
        >
          {{ item.popup.value }}
        </a>

        <component
          :is="item.popup.type"
          v-if="editItemPopupVisible"
          :key="`${item.popup.label}_${item.id}`"
          v-model="editItemPopupVisible"
          :items="items"
          :selected="item"
        />
      </template>
      <template #item.action="{ item }">
        <v-icon
          v-if="showSelect && item.isRetireable !== undefined"
          class="mr-2"
          :disabled="disabled || !item.isRetireable"
          small
          @click="retireItem(item)"
        >
          close
        </v-icon>
        <v-icon
          v-if="showSelect && item.isDeletable !== undefined"
          :disabled="disabled || !item.isDeletable"
          small
          @click="deleteItem(item)"
        >
          delete
        </v-icon>
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

  export default {
    name: 'GokbTable',
    components: { GokbEditJobPopup },
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
        return this.editable
      }
    },
    watch: {
      'options.page' () {
        this.handlePaging()
      },
    },
    methods: {
      handlePaging () {
        this.$emit('paginate', this.options.page)
      },
      deleteItem (item) {
        this.$emit('delete-item', item)
      },
      retireItem (item) {
        this.$emit('retire-item', item)
      },
      closeEdit () {
        this.editItemPopupVisible = false
      }
    }
  }
</script>
