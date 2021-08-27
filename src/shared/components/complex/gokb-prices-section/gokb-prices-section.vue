<template>
  <gokb-section
    :expandable="expandable"
    :sub-title="title"
    :items-total="totalNumberOfItems"
    :hide-default="!expanded"
  >
    <gokb-add-item-popup
      v-if="addItemPopupVisible"
      v-model="addItemPopupVisible"
      :component="{ type: 'GokbPriceField', name: $tc('component.tipp.prices.label') }"
      @add="addNewItem"
    />
    <template #buttons>
      <gokb-button
        v-if="isEditable"
        icon-id="add"
        @click="showAddItemPopup"
      >
        {{ $i18n.t('btn.add') }}
      </gokb-button>
      <gokb-button
        :disabled="selectedItems.length == 0"
        class="ml-4"
        icon-id="delete"
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
      :items="prices"
      :headers="tableHeaders"
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
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import GokbAddItemPopup from '@/shared/popups/gokb-add-item-popup'
  import BaseComponent from '@/shared/components/base-component'

  const ROWS_PER_PAGE = 10

  export default {
    name: 'GokbPricesSection',
    components: {
      GokbConfirmationPopup,
      GokbAddItemPopup
    },
    extends: BaseComponent,
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
      expandable: {
        type: Boolean,
        required: false,
        default: true
      },
      showTitle: {
        type: Boolean,
        required: false,
        default: true
      },
      expanded: {
        type: Boolean,
        required: false,
        default: true
      }
    },
    data () {
      return {
        confirmationPopUpVisible: false,
        addItemPopupVisible: undefined,
        selectedItems: [],
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: undefined,
        options: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        }
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
      prices () {
        return [...this.value]
          .map(item => ({ ...item, localCurrency: (item.currency && item.currency.name), localType: (item.priceType && this.$i18n.t('component.tipp.prices.priceType.' + (item.priceType.value || item.priceType.name) + '.label')) }))
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
          { text: this.$i18n.t('component.tipp.prices.priceType.label'), align: 'left', value: 'localType', sortable: true },
          { text: this.$i18n.tc('component.tipp.prices.label'), align: 'left', value: 'price', sortable: true },
          { text: this.$i18n.tc('component.tipp.prices.currency.label'), align: 'left', value: 'localCurrency', sortable: true, width: '15%' },
        ]
      },
      title () {
        return this.showTitle ? this.$i18n.tc('component.tipp.prices.label') : undefined
      }
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      tempId () {
        return 'tempId' + Math.random().toString(36).substr(2, 5)
      },
      confirmDeleteSelectedItems () {
        this.actionToConfirm = '_deleteSelected'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: [this.selectedItems.length, this.$i18n.tc('component.tipp.prices.label', this.selectedItems.length)] }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      confirmDeleteItem ({ id, price }) {
        this.actionToConfirm = '_deleteItem'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: ['', price] }
        this.parameterToConfirm = id
        this.confirmationPopUpVisible = true
      },
      _deleteSelected () {
        // console.log('_deleteSelected')
        this.localValue = this.localValue.filter(({ id }) => !this.selectedItems
          .find(({ id: selectedId }) => id === selectedId))
        this.selectedItems = []
        this.$emit('update', 'prices')
      },
      _deleteItem (idToDelete) {
        this.localValue = this.localValue.filter(({ id }) => id !== idToDelete)
        this.selectedItems = this.selectedItems.filter(({ id }) => id !== idToDelete)
        this.$emit('update', 'prices')
      },
      addNewItem (item) {
        this.localValue.push({
          id: this.tempId(),
          ...item,
          localCurrency: (item.currency && item.currency.name),
          isDeletable: true,
          _pending: 'added'
        })
        this.$emit('update', 'prices')
      },
      showAddItemPopup () {
        this.addItemPopupVisible = true
      },
    }
  }
</script>
