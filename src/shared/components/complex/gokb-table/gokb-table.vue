<template>
  <div>
    <v-data-table
      v-model="localSelectedItems"
      :headers="localHeaders"
      :items="localItems"
      :options.sync="localOptions"
      :server-items-length="totalItems"
      hide-default-footer
      item-key="id"
      :show-select="showSelect"
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
            Keine Daten verfügbar.
          </div>
        </v-row>
      </template>
      <template #item.action="{ item }">
        <v-icon
          :disabled="disabled"
          small
          @click="deleteItem(item)"
        >
          delete
        </v-icon>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination
        v-model="localOptions.page"
        :disabled="disabled"
        :length="pages"
        :total-visible="7"
      />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GokbTable',
    props: {
      disabled: {
        type: Boolean,
        required: false,
        default: false,
      },
      showSelect: {
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
      selectedItems: {
        type: Array,
        default: () => [],
      },
      deletedItems: {
        type: Array,
        default: () => []
      },
      addedItems: {
        type: Array,
        default: () => []
      },
      options: {
        type: Object,
        required: false,
        default: undefined
      },
      error: {
        type: Error,
        required: false,
        default: undefined
      },
    },
    data () {
      return {
        localSelectedItems: [],
        localOptions: {
          page: 1,
          itemsPerPage: 10,
          // sortBy: undefined,
          // sortDesc: undefined, // boolean[]
          // groupBy: undefined, // string[]
          // groupDesc: undefined, // boolean[]
          // multiSort: undefined, // boolean
          // mustSort: undefined, // boolean
        }
      }
    },
    computed: {
      localHeaders () {
        return [...this.headers, { value: 'action', sortable: false }] // with delete icon
      },
      visibleItems () {
        const items = [
          ...(this.addedItems ? this.addedItems : []),
          ...(this.items ? this.items : []),
        ]
        return items.filter(item => !this.deletedItems.includes(item))
      },
      localItems () {
        return this.pagination
          ? this.visibleItems
          : this.visibleItems?.slice((this.localOptions.page - 1) * this.localOptions.itemsPerPage, this.localOptions.page * this.localOptions.itemsPerPage)
      },
      totalItems () {
        return this.pagination ? this.pagination.totalItems : this.visibleItems?.length
      },
      pages () {
        return this.visibleItems
          ? Math.ceil(this.visibleItems?.length / (this.pagination ? this.pagination.itemsPerPage : this.localOptions.itemsPerPage))
          : 0
      },
    },
    watch: {
      localSelectedItems: function () {
        this.selectedItems.length = 0
        this.selectedItems.push(...this.localSelectedItems)
      },
      'localOptions.page': function () {
        this.handlePaging()
      },
    },
    mounted () {
      if (this.pagination) {
        this.localOptions = this.pagination
      }
    },
    methods: {
      handlePaging () {
        if (this.pagination) {
          this.$emit('paginate')
        }
      },
      deleteItem (item) {
        this.deletedItems.push(item)
      },
    }
  }
</script>
