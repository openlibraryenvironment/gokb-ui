<template>
  <v-row>
    <v-col v-if="!namespaceFixed">
      <gokb-namespace-field v-model="localValue.namespace.id" />
    </v-col>
    <v-col>
      <gokb-text-field
        v-model="localValue.value"
        :label="namespaceFixed ? localValue.namespace.name : 'Identifikator'"
        :append-icon="deleteIcon"
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
      deleteable: {
        type: Boolean,
        required: false
      },
      value: {
        type: Object,
        required: true,
      },
    },
    computed: {
      deleteIcon () {
        return this.deleteable ? 'delete' : undefined
      },
      colsNamespace () {
        return this.namespaceFixed ? 1 : 6
      },
      localValue: {
        get () {
          return this.value
        },
        set (localValue) {
          this.$emit('input', localValue)
        }
      },
    }
  }
</script>
