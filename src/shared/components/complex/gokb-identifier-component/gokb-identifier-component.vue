<template>
  <v-row>
    <v-col>
      <gokb-namespace-field />
    </v-col>
    <v-col>
      <gokb-text-field label="Identifikator" />
    </v-col>
  </v-row>
</template>
<script>
  import GokbNamespaceField from '@/shared/components/simple/gokb-namespace-field'
  import GokbTextField from '@/shared/components/base/gokb-text-field'

  export default {
    name: 'GokbIdentifierComponent',
    components: { GokbNamespaceField, GokbTextField },
    props: {
    }
  }
</script>
