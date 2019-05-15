<template>
  <v-container>
    <v-card flat>
      <v-toolbar flat>
        <v-toolbar-title>
          {{title}}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <slot></slot>
      </v-card-text>
      <v-card-actions>
        <slot name="buttons"></slot>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'PageComponent',
  props: {
    title: {
      type: String,
      required: false,
      default: 'missing title for page'
    },
  },
  data () {
    return {
    }
  },
}
</script>

<style scoped>
</style>
