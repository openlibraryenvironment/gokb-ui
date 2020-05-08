<template>
  <gokb-dialog
    v-model="localValue"
    :title="`${component.name} hinzufügen`"
    @submit="addItem"
  >
    <component
      :is="component.type"
      v-model="selectedItem"
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
        :disabled="!selectedItem"
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
        selectedItem: undefined,
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
        this.$emit('add', this.selectedItem)
        this.close()
      },
      close () {
        this.localValue = false
      }
    }
  }
</script>
