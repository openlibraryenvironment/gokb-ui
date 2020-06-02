<template>
  <gokb-section
    expandable
    sub-title="Identifier"
  >
    <gokb-add-item-popup
      v-if="addIdentifierPopupVisible"
      v-model="addIdentifierPopupVisible"
      :component="{ type: 'GokbIdentifierField', name: 'Identifier' }"
      @add="addNewIdentifier"
    />
    <template #buttons>
      <gokb-button
        icon-id="add"
        @click.native="showAddIdentifierPopup"
      >
        Identifier hinzufügen
      </gokb-button>
    </template>
    <gokb-identifier-field
      v-for="(identifier, i) of localValue"
      :key="identifier.id"
      v-model="localValue[i]"
      namespace-fixed
      deleteable
    />
  </gokb-section>
</template>

<script>
  import GokbAddItemPopup from '@/shared/popups/gokb-add-item-popup'

  export default {
    name: 'GokbIdentifierSection',
    components: { GokbAddItemPopup },
    props: {
      value: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        addIdentifierPopupVisible: false,
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
      showAddIdentifierPopup () {
        this.addIdentifierPopupVisible = true
      },
      addNewIdentifier () {
        console.log('addNewIdentifier called')
      },
    }
  }
</script>
