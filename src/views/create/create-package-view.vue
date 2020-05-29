<template>
  <gokb-page
    title="Paket anlegen"
    @submit="createPackage"
  >
    <v-stepper
      v-model="step"
      alt-labels
    >
      <v-stepper-header>
        <v-stepper-step
          editable
          :step="1"
        >
          Allgemein
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          editable
          :step="2"
        >
          Organisation und Plattform
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          editable
          :step="3"
        >
          Titel im Paket
        </v-stepper-step>
        <v-divider />
        <v-stepper-step
          editable
          :step="4"
        >
          Zusammenfassung
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content :step="1">
          <gokb-section
            title="Allgemein"
            sub-title="Paket"
          >
            <gokb-text-field
              v-model="title"
              label="Titel"
            />
            <gokb-search-source-field
              v-model="source"
            />
            <gokb-url-field
              v-model="url"
            />
            <gokb-textarea-field
              v-model="description"
              label="Beschreibung"
            />
            <gokb-scope-field
              v-model="scope"
            />
            <gokb-radiobutton-group>
              <gokb-radiobutton-field
                v-model="global"
                label="Konsortial"
              />
              <gokb-radiobutton-field
                v-model="global"
                label="Global"
              />
              <gokb-radiobutton-field
                v-model="global"
                label="Regional"
              />
              <gokb-radiobutton-field
                v-model="global"
                label="Unbekannt"
              />
            </gokb-radiobutton-group>
            <v-row>
              <gokb-checkbox-field
                v-model="consistent"
                class="ml-3"
                label="Paketinhalt ist konsistent"
              />
              <gokb-checkbox-field
                v-model="breakable"
                class="ml-3"
                label="Teilbar für Lizenznehmer"
              />
              <gokb-checkbox-field
                v-model="fixed"
                class="ml-3"
                label="Paket ist unveränderbar"
              />
            </v-row>
          </gokb-section>
          <gokb-section
            expandable
            sub-title="Identifier"
          >
            <gokb-add-item-popup
              v-if="addIdentifierPopupVisible"
              v-model="addIdentifierPopupVisible"
              :component="{ type: 'GokbIdentifierField', name: 'Identifier' }"
              @add="addNewIdentifier"
            />
            <template #buttons>
              <gokb-button
                icon-id="add"
                @click.native="showAddIdentifierPopup"
              >
                Identifier hinzufügen
              </gokb-button>
            </template>
            <gokb-identifier-field
              v-for="(identifier, i) of identifiers"
              :key="identifier.id"
              v-model="identifiers[i]"
              namespace-fixed
              deleteable
            />
          </gokb-section>
        </v-stepper-content>

        <v-stepper-content :step="2">
          <gokb-section
            title="Organisation"
            sub-title="Allgemein"
          >
            <gokb-search-provider-field
              v-model="provider"
              label="Name"
            />
            <gokb-select-field
              v-model="source"
              label="Quelle"
            />
            <gokb-text-field
              v-model="reference"
              label="Referenz"
            />
          </gokb-section>
          <gokb-section
            expandable
            sub-title="Identifier"
          >
            <template #buttons>
              <gokb-button
                icon-id="add"
              >
                Identifier hinzufügen
              </gokb-button>
            </template>
          </gokb-section>
          <gokb-section sub-title="Alternative Namen">
            <template #buttons>
              <gokb-button
                icon-id="add"
                class="mr-4"
              >
                Hinzufügen
              </gokb-button>
              <gokb-button
                icon-id="delete"
              >
                Löschen
              </gokb-button>
            </template>
            <gokb-table
              :show-select="false"
              :headers="alternativeNamesHeader"
              :items="alternativeNames"
            />
          </gokb-section>
          <gokb-section sub-title="Kuratoren">
            <template #buttons>
              <gokb-button
                icon-id="add"
                class="mr-4"
              >
                Hinzufügen
              </gokb-button>
              <gokb-button
                icon-id="delete"
              >
                Löschen
              </gokb-button>
            </template>
            <gokb-table
              :show-select="false"
              :headers="curatoriesHeader"
              :items="curatories"
            />
          </gokb-section>
          <gokb-section title="Plattform">
            <gokb-select-field label="Name" />
            <gokb-select-field label="Quelle" />
            <gokb-select-field label="Url" />
            <gokb-checkbox-field label="Gleicher Provider wie oben" />
            <gokb-select-field label="Provider" />
          </gokb-section>
        </v-stepper-content>

      <!--        <v-stepper-content :step="3">-->
      <!--          <gokb-add-title-popup-->
      <!--            v-if="addTitlePopupVisible"-->
      <!--            v-model="addTitlePopupVisible"-->
      <!--            @add="addNewTitle"-->
      <!--          />-->
      <!--          <gokb-kbart-import-popup-->
      <!--            v-if="kbartImportPopupVisible"-->
      <!--            v-model="kbartImportPopupVisible"-->
      <!--          />-->
      <!--          <gokb-section sub-title="Titel">-->
      <!--            <template #buttons>-->
      <!--              <gokb-button-->
      <!--                class="mr-4"-->
      <!--                @click.native="showKbartImportPopup"-->
      <!--              >-->
      <!--                KBART Import-->
      <!--              </gokb-button>-->
      <!--              <gokb-button-->
      <!--                icon-id="add"-->
      <!--                class="mr-4"-->
      <!--                @click.native="showAddNewTitlePopup"-->
      <!--              >-->
      <!--                Hinzufügen-->
      <!--              </gokb-button>-->
      <!--              <gokb-button-->
      <!--                icon-id="delete"-->
      <!--              >-->
      <!--                Löschen-->
      <!--              </gokb-button>-->
      <!--            </template>-->
      <!--            <gokb-table-->
      <!--              :show-select="false"-->
      <!--              :headers="titlesHeader"-->
      <!--              :items="titles"-->
      <!--            />-->
      <!--          </gokb-section>-->
      <!--        </v-stepper-content>-->

      <!--        <v-stepper-content :step="4">-->
      <!--          <gokb-section sub-title="Zusammenfassung">-->
      <!--            <v-row>-->
      <!--              <v-col>-->
      <!--                <gokb-text-field-->
      <!--                  v-model="title"-->
      <!--                  label="Titel"-->
      <!--                  disabled-->
      <!--                />-->
      <!--              </v-col>-->
      <!--              <v-col>-->
      <!--                <gokb-text-field-->
      <!--                  v-model="description"-->
      <!--                  label="Beschreibung"-->
      <!--                  disabled-->
      <!--                />-->
      <!--              </v-col>-->
      <!--            </v-row>-->
      <!--            <v-row>-->
      <!--              <v-col>-->
      <!--                <gokb-text-field-->
      <!--                  v-model="plattform"-->
      <!--                  label="Plattform"-->
      <!--                  disabled-->
      <!--                />-->
      <!--              </v-col>-->
      <!--              <v-col>-->
      <!--                <gokb-text-field-->
      <!--                  v-model="numberOfTitles"-->
      <!--                  label="Anzahl Titel im Paket"-->
      <!--                  disabled-->
      <!--                />-->
      <!--              </v-col>-->
      <!--            </v-row>-->
      <!--            <gokb-text-field-->
      <!--              v-model="organisation"-->
      <!--              label="Organisation"-->
      <!--              disabled-->
      <!--            />-->
      <!--          </gokb-section>-->
      <!--          <gokb-section sub-title="Pflege">-->
      <!--            <gokb-select-field label="Tunus" />-->
      <!--            <gokb-text-field-->
      <!--              label="Fällig am"-->
      <!--              disabled-->
      <!--            />-->
      <!--          </gokb-section>-->
      <!--          <gokb-section sub-title="Kuratoren">-->
      <!--            <template #buttons>-->
      <!--              <gokb-button @click.native="showAddNewCuratoryGroup">-->
      <!--                Hinzufügen-->
      <!--              </gokb-button>-->
      <!--              <gokb-button @click.native="deleteSelectedCuratoryGroups">-->
      <!--                Löschen-->
      <!--              </gokb-button>-->
      <!--            </template>-->
      <!--            <gokb-table-->
      <!--              :added-items="addedCuratoryGroups"-->
      <!--              :deleted-items="deletedCuratoryGroups"-->
      <!--              :headers="curatoryGroupsTableHeaders"-->
      <!--              :items="curatoryGroups"-->
      <!--              :selected-items="selectedCuratoryGroups"-->
      <!--            />-->
      <!--          </gokb-section>-->
      <!--        </v-stepper-content>-->
      </v-stepper-items>
    </v-stepper>

    <template #buttons>
      <gokb-button
        v-show="step !== 1"
        @click.native="go2PreviousStep"
      >
        Zurück
      </gokb-button>
      <v-spacer />
      <gokb-button
        v-if="step !== 4"
        default
        @click.native="go2NextStep"
      >
        Weiter
      </gokb-button>
      <gokb-button
        v-else
        default
        @click.native="go2NextStep"
      >
        Hinzufügen
      </gokb-button>
    </template>
  </gokb-page>
