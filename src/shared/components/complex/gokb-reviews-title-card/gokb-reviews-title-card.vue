<template>
  <v-card class="elevation-4 flex d-flex flex-column" v-if="!!title?.name"> 
    <v-card-title primary-title>
      <h5 class="titlecard-headline">{{ title.name }}</h5>
    </v-card-title>

    <v-card-text class="flex" v-for="(i, count) in title.identifiers" :key="i.id">
      <div v-if="count == 0">{{ $tc('component.identifier.label', 2) }}</div>
      <div class="titlecard-ids" :class="i.namespace.value">{{ i.namespace.value }}: {{ i.value }}</div>
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

  export default {
    name: 'GokbReviewsTitleCard',
    components: {},
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
        wantedFields: ["name", "identifiers", "history"]
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
