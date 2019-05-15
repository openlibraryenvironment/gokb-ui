<template>
  <v-container>
    <v-card flat>
      <v-toolbar flat>
        <v-toolbar-title>
          <span class="subheading">{{title}}</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <slot name="buttons"></slot>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text class="ma-2">
        <slot></slot>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'SectionComponent',
  props: {
    title: {
      type: String,
      required: false,
      default: 'missing title for section'
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