</template>

<script>
  // import GokbSearchProviderField from '@/shared/components/simple/gokb-search-provider-field'
  import GokbScopeField from '@/shared/components/simple/gokb-scope-field'
  import GokbUrlField from '@/shared/components/simple/gokb-url-field'
  import GokbSearchSourceField from '@/shared/components/simple/gokb-search-source-field'
  import GokbAddItemPopup from '@/shared/popups/gokb-add-item-popup'
  // import GokbAddTitlePopup from '@/shared/popups/gokb-add-title-popup'
  // import GokbKbartImportPopup from '@/shared/popups/gokb-kbart-import-popup'

  export default {
    name: 'CreatePackage',
    components: {
      // GokbSearchProviderField,
      GokbScopeField,
      GokbUrlField,
      GokbSearchSourceField,
      // GokbAddTitlePopup,
      GokbAddItemPopup,
      // GokbKbartImportPopup
    },
    data () {
      return {
        addIdentifierPopupVisible: false,
        kbartImportPopupVisible: false,
        step: 1,
        title: undefined,
        source: undefined,
        url: undefined,
        description: undefined,
        scope: undefined,
        global: undefined,
        consistent: undefined,
        breakable: undefined,
        fixed: undefined,
        identifiers: [{ id: 42, namespace: { id: 42, name: 'issn' }, value: '1231' }],
        provider: undefined,
        alternativeNamesHeader: [
          {
            text: 'Alias',
            align: 'left',
            sortable: false,
            value: 'alias'
          },
        ],
        alternativeNames: [],
        curatoriesHeader: [
          {
            text: 'Gruppe',
            align: 'left',
            sortable: false,
            value: 'group'
          },
        ],
        curatories: [],
        addTitlePopupVisible: false,
        titlesHeader: [
          {
            text: 'Titel',
            align: 'left',
            sortable: false,
            value: 'title'
          },
          {
            text: 'Plattform',
            align: 'left',
            sortable: false,
            value: 'platform'
          },
        ],
        titles: [],

        curatoryGroups: undefined,
        selectedCuratoryGroups: [],
        deletedCuratoryGroups: [],
        addedCuratoryGroups: [],
        curatoryGroupsTableHeaders: [
          { text: 'Gruppe', align: 'left', value: 'name', sortable: false, width: '100%' },
        ]
      }
    },
    methods: {
      showAddIdentifierPopup () {
        this.addIdentifierPopupVisible = true
      },
      addNewIdentifier () {
        console.log('addNewIdentifier called')
      },
      go2NextStep () {
        this.step < 4 && this.step++
      },
      go2PreviousStep () {
        this.step > 1 && this.step--
      },
      showAddNewTitlePopup () {
        this.addTitlePopupVisible = true
      },
      showKbartImportPopup () {
        this.kbartImportPopupVisible = true
      },
      addNewTitle () {
        console.log('addNewTitle')
      },
      createPackage () {
        console.log('create package')
      }
    }
  }
</script>

<style scoped>
</style>
