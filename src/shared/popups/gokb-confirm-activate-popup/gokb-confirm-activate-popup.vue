<template>
  <gokb-dialog
    ref="comp"
    v-model="localValue"
    :title="$t('popups.activateUser.label')"
    @submit="confirm"
  >
    <v-sheet>
      <div>{{ $t('popups.activateUser.info') }}</div>
      <gokb-checkbox-field
        :label="$t('popups.activateUser.sendAlert')"
        v-model="sendAlert"
      />
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
        is-submit
      >
        {{ $t('btn.confirm') }}
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'

  export default {
    name: 'GokbConfirmActivatePopup',
    extends: BaseComponent,
    emits: ["update:model-value", "submit"],
    props: {
      modelValue: {
        type: Boolean,
        required: true,
        default: false
      }
    },
    data () {
      return {
        sendAlert: false
      }
    },
    computed: {
      localValue: {
        get () {
          return this.modelValue
        },
        set (localValue) {
          this.$emit('update:model-value', localValue)
        }
      },
    },
    methods: {
      confirm () {
        this.$emit('submit', this.sendAlert)
        this.close()
      },
      close () {
        this.localValue = false
      }
    }
  }
</script>
