<template>
  <v-card class="elevation-4 flex d-flex flex-column" :color="roleColor" v-if="!!title?.name">
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
        :hide-pagination="true"
        :hide-select="!isOtherCardSelected"
        :actions="isReviewedCard ? null : true"
        @delete-item="deleteId"
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
        <gokb-button v-if="!isSelected && !isOtherCardSelected && role!='reviewedComponent'"
          @click="selectCard"
        >
          {{ $i18n.t('btn.select') }}
        </gokb-button>
        <gokb-button v-if="isSelected && role!='reviewedComponent'"
          @click="unselectCard"
        >
          {{ $i18n.t('btn.unselect') }}
        </gokb-button>
        <gokb-button v-if="isSelected && role!='reviewedComponent'"
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
      selectedCardId: {
        type: String,
        required: false,
        default: undefined
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
        selCardId: undefined,
        isSelected: false,
        isReviewedCard: undefined
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
            value: item.value,
            isDeletable: true
          }))
      },
      idsEditable () {
        return this.isSelected || (this.role != "candidateComponent" && this.isOtherCardSelected)
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
        if (this.role == "candidateComponent" && this.isSelected) {
          return "#c1ffc1"
        }
      },
      isOtherCardSelected () {
        return !!this.id && !!this.selCardId && this.id != this.selCardId
      }
    },
    watch: {
      selCardId () {
        this.isSelected = !!this.id && this.id == this.selCardId
      },
      selectedCardId () {
        this.selCardId = this.selectedCardId
      }
    },
    created () {
      this.isReviewedCard = this.role == "reviewedComponent"
    },
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
      },
      selectCard () {
        this.selCardId = this.id
        this.$emit('set-active', this.id)
      },
      unselectCard () {
        this.selCardId = undefined
        this.$emit('set-active', undefined)
      },
      confirmCard () {
        console.log("confirmCard")
        // TODO
      },
      deleteId (id) {
        console.log("deleteId: " + id.value)
        // TODO
      }
    }
  }
</script>
