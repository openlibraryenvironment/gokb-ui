<template>
  <gokb-page
    title="Benutzer hinzufügen"
    @submit="add"
  >
    <gokb-section sub-title="Allgemein">
      <v-row>
        <v-col md="4">
          <gokb-username-field
            v-model="username"
            hide-icon
            autocomplete="off"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col md="4">
          <gokb-password-field
            v-model="password"
            label="Kennwort"
            hide-icon
            autocomplete="off"
          />
        </v-col>
        <v-col md="3">
          <gokb-checkbox-field
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
          <gokb-checkbox-field
            v-model="active"
            label="Aktiv"
          />
        </v-col>
        <v-col md="1">
          <gokb-checkbox-field
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
    <!--    <gokb-section sub-title="Rollen">-->
    <!--      <template #buttons>-->
    <!--        <gokb-button-->
    <!--          class="mr-4"-->
    <!--          icon-id="add"-->
    <!--          @click.native="showAddNewRole"-->
    <!--        >-->
    <!--          Hinzufügen-->
    <!--        </gokb-button>-->
    <!--        <gokb-button-->
    <!--          icon-id="delete"-->
    <!--          @click.native="deleteSelectedRole"-->
    <!--        >-->
    <!--          Löschen-->
    <!--        </gokb-button>-->
    <!--      </template>-->
    <!--      <gokb-table-->
    <!--        :headers="roleHeaders"-->
    <!--      />-->
    <!--    </gokb-section>-->
    <!--    <gokb-section sub-title="Kuratorengruppen">-->
    <!--      <template #buttons>-->
    <!--        <gokb-button-->
    <!--          class="mr-4"-->
    <!--          icon-id="add"-->
    <!--          @click.native="showAddNewCuratoryGroup"-->
    <!--        >-->
    <!--          Hinzufügen-->
    <!--        </gokb-button>-->
    <!--        <gokb-button-->
    <!--          icon-id="delete"-->
    <!--          @click.native="deleteSelectedCuratoryGroups"-->
    <!--        >-->
    <!--          Löschen-->
    <!--        </gokb-button>-->
    <!--      </template>-->
    <!--      <gokb-table-->
    <!--        :headers="curatoryHeaders"-->
    <!--      />-->
    <!--    </gokb-section>-->
    <template #buttons>
      <v-spacer />
      <gokb-button default>
        Hinzufügen
      </gokb-button>
    </template>
  </gokb-page>
</template>

<script>
  import BaseComponent from '@/shared/base-component'
  import loading from '@/shared/models/loading'
  import userServices from '@/shared/services/user-services'

  export default {
    name: 'AddUserView',
    extends: BaseComponent,
    data () {
      return {
        username: undefined,
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
      async add () {
        loading.startLoading()
        await this.catchError({
          promise: userServices.createUser({
            username: this.username,
            password: this.password,
            email: this.email,
          }, this.cancelToken.token),
          instance: this
        })
        loading.stopLoading()
        this.$router.go(-1)
      }
    }
  }
</script>
