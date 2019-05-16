<template>
  <gokb-page title="Profil">
    <gokb-section title="Allgemein">
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
// import accountServices from '@/shared/services/account-services'
import GokbPage from '@/shared/components/complex/PageComponent'
import GokbTable from '@/shared/components/complex/TableComponent'
import GokbSection from '@/shared/components/complex/SectionComponent'
import GokbButton from '@/shared/components/base/ButtonComponent'
import GokbEmailField from '@/shared/components/simple/EmailFieldComponent'
import GokbPasswordField from '@/shared/components/simple/PasswordFieldComponent'

export default {
  name: 'ProfileComponent',
  components: { GokbPage, GokbSection, GokbTable, GokbEmailField, GokbButton, GokbPasswordField },
  data () {
    return {
      email: undefined,
      origpass: undefined,
      newpass: undefined,
      repeatpass: undefined,
    }
  },
  created () {
    // accountServices
  }
}
</script>

<style scoped>

</style>
