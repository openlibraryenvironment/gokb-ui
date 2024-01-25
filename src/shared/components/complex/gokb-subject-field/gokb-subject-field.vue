<template>
  <div>
    <v-row>
      <gokb-state-field
        v-model="localScheme"
        width="150px"
        class="ms-4"
        message-path="component.subject.scheme"
        :init-item="scheme"
        :label="$tc('component.subject.scheme.label')"
        return-object
        required
      />
    </v-row>
    <v-row>
      <v-col>
        <gokb-text-field
          v-model="localHeading"
          :disabled="disabled"
          :label="$tc('component.subject.heading.label')"
          required
          @click:append="$emit('delete', value)"
        />
      </v-col>
    </v-row>
  </div>
</template>
<script>

  export default {
    name: 'GokbSubjectField',
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
      scheme: {
        type: String,
        required: false,
        default: undefined
      },
      modelValue: {
        type: Object,
        required: true,
        default: () => ({ scheme: undefined, heading: undefined })
      },
    },
    computed: {
      deleteIcon () {
        return this.deleteable ? 'delete' : undefined
      },
      localHeading: {
        get () {
          return this.modelValue.heading
        },
        set (heading) {
          this.$emit('update:modelValue', { heading, scheme: this.modelValue.scheme })
        }
      },
      localScheme: {
        get () {
          return this.modelValue.scheme
        },
        set (scheme) {
          this.$emit('update:modelValue', { heading: this.modelValue.heading, scheme })
        }
      },
    }
  }
</script>
