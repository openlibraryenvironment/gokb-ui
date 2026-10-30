<template>

  <gokb-section
  >
    <!--
    v-model="isExpanded"
    expandable
    :hide-default="!expanded"
    :filters="filterAlign"
    :expand-filters="expandFilters"
    show-actions
    :sub-title="sectionTitle"
    :items-total="totalNumberOfItems"
    :errors="!!apiErrors"
    :mark-required="required"
    :clear-background="!ttl && !pkg"
    -->

    <gokb-table
      :headers="tableHeaders"
      :items="users"
      :options.sync="options"
    >
    </gokb-table>


  </gokb-section>

</template>

<script>
import BaseComponent from '@/shared/components/base-component'

export default {
  name: 'GokbUsersSection',
  components: {

  },
  extends: BaseComponent,
  emits: [],
  props: {
    users: {
      type: Array,
      required: false,
      default: undefined
    }
  },
  data () {
    return {
      options: {
        page: 1,
        itemsPerPage: 20,
        sortBy: ['id'],
        desc: [false]
      },
    }
  },
  computed: {
    tableHeaders () {
      return [
        { title: "Name", align: 'start', value: 'name', width: '50%', sortable: false },

      ]
    },
  },
  watch: {},
  async mounted () {

  },
  methods: {

  }
}

</script>



