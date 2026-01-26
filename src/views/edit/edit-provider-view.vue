<template>
  <div>
    <v-snackbar v-model="showSnackbar" :color="messageColor" :timeout="currentSnackBarTimeout">
        {{ snackbarMessage }}
        <template #actions>
          <v-icon @click="showSnackbar = false" color="white">mdi-close</v-icon>
        </template>
    </v-snackbar>
    <gokb-page
      ref="titlepage"
      v-if="accessible && !notFound"
      :key="version"
      :title="title"
    >
      <gokb-error-component :value="error" />
      <gokb-section :no-tool-bar="true">
        <v-row>
          <v-col md="12">
            <gokb-name-field
              v-model="allNames"
              :disabled="isReadonly"
              :label="$t('component.general.name')"
              check-dupes="Org"
              :item-id="providerObject.id"
            />
          </v-col>
        </v-row>
        <v-row v-if="id">
          <v-col cols="6">
            <gokb-state-select-field
              v-model="providerObject.status"
              :deletable="isAdmin"
              :editable="isAdmin"
              @delete="markDeleted"
            />
          </v-col>
          <v-col cols="6" xl="3">
            <gokb-uuid-field
              v-if="id"
              :label="$t('component.general.uuid.label')"
              v-model="uuid"
              path="/provider"
              dense
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <gokb-text-field
              v-model="providerObject.preferredShortname"
              :label="$t('component.provider.preferredShortname.label')"
              :disabled="isReadonly"
            />
          </v-col>
          <v-col cols="4">
            <gokb-text-field
              v-model="providerObject.homepage"
              :label="$t('component.provider.homepage.label')"
              :disabled="isReadonly"
            />
          </v-col>
          <v-col cols="3" xl="2">
            <gokb-namespace-field
              v-model="providerObject.titleNamespaceSerial"
              target-type="Journal"
              :readonly="isReadonly"
              :label="$t('component.provider.titleNamespaceSerial.label')"
              exclude-isxn
            />
          </v-col>
          <v-col cols="3" xl="2">
            <gokb-namespace-field
              v-model="providerObject.titleNamespaceMonograph"
              target-type="Book"
              :readonly="isReadonly"
              :label="$t('component.provider.titleNamespaceMonograph.label')"
              exclude-isxn
            />
          </v-col>
          <v-col cols="3" xl="2">
            <gokb-namespace-field
              v-model="providerObject.packageNamespace"
              target-type="Package"
              :readonly="isReadonly"
              :label="$t('component.provider.packageNamespace.label')"
            />
          </v-col>
          <v-col lg="2" />
        </v-row>
      </gokb-section>
      <v-row
        v-if="tabsView"
        :style="{ minHeight:'330px' }"
      >
        <v-col>
          <v-tabs
            v-model="tab"
            class="mx-4"
          >
            <v-tab
              value="roles"
              :active-class="tabClass"
            >
              {{ $tc('component.provider.role.label', 2) }}
              <v-chip class="ma-2">
                {{ allRoles.length }}
              </v-chip>
              <v-icon
                v-if="pendingChanges.roles"
                :title="$t('pending.lists.changed')"
                small
              >
                mdi-alert-decagram
              </v-icon>
              <v-icon
                v-if="!isReadonly"
                v-for="e in errors.roles"
                :title="$t(e.messageCode)"
                color="error"
                small
              >
                mdi-alert-outline
              </v-icon>
            </v-tab>
            <v-tab
              value="platforms"
              :active-class="tabClass"
            >
              {{ $tc('component.platform.label', 2) }}
              <v-chip class="ma-2">
                {{ allPlatforms.length }}
              </v-chip>
              <v-icon
                v-if="pendingChanges.platforms"
                :title="$t('pending.lists.changed')"
                small
              >
                mdi-alert-decagram
              </v-icon>
              <v-icon
                v-if="!isReadonly"
                v-for="e in errors.providedPlatforms"
                :title="$t(e.messageCode)"
                color="error"
                small
              >
                mdi-alert
              </v-icon>
            </v-tab>
            <v-tab
              value="variants"
              :active-class="tabClass"
            >
              {{ $tc('component.variantName.label', 2) }}
              <v-chip class="ma-2">
                {{ allNames.alts.length }}
              </v-chip>
              <v-icon
                v-if="pendingChanges.variants"
                :title="$t('pending.lists.changed')"
                small
              >
                mdi-alert-decagram
              </v-icon>
            </v-tab>
            <v-tab
              value="identifiers"
              :active-class="tabClass"
            >
              {{ $tc('component.identifier.label', 2) }}
              <v-chip class="ma-2">
                {{ providerObject.ids.length }}
              </v-chip>
              <v-icon
                v-if="pendingChanges.ids"
                :title="$t('pending.lists.changed')"
                small
              >
                mdi-alert-decagram
              </v-icon>
            </v-tab>
            <v-tab
              v-if="!!id"
              value="packages"
              :active-class="tabClass"
            >
              {{ $tc('component.package.label', 2) }}
              <v-chip class="ma-2">
                {{ packageCount }}
              </v-chip>
            </v-tab>
            <v-tab
              value="information"
              :active-class="tabClass"
            >
              {{ $t('component.provider.infos.label') }}
            </v-tab>
            <v-tab
              value="curators"
              :active-class="tabClass"
            >
              {{ $tc('component.curatoryGroup.label', 2) }}
              <v-chip class="ma-2">
                {{ allCuratoryGroups.length }}
              </v-chip>
              <v-icon
                v-if="pendingChanges.curators"
                :title="$t('pending.lists.changed')"
                small
              >
                mdi-alert-decagram
              </v-icon>
            </v-tab>
            <v-tab
              value="offices"
              :active-class="tabClass"
            >
              {{ $tc('component.office.label', 2) }}
              <v-chip class="ma-2">
                {{ offices.length }}
              </v-chip>
              <v-icon
                v-if="pendingChanges.offices"
                :title="$t('pending.lists.changed')"
                small
              >
                mdi-alert-decagram
              </v-icon>
            </v-tab>

          </v-tabs>
          <v-window v-model="tab">
            <v-window-item
              value="roles"
              class="mt-4"
            >
              <gokb-org-roles-section
                v-model="allRoles"
                :show-title="false"
                :disabled="isReadonly"
                :api-errors="errors.roles"
                @update="addPendingChange"
              />
            </v-window-item>
            <v-window-item
              value="platforms"
              class="mt-4"
            >
              <gokb-platform-section
                v-model="allPlatforms"
                :show-title="false"
                :disabled="isReadonly"
                :warn-missing-role="!isPlatformProvider"
                :api-errors="errors.providedPlatforms"
                :provider-id="providerObject.id"
                @update="addPendingChange"
              />
            </v-window-item>
            <v-window-item
              value="variants"
              class="mt-4"
            >
              <gokb-alternate-names-section
                v-model="allNames.alts"
                :show-title="false"
                :disabled="isReadonly"
                :api-errors="errors.variantNames"
                @update="addPendingChange"
              />
            </v-window-item>
            <v-window-item
              value="identifiers"
              class="mt-4"
            >
              <gokb-identifier-section
                v-model="providerObject.ids"
                :show-title="false"
                :disabled="isReadonly"
                :api-errors="errors.ids"
                @update="addPendingChange"
              />
            </v-window-item>
            <v-window-item
              v-if="!!id"
              value="packages"
              class="mt-4"
            >
              <gokb-packages-section
                :show-title="false"
                disabled
                :api-errors="errors.providedPackages"
                :provider-id="providerObject.id"
                @update="updatePackageCount"
              />
            </v-window-item>

            <v-window-item
              value="information"
              class="mt-4"
            >
              <gokb-section>
                <v-row>
                  <v-col cols="5"><h3>{{ $t('component.provider.infos.format') }}</h3></v-col>
                  <v-col cols="5"><h3>{{ $t('component.provider.infos.kbartExtension') }}</h3></v-col>
                </v-row>
                <br/>
                <v-row>
                  <v-col cols="5">
                    <gokb-checkbox-field dense
                      v-model="providerObject.supplyKbart"
                      class="ml-3"
                      :label="$t('component.provider.infos.supply.kbart')"
                      :readonly="isReadonly"
                    />

                    <gokb-checkbox-field dense
                      v-model="providerObject.supplyCsv"
                      class="ml-3"
                      :label="$t('component.provider.infos.supply.csv')"
                      :readonly="isReadonly"
                    />

                    <gokb-checkbox-field dense
                      v-model="providerObject.supplyMarc"
                      class="ml-3"
                      :label="$t('component.provider.infos.supply.marc')"
                      :readonly="isReadonly"
                    />

                    <gokb-checkbox-field dense
                      v-model="providerObject.supplyOnix"
                      class="ml-3"
                      :label="$t('component.provider.infos.supply.onix')"
                      :readonly="isReadonly"
                    />

                    <br/>

                    <h3>{{ $t('component.provider.infos.supply.heading') }}</h3>
                    <br/>

                    <gokb-state-field
                      v-model="providerObject.preferredSupplyMethod"
                      :init-item="providerObject.preferredSupplyMethod"
                      url="refdata/categories/Org.PreferredSupplyMethod"
                      :label="$t('component.provider.preferredSupplyMethod.label')"
                      message-path="component.provider.preferredSupplyMethod"
                      :readonly="isReadonly"
                      width="80%"
                    />

                    <gokb-url-field
                      v-model="providerObject.kbartHostUrl"
                      :disabled="isReadonly"
                      :label="$t('component.provider.infos.supply.url')"
                      width="80%"
                    />

                    <gokb-state-field
                      v-model="providerObject.kbartScope"
                      :init-item="providerObject.kbartScope"
                      url="refdata/categories/Org.KbartScope"
                      :label="$t('component.provider.kbartScope.label')"
                      message-path="component.provider.kbartScope"
                      :readonly="isReadonly"
                      width="80%"
                    />

                    <gokb-state-field
                      v-model="providerObject.kbartPublicationType"
                      :init-item="providerObject.kbartPublicationType"
                      url="refdata/categories/Org.KbartPublicationType"
                      :label="$t('component.provider.kbartPublicationType.label')"
                      message-path="component.provider.kbartPublicationType"
                      :readonly="isReadonly"
                      width="80%"
                    />

                    <br/>

                    <h3>{{ $t('component.provider.infos.autoUpdate.label') }}</h3>
                    <br/>

                    <gokb-checkbox-field dense
                     v-model="providerObject.autoImportSupported"
                     class="ml-3"
                     :label="$t('component.provider.infos.autoUpdate.supported')"
                     :readonly="isReadonly"
                    />

                    <gokb-checkbox-field dense
                     v-model="providerObject.kbartUrlWithDateMask"
                     class="ml-3"
                     :label="$t('component.provider.infos.autoUpdate.dateMask')"
                     :readonly="isReadonly"
                    />

                    <gokb-state-field
                      v-model="providerObject.kbartUpdateCycle"
                      :init-item="providerObject.kbartUpdateCycle"
                      message-path="component.source.frequency"
                      url="refdata/categories/Org.KbartUpdateCycle"
                      :label="$t('component.source.frequency.label')"
                      :readonly="isReadonly"
                    />

                  </v-col>
                  <v-col cols="5">
                    <gokb-checkbox-field dense
                     v-model="providerObject.kbartExtensionZdbId"
                     class="ml-3"
                     label="zdb_id"
                     :readonly="isReadonly"
                    />

                    <gokb-checkbox-field dense
                     v-model="providerObject.kbartExtensionEzbId"
                     class="ml-3"
                     label="ezb_id"
                     :readonly="isReadonly"
                    />

                    <gokb-checkbox-field dense
                     v-model="providerObject.kbartExtensionDoiId"
                     class="ml-3"
                     label="doi_identifier"
                     :readonly="isReadonly"
                    />

                    <gokb-checkbox-field dense
                     v-model="providerObject.kbartExtensionLastChanged"
                     class="ml-3"
                     label="last_changed"
                     :readonly="isReadonly"
                    />

                    <gokb-checkbox-field dense
                     v-model="providerObject.kbartExtensionAccessStartDate"
                     class="ml-3"
                     label="access_start_date"
                     :readonly="isReadonly"
                    />

                    <gokb-checkbox-field dense
                     v-model="providerObject.kbartExtensionAccessEndDate"
                     class="ml-3"
                     label="access_end_date"
                     :readonly="isReadonly"
                    />

                    <gokb-checkbox-field dense
                     v-model="providerObject.kbartExtensionMedium"
                     class="ml-3"
                     label="medium"
                     :readonly="isReadonly"
                    />

                    <gokb-checkbox-field dense
                     v-model="providerObject.kbartExtensionMonographParentCollectionTitle"
                     class="ml-3"
                     label="monograph_parent_collection_title"
                     :readonly="isReadonly"
                    />

                    <gokb-checkbox-field dense
                     v-model="providerObject.kbartExtensionSeries"
                     class="ml-3"
                     label="series"
                     :readonly="isReadonly"
                    />

                    <gokb-checkbox-field dense
                     v-model="providerObject.kbartExtensionSubjetArea"
                     class="ms-3"
                     label="subject_area"
                     :readonly="isReadonly"
                    />
                    <br/>

                    <h3>{{ $t('component.provider.infos.generalNotes.label') }}</h3>

                    <v-col>
                      <gokb-comments-field
                        v-model="providerObject.comments"
                        :disabled="isReadonly"
                        show-title
                        @update="addPendingChange"
                      />
                    </v-col>

                    {{ $t('component.provider.infos.lastUpdated')  }}
                    <v-chip
                      class="ma-1"
                      label
                    >
                      <v-icon
                        :title="$t('component.general.lastUpdated')"
                        class="pb-1"
                        label
                        medium
                      >
                        mdi-refresh
                      </v-icon>
                      <span class="ml-1">{{ providerObject?.importInfoLastUpdated }}</span>
                    </v-chip>
                  </v-col>
                </v-row>
              </gokb-section>
            </v-window-item>
            <v-window-item
              value="curators"
              class="mt-4"
            >
              <gokb-curatory-group-section
                v-model="allCuratoryGroups"
                :show-title="false"
                :disabled="isReadonly"
                :api-errors="errors.curatoryGroups"
                @update="addPendingChange"
              />
            </v-window-item>
            <v-window-item
              value="offices"
              class="mt-4"
            >
              <gokb-offices-section
                v-model="offices"
                :show-title="false"
                :disabled="isReadonly"
                :api-errors="errors.offices"
                @update="addPendingChange"
              />
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>
      <div v-else>
        <gokb-org-roles-section
          v-model="allRoles"
          :expanded="allRoles.length > 0"
          :disabled="isReadonly"
        />
        <gokb-platform-section
          v-model="allPlatforms"
          :expanded="allPlatforms.length > 0"
          :sub-title="$tc('component.platform.label', 2)"
          :provider-id="providerObject.id"
          :disabled="isReadonly"
        />
        <gokb-alternate-names-section
          v-model="allNames.alts"
          :expanded="allNames.alts.length > 0"
          :disabled="isReadonly"
        />
        <gokb-identifier-section
          v-model="providerObject.ids"
          :expanded="providerObject.ids.length > 0"
          :disabled="isReadonly"
        />
        <gokb-packages-section
          v-if="!!id"
          :sub-title="$tc('component.package.label', 2)"
          :expanded="packageCount > 0"
          :provider-id="providerObject.id"
          disabled
        />
        <gokb-section
          :sub-title="$t('component.provider.infos.label')"
          v-model="infosExpanded"
          expandable
        >
          <v-row>
            <v-col cols="5"><h3>{{ $t('component.provider.infos.format') }}</h3></v-col>
            <v-col cols="5"><h3>{{ $t('component.provider.infos.kbartExtension') }}</h3></v-col>
          </v-row>
          <br/>
          <v-row>
            <v-col cols="5">
              <gokb-checkbox-field dense
               v-model="providerObject.supplyKbart"
               class="ml-3"
               :label="$t('component.provider.infos.supply.kbart')"
               :readonly="isReadonly"
              />

              <gokb-checkbox-field dense
               v-model="providerObject.supplyCsv"
               class="ml-3"
               :label="$t('component.provider.infos.supply.csv')"
               :readonly="isReadonly"
              />

              <gokb-checkbox-field dense
               v-model="providerObject.supplyMarc"
               class="ml-3"
               :label="$t('component.provider.infos.supply.marc')"
               :readonly="isReadonly"
              />

              <gokb-checkbox-field dense
               v-model="providerObject.supplyOnix"
               class="ml-3"
               :label="$t('component.provider.infos.supply.onix')"
               :readonly="isReadonly"
              />

              <br/>

              <h3>{{ $t('component.provider.infos.supply.heading') }}</h3>
              <br/>

              <gokb-state-field
                v-model="providerObject.preferredSupplyMethod"
                :init-item="providerObject.preferredSupplyMethod"
                url="refdata/categories/Org.PreferredSupplyMethod"
                :label="$t('component.provider.preferredSupplyMethod.label')"
                message-path="component.provider.preferredSupplyMethod"
                :readonly="isReadonly"
                width="80%"
              />

              <gokb-url-field
                v-model="providerObject.kbartHostUrl"
                :disabled="isReadonly"
                :label="$t('component.provider.infos.supply.url')"
                width="80%"
              />

              <gokb-state-field
                v-model="providerObject.kbartScope"
                :init-item="providerObject.kbartScope"
                url="refdata/categories/Org.KbartScope"
                :label="$t('component.provider.kbartScope.label')"
                message-path="component.provider.kbartScope"
                :readonly="isReadonly"
                width="80%"
              />

              <gokb-state-field
                v-model="providerObject.kbartPublicationType"
                :init-item="providerObject.kbartPublicationType"
                url="refdata/categories/Org.KbartPublicationType"
                :label="$t('component.provider.kbartPublicationType.label')"
                message-path="component.provider.kbartPublicationType"
                :readonly="isReadonly"
                width="80%"
              />

              <br/>

              <h3>{{ $t('component.provider.infos.autoUpdate.label') }}</h3>
              <br/>

              <gokb-checkbox-field dense
               v-model="providerObject.autoImportSupported"
               class="ml-3"
               :label="$t('component.provider.infos.autoUpdate.supported')"
               :readonly="isReadonly"
              />

              <gokb-checkbox-field dense
               v-model="providerObject.kbartUrlWithDateMask"
               class="ml-3"
               :label="$t('component.provider.infos.autoUpdate.dateMask')"
               :readonly="isReadonly"
              />

              <gokb-state-field
                v-model="providerObject.kbartUpdateCycle"
                :init-item="providerObject.kbartUpdateCycle"
                message-path="component.source.frequency"
                url="refdata/categories/Org.KbartUpdateCycle"
                :label="$t('component.source.frequency.label')"
                :readonly="isReadonly"
              />

            </v-col>
            <v-col cols="5">
              <gokb-checkbox-field dense
               v-model="providerObject.kbartExtensionZdbId"
               class="ml-3"
               label="zdb_id"
               :readonly="isReadonly"
              />

              <gokb-checkbox-field dense
               v-model="providerObject.kbartExtensionEzbId"
               class="ml-3"
               label="ezb_id"
               :readonly="isReadonly"
              />

              <gokb-checkbox-field dense
               v-model="providerObject.kbartExtensionDoiId"
               class="ml-3"
               label="doi_identifier"
               :readonly="isReadonly"
              />

              <gokb-checkbox-field dense
               v-model="providerObject.kbartExtensionLastChanged"
               class="ml-3"
               label="last_changed"
               :readonly="isReadonly"
              />

              <gokb-checkbox-field dense
               v-model="providerObject.kbartExtensionAccessStartDate"
               class="ml-3"
               label="access_start_date"
               :readonly="isReadonly"
              />

              <gokb-checkbox-field dense
               v-model="providerObject.kbartExtensionAccessEndDate"
               class="ml-3"
               label="access_end_date"
               :readonly="isReadonly"
              />

              <gokb-checkbox-field dense
               v-model="providerObject.kbartExtensionMedium"
               class="ml-3"
               label="medium"
               :readonly="isReadonly"
              />

              <gokb-checkbox-field dense
               v-model="providerObject.kbartExtensionMonographParentCollectionTitle"
               class="ml-3"
               label="monograph_parent_collection_title"
               :readonly="isReadonly"
              />

              <gokb-checkbox-field dense
               v-model="providerObject.kbartExtensionSeries"
               class="ml-3"
               label="series"
               :readonly="isReadonly"
              />

              <gokb-checkbox-field dense
               v-model="providerObject.kbartExtensionSubjetArea"
               class="ms-3"
               label="subject_area"
               :readonly="isReadonly"
              />
              <br/>

              <h3>{{ $t('component.provider.infos.generalNotes.label') }}</h3>

              <v-col>
                <gokb-comments-field
                  v-model="providerObject.comments"
                  :disabled="isReadonly"
                  show-title
                  @update="addPendingChange"
                />
              </v-col>

              {{ $t('component.provider.infos.lastUpdated')  }}
              <v-chip
                class="ma-1"
                label
              >
                <v-icon
                  :title="$t('component.general.lastUpdated')"
                  class="pb-1"
                  label
                  medium
                >
                  mdi-refresh
                </v-icon>
                <span class="ml-1">{{ providerObject?.importInfoLastUpdated }}</span>
              </v-chip>
            </v-col>
          </v-row>
        </gokb-section>
        <gokb-curatory-group-section
          v-model="allCuratoryGroups"
          :expanded="allCuratoryGroups.length > 0"
          :sub-title="$tc('component.curatoryGroup.label', 2)"
          :disabled="isReadonly"
        />
        <gokb-offices-section
          v-model="offices"
          :expanded="offices.length > 0"
          :sub-title="$tc('component.office.label', 2)"
          :disabled="isReadonly"
        />

      </div>
      <template #buttons>
        <gokb-button
          v-if="!isReadonly"
          @click.prevent="reset"
        >
          {{ $t('btn.reset') }}
        </gokb-button>
        <v-spacer />
        <div v-if="id">
          <v-chip
            class="ma-1"
            label
          >
            <v-icon
              :title="$t('component.general.dateCreated')"
              class="pb-1"
              medium
            >
              mdi-file-plus-outline
            </v-icon>
            <span class="ml-1">{{ localDateCreated }}</span>
          </v-chip>
          <v-chip
            class="ma-1"
            label
          >
            <v-icon
              :title="$t('component.general.lastUpdated')"
              class="pb-1"
              label
              medium
            >
              mdi-refresh
            </v-icon>
            <span class="ml-1">{{ localLastUpdated }}</span>
          </v-chip>
        </div>
        <v-spacer />
        <v-switch
          v-model="tabsView"
          class="pt-4 pr-6"
          :label="$t('component.title.tabsView')"
        />
        <gokb-button
          v-if="!isReadonly"
          :disabled="!valid"
          is-submit
          @click="update"
        >
          {{ updateButtonText }}
        </gokb-button>
      </template>
    </gokb-page>
    <gokb-no-access-field v-else-if="!accessible" />
    <gokb-page
      v-else
      title=""
    >
      <v-card>
        <v-card-text align="center">
          <div class="text-h5 primary--text">
            {{ $t('component.general.notFound', [$tc('component.provider.label')]) }}
          </div>
        </v-card-text>
      </v-card>
    </gokb-page>
  </div>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import providerServices from '@/shared/services/provider-services'
  import searchServices from '@/shared/services/search-services'
  import accountModel from '@/shared/models/account-model'
  import loading from '@/shared/models/loading'
  import log from '@/shared/utils/logger'
  import utils from '@/shared/utils/utils'


  export default {
    name: 'EditProviderView',
    extends: BaseComponent,
    props: {
      id: {
        type: [String, Number],
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        tab: null,
        uuid: undefined,
        pendingChanges: {},
        toDelete: false,
        valid: true,
        notFound: false,
        tabsView: true,
        infosExpanded: false,
        dateCreated: undefined,
        lastUpdated: undefined,
        deleteUrl: undefined,
        allAlternateNames: [],
        allCuratoryGroups: [],
        packageCount: 0,
        allNames: {
          name: undefined,
          alts: []
        },
        allPlatforms: [],
        allRoles: [],
        offices: [],
        errors: {},
        hasErrors: false,
        updateUrl: undefined,
        showSnackbar: false,
        snackbarMessage: undefined,
        messageColor: undefined,
        currentSnackBarTimeout: '-1',
        version: undefined,
        lastLoad: undefined,
        lastLoadComments: undefined,
        providerObject: {
          id: undefined,
          ids: [],
          status: undefined,
          source: undefined,
          titleNamespace: undefined,
          titleNamespaceSerial: undefined,
          titleNamespaceMonograph: undefined,
          packageNamespace: undefined,
          homepage: undefined,
          comments: [],
          supplyKbart: undefined,
          supplyCsv: undefined,
          supplyMarc: undefined,
          supplyOnix: undefined,
          kbartExtensionZdbId: undefined,
          kbartExtensionEzbId: undefined,
          kbartExtensionDoiId: undefined,
          kbartExtensionLastChanged: undefined,
          kbartExtensionAccessStartDate: undefined,
          kbartExtensionAccessEndDate: undefined,
          kbartExtensionMedium: undefined,
          kbartExtensionMonographParentCollectionTitle: undefined,
          kbartExtensionSeries: undefined,
          kbartExtensionSubjetArea: undefined,
          autoImportSupported: undefined,
          kbartUrlWithDateMask: undefined,
          kbartUpdateCycle: undefined,
          kbartHostUrl: undefined,
          preferredSupplyMethod: undefined,
          importInfoLastUpdated: undefined,
          kbartScope: undefined,
          kbartPublicationType: undefined
        }
      }
    },
    computed: {
      isEdit () {
        return !!this.id
      },
      title () {
        return this.$i18n.t(this.titleCode, [this.$i18n.tc('component.provider.label')])
      },
      titleCode () {
        return this.isEdit ? (this.updateUrl ? 'header.edit.label' : 'header.show.label') : 'header.create.label'
      },
      updateButtonText () {
        return this.id ? this.$i18n.t('btn.update') : this.$i18n.t('btn.create')
      },
      isReadonly () {
        return !accountModel.loggedIn || (this.isEdit && !this.updateUrl) || (!this.isEdit && !accountModel.hasRole('ROLE_EDITOR'))
      },
      isAdmin () {
        return accountModel.loggedIn() && accountModel.hasRole('ROLE_ADMIN')
      },
      loggedIn () {
        return accountModel.loggedIn()
      },
      localDateCreated () {
        return this.dateCreated ? new Date(this.dateCreated).toLocaleString('sv') : ''
      },
      localLastUpdated () {
        return this.lastUpdated ? new Date(this.lastUpdated).toLocaleString('sv') : ''
      },
      tabClass () {
        return this.$vuetify.theme.dark ? 'tab-dark' : ''
      },
      accessible () {
        return this.isEdit || (accountModel.loggedIn() && accountModel.hasRole('ROLE_CONTRIBUTOR'))
      },
      'providerObject.importInfoLastUpdated' () {
        return this.providerObject.importInfoLastUpdated ? new Date(this.providerObject.importInfoLastUpdated).toLocaleDateString('sv') : ''
      },
      isPlatformProvider () {
        return this.allRoles.some(role => (role.value === 'Platform Provider'))
      }
    },
    watch: {
      loggedIn (value) {
        if (value) {
          this.reload()
        }
      },
      '$i18n.locale' (l) {
        if (this.isEdit) {
          document.title = this.$i18n.tc('component.provider.label') + ' – ' + this.allNames.name
        }
      },
      tabsView (value) {
        if (this.loggedIn) {
          accountModel.useTabbedView(value)
        }
      },
      tab (val) {
        history.replaceState({}, "", window.location.toString().split('?')[0] + (!!val ? ('?tab=' + val) : ''))
      },
      allRoles: {
        handler (vals) {
          this.validate()
        },
        deep: true
      },
      allPlatforms: {
        handler (vals) {
          this.validate()
        },
        deep: true
      }
    },
    async created () {
      this.reload()

      let pars = history.state

      if (!!pars.initMessageCode) {
        if (pars.initMessageCode.includes('success')) {
          this.messageColor = 'success'
          this.snackbarMessage = this.$i18n.t(pars.initMessageCode, [this.$i18n.tc('component.provider.label'), this.allNames.name])
          this.currentSnackBarTimeout = 5000
          this.showSnackbar = true
        } else if (pars.initMessageCode.includes('failure')) {
          this.messageColor = 'error'
          this.snackbarMessage = this.$i18n.t(pars.initMessageCode, [this.$i18n.tc('component.provider.label')])
          this.currentSnackBarTimeout = 5000
          this.showSnackbar = true
        } else if (pars.initMessageCode.includes('warning')) {
          this.messageColor = 'warning'
          this.snackbarMessage = this.$i18n.t(pars.initMessageCode, [this.$i18n.tc('component.provider.label'), this.allNames.name])
          this.currentSnackBarTimeout = 5000
          this.showSnackbar = true
        }

        history.replaceState({}, "")
      }

      if (this.loggedIn) {
        this.tabsView = accountModel.tabbedView()
      }


    },
    mounted () {
      window.addEventListener('beforeunload', this.checkForChanges)
      this.tab = this.$route?.query?.tab || (!!this.id ? 'variants' : 'roles')
    },
    unmounted() {
      window.removeEventListener('beforeunload', this.checkForChanges)
    },
    beforeRouteLeave (to, from) {
      if (this.hasUnsavedChanges()) {
        const answer = window.confirm(this.$i18n.t('popups.confirm.pendingChanges.label'))

        return answer
      }
      else {
        log.debug('No Changes ..')
      }
    },
    methods: {
      saveInitialCommentsState () {
        if (this.providerObject.comments?.length > 0) {
          this.lastLoadComments = this.providerObject.comments.map( comment => ({
            id: comment.id,
            value: comment.value
            })
          )
        }
      },
      isInfoUpdate () {

        let changed = false

        if (!!this.lastLoad?.id) {
          let compareState = [this.lastLoad.supplyKbart, this.lastLoad.supplyCsv, this.lastLoad.supplyMarc, this.lastLoad.supplyOnix, this.lastLoad.kbartExtensionZdbId, this.lastLoad.kbartExtensionEzbId, this.lastLoad.kbartExtensionDoiId,
            this.lastLoad.kbartExtensionLastChanged, this.lastLoad.kbartExtensionAccessStartDate, this.lastLoad.kbartExtensionAccessEndDate, this.lastLoad.kbartExtensionMedium, this.lastLoad.kbartExtensionMonographParentCollectionTitle,
            this.lastLoad.kbartExtensionSeries, this.lastLoad.kbartExtensionSubjetArea, this.lastLoad.autoImportSupported, this.lastLoad.kbartUrlWithDateMask, this.lastLoad.kbartUpdateCycle?.id, this.lastLoad.kbartHostUrl,
            this.lastLoad.preferredSupplyMethod?.id, this.lastLoad.kbartScope?.id, this.lastLoad.kbartPublicationType?.id]

          let actualState = [this.providerObject.supplyKbart, this.providerObject.supplyCsv, this.providerObject.supplyMarc, this.providerObject.supplyOnix, this.providerObject.kbartExtensionZdbId, this.providerObject.kbartExtensionEzbId,
            this.providerObject.kbartExtensionDoiId, this.providerObject.kbartExtensionLastChanged, this.providerObject.kbartExtensionAccessStartDate, this.providerObject.kbartExtensionAccessEndDate, this.providerObject.kbartExtensionMedium,
            this.providerObject.kbartExtensionMonographParentCollectionTitle, this.providerObject.kbartExtensionSeries, this.providerObject.kbartExtensionSubjetArea, this.providerObject.autoImportSupported, this.providerObject.kbartUrlWithDateMask,
            this.providerObject.kbartUpdateCycle?.id, this.providerObject.kbartHostUrl, this.providerObject.preferredSupplyMethod?.id, this.providerObject.kbartScope?.id, this.providerObject.kbartPublicationType?.id]

          for (var i = 0; i < compareState.length; i++) {
            if (compareState[i] !== actualState[i]) {
              changed = true
              break;
            }
          }

          // check comments
          if (!changed) {
            if (this.lastLoadComments?.length !== this.providerObject.comments.length) {
              changed = true
            } else {
              //filter the identical comments and check if number is == the actual number of comments
              let identicalComments = this.providerObject.comments.filter(c1 => this.lastLoadComments.some(c2 => c1.id === c2.id && c1.value === c2.value))
              changed = (identicalComments.length !== this.providerObject.comments.length)
            }
          }
        }
        return changed
      },
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      checkForChanges (e) {
        if (this.hasUnsavedChanges()) {
          e.preventDefault()
          e.returnValue = this.$i18n.t('popups.confirm.pendingChanges.label')
        }
      },
      hasUnsavedChanges () {
        log.debug("Check for unsaved changes ..")
        if (Object.keys(this.pendingChanges).length > 0) {
          log.debug('hasUnsavedChanges :: pendingChanges: ' + this.pendingChanges)
          return true
        }

        if (!!this.lastLoad?.id) {
          for (var [key, val] of Object.entries(this.lastLoad)) {
            if (key === 'name' && this.allNames.name !== val) {
              return true
            }
            else if (typeof val === 'array') {
              // Array fields will have already been handled by check for entries in this.pendingChanges
            }
            else if (typeof val === 'object') {
              if (this.providerObject.hasOwnProperty(key) && utils.hasLinkedFieldChanged(val, this.providerObject[key])) {
                log.debug('hasUnsavedChanges :: changed linked field ' + key + '!')
                return true
              }
            }
            else if (this.providerObject.hasOwnProperty(key) && val !== this.providerObject[key]) {
              log.debug('hasUnsavedChanges :: changed field ' + key + ': ' + val + '<>' + this.providerObject[key])
              return true
            }
          }
        }
        else if (!!this.allNames.name) {
          log.debug('hasUnsavedChanges :: no lastload, pending name!')
          return true
        }

        return false
      },
      async update () {
        var isUpdate = !!this.id
        this.showSnackbar = false
        const activeGroup = accountModel.activeGroup()

        if (!this.providerObject.importInfoLastUpdated || this.isInfoUpdate()) {
          var date = new Date()
          // make date compatible to Backend, i.e. format YYYY-MM-DD as String
          this.providerObject.importInfoLastUpdated = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1).toString()).slice(-2) + '-' + ('0' + date.getDate().toString()).slice(-2)

          log.debug("Info last updated set new: ", this.providerObject.importInfoLastUpdated)
        }

        const data = {
          ...this.providerObject,
          name: this.allNames.name,
          version: this.version,
          variantNames: this.allNames.alts.map(({ variantName, id, locale, variantType }) => ({
            variantName,
            locale,
            variantType,
            id: typeof id === 'number' ? id : null
          })),
          comments: this.providerObject.comments.map(( cmt ) => ({
            ...cmt,
            id: (typeof cmt.id === 'number' ? cmt.id : null)
          })),
          offices: this.offices.map(office => ({
            ...office,
            id: (typeof office.id === 'number' ? office.id : null)
          })),
          ids: this.providerObject.ids.map(id => ({
            value: id.value,
            type: id.namespace
          })),
          roles: this.allRoles.map (({ id }) => id),
          curatoryGroups: this.allCuratoryGroups.map(({ id }) => id),
          providedPlatforms: this.allPlatforms.map(({ name, primaryUrl, id }) => ({
            name,
            primaryUrl,
            id: typeof id === 'number' ? id : null
          })),
          activeGroup: activeGroup
        }

        const response = await this.catchError({
          promise: providerServices.createOrUpdate(data, this.cancelToken.token),
          instance: this
        })

        if (response?.status < 400) {
          if (isUpdate) {
            this.messageColor = 'success'
            this.snackbarMessage = this.$i18n.t('success.update', [this.$i18n.tc('component.provider.label'), this.allNames.name])
            this.currentSnackBarTimeout = 4000
            this.showSnackbar = true

            this.reload()
          } else {
            this.allNames.name = undefined
            this.pendingChanges = {}
            this.$router.push({
              name: '/provider',
              state: {
                initMessageCode: 'success.create'
              },
              params: {
                id: response.data?.id
              }
            })
          }
        } else {
          if (response.status === 409) {
            this.messageColor = 'error'
            this.snackbarMessage = this.$i18n.t('error.update.409', [this.$i18n.tc('component.provider.label')])
            this.currentSnackBarTimeout = -1
            this.showSnackbar = true
          } else if (response.status === 500) {
            this.messageColor = 'error'
            this.snackbarMessage = this.$i18n.t('error.general.500', [this.$i18n.tc('component.provider.label')]),
            this.currentSnackBarTimeout = -1
            this.showSnackbar = true
          } else {
            this.messageColor = 'error'
            this.snackbarMessage = this.$i18n.t(this.isEdit ? 'error.update.400' : 'error.create.400', [this.$i18n.tc('component.provider.label')]),
            this.currentSnackBarTimeout = -1
            this.showSnackbar = true
            this.errors = response.data.error
          }
        }
      },
      reset () {
        this.tab = null
        this.uuid = undefined
        this.pendingChanges = {}
        this.valid = true
        this.notFound = false
        this.tabsView = true
        this.dateCreated = undefined
        this.lastUpdated = undefined
        this.deleteUrl = undefined
        this.allAlternateNames = []
        this.allCuratoryGroups = []
        this.packageCount = 0
        this.allNames = {
          name: undefined,
          alts: []
        }
        this.allRoles = []
        this.allPlatforms = []
        this.offices = []
        this.errors = {}
        this.lastLoad = undefined
        this.updateUrl = undefined
        this.showSnackbar = false
        this.version = undefined
        this.providerObject = {
          id: undefined,
          name: undefined,
          ids: [],
          status: undefined,
          source: undefined,
          titleNamespace: undefined,
          titleNamespaceMonograph: undefined,
          titleNamespaceSerial: undefined,
          packageNamespac: undefined,
          homepage: undefined,
          preferredShortname: undefined,
          comments: []
        }
        this.reload()
      },
      async reload () {
        if (this.isEdit) {
          loading.startLoading()
          this.errors = {}
          this.toDelete = false
          this.pendingChanges = {}

          const result = await this.catchError({
            promise: providerServices.get(this.id, this.cancelToken.token),
            instance: this
          })

          if (result.status === 200) {
            this.lastLoad = {}
            this.lastLoadComments = []
            this.mapRecord(result.data)
            this.saveInitialCommentsState()
          } else if (result.status === 404) {
            this.notFound = true
          }

          loading.stopLoading()
        }
      },
      addPendingChange (prop) {
        if (!this.pendingChanges[prop]) {
          this.pendingChanges[prop] = true
        }

        if (prop === 'roles' && !!this.errors.providedPlatforms && this.allRoles.some(role => (role.value === 'Platform Provider'))) {
          delete this.errors.providedPlatforms
        }
      },
      async mapRecord (data) {

        this.name = data.name

        this.version = data.version
        this.updateUrl = data._links?.update?.href || null
        this.deleteUrl = data._links?.delete?.href || null
        this.dateCreated = data.dateCreated
        this.lastUpdated = data.lastUpdated

        const new_item_info = {
          id: data.id,
          name: data.name,
          status: data.status,
          source: data.source,
          homepage: data.homepage,
          titleNamespace: data.titleNamespace,
          titleNamespaceSerial: data.titleNamespaceSerial,
          titleNamespaceMonograph: data.titleNamespaceMonograph,
          packageNamespace: data.packageNamespace,
          preferredShortname: data.preferredShortname,
          supplyKbart: data.supplyKbart,
          supplyCsv: data.supplyCsv,
          supplyMarc: data.supplyMarc,
          supplyOnix: data.supplyOnix,
          kbartExtensionZdbId: data.kbartExtensionZdbId,
          kbartExtensionEzbId: data.kbartExtensionEzbId,
          kbartExtensionDoiId: data.kbartExtensionDoiId,
          kbartExtensionLastChanged: data.kbartExtensionLastChanged,
          kbartExtensionAccessStartDate: data.kbartExtensionAccessStartDate,
          kbartExtensionAccessEndDate: data.kbartExtensionAccessEndDate,
          kbartExtensionMedium: data.kbartExtensionMedium,
          kbartExtensionMonographParentCollectionTitle: data.kbartExtensionMonographParentCollectionTitle,
          kbartExtensionSeries: data.kbartExtensionSeries,
          kbartExtensionSubjetArea: data.kbartExtensionSubjetArea,
          autoImportSupported: data.autoImportSupported,
          kbartUrlWithDateMask: data.kbartUrlWithDateMask,
          kbartUpdateCycle: data.kbartUpdateCycle,
          kbartHostUrl: data.kbartHostUrl,
          //comments: data._embedded.comments,
          preferredSupplyMethod: data.preferredSupplyMethod,
          kbartScope: data.kbartScope,
          kbartPublicationType: data.kbartPublicationType,
          importInfoLastUpdated: data.importInfoLastUpdated
        }

        this.lastLoad = structuredClone(new_item_info)

        new_item_info.ids = data._embedded.ids.map(({ id, value, namespace }) => ({
          id,
          value,
          namespace: namespace.value,
          nslabel: namespace.name || namespace.value,
          isDeletable: !!this.updateUrl
        }))

        new_item_info.comments = data._embedded.comments.map(({ id, value, language }) => ({
          id,
          value,
          language,
          isDeletable: !!this.updateUrl
        })) || []

        this.providerObject = new_item_info

        this.allRoles = data._embedded.roles.map(role => ({
          ...role,
          isDeletable: !!this.updateUrl
        }))

        this.allNames = {
          name: data.name,
          alts: data._embedded.variantNames.map(variantName => ({
            ...variantName,
            isDeletable: !!this.updateUrl
          }))
        }

        this.allCuratoryGroups = data._embedded.curatoryGroups.map(group => ({
          ...group,
          isDeletable: !!this.updateUrl
        }))

        this.allPlatforms = data._embedded.providedPlatforms.map(platform => ({
          ...platform,
          updateUrl: platform._links.update.href,
          isDeletable: !!this.updateUrl
        }))

        this.offices = data._embedded.offices?.map(office => ({
          ...office,
          typeLocal: (office.function ? this.$i18n.t('component.office.type.label') : undefined),
          localLanguage: (office.language?.value && office.language.value),
          isDeletable: !!this.updateUrl
        })) || []

        this.uuid = data.uuid

        document.title = this.$i18n.tc('component.provider.label') + ' – ' + this.allNames.name

        const pkgResult = await this.catchError({
          promise: searchServices('rest/packages').search({
            status: 'Current',
            global: ['Global', 'Consortium', 'Regional', 'Unknown'],
            provider: data.id,
            es: true
          }, this.cancelToken.token),
          instance: this
        })

        if (pkgResult.status === 200) {
          this.packageCount = pkgResult.data._pagination.total
        }
      },
      updatePackageCount (count) {
        this.packageCount = count
      },
      markDeleted (val) {
        this.toDelete = val
      },
      validate () {
        this.valid = true

        if (!this.allNames.name) {
          this.valid = false
        }

        if (this.isPlatformProvider && this.allPlatforms.length === 0) {
          this.valid = false
          this.errors.platforms = [{
            messageCode: "component.provider.error.missingPlatform.label"
          }]
        } else if (this.allPlatforms.length > 0 && !this.isPlatformProvider) {
          this.valid = false
          this.errors.roles = [{
            messageCode: "component.provider.error.missingRole.platform"
          }]
        }
      }
    }
  }
</script>

<style scoped>
  .tab-dark {
    color: rgba(255, 255, 255, 0.6);
  }
</style>
