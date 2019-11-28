<template>
  <gokb-page
    title="Benutzer hinzufügen"
    @submit="add"
  >
    <gokb-section sub-title="Allgemein">
      <v-row>
        <v-col md="4">
          <gokb-username-field
            hide-icon
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col md="4">
          <gokb-password-field
            v-model="password"
            label="Kennwort"
            hide-icon
          />
        </v-col>
        <v-col md="3">
          <gokb-checkbox
            v-model="outdated"
            label="Kennwort abgelaufen"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col md="4">
          <gokb-email-field
            v-model="email"
            hide-icon
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col md="1">
          <gokb-checkbox
            v-model="active"
            label="Aktiv"
          />
        </v-col>
        <v-col md="1">
          <gokb-checkbox
            v-model="locked"
            label="Gesperrt"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col md="4">
          <gokb-select-field label="Organisation" />
        </v-col>
      </v-row>
    </gokb-section>
    <gokb-section sub-title="Rollen">
      <template #buttons>
        <gokb-button
          class="mr-4"
          icon-id="add"
          @click.native="showAddNewRole"
        >
          Hinzufügen
        </gokb-button>
        <gokb-button
          icon-id="delete"
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
          icon-id="add"
          @click.native="showAddNewCuratoryGroup"
        >
          Hinzufügen
        </gokb-button>
        <gokb-button
          icon-id="delete"
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
  export default {
    name: 'AddUser',
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
