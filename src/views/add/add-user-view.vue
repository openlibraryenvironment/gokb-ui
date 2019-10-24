<template>
  <gokb-page
    title="Benutzer hinzufügen"
    @submit="add"
  >
    <gokb-section title="Allgemein">
      <gokb-select-field placeholder="Benutzername" />
      <gokb-password-field
        v-model="origpass"
        label="Kennwort"
      />
      <gokb-email-field v-model="email" />
      <gokb-select-field placeholder="Organisation" />
    </gokb-section>
    <gokb-section title="Rollen">
      <template #buttons>
        <gokb-button @click.native="showAddNewRole">
          Hinzufügen
        </gokb-button>
        <gokb-button @click.native="deleteSelectedRole">
          Löschen
        </gokb-button>
      </template>
      <gokb-table />
    </gokb-section>
    <gokb-section title="Kuratorengruppen">
      <template #buttons>
        <gokb-button @click.native="showAddNewCuratoryGroup">
          Hinzufügen
        </gokb-button>
        <gokb-button @click.native="deleteSelectedCuratoryGroups">
          Löschen
        </gokb-button>
      </template>
      <gokb-table />
    </gokb-section>
    <template #buttons>
      <v-spacer />
      <gokb-button default>
        Hinzufügen
      </gokb-button>
    </template>
  </gokb-page>
</template>

<script>
  import GokbPage from '@/shared/components/complex/page-component'
  import GokbSection from '@/shared/components/complex/section-component'
  import GokbButton from '@/shared/components/base/button-component'
  import GokbSelectField from '@/shared/components/base/select-field-component'
  import GokbEmailField from '@/shared/components/simple/email-field-component'
  import GokbPasswordField from '@/shared/components/simple/password-field-component'

  export default {
    name: 'AddUser',
    components: {
      GokbPage,
      GokbSection,
      GokbButton,
      GokbSelectField,
      GokbEmailField,
      GokbPasswordField,
    },
    data () {
      return {}
    },
  }
</script>

<style scoped>
</style>
