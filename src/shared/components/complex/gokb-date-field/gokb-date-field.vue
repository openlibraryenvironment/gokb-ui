<template>
  <v-row v-if="!readonly">
    <v-col
      cols="10"
      class="pr-0"
    >
      <v-text-field
        v-model="localDate"
        :clearable="clearable"
        :label="label"
        validate-on-blur
        :hint="$t('default.ISOdateHint')"
        :rules="rules"
        :dense="dense"
      />
    </v-col>
    <v-col
      align-self="center"
      cols="2"
    >
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
      >
        <template v-slot:activator="{ on }">
          <v-icon
            v-bind="$props"
            class="pb-1"
            v-on="on"
          >
            mdi-calendar
          </v-icon>
        </template>
        <v-date-picker
          v-if="!readonly"
          v-model="localDate"
          @input="menu = false"
        />
      </v-menu>
    </v-col>
  </v-row>
  <v-text-field
    v-else
    v-model="localDate"
    class="gokb-date-field-disabled"
    v-bind="$props"
    :dense="dense"
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
      clearable: {
        type: Boolean,
        required: false,
        default: true,
      },
      value: {
        type: String,
        required: false,
        default: undefined
      },
      dense: {
        type: Boolean,
        required: false,
        default: false
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
      },
      rules () {
        return [
          value => !value || (/^([12][0-9]{3})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$/.test(value) && !isNaN(new Date(value))) || this.$i18n.t('validation.dateFormat')
        ]
      }
    }
  }
</script>
