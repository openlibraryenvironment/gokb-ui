<template>
  <gokb-dialog
    v-model="localValue"
    :title="$t('popups.confirm.label')"
    persistent
    @submit="submit"
  >
    <v-sheet>
      <i18n-t
        v-if="message.vars"
        :path="message.text"
      >
        <template v-slot:0>
          <b>{{ message.vars[0] }}</b>
        </template>
        <template v-slot:1>
          <b>{{ message.vars[1] }}</b>
        </template>
      </i18n-t>
      <span v-else> {{ message.text }} </span>
    </v-sheet>
    <template #buttons>
      <v-spacer />
      <gokb-button
        text
        @click="close"
      >
        {{ $t('btn.cancel') }}
      </gokb-button>
      <gokb-button
        default
      >
        {{ $t('btn.confirm') }}
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
      modelValue: {
        type: Boolean,
        required: true,
        default: false
      },
      message: {
        type: [Object, String],
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
          return this.modelValue
        },
        set (value) {
          this.$emit('update:modelValue', value)
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
