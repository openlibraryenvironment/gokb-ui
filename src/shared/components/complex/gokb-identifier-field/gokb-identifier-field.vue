<template>
  <v-row>
    <v-col v-if="!namespaceFixed">
      <gokb-namespace-field
        v-model="localNamespace"
        :label="$tc('component.identifier.namespace')"
      />
    </v-col>
    <v-col>
      <gokb-text-field
        v-model="localValue"
        :disabled="disabled"
        :label="namespaceFixed ? localNamespace.name : $tc('component.identifier.label')"
        :append-icon="deleteIcon"
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
        default: () => ({ value: undefined, namespace: { id: undefined, name: undefined } })
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
    }
  }
</script>
