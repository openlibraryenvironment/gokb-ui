<template>
  <div>
    <v-row>
      <v-col>
        <gokb-text-field
          v-model="localName"
          :disabled="disabled"
          :required="true"
          :label="'Name'"
          :append-icon="deleteIcon"
          @click:append="$emit('delete', value)"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <gokb-url-field
          v-model="localUrl"
          :disabled="disabled"
          :required="true"
          label="URL"
          :append-icon="deleteIcon"
          @click:append="$emit('delete', value)"
        />
      </v-col>
    </v-row>
  </div>
</template>
<script>
  import GokbTextField from '@/shared/components/base/gokb-text-field'
  import GokbUrlField from '@/shared/components/simple/gokb-url-field'

  export default {
    name: 'GokbPlatformField',
    components: { GokbTextField, GokbUrlField },
    props: {
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
        default: () => ({ name: undefined, primaryUrl: undefined })
      },
    },
    computed: {
      deleteIcon () {
        return this.deleteable ? 'delete' : undefined
      },
      localName: {
        get () {
          return this.value.name
        },
        set (name) {
          this.$emit('input', { name, primaryUrl: this.value.primaryUrl })
        }
      },
      localUrl: {
        get () {
          return this.value.primaryUrl
        },
        set (primaryUrl) {
          this.$emit('input', { name: this.value.name, primaryUrl })
        }
      },
    }
  }
</script>
