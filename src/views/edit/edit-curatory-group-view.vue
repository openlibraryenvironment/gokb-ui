
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
              v-model="active.curatoryGroupName"
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

          </v-col>
          <v-col>

          </v-col>
        </v-row>
      </gokb-section>

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

  export default {
    name: 'EditCuratoryGroupView',
    components: {
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
          curatoryGroupName: undefined,
          email: undefined,
          description: undefined,
        },
        active: {
          curatoryGroupName: undefined,
          email: undefined,
          description: undefined,
        }
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
    methods: {
      async fetch () {
        const response = await this.catchError({
          promise: curatoryGroupServices.get(this.id, this.cancelToken.token),
          instance: this
        })

        if (response?.status === 200) {
          console.log("11111 ", response)
          this.persisted.curatoryGroupName = response.data.data.name
          this.persisted.email = response.data.data.email
          this.persisted.description = response.data.data.description

          this.active = this.persisted
        }

        const resMembers = await this.catchError({
          promise: userServices.getAllMembersofCG(this.id, this.cancelToken.token),
          instance: this
        })

        console.log("2222 ", resMembers.data)
      },
    }
  }
</script>
