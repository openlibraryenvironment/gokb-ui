<template>
  <gokb-page
    title="Einzeltitel anlegen"
    @submit="createTitle"
  >
    <gokb-select-field
      class="ml-4"
      label="Journal"
    />
    <gokb-section
      sub-title="Identifier"
    >
      <gokb-select-field label="Title" />
      <gokb-select-field label="Quelle" />
      <gokb-select-field label="URL" />
      <gokb-select-field label="Beschreibung" />
      <gokb-select-field label="Umfang" />
      <gokb-select-field label="Zuordnung" />
      <gokb-select-field label="URL" />
    </gokb-section>
    <gokb-section sub-title="Allgemein">
      <gokb-select-field label="ISSN" />
    </gokb-section>
    <gokb-section sub-title="Impressum">
      <gokb-select-field label="ISSN" />
    </gokb-section>
    <gokb-section sub-title="Publisher">
      <gokb-select-field label="ISSN" />
    </gokb-section>
    <gokb-section sub-title="Pflege">
      <gokb-select-field label="ISSN" />
    </gokb-section>
    <gokb-section sub-title="Review">
      <gokb-select-field label="ISSN" />
    </gokb-section>

    <template #buttons>
      <v-spacer />
      <gokb-button
        @click.native="review"
      >
        Review
      </gokb-button>
    </template>
  </gokb-page>
</template>

<script>
  export default {
    name: 'CreateTitle',
    data () {
      return {
      }
    },
  }
</script>

<style scoped>
</style>
