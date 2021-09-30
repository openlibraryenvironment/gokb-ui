<template>
  <v-dialog
    :value="value"
    :persistent="persistent"
    :fullscreen="fullscreen"
    :width="width"
  >
    <v-card class="elevation-12">
      <v-form
        ref="form"
        :value="isValid"
        @submit.prevent="doSubmit"
      >
        <v-toolbar
          color="accent"
        >
          <v-toolbar-title>
            {{ title }}
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <slot />
        </v-card-text>
        <v-card-actions>
          <slot name="buttons" />
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'GokbDialog',
    props: {
      value: {
        type: Boolean,
        required: true,
        default: false
      },
      title: {
        type: String,
        required: true,
      },
      width: {
        type: [Number, String],
        required: false,
        default: 400
      },
      persistent: {
        type: Boolean,
        required: false,
        default: true
      },
      fullscreen: {
        type: Boolean,
        required: false,
        default: false
      },
      isValid: {
        type: Boolean,
        required: false,
        default: true
      }
    },
    methods: {
      doSubmit () {
        this.$emit('submit', this.$refs.form)
      }
    }
  }
</script>
