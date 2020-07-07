<template>
  <gokb-section
    sub-title="Alternative Namen"
  >
    <gokb-add-item-popup
      v-if="addItemPopupVisible"
      v-model="addItemPopupVisible"
      :component="{ type: 'GokbTextField', name: 'Namen' }"
      @add="addItem"
    />
    <template #buttons>
      <gokb-button
        icon-id="add"
        @click="showAddItem"
      >
        Hinzufügen
      </gokb-button>
      <gokb-button
        class="ml-4"
        icon-id="delete"
        :disabled="isDeleteSelectedDisabled"
        @click="confirmDeleteSelectedItems"
      >
        Löschen
      </gokb-button>
    </template>
    <gokb-confirmation-popup
      v-model="confirmationPopUpVisible"
      :message="messageToConfirm"
      @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
    />
    <gokb-table
      :headers="tableHeaders"
      :items="items"
      :selected-items="selectedItems"
      :total-number-of-items="totalNumberOfItems"
      :options.sync="options"
      @selected-items="selectedItems = $event"
      @delete-item="confirmDeleteItem"
    />
  </gokb-section>
</template>

<script>
  import GokbAddItemPopup from '@/shared/popups/gokb-add-item-popup'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'

  const ROWS_PER_PAGE = 10

  const TABLE_HEADERS = [
    { text: 'Name', align: 'left', value: 'name', sortable: false, width: '100%' },
  ]

  export default {
    name: 'GokbAlternateNamesSection',
    components: { GokbAddItemPopup, GokbConfirmationPopup },
    props: {
      value: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        addItemPopupVisible: false,
        options: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
        selectedItems: [],
        confirmationPopUpVisible: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: undefined,
      }
    },
    computed: {
      localValue: {
        get () {
          return this.value
        },
        set (localValue) {
          this.$emit('input', localValue)
        }
      },
      items () {
        return [...this.value]
          .sort(({ name: first }, { name: second }) => (first > second) ? 1 : (second > first) ? -1 : 0)
          .slice((this.options.page - 1) * ROWS_PER_PAGE, this.options.page * ROWS_PER_PAGE)
      },
      isDeleteSelectedDisabled () {
        return !this.selectedItems.length
      },
      totalNumberOfItems () {
        return this.localValue.length
      },
    },
    created () {
      this.tableHeaders = TABLE_HEADERS
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      confirmDeleteSelectedItems () {
        this.actionToConfirm = '_deleteSelected'
        this.messageToConfirm = 'Wollen Sie die ausgewählten Elemente wirklich löschen?'
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      confirmDeleteItem ({ id }) {
        this.actionToConfirm = '_deleteItem'
        this.messageToConfirm = 'Wollen Sie das ausgewählte Elemente wirklich löschen?'
        this.parameterToConfirm = id
        this.confirmationPopUpVisible = true
      },
      _deleteSelected () {
        this.localValue = this.localValue.filter(({ id }) => !this.selected
          .find(({ id: selectedId }) => id === selectedId))
        this.selectedItems = []
      },
      _deleteItem (idToDelete) {
        this.localValue = this.localValue.filter(({ id }) => id !== idToDelete)
        this.selectedItems = this.selectedItems.filter(({ id }) => id !== idToDelete)
      },
      showAddItem () {
        this.addItemPopupVisible = true
      },
      addItem ({ id, name }) {
        !this.localValue.find(({ id: idInAll }) => id === idInAll) &&
          this.localValue.push({ id, name, isDeletable: true })
      },
    }
  }
</script>
