<template>
  <gokb-dialog
    v-model="localValue"
    :title="`${component.name} hinzufügen`"
    @submit="addItem"
  >
    <component
      :is="component.type"
      v-model="item"
    />
    <template #buttons>
      <v-spacer />
      <gokb-button
        text
        @click.native="close"
      >
        Abbrechen
      </gokb-button>
      <gokb-button
        :disabled="!item"
        default
      >
        Hinzufügen
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'

  export default {
    name: 'AddItemPopup',
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
