<template>
  <v-container style="max-width: 1000px;">
    <v-form @submit.prevent="doSubmit">
      <v-card flat>
        <v-toolbar
          color="white"
          dense
          flat
          height="32"
        >
          <div class="ml-3">
            <v-toolbar-title class="display-1">
              {{ title }}
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
    name: 'PageComponent',
    props: {
      title: {
        type: String,
        required: false,
        default: 'missing title for page'
      },
    },
    data () {
      return {}
    },
    methods: {
      doSubmit () {
        this.$emit('submit')
      }
    }
  }
</script>
