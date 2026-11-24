<template>
  <gokb-dialog
    ref="comp"
    v-model="localValue"
    :title="$t('component.review.transfer.targetSelect.label')"
    :is-valid="isValid"
    :width="width"
    @update-valid="updateValidStatus"
    @submit="addItem"
  >
    <gokb-curatory-group-field v-model="item" />

    <template #buttons>
      <v-spacer />
      <gokb-button
        text
        @click="close"
      >
        {{ $t('btn.cancel') }}
      </gokb-button>
      <gokb-button
        :disabled="!isValid"
        is-submit
      >
        {{ $t('btn.transfer') }}
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'

  export default {
    name: 'GokbTransferReviewPopup',
    extends: BaseComponent,
    emits: ['update:model-value', 'submit'],
    props: {
      modelValue: {
        type: Boolean,
        required: true
      },
      width: {
        type: [Number, String],
        required: false,
        default: 400
      }
    },
    data () {
      return {
        item: undefined,
        isValid: false
      }
    },
    computed: {
      localValue: {
        get () {
          return this.modelValue || false
        },
        set (localValue) {
          this.$emit('update:model-value', localValue)
        }
      },
    },
    methods: {
      addItem () {
        this.$emit('submit', this.item)
        this.close()
      },
      close () {
        this.localValue = false
      },
      updateValidStatus(status) {
        this.isValid = status
      }
    }
  }
</script>
