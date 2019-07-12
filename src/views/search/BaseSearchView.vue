<template>
  <v-container>
    <v-card flat>
      <v-form ref="searchForm" @submit.prevent="search">
        <v-toolbar flat>
          <v-toolbar-title>
            <div class="title">{{title}}</div>
            <div class="subheading">Suche</div>
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text class="ma-2">
          <template v-for="(row, rowIndex) of searchInputFields">
            <v-layout :key="`${title}_${rowIndex}`">
              <template v-for="(column, columnIndex) of row">
                <component :is="column.type" clearable v-bind="column.properties" v-model="column.model" :key="`${title}_${rowIndex}_${columnIndex}`"></component>
                <v-spacer v-if="columnIndex != row.length - 1" :key="`${title}_${rowIndex}_${columnIndex}_spacer`"></v-spacer>
              </template>
            </v-layout>
          </template>
          <v-layout>
            <v-spacer></v-spacer>
            <v-btn @click.stop="resetSearch">Zurücksetzen</v-btn>
            <v-btn type="submit">Suchen</v-btn>
          </v-layout>
        </v-card-text>
      </v-form>
    </v-card>

    <v-card flat>
      <v-form>
        <v-toolbar flat>
          <v-toolbar-title>
            <div class="subheading">Ergebnisse</div>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat>Hinzufügen</v-btn>
            <v-btn flat>Deaktivieren</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="ma-2">
          <v-data-table
            :headers="resultHeaders"
            :items="resultItems"
            hide-actions
            :pagination.sync="resultPagination"
            :total-items="resultPagination.totalItems"
          >
            <template slot="items" slot-scope="props">
              <td v-for="header in resultHeaders" :key="header.value"
                  :class="`text-xs-${header.align}`">{{props.item[header.value]}}
              </td>
            </template>
          </v-data-table>
          <v-layout>
            <v-spacer></v-spacer>
            <v-pagination v-model="resultPagination.page" :length="pages"></v-pagination>
          </v-layout>
        </v-card-text>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import BaseComponent from '@/shared/components/BaseComponent'
import GokbTextField from '@/shared/components/base/TextFieldComponent'
import searchServices from '@/shared/services/search-services'

const ROWS_PER_PAGE = 10

export default {
  name: 'BaseSearch',
  extends: BaseComponent,
  components: { GokbTextField },
  data () {
    return {
      title: undefined,
      component: undefined,
      searchInputFields: undefined,

      resultItems: undefined,
      resultPagination: {
        descending: false,
        page: undefined,
        rowsPerPage: ROWS_PER_PAGE,
        sortBy: undefined,
        totalItems: undefined,
      },
      resultHeaders: undefined,
    }
  },
  computed: {
    pages () {
      if (!this.resultPagination.totalItems) {
        return 0
      }
      return Math.ceil(this.resultPagination.totalItems / this.resultPagination.rowsPerPage)
    }
  },
  watch: {
    'resultPagination.page': function () {
      this.search({ page: this.resultPagination.page })
    }
  },
  methods: {
    resetSearch () {
      this.$refs.searchForm.reset()
    },
    async search ({ page = undefined }) {
      const searchParameters = this.searchInputFields
        .flat()
        .map(field => ([field.name, field.model]))
        .filter(([name, value]) => name && value)
        .reduce((r, [name, value]) => {
          r[name] = value
          return r
        }, {})

      const result = await searchServices.search({
        ...searchParameters,
        qbe: this.component,
        max: ROWS_PER_PAGE,
        offset: page ? (page - 1) * this.resultPagination.rowsPerPage : 0
      }, this.cancelToken.token)
      console.log(result)
      if (!page) {
        this.resultPagination.totalItems = result.count
        this.resultPagination.page = 1
      }
      this.resultItems = result.records
    },
  }
}
</script>

<style scoped>
</style>
