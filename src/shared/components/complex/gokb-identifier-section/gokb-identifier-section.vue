<template>
  <gokb-section
    expandable
    :hide-default="!expanded"
    :sub-title="title"
    :items-total="totalNumberOfItems"
    :mark-required="markRequired"
    :errors="!!apiErrors"
  >
    <gokb-add-identifier-popup
      v-if="addIdentifierPopupVisible"
      v-model="addIdentifierPopupVisible"
      :target-type="targetType"
      @add="addNewIdentifier"
    />
    <v-snackbar v-model="showError" color="error">
      {{ errorMessage }}
    </v-snackbar>
    <template #buttons>
      <gokb-button
        v-if="isEditable"
        icon-id="mdi-plus"
        color="primary"
        @click.prevent="showAddIdentifierPopup"
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
        {{ $i18n.t('btn.remove') }}
      </gokb-button>
    </template>

    <gokb-confirmation-popup
      v-model="confirmationPopUpVisible"
      :message="messageToConfirm"
      @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
    />
    <gokb-table
      :headers="tableHeaders"
      :items="identifiers"
      :editable="isEditable"
      :selected-items="selectedItems"
      :total-number-of-items="totalNumberOfItems"
      :options.sync="idsOptions"
      :hide-select="!isEditable"
      @selected-items="selectedItems = $event"
      @delete-item="confirmDeleteItem"
      @paginate="updateItems"
      actions
    />
  </gokb-section>
</template>

<script>
  import GokbAddIdentifierPopup from '@/shared/popups/gokb-add-identifier-popup'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import namespaceServices from '@/shared/services/namespace-services'

  const ROWS_PER_PAGE = 10

  export default {
    name: 'GokbIdentifierSection',
    emits: ['update:model-value', 'update'],
    components: {
      GokbAddIdentifierPopup,
      GokbConfirmationPopup
    },
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
      showTitle: {
        type: Boolean,
        required: false,
        default: true
      },
      expanded: {
        type: Boolean,
        required: false,
        default: true
      },
      targetType: {
        type: String,
        required: false,
        default: undefined
      },
      apiErrors: {
        type: Array,
        required: false,
        default: undefined
      },
      rules: {
        type: Array,
        required: false,
        default: undefined
      },
      markRequired: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
        addIdentifierPopupVisible: false,
        idsOptions: {
          page: 1,
          itemsPerPage: ROWS_PER_PAGE
        },
        selectedItems: [],
        identifiers: [],
        confirmationPopUpVisible: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: { text: undefined, vars: undefined },
        showError: false,
        errorMessage: undefined
      }
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
            title: this.$i18n.tc('component.identifier.namespace'),
            align: 'start',
            value: 'nslabel',
            sortable: false,
            width: '15%'
          },
          {
            title: this.$i18n.t('component.identifier.value'),
            align: 'start',
            value: 'value',
            sortable: false,
            width: '100%'
          }
        ]
      },
      title () {
        return this.showTitle ? this.$i18n.tc('component.identifier.label', 2) : undefined
      }
    },
    watch: {
      modelValue: {
        deep: true,
        handler () {
          this.updateItems()
        }
      },
      apiErrors () {
        this.updateItems()
      },
      '$i18n.locale' () {
        this.updateItems()
      }
    },
    mounted () {
      this.updateItems()
    },
    methods: {
      executeAction (actionMethodName, actionMethodParameter) {
        this[actionMethodName](actionMethodParameter)
      },
      tempId () {
        return 'tempId' + Math.random().toString(36).substring(2, 5)
      },
      confirmDeleteSelectedItems () {
        this.actionToConfirm = '_deleteSelectedItems'
        this.messageToConfirm = {
          text: 'popups.confirm.delete.list',
          vars: [this.selectedItems.length, this.$i18n.tc('component.identifier.label', this.selectedItems.length)]
        }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      confirmDeleteItem ({ id, value }) {
        this.actionToConfirm = '_deleteItem'
        this.messageToConfirm = {
          text: 'popups.confirm.delete.list',
          vars: [this.$i18n.tc('component.identifier.label'), value]
        }
        this.parameterToConfirm = id
        this.confirmationPopUpVisible = true
      },
      _deleteSelectedItems () {
        this.localValue = this.localValue.filter(({ id }) => !this.selectedItems
          .find(({ id: selectedId }) => id === selectedId))
        this.selectedItems = []

        this.$emit('update', 'ids')
      },
      _deleteItem (idToDelete) {
        this.localValue = this.localValue.filter(({ id }) => id !== idToDelete)
        this.selectedItems = this.selectedItems.filter(({ id }) => id !== idToDelete)

        this.$emit('update', 'ids')
      },
      showAddIdentifierPopup () {
        this.addIdentifierPopupVisible = true
      },
      addNewIdentifier (id) {

        if (this.localValue.filter(v => v.value === id.value && v.namespace === id.namespace.value).length > 0) {
          this.errorMessage = this.$i18n.t('component.identifier.validation.list.duplicate')
          this.showError = true
        }
        else {
          this.localValue.push({
            id: this.tempId(),
            value: id.value,
            namespace: id.namespace.value,
            nslabel: (id.namespace.name || id.namespace.value),
            isDeletable: undefined,
            _pending: 'added'
          })
        }

        this.$emit('update', 'ids')
      },
      deleteIdentifier (value) {
        this.localValue = this.localValue.filter(v => v !== value)
      },
      async updateItems (options) {
        if (!!options) {
          this.idsOptions = options
        }

        this.identifiers = this.localValue.map(item => ({
          ...item,
          nslabel: item.nslabel || item.type,
          extlink: namespaceServices.getBaseurl(item.namespace) ? namespaceServices.getBaseurl(item.namespace)+item.value : undefined,
          markError: this.mapErrorForItem(item),
          isDeletable : undefined
        }))
        .sort(({ nslabel: first }, { nslabel: second }) => (first > second) ? 1 : (second > first) ? -1 : 0)
        .slice((this.idsOptions.page - 1) * this.idsOptions.itemsPerPage, this.idsOptions.page * this.idsOptions.itemsPerPage)
      },
      mapErrorForItem (item) {
        let result = null

        this.apiErrors?.forEach(e => {
          if (e.baddata[0].value === item.value && e.baddata[0].type === item.namespace) {
            result = (e.messageCode ? this.$i18n.t(e.messageCode, [e.baddata[0].value]) : this.$i18n.t('component.identifier.validation.value', [e.baddata[0].value]))
          }
        })

        return result
      }
    }
  }
</script>
