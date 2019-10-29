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
        <v-layout
          align-center
          column
        >
          <v-alert
            :value="!!error"
            type="error"
          >
            {{ error }}
          </v-alert>
          <div>Keine Daten verfügbar.</div>
        </v-layout>
      </template>
      <!-- data -->
      <template #items="props">
        <td>
          <v-checkbox
            v-model="props.selected"
            hide-details
          />
        </td>
        <td
          v-for="header in headers"
          :key="props.item[header.value]"
          :class="`text-${header.align}`"
        >
          {{ props.item[header.value] }}
        </td>
        <td>
          <v-icon
            small
            @click="markItemDeleted(props.item)"
          >
            delete
          </v-icon>
        </td>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination
        v-model="localOptions.page"
        :length="pages"
        :total-visible="7"
      />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TableComponent',
    props: {
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
        return [...this.headers, { sortable: false, width: '1%' }]
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
      'localSelectedItems': function () {
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
      markItemDeleted (item) {
        this.deletedItems.push(item)
      },
      markSelectedDeleted () {
        this.localSelectedItems.forEach(item => {
          this.markItemDeleted(item)
        })
        this.localSelectedItems = []
      },
    }
  }
</script>
