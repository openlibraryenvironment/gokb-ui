<template>
  <v-card class="elevation-4 flex d-flex flex-column" :color="roleColor" v-if="!!originalRecord?.name">
    <v-card-title
      primary-title
      :id="titleName"
      :contenteditable="singleCardReview && fieldsToBeEdited.includes('name')"
      @input="event => onTitleNameInput(event)"
    >
      <h5 class="titlecard-headline">{{ originalRecord.name }}</h5>
    </v-card-title>

    <v-card-text class="flex" v-if="!!ids?.length > 0">
      <gokb-table
        :headers="idHeaders"
        :items="idsVisible"
        :selected-items="selectedIdItems"
        :editable="idsEditable"
        :options.sync="variantNameOptions"
        :total-number-of-items="totalNumberOfIds"
        :hide-pagination="true"
        :hide-select="!isOtherCardSelected"
        :actions="showActions"
        _pending="empty"
        @delete-item="deleteId"
        @selected-items="selectedIdItems = $event"
      />
    </v-card-text>

    <v-card-text class="flex" v-if="!!originalRecord?.history">
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
        <gokb-button v-if="!isChanged && !isCardSelected && !isOtherCardSelected && isCandidate"
          @click="selectCard"
        >
          {{ $i18n.t('btn.select') }}
        </gokb-button>
        <gokb-button v-if="!isChanged && isCardSelected && isCandidate"
          @click="unselectCard"
        >
          {{ $i18n.t('btn.unselect') }}
        </gokb-button>
        <gokb-button v-if="!isChanged && isCardSelected && isCandidate"
          @click="confirmSelectedCard"
        >
          {{ $i18n.t('btn.confirm') }}
        </gokb-button>
        <gokb-button v-if="!isChanged && singleCardReview"
          @click="confirmSingleCard"
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
  import identifierServices from '@/shared/services/identifier-services'
  import genericEntityServices from '@/shared/services/generic-entity-services'
  import GokbTitleIdsField from '@/shared/components/simple/gokb-title-ids-field/gokb-title-ids-field.vue'
  import namespacesModel from '@/shared/models/namespaces-model'

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
      },
      singleCardReview: {
        type: Boolean,
        required: true
      },
      isMerged: {
        type: Boolean,
        required: false,
        default: false
      },
      fieldsToBeEdited: {
        type: Array,
        required: false,
        default: () => []
      },
      additionalVars: {
        type: Array,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        originalRecord: undefined,
        ids: [],
        titleName: undefined,
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
        idsVisible: undefined,
        isChanged: false,
        mismatchIdentifiers: []
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
        return this.isCardSelected ||
          (this.role != "candidateComponent" && this.isOtherCardSelected) ||
          (this.singleCardReview && this.fieldsToBeEdited.includes("ids"))
      },
      historyHeaders () {
        return [
          { text: this.$i18n.tc('component.title.history.date.label'), align: 'start', value: 'date', sortable: false },
          { text: this.$i18n.tc('component.title.history.from', 1), align: 'start', value: 'from', sortable: false },
          { text: this.$i18n.tc('component.title.history.to', 1), align: 'start', value: 'to', sortable: false }
        ]
      },
      historyVisible () {
        return [...this.originalRecord?.history]
          .map(item => ({
            namespace: item.namespace.value,
            value: item.value
          }))
      },
      totalNumberOfIds () {
        return !!(this.ids) ? this.ids.length : 0
      },
      historyEditable () {
        return false
      },
      getHistory () {
        let result = []
        if (!!this.originalRecord?.history) {
          this.originalRecord.history.forEach(h => {
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
          if (this.isChanged) return "#c1ffc1"
          if (this.isMerged) return null
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
        if (this.isReviewedCard && (!this.singleCardReview && !this.fieldsToBeEdited.includes("ids"))) {
          return undefined
        }
        else return true
      },
      isCandidate () {
        return this.role != 'reviewedComponent'
      },
      showActions () {
        return !this.isReviewedCard || (this.singleCardReview && this.fieldsToBeEdited.includes('ids'))
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
      },
      selectedIdItems () {
        this.$emit('reviewedCardSelectedIds', this.selectedIdItems)
      },
      originalRecord () {
        this.titleName = this.originalRecord.name
      }
    },
    created () {
      this.isReviewedCard = this.role == "reviewedComponent"
    },
    async mounted () {
      this.fetchTitle(this.id)
      if (this.singleCardReview && this.fieldsToBeEdited.includes("ids")) {
        this.fetchReviewMismatchIds()
      }
    },
    beforeUpdate () {
      this.idsVisible = this.visibleIdentifiers()
    },
    methods: {
      async fetchTitle (tid) {
        this.finishedLoading = false
        const response = await this.catchError({
          promise: titleServices.getTitle(tid, this.cancelToken.token),
          instance: this
        })
        if (response.status < 400) {
          this.originalRecord = response.data
          this.finishedLoading = true
        }
      },
      hasTitle () {
        return (!!this.titleName && !!this.identifiers && this.finishedLoading)
      },
      selectCard () {
        this.selCard = this.id
        this.selCardIds = this.ids
        this.$emit('set-active', this.selCard)
        this.$emit('set-selected-ids', this.selCardIds)
      },
      unselectCard () {
        this.selCard = undefined
        this.selCardIds = []
        this.pendingStatuses = {}
        this.idsVisible = this.visibleIdentifiers()
        this.$emit('set-active', undefined)
        this.$emit('set-selected-ids', [])
      },
      async confirmSelectedCard () {
        let putData = this.originalRecord
        putData.ids = this.ids.filter(id => this.pendingStatuses[id.id] != 'removed')
        const putResponse = await this.catchError({
          promise: titleServices.createOrUpdateTitle(putData, this.cancelToken.token),
          instance: this
        })
        this.unselectCard()
        if (putResponse.status < 400) {
          this.$emit('merge', putData)
          this.isChanged = true
        }
        else {
          this.$emit('feedback-response', putResponse)
        }
      },
      async confirmSingleCard () {
        let putData = this.originalRecord
        putData.ids = [...this.ids, ...this.mismatchIdentifiers].filter(id => this.pendingStatuses[id.id] != 'removed')
        if (!!this.titleName && this.titleName != this.originalRecord?.name) {
          putData.name = this.titleName
        }
        const putResponse = await this.catchError({
          promise: titleServices.createOrUpdateTitle(putData, this.cancelToken.token),
          instance: this
        })
        this.$emit('feedback-response', putResponse)
        this.$emit('prepare-close')
        this.isChanged = true
      },
      deleteId (id) {
        this.pendingStatuses[id.id] = 'removed'
        this.idsVisible = this.visibleIdentifiers()
      },
      pendingStatus (id) {
        if ( !this.isReviewedCard || (this.singleCardReview && this.fieldsToBeEdited.includes('ids'))){
          return this.deletedStatus(id)
        }
        else {
          return this.mergeStatus(id)
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
        this.ids = this.originalRecord._embedded.ids
        if (this.isReviewedCard && !this.singleCardReview) {
          for (const id of this.originalRecord?._embedded?.ids) {
            this.pendingStatuses[id.id] = this.pendingStatus(id.id)
          }
        }
        let val = [...this.originalRecord?._embedded?.ids]
          .map((item) => ({
            id: item.id,
            namespace: item.namespace.value,
            value: item.value,
            isDeletable: this.isItemDeletable,
            _pending: this.pendingStatuses[item.id]
          }))
        for (const [count, id] of this.mismatchIdentifiers.entries()) {
          val.push({
            id: id.id,
            namespace: id.namespace.value,
            value: id.value,
            isDeletable: this.isItemDeletable,
            _pending: this.pendingStatuses[id.id]
          })
        }
        return val
      },
      onTitleNameInput (event) {
        this.titleName = event.target.innerText
      },
      fetchReviewMismatchIds () {
        for (const [count, idItem] of this.additionalVars[1].entries()) {
          for (const [namespace, id] of Object.entries(idItem)) {
            this.addReviewMismatchId(namespace, id)
          }
        }
      },
      async addReviewMismatchId (namespace, id) {
        const namespaceItem = namespacesModel.getNamespace(namespace)
        if (!!namespaceItem) {
          const parameters = { value: id, namespace: namespaceItem.id }
          const response = await this.catchError({
            promise: genericEntityServices("identifiers").get({ parameters }, this.cancelToken.token),
            instance: this
          })
          const { data : { data } } = response
          if (!!data && !!data[0]) {
            this.mismatchIdentifiers.push(data[0])
          }
          else this.addNewReviewMismatchId(parameters)
        }
      },
      async addNewReviewMismatchId(parameters) {
        const response = await this.catchError({
          promise: identifierServices.createOrUpdateIdentifier(parameters, this.cancelToken.token),
          instance: this
        })
        const { data } = response
        if (!!data) {
          this.mismatchIdentifiers.push(data)
        }
      }
    }
  }
</script>
