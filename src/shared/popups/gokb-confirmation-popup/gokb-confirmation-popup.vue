<template>
  <gokb-dialog
    v-model="localValue"
    title="Bestätigung"
    persistent
    @submit="submit"
  >
    <v-sheet>
      {{ message }}
    </v-sheet>
    <template #buttons>
      <v-spacer />
      <gokb-button
        text
        @click.native="close"
      >
        Abbrechen
      </gokb-button>
      <gokb-button
        default
      >
        Ok
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'

  export default {
    name: 'GokbConfirmationPopup',
    extends: BaseComponent,
    props: {
      value: {
        type: Boolean,
        required: true,
        default: false
      },
      message: {
        type: String,
        required: true,
        default: ''
      },
    },
    data () {
      return {
        error: undefined,
      }
    },
    computed: {
      localValue: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        }
      },
    },
    async created () {
    },
    methods: {
      submit () {
        this.close()
        this.$emit('confirmed')
      },
      close () {
        this.localValue = false
      }
    }
  }
</script>
