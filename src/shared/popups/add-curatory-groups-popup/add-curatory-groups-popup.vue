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
      <gokb-button default>
        Hinzufügen
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import ajaxServices from '@/shared/services/ajax-services'
  import BaseComponent from '@/shared/base-component'

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
      const { data: { values } } = await ajaxServices.lookup({
        baseClass: 'org.gokb.cred.CuratoryGroup',
        q: ''
      })
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
