<template>
  <gokb-dialog
    v-model="localValue"
    title="Rolle hinzufügen"
    @submit="addRole"
  >
    <gokb-role-field
      v-model="selectedRole"
      label="Rollen"
      return-object
    />
    <template #buttons>
      <v-spacer />
      <gokb-button
        text
        @click.native="close"
      >
        Abbrechen
      </gokb-button>
      <gokb-button
        :disabled="!selectedRole"
        default
      >
        Hinzufügen
      </gokb-button>
    </template>
  </gokb-dialog>
</template>

<script>
  import BaseComponent from '@/shared/base-component'
  import GokbRoleField from '@/shared/components/simple/gokb-role-field'

  export default {
    name: 'AddRolePopup',
    components: { GokbRoleField },
    extends: BaseComponent,
    props: {
      value: {
        type: Boolean,
        required: true,
        default: false
      },
    },
    data () {
      return {
        error: undefined,
        roles: undefined,
        selectedRole: undefined,
      }
    },
    computed: {
      localValue: {
        get () {
          return this.value
        },
        set (localValue) {
          this.$emit('input', localValue)
        }
      },
    },
    methods: {
      addRole () {
        this.$emit('add', this.selectedRole)
        this.close()
      },
      close () {
        this.localValue = false
      }
    }
  }
</script>
