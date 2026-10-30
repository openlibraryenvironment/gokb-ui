
<template>
  <div>
    <v-snackbar v-model="showSnackbar" :color="messageColor" :timeout="currentSnackBarTimeout">
      {{ snackbarMessage }}
      <template #actions>
        <v-icon @click="showSnackbar = false" color="white">mdi-close</v-icon>
      </template>
    </v-snackbar>
    <gokb-page
      v-if="accessible && !notFound"

      title="Kuratorengruppe bearbeiten"
    >

      <gokb-section :sub-title="$t('component.general.general')">
        <v-row>
          <v-col
            class="pt-8"
            md="4"
          >
            <gokb-text-field
              v-model="active.name"
              label="Kuratorengruppe"
              hide-icon
              autocomplete="off"
              dense
            />
          </v-col>
          <v-col>
            <gokb-email-field
              v-model="active.email">
            </gokb-email-field>
          </v-col>
          <v-col>
            <!-- OWNER -->
            <gokb-select-field
              v-if="members"
              v-model="active.owner"
              label="Group Owner"
              class="ml-4"
              :static-items="members"
              :init-item="active.owner"
            >
            </gokb-select-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <gokb-textarea-field
              v-model="active.description"
              label="Beschreibung"
              rows="2"
            ></gokb-textarea-field>
          </v-col>
          <v-col>
            <gokb-state-field
              v-model="active.organizationType"
              :init-item="active.organizationType"
              url="refdata/categories/CuratoryGroup.OrganizationType"
              :label="$t('component.curatoryGroup.organisationType.label')"
              message-path="component.curatoryGroup.organisationType"
            />
          </v-col>
          <v-col>
            <gokb-state-field
              v-model="active.status"
              :init-item="active.status"
              url="refdata/categories/KBComponent.Status"
              message-path="component.general.status"
              :label="$t('component.general.status.label')"
            />

          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <!-- TYPE -->
          </v-col>
          <v-col>
            <gokb-state-field
              v-model="active.editStatus"
              :init-item="active.editStatus"
              url="refdata/categories/KBComponent.EditStatus"
              message-path="component.general.editStatus"
              :label="$t('component.general.editStatus.label')"
            />
          </v-col>
        </v-row>
      </gokb-section>

     <gokb-users-section
       v-if="members"
       :users="members"
     >

     </gokb-users-section>

    </gokb-page>
  </div>
</template>

<script>
  import BaseComponent from "../../shared/components/base-component.js";
  import curatoryGroupServices from '@/shared/services/curatory-group-services'
  import userServices from '@/shared/services/user-services'
  import account from '@/shared/models/account-model'
  import GokbEmailField from "../../shared/components/simple/gokb-email-field/index.js";
  import GokbTextareaField from "../../shared/components/base/gokb-textarea-field/index.js";
  import GokbSelectField from "../../shared/components/base/gokb-select-field/index.js";
  import GokbSection from "../../shared/components/complex/gokb-section/index.js";
  import GokbTable from "../../shared/components/complex/gokb-table/index.js";
  import GokbUsersSection from "../../shared/components/complex/gokb-users-section/index.js";

  export default {
    name: 'EditCuratoryGroupView',
    components: {
      GokbUsersSection,
      GokbTable,
      GokbSection,
      GokbSelectField,
      GokbTextareaField,
      GokbEmailField

    },
    extends: BaseComponent,
    props: {
      id: {
        type: [Number, String],
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        persisted: {
          name: undefined,
          email: undefined,
          description: undefined,
          organizationType: undefined,
          status: undefined,
          editStatus: undefined,
        },
        active: {
          name: undefined,
          email: undefined,
          description: undefined,
          organizationType: undefined,
          status: undefined,
          editStatus: undefined,
        },
        members: undefined
      }
    },
    computed: {
      accessible () {
        return account?.loggedIn() && account?.hasRole('ROLE_ADMIN')
      }
    },
    watch: {

    },
    async created () {
      if (account.loggedIn() && account.hasRole('ROLE_ADMIN')) {
        this.fetch()
      }
    },
    async mounted () {
    },
    methods: {
      async fetch () {
        const response = await this.catchError({
          promise: curatoryGroupServices.get(this.id, this.cancelToken.token),
          instance: this
        })

        if (response?.status === 200) {
          console.log("11111 ", response.data.data)
          this.persisted.name = response.data.data.name
          this.persisted.email = response.data.data.email
          this.persisted.description = response.data.data.description
          this.persisted.organizationType = response.data.data.organizationType
          this.persisted.status = response.data.data.status
          this.persisted.editStatus = response.data.data.editStatus
          this.persisted.owner = response.data.data.owner

          this.active = this.persisted
        }

        const resMembers = await this.catchError({
          promise: userServices.getAllMembersofCG(this.id, this.cancelToken.token),
          instance: this
        })

        console.log("2222 ", resMembers.data)

        this.members = resMembers.data.data.map(({id, username}) => ({id, name: username, type: "User"}))

      },
    }
  }
</script>
