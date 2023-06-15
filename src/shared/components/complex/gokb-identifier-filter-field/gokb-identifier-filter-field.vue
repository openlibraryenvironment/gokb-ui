<template>
  <v-row>
    <v-col cols="4">
      <gokb-namespace-field
        v-model="namespace"
        :target-type="targetType"
        width="200px"
        :label="$tc('component.identifier.namespace')"
      />
    </v-col>
    <v-col cols="8">
      <gokb-text-field
        v-model="val"
        :label="$tc('component.identifier.label')"
        clearable
      />
    </v-col>
  </v-row>
</template>
<script>
  import GokbNamespaceField from '@/shared/components/simple/gokb-namespace-field'
  import GokbTextField from '@/shared/components/base/gokb-text-field'

  export default {
    name: 'GokbIdentifierFilterField',
    components: { GokbNamespaceField, GokbTextField },
    props: {
      targetType: {
        type: String,
        required: false,
        default: undefined
      },
      value: {
        required: true,
        default: '',
      }
    },
    data () {
      return {
        namespace: undefined,
        val: undefined,
      }
    },
    watch: {
      value (val) {
        if (!val) {
          this.namespace = undefined
          this.val = undefined
        }
      },
      namespace () {
        this.emitFinal()
      },
      val () {
        this.emitFinal()
      }
    },
    methods: {
      emitFinal () {
        let result = this.val

        if (!!this.namespace) {
          result = this.namespace.value + ',' + (result || '*')
        }

        this.$emit('input', result)
      }
    }
  }
</script>
