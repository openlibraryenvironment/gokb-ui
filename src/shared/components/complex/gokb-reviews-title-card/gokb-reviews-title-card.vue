<template>
  <v-card
    v-if="!!originalRecord?.name"
    :color="roleColor"
    :class="elevationClass"
  >
    <gokb-confirmation-popup
      v-model="showSubmitConfirm"
      :message="submitConfirmationMessage"
      @confirmed="triggerConfirmedAction"
    />
    <v-card-title
      primary-title
      :id="titleName"
      :contenteditable="singleCardReview && fieldsToBeEdited.includes('name')"
      @input="event => onTitleNameInput(event)"
    >
      <h5 class="titlecard-headline">
        <router-link
          :style="{ color: 'primary' }"
          :to="{ name: route, params: { 'id': originalRecord.id } }"
        >
          {{ originalRecord.name }}
        </router-link>
      </h5>
    </v-card-title>

    <v-card-text>
      <span>{{ $t('component.general.status.label') }}: </span>
      <span v-if="!!status">
        {{ $t('component.general.status.' + status + '.label') }}
        <v-icon
          :color="statusIcons[status].color"
          class="mt-n1"
          dense
        >
          {{ statusIcons[status].icon }}
        </v-icon>
      </span>
    </v-card-text>

    <v-card-text v-if="!!ids?.length > 0">
      <v-chip
        v-if="reviewedCardDeleteEnabled"
        class="mb-1"
        pill
      >
          {{ $t('component.review.edit.components.single.selectIds') }}
      </v-chip>
      <v-chip
        v-else-if="isOtherCardSelected && mergeEnabled && editable"
        class="mb-1"
        pill
      >
          {{ $t('component.review.edit.components.merge.selectIds') }}
        </v-chip>
      <gokb-table
        :headers="idHeaders"
        :items="idsVisible"
        :selected-items="selectedIdItems"
        :editable="idsEditable"
        :options.sync="idOptions"
        :total-number-of-items="totalNumberOfIds"
        :hide-pagination="true"
        :hide-select="hideTableSelects"
        :actions="showActions"
        _pending="empty"
        @delete-item="deleteId"
        @selected-items="selectedIdItems = $event"
      />
    </v-card-text>

    <v-card-text v-if="!!originalRecord?.history">
      <div class="titlecard-history">{{ $t('component.title.history.label') }}</div>
    </v-card-text>

    <v-card-text>
      <gokb-table
        :headers="historyHeaders"
        :items="getHistory"
        :editable="historyEditable"
        :options.sync="historyOptions"
        :total-number-of-items="getHistory.length"
        :hide-select="true"
        :hide-pagination="true"
      />
    </v-card-text>
    <v-card-actions v-if="editable">
      <v-spacer />
      <gokb-button v-if="!isChanged && !isCardSelected && !isOtherCardSelected && isMergeCandidate"
        @click="selectCard"
      >
        {{ $i18n.t('component.review.edit.components.merge.selectTarget.label') }}
      </gokb-button>
      <gokb-button v-if="!isChanged && isCardSelected && isMergeCandidate"
        @click="unselectCard"
      >
        {{ $i18n.t('btn.unselect') }}
      </gokb-button>
      <gokb-button
        v-if="!isChanged && isCardSelected && isMergeCandidate"
        primary
        @click="showConfirmSelectedCard"
      >
        {{ $i18n.t('component.review.edit.components.merge.confirm.label') }}
      </gokb-button>
      <gokb-button
        v-if="!isChanged && (singleCardReview || reviewedCardDeleteEnabled)"
        :disabled="selectedIdItems.length === 0"
        @click="showConfirmSelectedCard"
      >
        {{ $i18n.t('component.review.edit.components.single.confirm.label') }}
      </gokb-button>
      <v-spacer />
    </v-card-actions>
  </v-card>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import titleServices from '@/shared/services/title-services'
  import tippServices from '@/shared/services/tipp-services'
  import identifierServices from '@/shared/services/identifier-services'
  import genericEntityServices from '@/shared/services/generic-entity-services'
  import GokbTitleIdsField from '@/shared/components/simple/gokb-title-ids-field/gokb-title-ids-field.vue'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import namespacesModel from '@/shared/models/namespaces-model'

  const ROWS_PER_PAGE = 10

  const STATUS_ICONS = {
    'Current': { icon: "mdi-check-circle", color: 'success'},
    'Retired': { icon: "mdi-close-circle", color: 'amber'},
    'Expected': { icon: "mdi-clock", color: 'info'},
    'Deleted': { icon: "mdi-delete", color: 'red'}
  }

  export default {
    name: 'GokbReviewsTitleCard',
    components: {GokbTitleIdsField, GokbConfirmationPopup},
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
      editable: {
        type: Boolean,
        required: false,
        default: false
      },
      singleCardReview: {
        type: Boolean,
        required: true
      },
      mergeEnabled: {
        type: Boolean,
        required: false,
        default: false
      },
      route: {
        type: String,
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
        activeService: undefined,
        ids: [],
        titleName: undefined,
        status: undefined,
        wantedFields: ["name", "identifiers", "history"],
        idOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
        historyOptions: {
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
        mismatchIdentifiers: [],
        showSubmitConfirm: false,
        submitConfirmationMessage: undefined
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
        return this.isReviewedCard || (this.isCardSelected && this.fieldsToBeEdited.includes("ids"))
      },
      roleColor () {
        if (this.role == "reviewedComponent") {
          if (this.mergeEnabled) {
            return "#f2d2d2"
          }
          return null
        }
        if (this.role == "candidateComponent" && this.isCardSelected) {
          return "#d2f2d2"
        }
      },
      statusIcons () {
        return {
          'Current': { icon: "mdi-check-circle", color: 'success'},
          'Retired': { icon: "mdi-close-circle", color: 'amber'},
          'Expected': { icon: "mdi-clock", color: 'info'},
          'Deleted': { icon: "mdi-delete", color: 'red'}
        }
      },
      historyHeaders () {
        return [
          { text: this.$i18n.tc('component.title.history.date.label'), align: 'start', value: 'date', sortable: false },
          { text: this.$i18n.tc('component.title.history.from', 1), align: 'start', value: 'from', sortable: false },
          { text: this.$i18n.tc('component.title.history.to', 1), align: 'start', value: 'to', sortable: false }
        ]
      },
      elevationClass () {
        return (this.isReviewedCard || this.isCardSelected) ? 'elevation-4' : 'elevation-1'
      },
      totalNumberOfIds () {
        return !!(this.ids) ? this.ids.length : 0
      },
      historyEditable () {
        return false
      },
      reviewedCardDeleteEnabled () {
        return this.editable && (this.singleCardReview || (this.isReviewedCard && !this.isOtherCardSelected))
      },
      hideTableSelects () {
        return !this.editable || !this.isReviewedCard
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
      isOtherCardSelected () {
        return this.singleCardReview || (!!this.id && !!this.selCard && this.id != this.selCard)
      },
      isItemDeletable () {
        if (this.isReviewedCard || (!this.singleCardReview && !this.fieldsToBeEdited.includes("ids"))) {
          return undefined
        }
        else return true
      },
      isMergeCandidate () {
        return this.role != 'reviewedComponent' && this.mergeEnabled
      },
      showActions () {
        return this.isCardSelected && this.fieldsToBeEdited.includes('ids')
      }
    },
    watch: {
      selCard () {
        this.isCardSelected = (!!this.id && this.id == this.selCard)
      },
      selectedCard (val) {
        this.selCard = this.selectedCard

        Object.entries(this.pendingStatuses).forEach(([key, val]) => {
          this.pendingStatuses[key] = false
        })

        this.idsVisible = this.updateVisibleIdentifiers()
      },
      selectedCardIds () {
        this.selCardIds = this.selectedCardIds
      },
      selectedIdItems () {
        this.$emit('reviewed-card-selected-ids', this.selectedIdItems)
      },
      isMerged (){
        this.fetchTitle()
      }
    },
    created () {
      this.isReviewedCard = this.role === "reviewedComponent"
      this.activeService = this.route === '/title' ? titleServices : tippServices
    },
    async mounted () {
      this.fetchTitle()
      if (this.singleCardReview && this.fieldsToBeEdited.includes("ids")) {
        this.fetchReviewMismatchIds()
      }
    },
    beforeUpdate () {
      this.idsVisible = this.updateVisibleIdentifiers()
    },
    methods: {
      async fetchTitle () {
        this.finishedLoading = false

        let response = await this.catchError({
          promise: this.activeService.get(this.id, this.cancelToken.token),
          instance: this
        })

        if (response?.status < 400) {
          this.originalRecord = response.data
          this.titleName = response.data.name
          this.status = response.data.status.name
          this.finishedLoading = true
          this.idsVisible = this.updateVisibleIdentifiers()
        }
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

        Object.entries(this.pendingStatuses).forEach(idkey => {
          this.pendingStatuses[idkey] = false
        })

        this.idsVisible = this.updateVisibleIdentifiers()
        this.$emit('set-active', undefined)
        this.$emit('set-selected-ids', [])
      },
      showConfirmSelectedCard () {
        if (this.isMergeCandidate) {
          this.submitConfirmationMessage = { text: 'component.review.edit.components.merge.confirm.message', vars: [] }
        } else {
          this.submitConfirmationMessage = { text: 'component.review.edit.components.single.confirm.message', vars: [] }
        }
        this.showSubmitConfirm = true
      },
      triggerConfirmedAction () {
        if (this.isMergeCandidate) {
          this.confirmSelectedCard()
        }
        else {
          this.confirmReviewedItemCard()
        }
      },
      async confirmSelectedCard () {
        let putData = this.originalRecord
        putData.ids = this.ids.filter(id => this.pendingStatuses[id.id] != 'removed')

        const putResponse = await this.catchError({
          promise: this.activeService.createOrUpdate(putData, this.cancelToken.token),
          instance: this
        })
        this.unselectCard()
        if (putResponse.status < 400) {
          this.$emit('merge', putData.id)
          this.isChanged = true
        }
        else {
          this.$emit('feedback-response', putResponse)
        }
      },
      async confirmReviewedItemCard () {
        let putData = this.originalRecord
        putData.ids = this.ids.filter(ido => !this.selectedIdItems.some(sel => sel.id == ido.id))
        if (!!this.titleName && this.titleName != this.originalRecord?.name) {
          putData.name = this.titleName
        }
        const putResponse = await this.catchError({
          promise: this.activeService.createOrUpdate(putData, this.cancelToken.token),
          instance: this
        })
        this.$emit('feedback-response', putResponse)
        this.isChanged = true
      },
      deleteId (id) {
        this.pendingStatuses[id.id] = 'removed'
        this.idsVisible = this.updateVisibleIdentifiers()
      },
      getPendingStatus (id) {
        if ( !this.isReviewedCard || (this.isReviewedCard && this.isOtherCardSelected) || (this.singleCardReview && this.fieldsToBeEdited.includes('ids'))){
          return this.getDeletedStatus(id)
        }
        else {
          return this.getMergeStatus(id)
        }
      },
      getDeletedStatus (id) {
        return 'removed'
      },
      getMergeStatus (id) {
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
      updateVisibleIdentifiers () {
        this.ids = this.originalRecord._embedded.ids
        if (this.isReviewedCard && !this.singleCardReview && this.isOtherCardSelected) {
          for (const id of this.originalRecord?._embedded?.ids) {
            this.pendingStatuses[id.id] = this.getPendingStatus(id.id)
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
          promise: identifierServices.createOrUpdate(parameters, this.cancelToken.token),
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
