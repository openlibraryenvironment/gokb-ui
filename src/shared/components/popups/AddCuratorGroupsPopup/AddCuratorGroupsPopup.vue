<template>
  <gokb-dialog v-model="localValue" title="Kuratorengruppe hinzufügen" @submit="addCuratoryGroup">
    <v-select label="Kuratorengruppe" :items="curatoryGroups" v-model="selectedCuratoryGroup" return-object/>
    <template #buttons>
      <v-spacer/>
      <gokb-button @click.native="close" flat>Abbrechen</gokb-button>
      <gokb-button default>Hinzufügen</gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
import ajaxServices from '@/shared/services/ajax-services'
import BaseComponent from '@/shared/components/BaseComponent'
import GokbDialog from '@/shared/components/complex/DialogComponent'
import GokbButton from '@/shared/components/base/ButtonComponent'

export default {
  extends: BaseComponent,
  name: 'AddCuratorGroupsPopup',
  components: { GokbDialog, GokbButton },
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
    const { values } = await ajaxServices.lookup({
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
