<template>
  <v-menu
    v-if="!readonly"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="localDate"
        readonly
        v-bind="$props"
        v-on="on"
      />
    </template>
    <v-date-picker
      v-if="!readonly"
      v-model="localDate"
      @input="menu = false"
    />
  </v-menu>
  <v-text-field
    v-else
    v-model="localDate"
    class="gokb-date-field-disabled"
    v-bind="$props"
    disabled
  />
</template>

<script>
  export default {
    name: 'GokbDateField',
    props: {
      label: {
        type: String,
        required: false,
        default: '',
      },
      readonly: {
        type: Boolean,
        required: false,
        default: false,
      },
      value: {
        type: String,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        menu: false,
      }
    },
    computed: {
      localDate: {
        get () {
          return this.value
        },
        set (localDate) {
          this.$emit('input', localDate)
        }
      }
    }
  }
</script>
