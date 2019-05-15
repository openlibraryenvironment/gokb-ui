<template>
  <gokb-page title="Profil">
    <gokb-section title="Allgemein">
      <gokb-text-field label="Name" v-model="username"></gokb-text-field>
      <gokb-text-field label="Name für die Anzeige" v-model="displayName"></gokb-text-field>
      <gokb-email-field v-model="email"></gokb-email-field>
    </gokb-section>
    <gokb-section title="Kennwort">
      <gokb-password-field label="Bisheriges Kennwort" v-model="origpass"/>
      <gokb-password-field label="Neues Kennwort" v-model="newpass"/>
      <gokb-password-field label="Neues Kennwort (Wiederholung)" v-model="repeatpass"/>
    </gokb-section>
    <gokb-section title="Kuratorengruppen">
      <template #buttons>
        <gokb-button>Hinzufügen</gokb-button>
        <gokb-button>Löschen</gokb-button>
      </template>
      <gokb-table/>
    </gokb-section>
    <template #buttons>
      <gokb-button>Konto löschen</gokb-button>
      <v-spacer></v-spacer>
      <gokb-button>Aktualisieren</gokb-button>
    </template>
  </gokb-page>
</template>

<script>
import GokbPage from '@/shared/components/complex/PageComponent'
import GokbTable from '@/shared/components/complex/TableComponent'
import GokbSection from '@/shared/components/complex/SectionComponent'
import GokbButton from '@/shared/components/base/ButtonComponent'
import GokbTextField from '@/shared/components/base/TextFieldComponent'
import GokbEmailField from '@/shared/components/base/EmailFieldComponent'
import GokbPasswordField from '@/shared/components/base/PasswordFieldComponent'

export default {
  name: 'ProfileComponent',
  components: { GokbPage, GokbSection, GokbTable, GokbTextField, GokbEmailField, GokbButton, GokbPasswordField },
  data () {
    return {
      username: undefined,
      displayName: undefined,
      email: undefined,
      origpass: undefined,
      newpass: undefined,
      repeatpass: undefined,
    }
  },
}
</script>

<style scoped>

</style>
