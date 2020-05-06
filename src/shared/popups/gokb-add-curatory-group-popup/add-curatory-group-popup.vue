<template>
  <gokb-dialog
    v-model="localValue"
    title="Kuratorengruppe hinzufügen"
    @submit="addCuratoryGroup"
  >
    <gokb-curatory-group-field
      v-model="selectedCuratoryGroup"
      label="Kuratorengruppe"
      return-object
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
        :disabled="!selectedCuratoryGroup"
        default
      >
        Hinzufügen
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/base-component'
  import GokbCuratoryGroupField from '@/shared/components/simple/gokb-curatory-group-field'

  export default {
    name: 'AddCuratorGroupsPopup',
    components: { GokbCuratoryGroupField },
    extends: BaseComponent,
    props: {
      value: {
        type: Boolean,
        required: true,
        default: false
      },
    },
    data () {
      return {
        error: undefined,
        curatoryGroups: undefined,
        selectedCuratoryGroup: undefined,
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
      addCuratoryGroup () {
        this.$emit('add', this.selectedCuratoryGroup)
        this.close()
      },
      close () {
        this.localValue = false
      }
    }
  }
</script>
