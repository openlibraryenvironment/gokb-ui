<template>
  <gokb-page
    :title="title"
    @submit="update"
  >
    <gokb-error-component :value="error" />
    <gokb-section sub-title="Allgemein">
      <v-row>
        <v-col md="4">
          <gokb-text-field
            v-model="name"
            label="Name"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col md="4">
          <gokb-search-source-field
            v-model="source"
          />
        </v-col>
        <v-col md="4">
          <gokb-text-field
            v-model="reference"
            label="Referenz"
          />
        </v-col>
      </v-row>
    </gokb-section>
    <gokb-identifier-section
      v-model="ids"
    />
    <gokb-alternate-names-section
      v-model="allAlternateNames"
    />
    <gokb-curatory-group-section
      v-model="allCuratoryGroups"
      sub-title="Kuratoren"
    />
    <template #buttons>
      <v-spacer />
      <gokb-button
        text
        @click="pageBack"
      >
        Abbrechen
      </gokb-button>
      <gokb-button
        default
      >
        {{ updateButtonText }}
      </gokb-button>
    </template>
  </gokb-page>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import GokbErrorComponent from '@/shared/components/complex/gokb-error-component'
  import GokbCuratoryGroupSection from '@/shared/components/complex/gokb-curatory-group-section'
  import GokbAlternateNamesSection from '@/shared/components/complex/gokb-alternate-names-section'
  import providerServices from '@/shared/services/provider-services'

  export default {
    name: 'EditProviderView',
    components: { GokbErrorComponent, GokbCuratoryGroupSection, GokbAlternateNamesSection },
    extends: BaseComponent,
    props: {
      id: {
        type: Number,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        name: undefined,
        source: undefined,
        reference: undefined,
        ids: [],
        allAlternateNames: [],
        allCuratoryGroups: [],
      }
    },
    computed: {
      isEdit () {
        return !!this.id
      },
      title () {
        return this.isEdit ? 'Provider bearbeiten' : 'Provider hinzufügen'
      },
      updateButtonText () {
        return this.id ? 'Aktualisieren' : 'Hinzufügen'
      }
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      addNewRole ({ id, name }) {
        // console.log('addNewRole', id, name)
        !this.allRoles.find(({ id: idInAll }) => id === idInAll) && !this.addedRoles.find(({ id: idInAll }) => id === idInAll) && this.addedRoles.push({ id, name, isDeletable: true })
      },
      showAddNewRole () {
        this.addRolePopupVisible = true
      },
      async update () {
        const data = {
          id: this.id,
          username: this.username,
          password: this.password,
          email: this.email,
          accountLocked: this.accountLocked,
          enabled: this.enabled,
          passwordExpired: this.passwordExpired,
          roleIds: this.roles.map(({ id }) => id),
          curatoryGroupIds: this.allCuratoryGroups.map(({ id }) => id),
          organisation: this.organisation
        }
        const response = await this.catchError({
          promise: providerServices.createOrUpdateProvider(data, this.cancelToken.token),
          instance: this
        })
        // todo: check error code
        if (response.status === 200) {
          this.pageBack()
        }
      },
      pageBack () {
        this.$router.go(-1)
      },
    }
  }
</script>
