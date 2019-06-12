<template>
  <v-container>
    <v-card flat class="pa-2">
      <v-toolbar flat dense height="32" color="white">
        <v-toolbar-title>
          {{title}}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="no-padding">
        <slot></slot>
      </v-card-text>
      <v-card-actions class="no-padding">
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
  .no-padding {
    padding: 0;
  }
</style>
