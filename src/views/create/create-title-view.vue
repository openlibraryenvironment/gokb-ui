<template>
  <gokb-page
    title="Einzeltitel anlegen"
    @submit="createTitle"
  >
    <gokb-select-field
      class="ml-4"
      label="Journal"
    />
    <gokb-section
      sub-title="Identifier"
    >
      <gokb-select-field label="ISSN" />
    </gokb-section>
    <gokb-section sub-title="Allgemein">
      <gokb-text-field label="Titel" />
      <v-row>
        <v-col>
          <gokb-number-field label="Band" />
        </v-col>
        <v-col>
          <gokb-number-field label="Auflage" />
        </v-col>
        <v-col>
          <gokb-text-field label="Merkmal (Auflage)" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <gokb-date-field label="Veröffentlichungsdatum (Druck)" />
        </v-col>
        <v-col>
          <gokb-date-field label="Veröffentlichungsdatum (Online)" />
        </v-col>
      </v-row>
      <gokb-textarea-field label="Zusammenfassung" />
      <gokb-text-field label="Buch Cover" />
    </gokb-section>
    <gokb-section sub-title="Impressum">
      <gokb-select-field label="Impressum" />
      <gokb-select-field label="Zugeordnete Organisation" />
    </gokb-section>
    <gokb-section sub-title="Publisher">
      <template #buttons>
        <gokb-button @click="showAddNewPublisher">
          Hinzufügen
        </gokb-button>
        <gokb-button @click="deleteSelectedPublisher">
          Löschen
        </gokb-button>
      </template>
      <gokb-table
        :added-items="addedPublisher"
        :deleted-items="deletedPublisher"
        :headers="publisherTableHeaders"
        :items="publisher"
        :selected-items="selectedPublisher"
      />
    </gokb-section>
    <gokb-section sub-title="Pflege">
      <gokb-select-field label="Tunus" />
      <gokb-date-field
        disabled
        label="Fällig am"
      />
    </gokb-section>
    <template #buttons>
      <gokb-button
        text
        @click="cancelTitle"
      >
        Abbrechen
      </gokb-button>
      <v-spacer />
      <gokb-button
        @click="createTitle"
      >
        Hinzufügen
      </gokb-button>
    </template>
  </gokb-page>
</template>

<script>
  import { HOME_ROUTE } from '@/router/route-paths'

  export default {
    name: 'CreateTitle',
    data () {
      return {
        publisher: undefined,
        selectedPublisher: [],
        deletedPublisher: [],
        addedPublisher: [],
        publisherTableHeaders: [
          { text: 'Name', align: 'left', value: 'name', sortable: false, width: '100%' },
          { text: 'Quelle', align: 'left', value: 'source', sortable: false, width: '100%' },
        ],
      }
    },
    methods: {
      cancelTitle () {
        this.$router.push(HOME_ROUTE)
      },
      createTitle () {
        console.log('createTitle')
      }
    }
  }
</script>
