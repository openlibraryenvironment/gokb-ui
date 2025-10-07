<template>

  <gokb-section>

    <v-row>
      <v-col cols="5"><h3>Format der Datenlieferung</h3></v-col>
      <v-col cols="5"><h3>GOKB-spezifische Erweiterung von KBART</h3></v-col>
    </v-row>

    <br/>
    <v-row>
      <v-col cols="5">
        <gokb-checkbox-field dense
          v-model="supplyKbart"
          class="ml-3"
          label="KBART"
          :readonly="isReadonly"
        />

        <gokb-checkbox-field dense
          v-model="supplyCsv"
          class="ml-3"
          label="Proprietäres CSV"
          :readonly="isReadonly"
        />

        <gokb-checkbox-field dense
          v-model="supplyMarc"
          class="ml-3"
          label="MARC21"
          :readonly="isReadonly"
        />

        <gokb-checkbox-field dense
          v-model="supplyOnix"
          class="ml-3"
          label="ONIX for Books 2.0/3.0"
          :readonly="isReadonly"
        />

        <br/>

        <h3>Bereitstellung von globalen KBART-Dateien</h3>

        <gokb-state-field
          v-model="supplyMethod"
          :init-item="supplyMethod"
          url="refdata/categories/Org.PreferredSupplyMethod"
          label="Bevorzugte Methode"
          :readonly="isReadonly"
        />

        <gokb-url-field
          v-model="kbartHostUrl"
          :disabled="isReadonly"
          label="URL zur KBART-Seite"
        />

        <br/>

        <h3>Autoupdate</h3>

        <gokb-checkbox-field dense
                             v-model="autoImportSupported"
                             class="ml-3"
                             label="Autoimport unterstützt"
                             :readonly="isReadonly"
        />

        <gokb-checkbox-field dense
                             v-model="kbartUrlWithDateMask"
                             class="ml-3"
                             label="URL mit Datumsmaskierung"
                             :readonly="isReadonly"
        />

        <gokb-state-field
          v-model="kbartUpdateCycle"
          :init-item="kbartUpdateCycle"
          message-path="component.source.frequency"
          url="refdata/categories/Source.Frequency"
          :label="$t('component.source.frequency.label')"
          :readonly="isReadonly"
        />


      </v-col>


      <v-col cols="5">
        <gokb-checkbox-field dense
           v-model="kbartExtensionZdbId"
           class="ml-3"
           label="zdb_id"
           :readonly="isReadonly"
        />

        <gokb-checkbox-field dense
           v-model="kbartExtensionZdbId"
           class="ml-3"
           label="zdb_id"
           :readonly="isReadonly"
        />

        <gokb-checkbox-field dense
           v-model="kbartExtensionEzbId"
           class="ml-3"
           label="ezb_id"
           :readonly="isReadonly"
        />

        <gokb-checkbox-field dense
           v-model="kbartExtensionLastChanged"
           class="ml-3"
           label="last_changed"
           :readonly="isReadonly"
        />

        <gokb-checkbox-field dense
           v-model="kbartExtensionAccessStartDate"
           class="ml-3"
           label="access_start_date"
           :readonly="isReadonly"
        />

        <gokb-checkbox-field dense
           v-model="kbartExtensionAccessEndDate"
           class="ml-3"
           label="access_end_date"
           :readonly="isReadonly"
        />

        <gokb-checkbox-field dense
           v-model="kbartExtensionMedium"
           class="ml-3"
           label="medium"
           :readonly="isReadonly"
        />

        <gokb-checkbox-field dense
           v-model="kbartExtensionMonographParentCollectionTitle"
           class="ml-3"
           label="monograph_parent_collection_title"
           :readonly="isReadonly"
        />

        <gokb-checkbox-field dense
           v-model="kbartExtensionSeries"
           class="ml-3"
           label="series"
           :readonly="isReadonly"
        />

        <gokb-checkbox-field dense
           v-model="kbartExtensionSubjetArea"
           class="ms-3"
           label="subject_area"
           :readonly="isReadonly"
        />

        <br/>

        <h3>Allgemeine Bemerkung</h3>

       <!-- <gokb-comments-field
          v-model="comment"
        /> -->

      </v-col>

    </v-row>

  </gokb-section>

</template>

<script>
  import BaseComponent from "@/shared/components/base-component"
  import genericServices from "@/shared/services/generic-entity-services"
  import providerServices from "@/shared/services/provider-services"
  import genericEntityServices from "@/shared/services/generic-entity-services"
  import GokbSection from "../gokb-section/index.js";
  import GokbCommentsField from "../gokb-comments-field/index.js";
  import GokbUrlField from "../../simple/gokb-url-field/index.js";


  export default {
    name: 'GokbOrgNotesSection',
    emits: ['update:model-value'],
    components: {GokbUrlField, GokbCommentsField, GokbSection},
    props: {
      modelValue: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        isReadonly: false,
        supplyKbart: undefined,
        supplyCsv: undefined,
        supplyMarc: undefined,
        supplyOnix: undefined,
        kbartExtensionZdbId: undefined,
        kbartExtensionEzbId: undefined,
        kbartExtensionLastChanged: undefined,
        kbartExtensionAccessStartDate: undefined,
        kbartExtensionAccessEndDate: undefined,
        kbartExtensionMedium: undefined,
        kbartExtensionMonographParentCollectionTitle: undefined,
        kbartExtensionSeries: undefined,
        kbartExtensionSubjetArea: undefined,
        autoImportSupported: undefined,
        kbartUrlWithDateMask: undefined,
        kbartUpdateCycle: undefined,
        kbartHostUrl: undefined,
        comment: undefined,
        supplyMethod: undefined,

      }
    },
    computed: {
      localValue: {
        get () {
          console.log("local Value", this.modelValue)
          return this.modelValue
        },
        set (localValue) {
          console.log("++++ local Value set --> EMIT ++++")
          this.$emit('update:model-value', localValue)
        }
      },
    },
    watch : {
      modelValue: {
        handler(val) {
          console.log("modelValue: ", val)
          this.supplyKbart = val.supplyKbart
        },
        deep: true
      },
      /* item: {
        handler (val) {
          this.$emit('update:model-value', val)
        },
        deep: true
      }, */
    },
    methods: {

    }
  }
</script>
