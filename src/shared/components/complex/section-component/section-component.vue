<template>
  <span>
    <v-card flat>
      <v-toolbar
        color="white"
        dense
        flat
        height="32"
      >
        <span class="title">{{ title }}</span>
        <v-spacer />
        <v-toolbar-items>
          <slot name="buttons" />
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text class="mx-2">
        <div class="controls pa-2">
          <slot />
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
      return {}
    },
  }
</script>

<style scoped>
  /deep/ .controls {
    background-color: #f2f2f2;
  }
</style>
