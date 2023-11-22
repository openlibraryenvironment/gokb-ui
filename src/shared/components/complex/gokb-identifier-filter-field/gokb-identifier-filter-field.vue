<template>
  <div style="margin-top:-8px">
    <div style="font-size:13px;margin-bottom:4px"> {{ $tc('component.identifier.label') }} </div>
    <v-row dense>
      <v-col cols="4">
        <gokb-namespace-field
          v-model="namespace"
          :target-type="targetType"
          width="200px"
          :placeholder="$tc('component.identifier.namespace')"
          dense
        />
      </v-col>
      <v-col cols="8">
        <gokb-text-field
          v-model="val"
          :placeholder="$tc('component.identifier.value')"
          clearable
          dense
        />
      </v-col>
    </v-row>
  </div>
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
