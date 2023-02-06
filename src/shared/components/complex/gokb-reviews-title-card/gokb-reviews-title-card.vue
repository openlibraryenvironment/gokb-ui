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
    <v-card-subtitle
      class="text--h4"
    >
      <v-row dense>
        <v-col>
          <router-link
            v-if="!nameEditActive"
            :style="{ color: 'primary' }"
            :to="{ name: route, params: { 'id': originalRecord.id } }"
          >
            {{ originalRecord.name }}
          </router-link>
          <gokb-text-field
            v-else
            v-model="titleName"
            append-icon="mdi-check-bold"
            editable
            dense
            @click:append="saveNameChange"
          />
          <v-icon
            v-if="isEditable && !nameEditActive"
            class="ml-2"
            style="cursor:pointer"
            :title="$t('btn.edit')"
            small
            @click="nameEditActive = !nameEditActive"
          >
            mdi-pencil
          </v-icon>
        </v-col>
      </v-row>
    </v-card-subtitle>
    <v-card-text>
      <v-row dense>
        <v-col>
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
        </v-col>
      </v-row>

      <v-row v-if="!!ids?.length > 0">
        <v-col>
          <v-chip
            v-if="isReviewedCard && isOtherCardSelected && mergeEnabled && isEditable"
            class="mb-1"
            pill
          >
            {{ $t('component.review.edit.components.merge.selectIds') }}
          </v-chip>
          <v-chip
            v-else-if="isEditable"
            class="mb-1"
            pill
          >
              {{ $t('component.review.edit.components.single.selectIds') }}
          </v-chip>
          <gokb-table
            :headers="idHeaders"
            :items="idsVisible"
            :selected-items="selectedIdItems"
            :editable="isEditable"
            :options.sync="idOptions"
            :total-number-of-items="totalNumberOfIds"
            :hide-pagination="true"
            :hide-select="!isEditable"
            :actions="showActions"
            _pending="empty"
            @delete-item="deleteId"
            @selected-items="selectedIdItems = $event"
          />
        </v-col>
      </v-row>

      <div v-if="originalRecord.type === 'Journal'">
        <v-row>
          <v-col>
            {{ $t('component.title.history.label') }}
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <gokb-table
              :headers="historyHeaders"
              :items="mappedHistory"
              :editable="historyEditable"
              :options.sync="historyOptions"
              :total-number-of-items="mappedHistory.length"
              :hide-select="true"
              :hide-pagination="true"
            />
          </v-col>
        </v-row>
      </div>
      <div v-else-if="originalRecord.type === 'TIPP' && originalRecord.publicationType?.name === 'Serial'">
        <v-row>
          <v-col>
            {{ $t('component.tipp.coverage.label') }}
          </v-col>
        </v-row>

        <v-card
          v-for="ci in mappedCoverage"
          :key="ci.id"
          class="mt-3"
        >
          <v-card-text>
            <v-row dense>
              <v-col>
                <span>{{ $t('component.tipp.coverage.depth.label') }}: </span>
                <span> {{ $t('component.tipp.coverage.depth.' + ci.coverageDepth + '.label') }}</span>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="2" />
              <v-col>
                {{ $t('default.date') }}
              </v-col>
              <v-col>
                {{ $t('component.tipp.coverage.volume') }}
              </v-col>
              <v-col>
                {{ $t('component.tipp.coverage.issue') }}
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="2">{{ $t('default.start') }}</v-col>
              <v-col>
                {{ ci.startDate }}
              </v-col>
              <v-col>
                {{ ci.startVolume }}
              </v-col>
              <v-col>
                {{ ci.startIssue }}
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="2">{{ $t('default.end') }}</v-col>
              <v-col>
                {{ ci.endDate }}
              </v-col>
              <v-col>
                {{ ci.endVolume }}
              </v-col>
              <v-col>
                {{ ci.endIssue }}
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
      <v-row class="mt-3">
        <v-col>
          <v-row v-if="!isChanged && !isCardSelected && !isOtherCardSelected && isMergeCandidate">
            <v-col>
              <gokb-button
                @click="selectCard"
              >
                {{ $i18n.t('component.review.edit.components.merge.selectTarget.label') }}
              </gokb-button>
            </v-col>
          </v-row>
          <v-row v-else-if="isCardSelected">
            <v-col>
              <gokb-button
                @click="deselectCard"
              >
                {{ $i18n.t('btn.deselect') }}
              </gokb-button>
            </v-col>
          </v-row>
          <v-row v-if="!isChanged && isCardSelected && isLinkCandidate">
            <v-col>
              <gokb-button
                primary
                @click="showConfirmSelectedCard('link')"
              >
                {{ $i18n.t('component.review.edit.components.link.confirmLink.label') }}
              </gokb-button>
            </v-col>
          </v-row>
          <v-row v-else-if="!isChanged && isOtherCardSelected && isMergeCandidate">
            <v-col>
              <gokb-button
                primary
                @click="showConfirmSelectedCard('merge')"
              >
                {{ $i18n.t('component.review.edit.components.link.selectDeprecated.label')  }}
              </gokb-button>
            </v-col>
          </v-row>
          <v-row v-else-if="!isChanged && isCardSelected && isMergeCandidate">
            <v-col>
              <gokb-button
                primary
                @click="showConfirmSelectedCard('merge')"
              >
                {{ $i18n.t('component.review.edit.components.merge.confirm.label')  }}
              </gokb-button>
            </v-col>
          </v-row>
          <v-row v-if="!isChanged && isEditable">
            <v-col>
              <gokb-button
                :disabled="selectedIdItems.length === 0 && !isNamePending"
                @click="showConfirmSelectedCard('single')"
              >
                {{ $i18n.t('component.review.edit.components.single.confirm.label') }}
              </gokb-button>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
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
        type: Number,
        required: true
      },
      candidateIndex: {
        type: Number,
        required: false,
        default: undefined
      },
      selectedCard: {
        type: Number,
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
      linkEnabled: {
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
      additionalVars: {
        type: Array,
        required: false,
        default: undefined
      },
      reviewedComponentName: {
        type: String,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        originalRecord: undefined,
        activeService: undefined,
        nameEditActive: false,
        isNamePending: false,
        ids: [],
        titleName: undefined,
        status: undefined,
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
        showCoverage: false,
        isCardSelected: false,
        isReviewedCard: undefined,
        selectedIdItems: [],
        pendingStatuses: {},
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
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
      isEditable () {
        return this.status !== 'Deleted' && this.editable && !!this.originalRecord?._links?.update?.href
      },
      roleColor () {
        if (this.role == "reviewedComponent") {
          if (this.mergeEnabled && this.originalRecord.type !== 'TIPP') {
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
      mappedHistory () {
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
        return result
      },
      mappedCoverage () {
        let result = []
        if (!!this.originalRecord?._embedded?.coverageStatements) {
          this.originalRecord?._embedded?.coverageStatements.forEach(h => {
            result.push({
              id  : h.id,
              coverageDepth: h.coverageDepth.name,
              startDate: this.buildDateString(h.startDate),
              startVolume: h.startVolume,
              startIssue: h.startIssue,
              endDate: this.buildDateString(h.endDate),
              endVolume: h.endVolume,
              endIssue: h.endIssue
            })
          })
        }
        return result
      },
      isOtherCardSelected () {
        return this.singleCardReview || (!!this.id && !!this.selCard && this.id != this.selCard)
      },
      isItemDeletable () {
        if (this.isReviewedCard || !this.singleCardReview) {
          return undefined
        }
        else return true
      },
      isMergeCandidate () {
        return this.role != 'reviewedComponent' && this.mergeEnabled && (!this.selectedCard || this.selectedCard != this.id)
      },
      isLinkCandidate () {
        return this.role != 'reviewedComponent' && this.linkEnabled && this.route  === '/title' && (!this.selectedCard || this.selectedCard == this.id)
      },
      showActions () {
        return this.isCardSelected
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
        if (this.isReviewedCard) {
          this.$emit('reviewed-card-selected-ids', this.selectedIdItems)
        }
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
      deselectCard () {
        this.selCard = undefined
        this.selectedIdItems = []

        Object.entries(this.pendingStatuses).forEach(idkey => {
          this.pendingStatuses[idkey] = false
        })

        this.idsVisible = this.updateVisibleIdentifiers()
        this.$emit('set-active', undefined)
        this.$emit('set-selected-ids', [])
      },
      showConfirmSelectedCard (type) {
        let cardReference = this.titleName + ' (#' + this.candidateIndex + ')'

        if (type === 'merge') {
          if (this.selectedCard === this.id) {
            this.submitConfirmationMessage = { text: 'component.review.edit.components.merge.confirm.message', vars: [this.reviewedComponentName , cardReference] }
            this.parameterToConfirm = 'primaryMerge'
          } else {
            this.submitConfirmationMessage = { text: 'component.review.edit.components.link.confirmMerge.message', vars: [cardReference] }
            this.parameterToConfirm = 'secondaryMerge'
          }
        } else if (type === 'link') {
          this.submitConfirmationMessage = { text: 'component.review.edit.components.link.confirmLink.message', vars: [cardReference] }
          this.parameterToConfirm === 'single'
        }

        this.showSubmitConfirm = true
      },
      triggerConfirmedAction () {
        if (this.parameterToConfirm === 'primaryMerge') {
          this.confirmSelectedCard()
        } else if (this.parameterToConfirm === 'single') {
          this.confirmItemChanges()
        } else if (this.parameterToConfirm === 'secondaryMerge') {
          this.confirmSecondaryMerge()
        }

        this.parameterToConfirm = undefined
      },
      saveNameChange () {
        this.originalRecord.name = this.titleName
        this.isNamePending = true
        this.nameEditActive = false
      },
      async confirmSelectedCard () {
        let putData = this.originalRecord
        putData.ids = this.ids.filter(id => this.pendingStatuses[id.id] != 'removed')

        const putResponse = await this.catchError({
          promise: this.activeService.createOrUpdate(putData, this.cancelToken.token),
          instance: this
        })
        this.deselectCard()
        this.isNamePending = false
        if (putResponse.status < 400) {
          this.$emit('merge', putData.id)
          this.isChanged = true
        }
        else {
          this.$emit('feedback-response', putResponse)
        }
      },
      async confirmSecondaryMerge () {
        this.$emit('merge', this.id)
        this.isChanged = true
      },
      async confirmItemChanges () {
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
            namespace: item.namespace.name || item.namespace.value,
            value: item.value,
            isDeletable: this.isItemDeletable,
            _pending: this.pendingStatuses[item.id]
          }))
        for (const [count, id] of this.mismatchIdentifiers.entries()) {
          val.push({
            id: id.id,
            namespace: id.namespace.name || id.namespace.value,
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
