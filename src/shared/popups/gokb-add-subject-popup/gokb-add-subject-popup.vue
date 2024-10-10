<template>
  <gokb-dialog
    ref="comp"
    v-model="localValue"
    :title="$t('header.add.label', [$tc('component.subject.label')])"
    :width="width"
    @submit="addItem"
  >
    <v-row>
      <v-col>
        <gokb-state-field
          v-model="item.scheme"
          width="100%"
          message-path="component.subject.scheme"
          url="refdata/categories/Subject.Scheme"
          :placeholder="$tc('component.subject.scheme.label')"
          return-object
        />
      </v-col>
      <v-col>
        <v-autocomplete
          v-if="!!item.scheme && item.scheme.name === 'DDC'"
          v-model="selectedClass"
          :disabled="!item.scheme"
          :items="$options.ddcList"
          :item-title="currentLabel"
          item-value="notation"
          :label="$tc('component.subject.heading.label')"
          variant="underlined"
          return-object
          required
          @click:append="$emit('delete', value)"
        />
      </v-col>
    </v-row>
    <template #buttons>
      <v-spacer />
      <gokb-button
        text
        @click="close"
      >
        {{ $t('btn.cancel') }}
      </gokb-button>
      <gokb-button
        :disabled="!isValid"
        is-submit
      >
        {{ $t('btn.add') }}
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/components/base-component'
  import DDC from '@/resources/ddc_list.json'

  export default {
    name: 'GokbAddSubjectPopup',
    extends: BaseComponent,
    emits: ['update:model-value', 'add', 'delete'],
    ddcList: DDC,
    props: {
      modelValue: {
        type: Boolean,
        required: true
      },
      namespaceFixed: {
        type: Boolean,
        required: false
      },
      targetType: {
        type: String,
        required: false,
        default: undefined
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      deleteable: {
        type: Boolean,
        required: false
      },
      width: {
        type: [Number, String],
        required: false,
        default: 400
      }
    },
    data () {
      return {
        item: {
          heading: undefined,
          label: undefined,
          scheme: undefined
        },
        knownSchemes: {
          DDC: {
            lookupOnly: true,
            itemValue: 'notation',
            itemText: 'label'
          }
        },
        selectedClass: undefined
      }
    },
    computed: {
      deleteIcon () {
        return this.deleteable ? 'delete' : undefined
      },
      isValid () {
        return !!this.item.scheme && !!this.item.heading
      },
      currentLabel () {
        return (!!this.item.scheme && !!this.knownSchemes[this.item.scheme.value]) ? this.knownSchemes[this.item.scheme.value].itemText + '.' + this.$i18n.locale : undefined
      },
      localValue: {
        get () {
          return this.modelValue || true
        },
        set (localValue) {
          this.$emit('update:model-value', localValue)
        }
      },
    },
    watch: {
      selectedClass (val) {
        this.item.heading = val.notation

        if (!!this.item.scheme && this.knownSchemes[this.item.scheme.value]) {
          this.item.label = val[this.knownSchemes[this.item.scheme.value].itemText][this.$i18n.locale]
        }
      }
    },
    methods: {
      async addItem () {
        this.$emit('add', this.item)
        this.close()
      },
      close () {
        this.localValue = false
      }
    }
  }
</script>
