<template>
  <v-dialog
    :model-value="localValue"
    :persistent="persistent"
    :fullscreen="fullscreen"
    :width="width"
    :min-height="minHeight"
    :retain-focus="false"
    scrollable
    @keydown.escape="closeWithEscape"
  >
    <v-form
      ref="form"
      v-model="formStatus"
      @submit.prevent="doSubmit"
    >
      <v-card class="elevation-12" :min-height="fullscreen ? '100vh' : 'undefined'">
        <v-card-title class="pt-0 px-0">
          <v-toolbar
            :color="appColor"
            theme="dark"
          >
            <div class="ml-5">
              {{ title }}
            </div>
            <v-spacer />
            <v-btn
              icon
              right
              @click="localValue = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
          <slot />
        </v-card-text>
        <v-card-actions>
          <slot name="buttons" />
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
  export default {
    name: 'GokbDialog',
    emits: ['update:model-value', 'submit', 'update-valid'],
    props: {
      modelValue: {
        type: [Boolean, Number, String],
        required: true,
        default: false
      },
      title: {
        type: String,
        required: true,
      },
      width: {
        type: [Number, String],
        required: false,
        default: 500
      },
      persistent: {
        type: Boolean,
        required: false,
        default: true
      },
      fullscreen: {
        type: Boolean,
        required: false,
        default: false
      },
      isValid: {
        type: Boolean,
        required: false,
        default: true
      },
      minHeight: {
        type: [Number, String],
        required: false,
        default: undefined
      }
    },
    data () {
      return {
        appColor: import.meta.env.VITE_COLOR || '#4f4f4f',
        formIsValid: false
      }
    },
    computed: {
      localValue: {
        get () {
          return !!this.modelValue || false
        },
        set (localValue) {
          this.$emit('update:model-value', localValue)
        }
      },
      formStatus: {
        get () {
          return this.isValid
        },
        set (localValue) {
          this.formIsValid = localValue
          this.$emit('update-valid', localValue)
        }
      }
    },
    mounted () {
      if (this.modelValue) {
        // this.$nextTick(() => {
        //   const theElement = this.$refs.form.$el
        //   const input = theElement.querySelector('input:not([type=hidden]),textarea:not([type=hidden])')
        //   if (input) {
        //     setTimeout(() => {
        //       input.focus()
        //     }, 0)
        //   }
        // })
      }
    },
    methods: {
      doSubmit () {
        if (this.$refs?.form?.validate()) {
          this.$emit('submit', true)
        }
      },
      closeWithEscape (event) {
        if (event.key === 'Escape') {
          this.localValue = false
        }
      }
    }
  }
</script>
