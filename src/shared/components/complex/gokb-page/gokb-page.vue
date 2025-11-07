<template>
  <v-container fluid>
    <v-form
      ref="pageform"
      @update:model-value="$emit('valid', $event)"
      @submit.prevent="doSubmit"
      class="bg-bg"
    >
      <v-card flat>
        <v-toolbar
          flat
          height="70"
          color="bg"
          class="pl-3"
        >
          <div>
            <v-toolbar-title>
              <div class="text-h4">{{ title }}</div>
              <div v-if="subTitle">{{ subTitle }}</div>
            </v-toolbar-title>
          </div>
        </v-toolbar>
        <v-card-text class="bg-bg">
          <slot />
        </v-card-text>
        <v-card-actions v-if="!hideActions" class="pl-6 pr-6 bg-bg">
          <slot name="buttons" />
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script>
  export default {
    name: 'GokbPage',
    emits: ['submit', 'valid'],
    props: {
      title: {
        type: String,
        required: false,
        default: 'missing title for page'
      },
      subTitle: {
        type: String,
        required: false,
        default: undefined
      },
      width: {
        type: String,
        required: false,
        default: '1400px'
      },
      hideActions: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    methods: {
      doSubmit () {
        this.$emit('submit', this.$refs.pageform)
      },
      validate () {
        this.$refs.validate()
      }
    }
  }
</script>
