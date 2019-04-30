<template>
  <gokb-page title="Profil">
    <gokb-section title="Allgemein">
      <gokb-email-field v-model="email"></gokb-email-field>
    </gokb-section>
    <gokb-section title="Kennwort">
      <gokb-password-field label="Bisheriges Kennwort" v-model="currentPassword"/>
      <gokb-password-field label="Neues Kennwort" v-model="newPassword"/>
      <gokb-password-field label="Neues Kennwort (Wiederholung)" v-model="newPasswordRepeated"/>
    </gokb-section>
    <gokb-section title="Kuratorengruppen">
    </gokb-section>
  </gokb-page>
</template>

<script>
import GokbPage from '@/shared/components/complex/PageComponent'
import GokbSection from '@/shared/components/complex/SectionComponent'
import GokbEmailField from '@/shared/components/base/EmailFieldComponent'
import GokbPasswordField from '@/shared/components/base/PasswordFieldComponent'
export default {
  name: 'ProfileComponent',
  components: { GokbPage, GokbSection, GokbEmailField, GokbPasswordField },
  data () {
    return {
      email: undefined,
      currentPassword: undefined,
      newPassword: undefined,
      newPasswordRepeated: undefined,
    }
  },
}
</script>

<style scoped>

</style>
