<template>
  <span>
    <v-card flat>
      <v-toolbar
        v-if="title && !subTitle"
        color="white"
        dense
        flat
        height="32"
      >
        <span
          class="headline"
        >
          {{ title }}
        </span>
        <v-spacer />
        <v-toolbar-items>
          <slot name="buttons" />
        </v-toolbar-items>
      </v-toolbar>
      <span
        v-else-if="title"
        class="headline ml-4"
      >
        {{ title }}
      </span>
      <v-toolbar
        v-if="subTitle"
        color="white"
        dense
        flat
        height="32"
      >
        <span
          v-if="subTitle"
          class="title"
        >
          {{ subTitle }}
        </span>
        <v-btn
          v-if="expandable"
          icon
          @click="doExpandCollapse"
        >
          <v-icon>{{ expansionIcon }}</v-icon>
        </v-btn>
        <v-spacer />
        <v-toolbar-items>
          <slot name="buttons" />
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text v-show="expanded">
        <div class="controls pa-2">
          <slot />
        </div>
      </v-card-text>
    </v-card>
  </span>
</template>

<script>
  export default {
    name: 'GokbSection',
    props: {
      expandable: {
        type: Boolean,
        required: false,
        default: false,
      },
      title: {
        type: String,
        required: false,
        default: undefined,
      },
      subTitle: {
        type: String,
        required: false,
        default: undefined,
      },
    },
    data () {
      return {
        expanded: true
      }
    },
    computed: {
      expansionIcon () {
        return this.expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'
      }
    },
    methods: {
      doExpandCollapse () {
        this.expanded = !this.expanded
      }
    }
  }
</script>

<style scoped>
  /deep/ .controls {
    background-color: #f2f2f2;
  }
</style>
