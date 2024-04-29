<template>
  <gokb-dialog
    ref="comp"
    v-model="localValue"
    :title="$t('header.add.label', [$tc('component.identifier.label')])"
    :width="width"
    @submit="addItem"
  >
    <v-row>
      <v-col>
        <gokb-namespace-field
          v-model="item.namespace"
          :readonly="namespaceFixed"
          :target-type="targetType"
          required
          width="140px"
          :label="$tc('component.identifier.namespace')"
        />
      </v-col>
      <v-col>
        <gokb-text-field
          ref="valueTextField"
          v-model="item.value"
          :disabled="disabled || !item.namespace"
          :label="namespaceFixed ? item.namespace.name : $tc('component.identifier.label')"
          :rules="rules"
          :validate-on-blur="false"
          :append-icon="deleteIcon"
          required
          @click:append="clearVal"
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
  import genericServices from '@/shared/services/generic-entity-services'

  export default {
    name: 'GokbAddIdentifierPopup',
    extends: BaseComponent,
    emits: ['update:model-value', 'add'],
    props: {
      modelValue: {
        type: Boolean,
        required: true
      },
      namespaceFixed: {
        type: Boolean,
        required: false,
        default: false
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
          value: undefined,
          namespace: undefined
        },
        failedValidation: false
      }
    },
    computed: {
      deleteIcon () {
        return this.deleteable ? 'delete' : undefined
      },
      localValue: {
        get () {
          return this.modelValue || true
        },
        set (localValue) {
          this.$emit('update:model-value', localValue)
        }
      },
      isValid () {
        return !!this.item.namespace && !!this.item.value && !this.failedValidation
      },
      rules () {
        return [
          val => val?.length > 0 || this.$i18n.t('validation.missingValue'),
          (this.failedValidation === false) || this.$i18n.t('component.identifier.validation.generic')
        ]
      },
    },
    watch: {
      'item.value' (val) {
        if (val?.length > 0) {
          this.checkValue()
        }
      }
    },
    methods: {
      validate ({ def }) {
        if (this.$refs.valueTextField) {
          this.$refs.valueTextField.validate({ def })
        }
      },
      async addItem () {
        var valid = await this.checkValue()

        if (!valid) {
          this.validate(false)
        } else {
          this.$emit('add', this.item)
          this.close()
        }
      },
      close () {
        this.localValue = false
      },
      clearVal () {
        this.item.value = undefined
      },
      async checkValue() {
        var response = await genericServices('rest/entities').checkIdentifier(
          this.item.value,
          this.item.namespace.value,
          this.cancelToken.token
        )

        if (response?.status < 400) {
          if (response.data.result === 'ERROR') {
            this.failedValidation = true
            return false
          } else {
            this.failedValidation = false
            return true
          }
        } else {
          this.failedValidation = false
          return true
        }
      }
    }
  }
</script>
