<template>
  <v-card class="elevation-5 flex d-flex flex-column">
    <v-card-title primary-title>
      <h3 class="titlecard-headline">{{ name }}</h3>
    </v-card-title>

    <v-card-text class="flex">
      <div class="titlecard-ids">{{ ids }}</div>
      <v-divider light style="margin-top:15px;"></v-divider>
      <v-divider light></v-divider>
    </v-card-text>

    <v-card-text class="flex" v-if="!!additionalInfo">
      <div class="titlecard-additional">{{ ids }}</div>
      <v-divider light style="margin-top:15px;"></v-divider>
      <v-divider light></v-divider>
    </v-card-text>
  </v-card>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'

  export default {
    name: 'GokbReviewsTitleCard',
    components: {},
    extends: BaseComponent,
    props: {
      name: {
        type: String,
        required: true,
        default: undefined
      },
      ids: {
        type: Map,
        required: true,
        default: undefined
      },
      additionalInfo: {
        type: Map,
        required: false,
        default: undefined
      }
    },
    data () {
      return {}
    },
    computed: {},
    watch: {},
    methods: {}
  }
</script>
