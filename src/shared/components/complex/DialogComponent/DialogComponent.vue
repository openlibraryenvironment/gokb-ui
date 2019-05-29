<template>
  <v-dialog :value="value" width="400" persistent>
    <v-card class="elevation-12">
      <v-form ref="form" @submit.prevent="submit">
        <v-toolbar color="#F2994A">
          <v-toolbar-title>{{title}}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <slot></slot>
        </v-card-text>
        <v-card-actions>
          <slot name="buttons"></slot>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DialogComponent',
  props: {
    value: {
      type: Boolean,
      required: true,
      default: false
    },
    submit: {
      type: Function,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
}
</script>
