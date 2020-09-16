<template>
  <gokb-dialog
    v-model="localValue"
    :title="$t('header.add.label', [component.name])"
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
        :disabled="!item"
        default
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
    props: {
      value: {
        type: Boolean,
        required: true,
        default: false
      },
      component: {
        type: Object,
        required: true
      },
    },
    data () {
      return {
        item: undefined,
      }
    },
    computed: {
      localValue: {
        get () {
          return this.value
        },
        set (localValue) {
          this.$emit('input', localValue)
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
      }
    }
  }
</script>
