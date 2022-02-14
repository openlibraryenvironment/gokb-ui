<template>
  <gokb-section
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
      :component="{ type: 'GokbAlternateNamesField', name: $tc('component.variantName.label') }"
      @add="addItem"
    />
    <template #buttons>
      <gokb-button
        v-if="isEditable"
        icon-id="mdi-plus"
        color="primary"
        @click="showAddVariantName"
      >
        {{ $i18n.t('btn.add') }}
      </gokb-button>
      <gokb-button
        v-if="isEditable"
        class="ml-4"
        icon-id="mdi-delete"
        color="primary"
        :disabled="isDeleteSelectedDisabled"
        @click="confirmDeleteSelectedItems"
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
      :items="variantNames"
      :editable="isEditable"
      :selected-items="selectedVariantNames"
      :total-number-of-items="totalNumberOfItems"
      :options.sync="variantNameOptions"
      @selected-items="selectedVariantNames = $event"
      @delete-item="confirmDeleteItem"
    />
  </gokb-section>
</template>

<script>
  import GokbAddItemPopup from '@/shared/popups/gokb-add-item-popup'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'

  const ROWS_PER_PAGE = 10

  export default {
    name: 'GokbAlternateNamesSection',
    components: { GokbAddItemPopup, GokbConfirmationPopup },
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
        variantNameOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
        errorMessage: undefined,
        showErrorMessage: false,
        selectedVariantNames: [],
        confirmationPopUpVisible: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: { text: undefined, vars: undefined }
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
      variantNames () {
        return [...this.value]
          .map(item => ({
            ...item,
            locale: (item.locale?.name || item.locale),
            markError: this.apiErrors?.find(e => (e.baddata.variantName === item.variantName))
              ? this.$i18n.t('component.variantName.error.' + this.apiErrors.find(e => (e.baddata.variantName === item.variantName)).code)
              : null
          }))
          .sort(({ variantName: first }, { variantName: second }) => (first > second) ? 1 : (second > first) ? -1 : 0)
          .slice((this.variantNameOptions.page - 1) * ROWS_PER_PAGE, this.variantNameOptions.page * ROWS_PER_PAGE)
      },
      isDeleteSelectedDisabled () {
        return !this.selectedVariantNames.length
      },
      totalNumberOfItems () {
        return this.localValue.length
      },
      isEditable () {
        return !this.disabled
      },
      headerLabel () {
        return this.$i18n.t('component.general.variantNames')
      },
      tableHeaders () {
        return [
          { text: this.$i18n.tc('component.general.name'), align: 'left', value: 'variantName', sortable: false, width: '100%' },
          { text: this.$i18n.t('component.general.language.label'), align: 'left', value: 'locale', sortable: false },
        ]
      },
      title () {
        return this.showTitle ? this.$i18n.tc('component.variantName.label', 2) : undefined
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
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: [this.selectedVariantNames.length, this.$i18n.tc('component.variantName.label', this.selectedVariantNames.length)] }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      confirmDeleteItem ({ id, variantName }) {
        this.actionToConfirm = '_deleteItem'
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: ['', variantName] }
        this.parameterToConfirm = id
        this.confirmationPopUpVisible = true
      },
      _deleteSelected () {
        // console.log('_deleteSelected')
        this.localValue = this.localValue.filter(({ id }) => !this.selectedVariantNames
          .find(({ id: selectedId }) => id === selectedId))
        this.selectedVariantNames = []
        this.$emit('update', 'variants')
      },
      _deleteItem (idToDelete) {
        this.localValue = this.localValue.filter(({ id }) => id !== idToDelete)
        this.selectedVariantNames = this.selectedVariantNames.filter(({ id }) => id !== idToDelete)
        this.$emit('update', 'variants')
      },
      showAddVariantName () {
        this.addItemPopupVisible = true
      },
      normalizeVariant (variant) {
        var result = variant.normalize('NFKD').replace(/[^\w]/g, '')
        return result
      },
      addItem (item) {
        if (!this.localValue.find(({ variantName }) => this.normalizeVariant(variantName) === this.normalizeVariant(item.variantName))) {
          this.localValue.push({ id: this.tempId(), variantName: item.variantName, locale: item.locale, variantType: null, isDeletable: true, _pending: 'added' })
          this.$emit('update', 'variants')
        } else {
          this.errorMessage = this.$i18n.t('component.variantName.error.duplicate', [item.variantName])
          this.showErrorMessage = true
        }
      }
    }
  }
</script>
