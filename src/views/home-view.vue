<template>
  <gokb-page
    title="Dashboard"
  >
    <gokb-section title="Reviews">
      <template #buttons>
        <gokb-select-field placeholder="Typ" />
        <gokb-select-field placeholder="Ersteller" />
      </template>
      <gokb-table />
    </gokb-section>
    <gokb-section title="Pflege">
      <template #buttons>
        <gokb-select-field placeholder="Typ" />
        <gokb-select-field placeholder="Ersteller" />
      </template>
      <gokb-table />
    </gokb-section>
    <gokb-section title="KBART Import">
      <gokb-table />
    </gokb-section>
  </gokb-page>
</template>

<script>
  import GokbPage from '@/shared/components/complex/page-component'
  import GokbTable from '@/shared/components/complex/table-component'
  import GokbSection from '@/shared/components/complex/section-component'
  import GokbSelectField from '@/shared/components/base/select-field-component'

  export default {
    name: 'ProfileView',
    components: {
      GokbPage,
      GokbSection,
      GokbTable,
      GokbSelectField,
    },
  }
</script>
