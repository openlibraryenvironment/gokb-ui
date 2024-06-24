<template>
  <span>
    <v-card
      flat
      class="mb-2"
      :style="styles"
    >
      <v-toolbar
        v-if="title && !subTitle"
        color="header"
        class="pl-4 pr-4"
        density="compact"
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
        <slot
          v-if="show"
          name="buttons"
        />
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
        height="63"
        color="header"
        class="pl-4 pr-4"
        density="compact"
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
          style="overflow:visible"
          class="ma-2"
        >
          {{ itemsTotal }}
        </v-chip>
        <v-btn
          v-if="expandable"
          icon
          @click.prevent="doExpandCollapse"
        >
          <v-icon>{{ expansionIcon }}</v-icon>
        </v-btn>
        <v-spacer />
        <slot
          v-if="show"
          name="buttons"
        />
      </v-toolbar>
      <v-toolbar
        v-if="filters && show"
        height="63"
        color="header"
        class="pt-1 pl-4"
        flat
      >
        <slot
          v-if="showActions"
          name="actions"
        />
        <v-spacer />
        <slot
          v-if="!title && !subTitle"
          name="buttons"
        />
        <v-toolbar-items
          class="pa-2"
        >
          <slot name="search" />
        </v-toolbar-items>
      </v-toolbar>
      <v-toolbar
        v-else-if="!subTitle && !title && !noToolBar"
        height="63"
        color="header"
        class="pl-4 pr-4"
        density="compact"
        flat
      >
        <v-spacer />
        <slot
          v-if="show"
          name="buttons"
        />
      </v-toolbar>
      <v-toolbar
        v-if="expandFilters"
        height="63"
        color="header"
        class="pt-1 pl-4 pr-4"
        flat
      >
        <slot name="filters" />
      </v-toolbar>

      <v-expand-transition>
        <div v-show="show">
          <v-card-text>
            <div
              class="pa-2 bg-card"
            >
              <slot />
            </div>
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </span>
</template>

<script>
  export default {
    name: 'GokbSection',
    emits: ['update:model-value'],
    props: {
      modelValue: {
        type: [Boolean, Number],
        required: false,
        default: true
      },
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
      filters: {
        type: Boolean,
        required: false,
        default: false,
      },
      expandFilters: {
        type: Boolean,
        required: false,
        default: false
      },
      showActions: {
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
      },
      hideDefault: {
        type: Boolean,
        required:false,
        default: false
      }
    },
    data () {
      return {
        show: true
      }
    },
    computed: {
      localValue: {
        get () {
          return this.modelValue
        },
        set (localValue) {
          this.$emit('update:model-value', localValue)
        }
      },
      expansionIcon () {
        return this.show ? 'mdi-chevron-up' : 'mdi-chevron-down'
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
    mounted () {
      if (this.hideDefault) {
        this.show = false
      }
    },
    methods: {
      doExpandCollapse () {
        this.localValue = !this.localValue
        this.show = !this.show
      }
    },
  }
</script>
