<template>
  <span>
    <v-card
      flat
      class="mb-2"
      :style="styles"
    >
      <v-toolbar
        v-if="title && !subTitle"
        dense
        flat
      >
        <span
          class="text-h5 text-no-wrap"
        >
          {{ title }}
          <span
            v-if="markRequired"
            style="color:red"
          >
            *
          </span>
        </span>
        <v-spacer />
        <v-toolbar-items
          v-if="expanded"
          class="pa-2"
        >
          <slot name="buttons" />
        </v-toolbar-items>
      </v-toolbar>
      <span
        v-else-if="title && subTitle"
        class="text-h5 ml-4 text-no-wrap"
      >
        {{ subTitle }}
        <span
          v-if="markRequired"
          style="color:red"
        >
          *
        </span>
      </span>
      <v-toolbar
        v-else-if="!title && subTitle"
        dense
        flat
      >
        <span
          v-if="subTitle"
          class="text-h6 text-no-wrap"
        >
          {{ subTitle }}
          <span
            v-if="markRequired"
            style="color:red"
          >
            *
          </span>
        </span>
        <v-chip
          v-if="itemsTotal !== undefined && itemsTotal !== -1"
          class="ma-2"
        >
          {{ itemsTotal }}
        </v-chip>
        <v-btn
          v-if="expandable"
          icon
          @click="doExpandCollapse"
        >
          <v-icon>{{ expansionIcon }}</v-icon>
        </v-btn>
        <v-spacer />
        <v-toolbar-items
          v-if="expanded"
          class="pa-2"
        >
          <slot name="buttons" />
        </v-toolbar-items>
      </v-toolbar>
      <v-toolbar
        v-if="filters && expanded"
        class="pt-1"
        align="end"
        flat
      >
        <v-spacer />
        <v-toolbar-items
          v-if="expanded"
          class="pa-2"
        >
          <slot name="search" />
        </v-toolbar-items>
      </v-toolbar>
      <v-toolbar
        v-else-if="!subTitle && !title && !noToolBar"
        dense
        flat
      >
        <v-spacer />
        <v-toolbar-items
          v-if="expanded"
          class="pa-2"
        >
          <slot name="buttons" />
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text v-show="expanded">
        <div
          class="pa-2"
          :class="[!clearBackground ? (darkMode ? 'controls-dark' : 'controls') : '']"
        >
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
      hideDefault: {
        type: Boolean,
        required: false,
        default: false
      },
      filters: {
        type: Boolean,
        required: false,
        default: false,
      },
      subTitle: {
        type: String,
        required: false,
        default: undefined,
      },
      itemsTotal: {
        type: Number,
        required: false,
        default: undefined,
      },
      noToolBar: {
        type: Boolean,
        required: false,
        default: false
      },
      errors: {
        type: Boolean,
        required: false,
        default: false
      },
      minWidth: {
        type: String,
        required: false,
        default: undefined
      },
      markRequired: {
        type: Boolean,
        required: false,
        default: false
      },
      clearBackground: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
        expanded: true
      }
    },
    computed: {
      expansionIcon () {
        return this.expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'
      },
      darkMode () {
        return this.$vuetify.theme.dark
      },
      styles () {
        var result = {}

        if (this.errors) {
          result.border = '1px solid red'
        }

        if (this.minWidth) {
          result.minWidth = this.minWidth
        }

        return [result]
      }
    },
    created () {
      this.expanded = !this.hideDefault
    },
    methods: {
      doExpandCollapse () {
        this.expanded = !this.expanded
      }
    },
  }
</script>

<style scoped>
  /deep/ .controls {
    background-color: #f2f2f2;
  }
  /deep/ .controls-dark {
    background-color: #1e1e1e;
  }
</style>
