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
      <template
        #item.link="{ item }"
      >
        <router-link
          :style="{ color: '#f2994a' }"
          :to="{ name: item.link.route, params: { [item.link.id]: item[item.link.id] }}"
        >
          {{ item.link.value }}
        </router-link>
      </template>
      <template #item.action="{ item }">
        <v-icon
          v-if="item.isDeletable !== undefined"
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
        required: true
      },
      totalNumberOfItems: {
        type: Number,
        required: true,
      },
      options: {
        type: Object,
        required: true,
      },
      error: {
        type: Error,
        required: false,
        default: undefined
      },
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
    }
  }
</script>
