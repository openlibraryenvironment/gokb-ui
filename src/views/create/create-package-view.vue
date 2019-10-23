<template>
  <gokb-page
    title="Paket anlegen"
    @submit="createPackage"
  >
    <v-stepper
      v-model="step"
      alt-labels
    >
      <v-stepper-header>
        <v-stepper-step
          step="1"
        >
          Allgemein
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          step="2"
        >
          Organisation und Plattform
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          step="3"
        >
          Titel im Paket
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          step="4"
        >
          Zusammenfassung
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <gokb-section
            title="Allgemein"
            sub-title="Paket"
          >
            <gokb-select-field placeholder="Title" />
            <gokb-select-field placeholder="Quelle" />
            <gokb-select-field placeholder="URL" />
            <gokb-select-field placeholder="Beschreibung" />
            <gokb-select-field placeholder="Umfang" />
            <gokb-select-field placeholder="Zuordnung" />
            <gokb-select-field placeholder="URL" />
          </gokb-section>
          <gokb-section sub-title="Identifier">
            <gokb-select-field placeholder="ISSN" />
          </gokb-section>
        </v-stepper-content>

        <v-stepper-content step="2">
          <gokb-section
            title="Organisation"
            sub-title="Allgemein"
          >
            <gokb-select-field placeholder="Title" />
            <gokb-select-field placeholder="Quelle" />
            <gokb-select-field placeholder="URL" />
            <gokb-select-field placeholder="Beschreibung" />
            <gokb-select-field placeholder="Umfang" />
            <gokb-select-field placeholder="Zuordnung" />
            <gokb-select-field placeholder="URL" />
          </gokb-section>
          <gokb-section sub-title="Identifier">
            <gokb-select-field placeholder="ISSN" />
          </gokb-section>
          <gokb-section sub-title="Alternative Namen">
            <gokb-select-field placeholder="ISSN" />
          </gokb-section>
          <gokb-section sub-title="Kuratoren">
            <gokb-select-field placeholder="ISSN" />
          </gokb-section>
          <gokb-section title="Plattform">
            <gokb-select-field placeholder="ISSN" />
          </gokb-section>
        </v-stepper-content>

        <v-stepper-content step="3">
          <gokb-section sub-title="Titel">
            <gokb-select-field placeholder="Titel" />
          </gokb-section>
        </v-stepper-content>

        <v-stepper-content step="4">
          <gokb-section sub-title="Zusammenfassung">
            df
          </gokb-section>
          <gokb-section sub-title="Pflege">
            df
          </gokb-section>
          <gokb-section sub-title="Kuratoren">
            df
          </gokb-section>
          <gokb-section sub-title="Review">
            df
          </gokb-section>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <template #buttons>
      <gokb-button
        v-show="step !== 1"
        @click.native="go2PreviousStep"
      >
        Zurück
      </gokb-button>
      <v-spacer />
      <gokb-button
        v-show="step !== 4"
        @click.native="go2NextStep"
      >
        Weiter
      </gokb-button>
    </template>
  </gokb-page>
</template>

<script>
  import GokbPage from '@/shared/components/complex/page-component'
  import GokbSection from '@/shared/components/complex/section-component'
  import GokbButton from '@/shared/components/base/button-component'
  import GokbSelectField from '@/shared/components/base/select-field-component'

  export default {
    name: 'CreatePackage',
    components: {
      GokbPage,
      GokbSection,
      GokbButton,
      GokbSelectField,
    },
    data () {
      return {
        step: 1,
      }
    },
    methods: {
      go2NextStep () {
        this.step < 4 && this.step++
      },
      go2PreviousStep () {
        this.step > 1 && this.step--
      },
      createPackage () {
        console.log('create package')
      }
    }
  }
</script>

<style scoped>
</style>
