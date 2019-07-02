<template>
  <span>
    <v-data-table
      v-model="localSelectedItems"
      :headers="localHeaders"
      :items="localItems"
      item-key="id"
      :pagination.sync="localPagination"
      :total-items="totalItems"
      hide-actions
      select-all>
      <template #no-data>
        <v-layout column align-center>
          <v-alert :value="!!error" type="error">
            {{error}}
          </v-alert>
          <div>Keine Daten verfügbar.</div>
        </v-layout>
      </template>
      <!-- data -->
      <template #items="props">
        <td><v-checkbox v-model="props.selected" hide-details/></td>
        <td v-for="header in headers" :key="props.item[header.value]"
            :class="`text-xs-${header.align}`">{{props.item[header.value]}}
        </td>
        <td><v-icon small @click="markItemDeleted(props.item)">delete</v-icon></td>
      </template>
    </v-data-table>
    <div class="text-xs-center pt-2">
      <v-pagination :total-visible="7" :length="pages" v-model="localPagination.page"/>
    </div>
  </span>
</template>

<script>
export default {
  name: 'TableComponent',
  props: {
    headers: {
      type: Array,
      required: true
    },
    items: [Array, undefined],
    selectedItems: [Array, undefined],
    deletedItems: [Array, undefined],
    addedItems: [Array, undefined],
    pagination: {
      type: Object,
      required: false,
    },
    error: {
      type: Error,
      required: false,
    },
  },
  data () {
    return {
      localSelectedItems: [],
      localPagination: {
        descending: null,
        page: 1,
        rowsPerPage: 10,
        sortBy: null,
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
        : this.visibleItems?.slice((this.localPagination.page - 1) * this.localPagination.rowsPerPage, this.localPagination.page * this.localPagination.rowsPerPage)
    },
    totalItems () {
      return this.pagination ? this.pagination.totalItems : this.visibleItems?.length
    },
    pages () {
      return this.visibleItems
        ? Math.ceil(this.visibleItems?.length / (this.pagination ? this.pagination.rowsPerPage : this.localPagination.rowsPerPage))
        : 0
    },
  },
  mounted () {
    if (this.pagination) {
      this.localPagination = this.pagination
    }
  },
  watch: {
    'localSelectedItems': function () {
      this.selectedItems.length = 0
      this.selectedItems.push(...this.localSelectedItems)
    },
    'localPagination.page': function () {
      this.handlePaging()
    },
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
