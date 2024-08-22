<template>
  <div style="margin-top:-5px">
    <div style="font-size:12px;margin-bottom:-16px" class="text-medium-emphasis"> {{ $tc('component.identifier.label') }} </div>
    <v-row dense>
      <v-col cols="5">
        <gokb-namespace-field
          v-model="namespace"
          :target-type="targetType"
          width="250px"
          :placeholder="$tc('component.identifier.namespace')"
          :density="dense ? 'compact' : 'default'"
        />
      </v-col>
      <v-col cols="7">
        <gokb-text-field
          v-model="val"
          :placeholder="$tc('component.identifier.value')"
          clearable
          :density="dense ? 'compact' : 'default'"
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
    emits: ['update:model-value'],
    props: {
      targetType: {
        type: String,
        required: false,
        default: undefined
      },
      modelValue: {
        required: true,
        default: '',
      },
      dense: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
        namespace: undefined,
        val: undefined,
      }
    },
    watch: {
      modelValue (val) {
        if (!val) {
          this.namespace = undefined
          this.val = undefined
        }
        else if (!this.val && !this.namespace) {
          var idparts = val.split(',')

          if (idparts.length > 1) {
            this.namespace = idparts[0]
            this.val = idparts[1] !== '*' ? idparts[1] : undefined
          }
          else {
            this.val = idparts[0]
          }
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

        this.$emit('update:model-value', result)
      }
    }
  }
</script>
