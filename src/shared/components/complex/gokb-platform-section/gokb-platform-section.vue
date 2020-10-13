<template>
  <gokb-section
    expandable
    :hide-default="!expanded"
    :sub-title="$tc('component.platform.label', 2)"
    :items-total="totalNumberOfItems"
  >
    <gokb-add-item-popup
      v-if="addPlatformPopupVisible"
      v-model="addPlatformPopupVisible"
      :component="{ type: 'GokbPlatformField', name: $tc('component.platform.label') }"
      @add="addNewPlatform"
    />
    <template #buttons>
      <gokb-button
        v-if="isEditable"
        icon-id="add"
        @click="showAddPlatformPopup"
      >
        {{ $t('btn.add') }}
      </gokb-button>
      <gokb-button
        v-if="isEditable"
        class="ml-4"
        icon-id="delete"
        :disabled="isDeleteSelectedDisabled"
        @click="confirmDeleteSelectedItems"
      >
        {{ $t('btn.delete') }}
      </gokb-button>
    </template>

    <gokb-confirmation-popup
      v-model="confirmationPopUpVisible"
      :message="messageToConfirm"
      @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
    />
    <gokb-table
      :headers="tableHeaders"
      :items="platforms"
      :editable="isEditable"
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
    { text: 'Name', align: 'start', value: 'name', sortable: false, width: '40%' },
    { text: 'URL', align: 'start', value: 'primaryUrl', sortable: false, width: '60%' },
  ]

  export default {
    name: 'GokbPlatformSection',
    components: {
      GokbAddItemPopup,
      GokbConfirmationPopup
    },
    props: {
      value: {
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
      }
    },
    data () {
      return {
        addPlatformPopupVisible: false,
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
      platforms () {
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
      isEditable () {
        return !this.disabled
      }
    },
    created () {
      this.tableHeaders = TABLE_HEADERS
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      confirmDeleteSelectedItems () {
        this.actionToConfirm = '_deleteSelectedItems'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: [this.selectedItems.length, this.$i18n.tc('component.platform.label', this.selectedItems.length)] }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      confirmDeleteItem ({ id, name }) {
        this.actionToConfirm = '_deleteItem'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: ['', name] }
        this.parameterToConfirm = id
        this.confirmationPopUpVisible = true
      },
      _deleteSelectedItems () {
        this.localValue = this.localValue.filter(({ id }) => !this.selectedItems
          .find(({ id: selectedId }) => id === selectedId))
        this.selectedItems = []
      },
      _deleteItem (idToDelete) {
        this.localValue = this.localValue.filter(({ id }) => id !== idToDelete)
        this.selectedItems = this.selectedItems.filter(({ id }) => id !== idToDelete)
      },
      showAddPlatformPopup () {
        this.addPlatformPopupVisible = true
      },
      addNewPlatform (value) {
        this.localValue.push(value)
      },
      deletePlatform (value) {
        this.localValue = this.localValue.filter(v => v !== value)
      }
    }
  }
</script>
