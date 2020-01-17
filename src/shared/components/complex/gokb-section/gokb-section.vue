<template>
  <span>
    <v-card flat>
      <v-toolbar
        v-if="title && !subTitle"
        color="white"
        dense
        flat
        height="32"
      >
        <span
          class="headline"
        >
          {{ title }}
        </span>
        <v-spacer />
        <v-toolbar-items>
          <slot name="buttons" />
        </v-toolbar-items>
      </v-toolbar>
      <span
        v-else
        class="headline ml-4"
      >
        {{ title }}
      </span>
      <v-toolbar
        v-if="subTitle"
        color="white"
        dense
        flat
        height="32"
      >
        <span
          v-if="subTitle"
          class="title"
        >
          {{ subTitle }}
        </span>
        <v-spacer />
        <v-toolbar-items>
          <slot name="buttons" />
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <div class="controls pa-2">
          <slot />
        </div>
      </v-card-text>
    </v-card>
  </span>
</template>

<script>
  export default {
    name: 'GokbSection',
    props: {
      title: {
        type: String,
        required: false,
        default: undefined,
      },
      subTitle: {
        type: String,
        required: false,
        default: undefined,
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
