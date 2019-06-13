<template>
  <span>
    <v-card flat>
      <v-toolbar flat dense height="32" color="white">
        <span class="subheading">{{title}}</span>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <slot name="buttons"></slot>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text class="mx-2">
        <div class="controls pa-2">
          <slot></slot>
        </div>
      </v-card-text>
    </v-card>
  </span>
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

<style>
  .controls {
    background-color: #f2f2f2;
  }
</style>
