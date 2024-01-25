<template>
  <gokb-section
    expandable
    :hide-default="!expanded"
    :sub-title="title"
    :items-total="totalNumberOfItems"
  >
    <gokb-add-item-popup
      v-if="addItemPopupVisible"
      v-model="addItemPopupVisible"
      :component="{ type: 'GokbHistoryEventField', name: $t('component.title.history.label'), properties: { sourceItem: titleInfo } }"
      @add="addItem"
    />
    <template #buttons>
      <gokb-button
        v-if="isEditable"
        color="primary"
        icon-id="mdi-plus"
        @click="showAddHistoryEvent"
      >
        {{ $i18n.t('btn.add') }}
      </gokb-button>
    </template>
    <gokb-confirmation-popup
      v-model="confirmationPopUpVisible"
      :message="messageToConfirm"
      @confirmed="executeAction(actionToConfirm, parameterToConfirm)"
    />
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              Date
            </th>
            <th class="text-left">
              From
            </th>
            <th class="text-left">
              To
            </th>
            <th class="text-center" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="event in localValue"
            :key="event.id"
            class="table-row-nohover"
          >
            <td style="max-width:150px">
              {{ event.date ? new Date(event.date).toLocaleDateString($i18n.locale) : '' }}
            </td>
            <td style="max-width:350px;white-space:nowrap;">
              <div
                v-for="item in event.from"
                :key="item.id"
              >
                <div>
                  <span
                    v-if="item.id === titleInfo.id"
                    class="font-weight-bold"
                    style="display:block;text-overflow:ellipsis;overflow:hidden;"
                  >
                    <span :title="item.name">{{ item.name }}</span>
                  </span>
                  <router-link
                    v-else
                    :style="{ color: '#f2994a', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }"
                    :to="{ name: '/title', params: { 'id': item.id } }"
                  >
                    <span :title="item.name">{{ item.name }}</span>
                  </router-link>
                </div>
              </div>
            </td>
            <td style="max-width:350px;white-space:nowrap;">
              <div
                v-for="item in event.to"
                :key="item.id"
                style="max-width:100%"
              >
                <div>
                  <span
                    v-if="item.id === titleInfo.id"
                    class="font-weight-bold"
                    style="display:block;text-overflow:ellipsis;overflow:hidden;"
                  >
                    <span :title="item.name">{{ item.name }}</span>
                  </span>
                  <router-link
                    v-else
                    :style="{ color: '#f2994a', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }"
                    :to="{ name: '/title', params: { 'id': item.id } }"
                  >
                    <span :title="item.name">{{ item.name }}</span>
                  </router-link>
                </div>
              </div>
            </td>
            <td
              class="text-center"
              style="max-width:50px"
            >
              <v-icon
                v-if="isEditable"
                :disabled="disabled"
                :title="$t('btn.delete')"
                small
                @click="confirmDeleteItem(event)"
              >
                mdi-delete
              </v-icon>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </gokb-section>
</template>

<script>
  import GokbAddItemPopup from '@/shared/popups/gokb-add-item-popup'
  import GokbConfirmationPopup from '@/shared/popups/gokb-confirmation-popup'
  import BaseComponent from '@/shared/components/base-component'

  export default {
    name: 'GokbTitleHistorySection',
    components: { GokbAddItemPopup, GokbConfirmationPopup },
    extends: BaseComponent,
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
      titleInfo: {
        type: Object,
        required: true,
      }
    },
    data () {
      return {
        addItemPopupVisible: false,
        allEvents: [],
        selectedEvents: [],
        addedItemWarning: [],
        confirmationPopUpVisible: false,
        actionToConfirm: undefined,
        parameterToConfirm: undefined,
        messageToConfirm: { text: undefined, vars: undefined }
      }
    },
    computed: {
      localValue: {
        get () {
          return this.modelValue
        },
        set (localValue) {
          this.$emit('update:modelValue', localValue)
        }
      },
      isDeleteSelectedDisabled () {
        return !this.selectedEvents.length
      },
      totalNumberOfItems () {
        return this.localValue.length
      },
      isEditable () {
        return !this.disabled
      },
      headerLabel () {
        return this.$i18n.t('component.title.history.label')
      },
      title () {
        return this.showTitle ? this.$i18n.tc('component.title.history.label', 2) : undefined
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
        this.messageToConfirm = { text: 'popups.confirm.delete.list', vars: [this.selectedEvents.length, this.$i18n.tc('component.title.history.label', this.selectedEvents.length)] }
        this.parameterToConfirm = undefined
        this.confirmationPopUpVisible = true
      },
      confirmDeleteItem ({ id }) {
        this.actionToConfirm = '_deleteItem'
        this.messageToConfirm = { text: 'popups.confirm.delete.generic', vars: [] }
        this.parameterToConfirm = id
        this.confirmationPopUpVisible = true
      },
      _deleteSelected () {
        // console.log('_deleteSelected')
        this.localValue = this.localValue.filter(({ id }) => !this.selectedEvent
          .find(({ id: selectedId }) => id === selectedId))
        this.selectedEvent = []
        this.addedItemWarning = []
      },
      _deleteItem (idToDelete) {
        this.localValue = this.localValue.filter(({ id }) => id !== idToDelete)
      },
      showAddHistoryEvent () {
        this.addItemPopupVisible = true
      },
      addItem (item) {
        var newItem = { date: item.date, id: this.tempId(), isDeletable: true }

        if (!item.date) {
          this.addedItemWarning.push(this.$i18n.t('component.title.history.add.warning.noDate'))
        }

        if (item.successor) {
          newItem.from = [this.titleInfo]
          newItem.to = [item.item]
        } else {
          newItem.from = [item.item]
          newItem.to = [this.titleInfo]
        }

        this.localValue.push(newItem)
      },
    }
  }
</script>
