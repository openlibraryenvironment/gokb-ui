<template>
  <gokb-page
    :title="title"
    @submit="update"
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
            v-model="passwordExpired"
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
            v-model="enabled"
            label="Aktiv"
          />
        </v-col>
        <v-col md="1">
          <gokb-checkbox-field
            v-model="accountLocked"
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
      <gokb-button
        text
        @click.native="pageBack"
      >
        Abbrechen
      </gokb-button>
      <gokb-button default>
        {{ updateButtonText }}
      </gokb-button>
    </template>
  </gokb-page>
</template>

<script>
  import BaseComponent from '@/shared/base-component'
  import loading from '@/shared/models/loading'
  import userServices from '@/shared/services/user-services'

  export default {
    name: 'EditUserView',
    extends: BaseComponent,
    data () {
      return {
        username: undefined,
        password: undefined,
        passwordExpired: undefined,
        email: undefined,
        enabled: undefined,
        accountLocked: undefined,
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
    computed: {
      id () {
        return this.$route.params?.id
      },
      isEdit () {
        return !!this.id
      },
      title () {
        return this.isEdit ? 'Benutzer bearbeiten' : 'Benutzer hinzufügen'
      },
      updateButtonText () {
        return this.id ? 'Aktualisieren' : 'Hinzufügen'
      }
    },
    async created () {
      if (this.isEdit) {
        loading.startLoading()
        const { data: { data: { username, email, accountLocked, enabled, passwordExpired } } } = await this.catchError({
          promise: userServices.getUser(this.id, this.cancelToken.token),
          instance: this
        })
        this.username = username
        this.password = undefined
        this.email = email
        this.accountLocked = accountLocked
        this.enabled = enabled
        this.passwordExpired = passwordExpired
        loading.stopLoading()
      }
    },
    methods: {
      async update () {
        loading.startLoading()
        const data = {
          id: this.id,
          username: this.username,
          password: this.password,
          email: this.email,
          accountLocked: this.accountLocked,
          enabled: this.enabled,
          passwordExpired: this.passwordExpired
        }
        await this.catchError({
          promise: userServices.createOrUpdateUser(data, this.cancelToken.token),
          instance: this
        })
        loading.stopLoading()
        this.pageBack()
      },
      pageBack () {
        this.$router.go(-1)
      }
    }
  }
</script>
