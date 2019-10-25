<template>
  <gokb-page
    title="Benutzer hinzufügen"
    @submit="add"
  >
    <gokb-section sub-title="Allgemein">
      <gokb-select-field placeholder="Benutzername" />
      <gokb-password-field
        v-model="password"
        label="Kennwort"
        hide-icon
      />
      <gokb-checkbox
        v-model="outdated"
        label="Kennwort abgelaufen"
      />
      <gokb-email-field
        v-model="email"
        hide-icon
      />
      <gokb-checkbox
        v-model="active"
        label="Aktiv"
      />
      <gokb-checkbox
        v-model="locked"
        label="Gesperrt"
      />
      <gokb-select-field placeholder="Organisation" />
    </gokb-section>
    <gokb-section sub-title="Rollen">
      <template #buttons>
        <gokb-button
          class="mr-4"
          icon="add"
          @click.native="showAddNewRole"
        >
          Hinzufügen
        </gokb-button>
        <gokb-button
          icon="delete"
          @click.native="deleteSelectedRole"
        >
          Löschen
        </gokb-button>
      </template>
      <gokb-table
        :headers="roleHeaders"
      />
    </gokb-section>
    <gokb-section sub-title="Kuratorengruppen">
      <template #buttons>
        <gokb-button
          class="mr-4"
          icon="add"
          @click.native="showAddNewCuratoryGroup"
        >
          Hinzufügen
        </gokb-button>
        <gokb-button
          icon="delete"
          @click.native="deleteSelectedCuratoryGroups"
        >
          Löschen
        </gokb-button>
      </template>
      <gokb-table
        :headers="curatoryHeaders"
      />
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
  import GokbCheckbox from '@/shared/components/base/checkbox-component'
  import GokbTable from '@/shared/components/complex/table-component'

  export default {
    name: 'AddUser',
    components: {
      GokbPage,
      GokbSection,
      GokbButton,
      GokbSelectField,
      GokbEmailField,
      GokbPasswordField,
      GokbCheckbox,
      GokbTable,
    },
    data () {
      return {
        password: undefined,
        outdated: undefined,
        email: undefined,
        active: undefined,
        locked: undefined,
        roleHeaders: [
          {
            text: 'Rolle',
            align: 'left',
            sortable: false,
            value: 'role'
          },
        ],
        curatoryHeaders: [
          {
            text: 'Gruppe',
            align: 'left',
            sortable: false,
            value: 'group'
          },
        ]
      }
    },
    methods: {
      add () {
      }
    }
  }
</script>

<style scoped>
</style>
