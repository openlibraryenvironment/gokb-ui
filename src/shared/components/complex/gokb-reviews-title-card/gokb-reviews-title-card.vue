<template>
  <v-card class="elevation-4 flex d-flex flex-column" :color="roleColor" v-if="!!title?.name">
    <v-card-title primary-title>
      <h5 class="titlecard-headline">{{ title.name }}</h5>
    </v-card-title>

    <v-card-text class="flex" v-if="!!title?.identifiers?.length > 0">
      <gokb-table
        :headers="idHeaders"
        :items="idsVisible"
        :selected-items="selectedIdItems"
        :editable="idsEditable"
        :options.sync="variantNameOptions"
        :total-number-of-items="totalNumberOfIds"
        :hide-pagination="true"
        :hide-select="!isOtherCardSelected"
        :actions="!isReviewedCard"
        _pending="empty"
        @delete-item="deleteId"
        @selected-items="selectedIdItems = $event"
      />
    </v-card-text>

    <v-card-text class="flex" v-if="!!title?.history">
      <div class="titlecard-history">{{ $t('component.title.history.label') }}</div>
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
    <v-row>
      <v-col>
        <gokb-button v-if="!isCardSelected && !isOtherCardSelected && role!='reviewedComponent'"
          @click="selectCard"
        >
          {{ $i18n.t('btn.select') }}
        </gokb-button>
        <gokb-button v-if="isCardSelected && role!='reviewedComponent'"
          @click="unselectCard"
        >
          {{ $i18n.t('btn.unselect') }}
        </gokb-button>
        <gokb-button v-if="isCardSelected && role!='reviewedComponent'"
          @click="confirmCard"
        >
          {{ $i18n.t('btn.confirm') }}
        </gokb-button>
      </v-col>
    </v-row>
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
      },
      selectedCard: {
        type: String,
        required: false,
        default: undefined
      },
      selectedCardIds: {
         type: Array,
         required: false,
         default: () => []
      },
      role: {
        type: String,
        required: false
      },
      enabled: {
        type: Boolean,
        required: false,
        default: true
      }
    },
    data () {
      return {
        title: undefined,
        wantedFields: ["name", "identifiers", "history"],
        variantNameOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
        selCard: undefined,
        selCardIds: [],
        isCardSelected: false,
        isReviewedCard: undefined,
        selectedIdItems: [],
        pendingStatuses: {},
        idsVisible: undefined
      }
    },
    computed: {
      idHeaders () {
        return [
          { text: this.$i18n.tc('component.identifier.namespace'), align: 'start', value: 'namespace', sortable: false },
          { text: this.$i18n.tc('component.identifier.label', 1), align: 'start', value: 'value', sortable: false }
        ]
      },
      idsEditable () {
        return this.isCardSelected || (this.role != "candidateComponent" && this.isOtherCardSelected)
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
        if (!!this.title?.history) {
          this.title?.history.forEach(h => {
            h.from.forEach((from, i) => {
              result.push({
                id  : h.id,
                date: h.date,
                from: h.from[i].name,
                to  : h.to[i]?.name
              })
            })
          })
        }
        // TODO: add Coverage
        return result
      },
      roleColor () {
        if (this.role == "reviewedComponent") {
          return "#ffc1c1"
        }
        if (this.role == "candidateComponent" && this.isCardSelected) {
          return "#c1ffc1"
        }
      },
      isOtherCardSelected () {
        return !!this.id && !!this.selCard && this.id != this.selCard
      },
      isItemDeletable () {
        if (this.isReviewedCard) {
          return undefined
        }
        else return true
      }
    },
    watch: {
      selCard () {
        this.isCardSelected = !!this.id && this.id == this.selCard
      },
      selectedCard () {
        this.selCard = this.selectedCard
      },
      selectedCardIds () {
        this.selCardIds = this.selectedCardIds
      }
    },
    created () {
      this.isReviewedCard = this.role == "reviewedComponent"
    },
    async mounted () {
      this.fetchTitle(this.id)
    },
    beforeUpdate () {
      this.idsVisible = this.visibleIdentifiers()
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
      },
      hasTitle () {
        return (!!this.titleName && !!this.identifiers && this.finishedLoading)
      },
      selectCard () {
        this.selCard = this.id
        this.selCardIds = this.title?.identifiers
        this.$emit('set-active', this.id)
        this.$emit('set-selected-ids', this.title?.identifiers)
      },
      unselectCard () {
        this.selCard = undefined
        this.selCardIds = []
        this.$emit('set-active', undefined)
        this.$emit('set-selected-ids', [])
      },
      confirmCard () {
        console.log("TODO: confirmCard")
        // TODO
      },
      deleteId (id) {
        this.pendingStatuses[id.id] = 'removed'
        this.idsVisible = this.visibleIdentifiers()
      },
      pendingStatus (id) {
        if ( this.isReviewedCard ){
          return this.mergeStatus(id)
        }
        else {
          return this.deletedStatus(id)
        }
      },
      deletedStatus (id) {
        return 'removed'
      },
      mergeStatus (id) {
        for (const [i, idItem] of this.selectedCardIds.entries()) {
          if (idItem.id == id) {
            return 'existing'
          }
        }
        for (const [i, idItem] of this.selectedIdItems.entries()) {
          if (idItem.id == id) {
            return 'selected'
          }
        }
        return 'unselected'
      },
      visibleIdentifiers () {
        let val = [...this.title?.identifiers]
          .map((item) => ({
            id: item.id,
            namespace: item.namespace.value,
            value: item.value,
            isDeletable: this.isItemDeletable,
            _pending: this.pendingStatuses[item.id]
          }))
        return val
      }
    }
  }
</script>
