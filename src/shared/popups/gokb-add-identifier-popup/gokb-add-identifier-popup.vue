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
          :disabled="disabled"
          :label="namespaceFixed ? item.namespace.name : $tc('component.identifier.label')"
          :rules="rules"
          :validate-on-blur="false"
          :append-icon="deleteIcon"
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
        default
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
    props: {
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
          return this.value || true
        },
        set (localValue) {
          this.$emit('input', localValue)
        }
      },
      isValid () {
        return !!this.item.namespace && !!this.item.value && !this.failedValidation
      },
      rules () {
        return [
          val => val?.length > 0 || this.$i18n.t('validation.missingValue'),
          val => !this.failedValidation || this.$i18n.t('component.identifier.validation.generic')
        ]
      },
    },
    watch: {
      'item': {
        deep: true,
        handler () {
          this.failedValidation = false
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
          this.failedValidation = true
          this.validate(false)
        } else {
          this.$emit('add', this.item)
          this.close()
        }
      },
      close () {
        this.localValue = false
      },
      async checkValue() {
        var response = await genericServices('rest/entities').checkIdentifier(
          this.item.value,
          this.item.namespace.value,
          this.cancelToken.token
        )

        if (response?.status < 400) {
          if (response.data.result === 'ERROR') {
            return false
          } else {
            return true
          }
        } else {
          return true
        }
      }
    }
  }
</script>
