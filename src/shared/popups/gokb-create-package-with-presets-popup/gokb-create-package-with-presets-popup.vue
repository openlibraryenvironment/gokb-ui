<template>
  <gokb-dialog
    v-model="localValue"
    :title="header"
    :width="1000"
    @submit="submit"
  >
    <v-snackbar v-model="showSnackbar" :color="messageColor" :timeout="currentSnackBarTimeout">
      {{ snackbarMessage }}
      <template #actions>
        <v-icon @click="showSnackbar = false" color="white">mdi-close</v-icon>
      </template>
    </v-snackbar>

    <gokb-section>


    </gokb-section>
  </gokb-dialog>
</template>

<script>
import BaseComponent from "@/shared/components/base-component"

export default {
  name: 'GokbCreatePackageWithPresetsPopup',
  extends: BaseComponent,
  emits: ['update:model-value'],
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
  },
  data () {
    return {
      showSnackbar: false,
      snackbarMessage: undefined,
      messageColor: undefined,
      currentSnackBarTimeout: '-1',
    }
  },
  computed: {
    localValue: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:model-value', val)
      }
    },
    header() {
      //return this.$i18n.t('popups.externalSourceImport.label')
      return 'Erstelle Paket mit Vorgabewerten'
    }
  },
  watch: {},
  methods: {
    submit () {
      console.log("+++ submit +++")
    }
  }


}
</script>
