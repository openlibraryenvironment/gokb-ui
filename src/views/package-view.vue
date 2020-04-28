<template>
  <v-container>
    <v-toolbar tabs>
      <v-toolbar-title>
        {{ providerName }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn>
        <v-icon left>
          archive
        </v-icon>
        Archivieren
      </v-btn>
      <v-btn>
        <v-icon left>
          delete
        </v-icon>
        Löschen
      </v-btn>

      <v-tabs
        slot="extension"
        v-model="tab"
        align-with-title
      >
        <v-tab
          v-for="item in items"
          :key="item.name"
        >
          <v-icon left>
            {{ item.icon }}
          </v-icon>
          {{ item.name }}
        </v-tab>
      </v-tabs>
    </v-toolbar>

    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="item in items"
        :key="item.name"
      >
        <v-card flat>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">
                Allgemein
              </h3>
              <div> {{ card_text }}</div>
            </div>
          </v-card-title>
          <v-card-text>{{ text }}</v-card-text>
        </v-card>
        <v-card flat>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">
                Identifier
              </h3>
              <div> {{ card_text }}</div>
            </div>
            <v-spacer />
            <v-btn>Hinzufügen</v-btn>
            <v-btn>Löschen</v-btn>
          </v-card-title>
          <v-card-text>{{ text }}</v-card-text>
        </v-card>
        <v-card flat>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">
                Alternative Namen
              </h3>
              <div> {{ card_text }}</div>
            </div>
          </v-card-title>
          <v-card-text>{{ text }}</v-card-text>
        </v-card>
        <v-card flat>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">
                Kuratoren
              </h3>
              <div> {{ card_text }}</div>
            </div>
          </v-card-title>
          <v-card-text>{{ text }}</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>

  export default {
    name: 'PackageComponent',
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    data () {
      return {
        tab: null,
        items: [
          { name: 'Allgemein', icon: 'description' }, { name: 'Pakete', icon: 'view_module' }, {
            name: 'Titel',
            icon: 'book'
          },
        ],
        text: 'Inhalt',
        providerName: 'undefined',
      }
    },
    mounted () {
      // console.log(this.id)
      // resourceServices.show({ oid: this.id, withCombos: true }).then(result => console.log(result))
    }
  }
</script>

<style scoped>

</style>
