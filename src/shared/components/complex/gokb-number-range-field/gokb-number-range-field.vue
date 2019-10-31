<template>
  <v-row>
    <v-col>
      <gokb-number-field :label="labelFrom" />
    </v-col>
    <v-col>
      <gokb-number-field :label="labelTo" />
    </v-col>
  </v-row>
</template>
<script>
  export default {
    name: 'GokbNumberRangeField',
    props: {
      labelFrom: {
        type: String,
        required: false,
        default: undefined,
      },
      labelTo: {
        type: String,
        required: false,
        default: undefined,
      },
    },
  }
</script>
