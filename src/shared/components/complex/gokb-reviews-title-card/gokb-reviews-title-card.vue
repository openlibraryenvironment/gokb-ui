<template>
  <v-card class="elevation-4 flex d-flex flex-column" v-if="!!title?.name"> 
    <v-card-title primary-title>
      <h5 class="titlecard-headline">{{ title.name }}</h5>
    </v-card-title>

    <v-card-text class="flex" v-if="!!title?.identifiers?.length > 0">
      <gokb-table
        :headers="idHeaders"
        :items="idsVisible"
        :editable="idsEditable"
        :options.sync="variantNameOptions"
        :total-number-of-items="totalNumberOfIds"
        :hide-select="true"
        :hide-pagination="true"
      />
    </v-card-text>

    <v-card-text class="flex" >
      <gokb-table
        :headers="historyHeaders"
        :items="getHistory"
        :editable="historyEditable"
        :options.sync="variantNameOptions"
        :total-number-of-items="getHistory.length"
        :hide-select="true"
        :hide-pagination="true"
      />
    </v-card-text>

    <v-card-text class="flex" v-if="!!title?.history">
      <div class="titlecard-history">{{ $t('component.title.history.label') }}</div>
      <div class="titlecard-history">{{ title.history }}</div>
    </v-card-text>
  </v-card>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import titleServices from '@/shared/services/title-services'
  import GokbTitleIdsField from '../../simple/gokb-title-ids-field/gokb-title-ids-field.vue'

  const ROWS_PER_PAGE = 10

  export default {
    name: 'GokbReviewsTitleCard',
    components: {GokbTitleIdsField},
    extends: BaseComponent,
    props: {
      id: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        title: undefined,
        wantedFields: ["name", "identifiers", "history"],
        variantNameOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        }
      }
    },
    computed: {
      identifiersMap () {
        const ids = []
        if (this.hasTitle) {
          for (let id in this.title?._embedded?.ids) {
            ids.push({id: id.id, namespace: id.namespace.value, value: id.value})
          }
        }
        return ids
      },
      getUsedKeys () {
        // TODO: delete this function (incl. the emit) again in case it will not be needed
        let usedKeys = []
        if (this.hasTitle) {
          for (let [key, value] of Object.entries(this.title)) {
            if (!!value && this.wantedFields.includes(key)) {
              usedKeys.push(key)
            }
          }
        }
        return usedKeys
      },
      idHeaders () {
        return [
          { text: this.$i18n.tc('component.identifier.namespace'), align: 'start', value: 'namespace', sortable: false },
          { text: this.$i18n.tc('component.identifier.label', 1), align: 'start', value: 'value', sortable: false }
        ]
      },
      idsVisible () {
        return [...this.title?.identifiers]
          .map(item => ({
            namespace: item.namespace.value,
            value: item.value
          }))
      },
      idsEditable () {
        return false
      },
      historyHeaders () {
        return [
          { text: this.$i18n.tc('component.title.history.date.label'), align: 'start', value: 'date', sortable: false },
          { text: this.$i18n.tc('component.title.history.from', 1), align: 'start', value: 'from', sortable: false },
          { text: this.$i18n.tc('component.title.history.to', 1), align: 'start', value: 'to', sortable: false }
        ]
      },
      historyVisible () {
        return [...this.title?.history]
          .map(item => ({
            namespace: item.namespace.value,
            value: item.value
          }))
      },
      totalNumberOfIds () {
        return !!(this.title?.identifiers) ? this.title.identifiers.length : 0
      },
      historyEditable () {
        return false
      },
      getHistory () {
        let result = []
        if (!!this.title?.history){
          for (let h of this.title?.history?.entries()) {
            console.log("h: " + h.id)
            if (!!h.from){
              for (let [subItem, count] of h.from?.entries()) {
                console.log("subItem: " + subItem)
                console.log("count: " + count)
                result.push({
                  date: h.date,
                  from: h.from[count],
                  to  : h.to[count]
                })
              }
            }
          }
        }
        // TODO: add Coverage
        return result
      }
    },
    watch: {},
    async mounted () {
      this.fetchTitle(this.id)
      this.identifiers = this.identifiersMap
    },
    methods: {
      async fetchTitle (tid) {
        this.finishedLoading = false
        const {
          data: {
            name,
            history,
            publishedFrom,
            publishedTo,
            type,
            _embedded,
            _links
          }
        } = await this.catchError({
          promise: titleServices.getTitle(tid, this.cancelToken.token),
          instance: this
        })
        this.title = {
          name: name,
          history: history,
          publishedFrom: publishedFrom,
          publishedTo: publishedTo,
          type: type,
          identifiers: _embedded?.ids
        }
        this.finishedLoading = true
        // this.$emit('keys', this.getUsedKeys) TODO: reactivate or delete
      },
      hasTitle () {
        return (!!this.titleName && !!this.identifiers && this.finishedLoading)
      }
    }
  }
</script>
