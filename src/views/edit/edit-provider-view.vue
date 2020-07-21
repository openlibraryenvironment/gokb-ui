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
    async created () {
      if (this.isEdit) {
        const {
          data: {
            //  data: {
            name,
            source,
            homepage,
            _embedded: {
              curatoryGroups,
              ids,
              variantNames
            },
            _links: {
              update: { href: updateUserUrl },
            },
            //  }
          }
        } = await this.catchError({
          promise: providerServices.getProvider(this.id, this.cancelToken.token),
          instance: this
        })
        console.log(updateUserUrl)
        this.name = name
        this.source = source
        this.reference = homepage
        this.ids = ids
        this.allAlternateNames = variantNames.map(variantName => ({ ...variantName, isDeletable: true }))
        this.allCuratoryGroups = curatoryGroups.map(group => ({ ...group, isDeletable: true }))
      }
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      async update () {
        const data = {
          id: this.id,
          name: this.username,
          source: this.source,
          reference: this.reference,
          ids: this.ids,
          alternateNames: this.allAlternateNames.map(({ name }) => name),
          curatoryGroupIds: this.allCuratoryGroups.map(({ id }) => id),
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
