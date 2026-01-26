<template>
  <gokb-section
    v-model="isExpanded"
    expandable
    :hide-default="!expanded"
    :errors="!!apiErrors"
    :sub-title="title"
    :items-total="totalNumberOfItems"
  >
    <gokb-add-item-popup
      v-if="addItemPopupVisible"
      v-model="addItemPopupVisible"
      width="500px"
      :component="{ type: 'GokbStateField', name: $tc('component.provider.role.label'), properties: { url: 'refdata/categories/Org.Role', messagePath: 'component.provider.role', returnObject: true } }"
      @add="addItem"
    />
    <template #buttons>
      <gokb-button
        v-if="isEditable"
        icon-id="mdi-plus"
        color="primary"
        @click.prevent="showAddItem"
      >
        {{ $i18n.t('btn.add') }}
      </gokb-button>
      <gokb-button
        v-if="isEditable"
        class="ml-4"
        icon-id="mdi-delete"
        color="primary"
        :disabled="isDeleteSelectedDisabled"
        @click.prevent="confirmDeleteSelectedItems"
      >
        {{ $i18n.t('btn.delete') }}
      </gokb-button>
    </template>
    <gokb-confirmation-popup
      v-model="confirmationPopUpVisible"
      :message="messageToConfirm"
      @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
    />
    <span v-if="errorMessage">
      <v-alert
        v-model="showErrorMessage"
        type="error"
        dismissible
      >
        {{ errorMessage }}
      </v-alert>
    </span>
    <gokb-table
      :headers="tableHeaders"
      :items="currentRoles"
      :editable="isEditable"
      :selected-items="selectedItems"
      :total-number-of-items="totalNumberOfItems"
      :options.sync="searchOptions"
      :hide-select="!isEditable"
      @selected-items="selectedItems = $event"
      @delete-item="confirmDeleteItem"
    />
  </gokb-section>
</template>

<script>
  import GokbAddItemPopup from '@/shared/popups/gokb-add-item-popup'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'

  const ROWS_PER_PAGE = 10

  export default {
    name: 'GokbOrgRolesSection',
    components: { GokbAddItemPopup, GokbConfirmationPopup },
    emits: ['update:model-value', 'update'],
    props: {
      modelValue: {
        type: Array,
        required: true
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      expanded: {
        type: Boolean,
        required: false,
        default: true
      },
      showTitle: {
        type: Boolean,
        required: false,
        default: true
      },
      apiErrors: {
        type: Array,
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        addItemPopupVisible: false,
        searchOptions: {
          page: 1,
          sortBy: [],
          itemsPerPage: ROWS_PER_PAGE
        },
        errorMessage: undefined,
        showErrorMessage: false,
        selectedItems: [],
        isExpanded: true,
        confirmationPopUpVisible: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: { text: undefined, vars: undefined }
      }
    },
    mounted() {
      this.updateItems()
    },
    computed: {
      localValue: {
        get () {
          return this.modelValue
        },
        set (localValue) {
          this.$emit('update:model-value', localValue)
        }
      },
      isDeleteSelectedDisabled () {
        return !this.selectedItems.length
      },
      totalNumberOfItems () {
        return this.localValue.length
      },
      isEditable () {
        return !this.disabled
      },
      tableHeaders () {
        return [
          {
            title: this.$i18n.tc('component.provider.role.label'),
            align: 'start',
            value: 'value',
            sortable: false,
            width: '100%'
          }
        ]
      },
      title () {
        return this.showTitle ? this.$i18n.tc('component.provider.role.label', 2) : undefined
      },
      currentRoles () {
        return this.localValue.map(role => ({ value: this.$i18n.t('component.provider.role.' + role.value + '.label'), id: role.id }))
      }
    },
    mounted (){
      this.isExpanded = this.expanded
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      confirmDeleteSelectedItems () {
        this.actionToConfirm = '_deleteSelected'
        this.messageToConfirm = {
          text: 'popups.confirm.delete.list',
          vars: [
            this.selectedItems.length,
            this.$i18n.tc('component.provider.role.label', this.selectedItems.length)
          ]
        }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      confirmDeleteItem ({ id, value }) {
        this.actionToConfirm = '_deleteItem'
        this.messageToConfirm = {
          text: 'popups.confirm.delete.list',
          vars: ['', value]
        }
        this.parameterToConfirm = id
        this.confirmationPopUpVisible = true
      },
      _deleteSelected () {
        this.localValue = this.localValue.filter(({ id }) => !this.selectedItems
          .find(({ id: selectedId }) => id === selectedId))
        this.selectedItems = []
        this.$emit('update', 'roles')
      },
      _deleteItem (idToDelete) {
        this.localValue = this.localValue.filter(({ id }) => id !== idToDelete)
        this.selectedItems = this.selectedItems.filter(({ id }) => id !== idToDelete)
        this.$emit('update', 'roles')
      },
      showAddItem () {
        this.addItemPopupVisible = true
      },
      addItem (item) {
        this.localValue.push(item)
        this.$emit('update', 'roles')
      }
    }
  }
</script>
