<template>
  <gokb-dialog
    v-model="localValue"
    title="Kuratorengruppe hinzufügen"
    @submit="addCuratoryGroup"
  >
    <v-select
      v-model="selectedCuratoryGroup"
      :items="curatoryGroups"
      label="Kuratorengruppe"
      item-value="id"
      item-text="name"
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
  import genericEntityServices from '@/shared/services/generic-entity-services'

  const curatoryGroupServices = genericEntityServices('curatoryGroups')

  export default {
    name: 'AddCuratorGroupsPopup',
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
    async created () {
      const { data: values } = await curatoryGroupServices.getAll()
      this.curatoryGroups = values
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
