<template>
  <gokb-dialog
    ref="comp"
    v-model="localValue"
    :title="$t('header.add.label', [component.name])"
    :is-valid="isValid"
    :width="width"
    @update-valid="updateValidStatus"
    @submit="addItem"
  >
    <component
      :is="component.type"
      v-model="item"
      v-bind="component.properties"
    />

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
        {{ $t('btn.add') }}
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'

  export default {
    name: 'GokbAddItemPopup',
    extends: BaseComponent,
    emits: ['update:model-value', 'add'],
    props: {
      modelValue: {
        type: Boolean,
        required: true
      },
      component: {
        type: Object,
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
        this.$emit('add', this.item)
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
