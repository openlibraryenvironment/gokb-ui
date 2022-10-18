<template>
  <v-card class="elevation-4 flex d-flex flex-column">
    <v-card-title primary-title>
      <h5 class="titlecard-headline">{{ titleName }}</h5>
    </v-card-title>

    <v-card-text class="flex" v-for="i in identifiers" :key="i.id">
      <div class="titlecard-ids" :class="i.namespace.value">{{ i.value }}</div>
    </v-card-text>

    <v-card-text class="flex" v-if="!!history">
      <div class="titlecard-history">{{ history }}</div>
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
        titleName: undefined,
        history: undefined,
        publishedFrom: undefined,
        publishedTo: undefined,
        type: undefined,
        identifiers: []
      }
    },
    computed: {
      identifiersMap () {
        const ids = []
        const title = this.fetchTitle(this.id)
        if (!!title){
          for (let id in title._embedded?.ids){
            ids.push({id: id.id, namespace: id.namespace.value, value: id.value})
          }
        }
        return ids
      }
    },
    watch: {},
    mounted () {
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
        this.titleName = name
        this.history = history
        this.publishedFrom = publishedFrom
        this.publishedTo = publishedTo
        this.type = type
        this.identifiers = _embedded.ids
        this.finishedLoading = true
      }
    }
  }
</script>
