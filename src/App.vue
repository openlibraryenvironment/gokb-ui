<template>
  <v-app>
    <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.mdAndUp"
      app
      v-model="drawer"
    >
      <v-list dense>
        <template v-for="(item, index) in items">
          <v-list-tile v-if="item.text" @click="" :key="item.text">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider v-else :key="index"></v-divider>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      color="#4f4f4f"
      dark
      app
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      fixed
    >
      <v-toolbar-title style="width: 300px" class="">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">GOKB Client</span>
      </v-toolbar-title>
      <v-text-field
        flat
        solo-inverted
        prepend-icon="search"
        label="Titel, Pakete, Verlage"
        class="hidden-sm-and-down"
      ></v-text-field>
      <v-spacer></v-spacer>

      <v-menu offset-y open-on-hover>
        <span slot="activator">
          <v-btn color="#F2994A">
            <v-icon>add</v-icon>
            Paket anlegen
            <v-icon>keyboard_arrow_down</v-icon>
          </v-btn>
        </span>
        <v-list>
          <v-list-tile @click.stop="">
            <v-list-tile-avatar>
              <v-icon>create_new_folder</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-title>Paket anlegen</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click.stop="">
            <v-list-tile-avatar>
              <v-icon>library_add</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-title>Einzeltitel anlegen</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click.stop="">
            <v-list-tile-avatar>
              <v-icon>folder_special</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-title>KBART Import</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <v-btn icon>
        <v-icon>person</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
        </v-layout>
      </v-container>
    </v-content>

    <v-dialog v-model="dialog" width="800px">
      <v-card>
        <v-card-title
          class="grey lighten-4 py-4 title"
        >
          Create contact
        </v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs12 align-center justify-space-between>
              <v-layout align-center>
                <v-avatar size="40px" class="mr-3">
                  <img
                    src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png"
                    alt=""
                  >
                </v-avatar>
                <v-text-field
                  placeholder="Name"
                ></v-text-field>
              </v-layout>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                prepend-icon="business"
                placeholder="Company"
              ></v-text-field>
            </v-flex>
            <v-flex xs6>
              <v-text-field
                placeholder="Job title"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                prepend-icon="mail"
                placeholder="Email"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                type="tel"
                prepend-icon="phone"
                placeholder="(000) 000 - 0000"
                mask="phone"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field
                prepend-icon="notes"
                placeholder="Notes"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-btn flat color="primary">More</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="dialog = false">Cancel</v-btn>
          <v-btn flat @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data: () => ({
    dialog: false,
    drawer: null,
    items: [
      { icon: 'create_new_folder', text: 'Paket anlegen' },
      { icon: 'library_add', text: 'Einzeltitel anlegen' },
      { icon: 'folder_special', text: 'KBART Import' },
      {},
      { icon: 'folder', text: 'Pakete' },
      { icon: 'library_books', text: 'Einzeltitel' },
      { icon: 'rate_review', text: 'Reviews' },
      { icon: 'keyboard', text: 'Pflege' },
      { icon: 'people', text: 'Benutzer' }
    ]
  })
}
</script>
