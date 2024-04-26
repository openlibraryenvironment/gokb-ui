<template>
  <gokb-dialog
      v-model="localValue"
      :title="header"
      :width="1000"
      @submit=""
  >
    <v-snackbars :objects.sync="eventMessages">
      <template #action="{ close }">
        <v-btn icon @click="close()"><v-icon>mdi-close</v-icon></v-btn>
      </template>
    </v-snackbars>

    <gokb-section

    >
      <v-row dense>
        <v-col>
          <gokb-state-field
              label="Quelle"
              v-model="import_sources"
          />
        </v-col>
        <v-col>
          <gokb-text-field
              label="Paket-UUID"
              v-model="wekb_package_uuid"
          />

        </v-col>
      </v-row>
      <v-row dense >
        <gokb-button
        >
          Abschicken
        </gokb-button>
      </v-row>
    </gokb-section>
    <template #buttons></template>
  </gokb-dialog>
</template>

<script>
import BaseComponent from "@/shared/components/base-component";
import VSnackbars from "v-snackbars";
import GokbSection from "@/shared/components/complex/gokb-section/gokb-section.vue";
import GokbStateField from "@/shared/components/simple/gokb-state-field/gokb-state-field.vue";
import GokbTextField from "@/shared/components/base/gokb-text-field/gokb-text-field.vue";
import GokbButton from "@/shared/components/base/gokb-button/gokb-button.vue";


export default {
  name: 'GokbImportWekbPackagePopup',
  components: {GokbButton, GokbTextField, GokbStateField, GokbSection, VSnackbars },
  extends: BaseComponent,
  props: {
    value: {
      type: Boolean,
      required: true
    },
  },
  data () {
    return {
      eventMessages: [],
      wekb_package_uuid: undefined,
      import_sources: ["WE:KB"]

    }
  },
  computed: {
    localValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    header () {
      return "Ein Paket aus einer externen Quelle importieren";
    }
  },
  watch: {},
  methods: {}

}


</script>
