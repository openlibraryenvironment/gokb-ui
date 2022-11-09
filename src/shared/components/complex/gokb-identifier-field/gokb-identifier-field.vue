<template>
  <v-row>
    <v-col>
      <gokb-namespace-field
        v-model="localNamespace"
        :readonly="namespaceFixed"
        :target-type="targetType"
        required
        width="140px"
        :label="$tc('component.identifier.namespace')"
      />
    </v-col>
    <v-col>
      <gokb-text-field
        v-model="localValue"
        :disabled="disabled"
        :label="namespaceFixed ? localNamespace.name : $tc('component.identifier.label')"
        :rules="namespaceRules"
        :append-icon="deleteIcon"
        :validate-on-blur="false"
        @click:append="$emit('delete', value)"
      />
    </v-col>
  </v-row>
</template>
<script>
  import GokbNamespaceField from '@/shared/components/simple/gokb-namespace-field'
  import GokbTextField from '@/shared/components/base/gokb-text-field'

  export default {
    name: 'GokbIdentifierField',
    components: { GokbNamespaceField, GokbTextField },
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
      value: {
        type: Object,
        required: true,
        default: () => ({ value: undefined, namespace: { id: undefined, name: undefined, value: undefined } })
      },
    },
    computed: {
      deleteIcon () {
        return this.deleteable ? 'delete' : undefined
      },
      localValue: {
        get () {
          return this.value.value
        },
        set (value) {
          this.$emit('input', { value, namespace: this.value.namespace })
        }
      },
      localNamespace: {
        get () {
          return this.value.namespace
        },
        set (namespace) {
          this.$emit('input', { value: this.value.value, namespace })
        }
      },
      namespacePattern () {
        return this.localNamespace?.pattern && new RegExp(this.localNamespace.pattern)
      },
      namespaceRules () {
        return [
          v => v?.length > 0 || this.$i18n.t('validation.missingValue'),
          v => !this.namespacePattern || !!this.namespacePattern.test(v) || this.$i18n.t('component.identifier.validation.pattern')
        ]
      }
    }
  }
</script>
