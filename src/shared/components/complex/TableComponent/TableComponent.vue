<template>
  <span>
    <v-data-table
      :headers="headers"
      :items="localItems"
      :pagination.sync="localPagination"
      :total-items="totalItems"
      :loading="loading"
      hide-actions>
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
        <td v-for="header in headers" :key="header.value"
            :class="`text-xs-${header.align}`">{{props.item[header.value]}}
        </td>
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
    items: {
      type: Array,
      required: false
    },
    formatter: {
      type: Object,
      required: false
    },
    loading: {
      type: Boolean,
      required: false
    },
    pagination: {
      type: Object,
      required: false,
    },
    search: {
      type: String,
      required: false,
    },
    error: {
      type: Error,
      required: false,
    },
  },
  data () {
    return {
      localPagination: {
        descending: null,
        page: 1,
        rowsPerPage: 10,
        sortBy: null,
      }
    }
  },
  computed: {
    convertedItems () {
      return [] // converter.toTable(this.items)
    },
    headers () {
      return this.determineTableHeader(this.convertedItems)
    },
    filteredItems () {
      const { header, items } = this.convertedItems
      if (this.pagination) {
        return { header, items }
      } else {
        return { header, items: this.filter(items) }
      }
    },
    formattedItems () {
      const { header, items } = this.filteredItems
      return (this.formatter && items.map(r =>
        r.map((it, i) => {
          const formatter = header[i] && this.formatter[header[i]]
          return (formatter && formatter(it)) || it
        })
      )) || items
    },
    localItems () {
      return this.pagination
        ? this.formattedItems
        : this.formattedItems.slice((this.localPagination.page - 1) * this.localPagination.rowsPerPage, this.localPagination.page * this.localPagination.rowsPerPage)
    },
    totalItems () {
      return this.pagination ? this.pagination.totalItems : this.formattedItems.length
    },
    pages () {
      return this.totalItems
        ? Math.ceil(this.totalItems / (this.pagination ? this.pagination.rowsPerPage : this.localPagination.rowsPerPage))
        : 0
    },
  },
  mounted () {
    if (this.pagination) {
      this.localPagination = this.pagination
    }
  },
  watch: {
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
    filter (items) {
      return this.search
        ? items
          .filter(i => Object.values(i)
            .some(v => v && String(v).toLowerCase().includes(this.search.toLowerCase()))
          )
        : items
    },
    determineTableHeader ({ header, items: [first] }) {
      return header.map((k, i) => ({
        text: k,
        value: i,
        align: !isNaN(first[i]) ? 'right' : 'left',
        sortable: false,
      }))
    }
  }
}
</script>
