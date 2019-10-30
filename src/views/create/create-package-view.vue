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
            <gokb-text-field
              v-model="title"
              placeholder="Titel"
            />
            <gokb-combobox-field placeholder="Quelle" />
            <gokb-text-field
              v-model="url"
              placeholder="URL"
            />
            <gokb-textarea-field
              v-model="description"
              placeholder="Beschreibung"
            />
            <gokb-select-field placeholder="Umfang" />
            <gokb-radiobutton-group>
              <gokb-radiobutton-field label="Konsortial" />
              <gokb-radiobutton-field label="Global" />
              <gokb-radiobutton-field label="Unbekannt" />
            </gokb-radiobutton-group>
            <v-row>
              <gokb-checkbox-field
                class="ml-3"
                label="Paketinhalt ist konsistent"
              />
              <gokb-checkbox-field
                class="ml-3"
                label="Teilbar für Lizenznehmer"
              />
              <gokb-checkbox-field
                class="ml-3"
                label="Paket ist unveränderbar"
              />
            </v-row>
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
  export default {
    name: 'CreatePackage',
    data () {
      return {
        step: 1,
        title: undefined,
        description: undefined,
        url: undefined,
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
