<template>
  <v-dialog
    :model-value="localValue"
    :persistent="persistent"
    :fullscreen="fullscreen"
    :width="width"
    :retain-focus="false"
    scrollable
    @keydown="closeWithEscape"
  >
    <v-form
      ref="form"
      :value="isValid"
      @submit.prevent="doSubmit"
    >
      <v-card class="elevation-12">
        <v-card-title class="pt-0 px-0">
          <v-toolbar
            :color="appColor"
            theme="dark"
          >
            <v-toolbar-title>
              {{ title }}
            </v-toolbar-title>
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
    props: {
      modelValue: {
        type: Boolean,
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
        default: 400
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
      }
    },
    data () {
      return {
        appColor: import.meta.env.VUE_APP_COLOR || '#4f4f4f',
      }
    },
    computed: {
      localValue: {
        get () {
          return this.modelValue
        },
        set (localValue) {
          this.$emit('update:modelValue', localValue)
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
        if (this.$refs.form.validate()) {
          this.$emit('submit', this.$refs.form)
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
