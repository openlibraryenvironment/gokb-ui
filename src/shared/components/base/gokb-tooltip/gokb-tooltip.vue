<template>
  <v-tooltip right>
<<<<<<< HEAD
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        :class="classes"
        v-bind="attrs"
        v-on="on"
=======
    <template v-slot:activator="{ props }">
      <v-icon
        :color="color"
        v-bind="props"
        class="mt-n1 ml-2"
        size="small"
>>>>>>> develop
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
