<template>
  <v-tooltip
    right
    max-width="300px">
    <template v-slot:activator="{ props }">
      <v-icon
        :color="color"
        v-bind="props"
        :class="classes"
        :size="size"
      >
        {{ iconId }}
      </v-icon>
    </template>
    <i18n-t :keypath="code" scope="global">
        <b v-for="(v, i) in vars">
          {{ typeof v === 'string' ? v : $t(v.code) }}
        </b>
    </i18n-t>
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
      size: {
        type: String,
        required: false,
        default: '20px'
      },
      code: {
        type: String,
        required: true
      },
      vars: {
        type: Array,
        required: false,
        default: undefined
      },
      classes: {
        type: String,
        required: false,
        default: 'mt-n1 ml-2'
      }
    }
  }
</script>

<style scoped>
</style>
