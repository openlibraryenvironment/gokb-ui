<template>
  <v-tooltip right>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        :class="classes"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon
          :color="color"
          class="mt-n1"
          :small="small"
        >
          {{ iconId }}
        </v-icon>
      </v-btn>
    </template>
    <i18n :path="code">
      <template v-for="(v, i) in vars" v-slot>
        <b v-if="typeof v === 'string'">{{ v }}</b>
        <b v-else>{{ $t(v.code) }}</b>
      </template>
    </i18n>
  </v-tooltip>
</template>

<script>
  export default {
    name: 'GokbTooltip',
    props: {
      color: {
        type: String,
        required: false,
        default: 'info',
      },
      iconId: {
        type: String,
        required: false,
        default: 'mdi-help-circle',
      },
      small: {
        type: Boolean,
        required: false,
        default: true
      },
      classes: {
        type: String,
        required: false,
        default: ""
      },
      code: {
        type: String,
        required: true
      },
      vars: {
        type: Array,
        required: false,
        default: undefined
      }
    }
  }
</script>

<style scoped>
</style>
