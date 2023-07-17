<template>
  <v-container>
    <v-form
      ref="form"
      @input="$emit('valid', $event)"
      @submit.prevent="doSubmit"
    >
      <v-card flat>
        <v-toolbar
          flat
          :color="toolbarBackground"
          height="70px"
        >
          <div class="ml-3">
            <v-toolbar-title>
              <div class="text-h4">{{ title }}</div>
              <div v-if="subTitle">{{ subTitle }}</div>
            </v-toolbar-title>
          </div>
        </v-toolbar>
        <v-card-text>
          <slot />
        </v-card-text>
        <v-card-actions class="ml-6 mr-6">
          <slot name="buttons" />
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script>
  export default {
    name: 'GokbPage',
    props: {
      title: {
        type: String,
        required: false,
        default: 'missing title for page'
      },
      subTitle: {
        type: String,
        required: false,
        default: undefined
      },
      width: {
        type: String,
        required: false,
        default: '1400px'
      }
    },
    computed: {
      toolbarBackground () {
        return this.$vuetify.theme.dark ? '#121212' : '#ffffff'
      }
    },
    methods: {
      doSubmit () {
        this.$emit('submit', this.$refs.form)
      },
      validate () {
        this.$refs.validate()
      }
    }
  }
</script>
