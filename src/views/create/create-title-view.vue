<template>
  <gokb-page
    title="Einzeltitel anlegen"
    @submit="createTitle"
  >
    <gokb-select-field
      class="ml-4"
      placeholder="Journal"
    />
    <gokb-section
      sub-title="Identifier"
    >
      <gokb-select-field placeholder="Title" />
      <gokb-select-field placeholder="Quelle" />
      <gokb-select-field placeholder="URL" />
      <gokb-select-field placeholder="Beschreibung" />
      <gokb-select-field placeholder="Umfang" />
      <gokb-select-field placeholder="Zuordnung" />
      <gokb-select-field placeholder="URL" />
    </gokb-section>
    <gokb-section sub-title="Allgemein">
      <gokb-select-field placeholder="ISSN" />
    </gokb-section>
    <gokb-section sub-title="Impressum">
      <gokb-select-field placeholder="ISSN" />
    </gokb-section>
    <gokb-section sub-title="Publisher">
      <gokb-select-field placeholder="ISSN" />
    </gokb-section>
    <gokb-section sub-title="Pflege">
      <gokb-select-field placeholder="ISSN" />
    </gokb-section>
    <gokb-section sub-title="Review">
      <gokb-select-field placeholder="ISSN" />
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
  import GokbPage from '@/shared/components/complex/page-component'
  import GokbSection from '@/shared/components/complex/section-component'
  import GokbButton from '@/shared/components/base/button-component'
  import GokbSelectField from '@/shared/components/base/select-field-component'

  export default {
    name: 'CreateTitle',
    components: {
      GokbPage,
      GokbSection,
      GokbButton,
      GokbSelectField,
    },
    data () {
      return {
      }
    },
  }
</script>

<style scoped>
</style>
