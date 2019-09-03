<template>
  <v-dialog
    :value="value"
    persistent
    width="400"
  >
    <v-card class="elevation-12">
      <v-form
        ref="form"
        @submit.prevent="doSubmit"
      >
        <v-toolbar color="#F2994A">
          <v-toolbar-title>{{ title }}</v-toolbar-title>
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
    name: 'DialogComponent',
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
    },
    methods: {
      doSubmit () {
        this.$emit('submit', this.$refs.form)
      }
    }
  }
</script>
