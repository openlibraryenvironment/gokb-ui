<template>
  <div>
    <div>
      <gokb-add-comment-popup
        v-if="addCommentPopupVisible"
        v-model="addCommentPopupVisible"
        @add="addNewComment"
      />
      <span>Languages:</span>
      <span v-for="comment in localValue">
        <v-chip
          v-if="activeLang === comment.language.name"
          class="font-weight-bold mx-1"
          variant="elevated"
          color="info"
          style="cursor:default"
          density="comfortable"
          label>
          {{ comment.language.name }}
        </v-chip>
        <v-chip
          v-else
          class="text-underlined mx-1"
          variant="outlined"
          style="cursor:pointer"
          density="comfortable"
          label
          @click="selectActiveLang(comment.language.name)"
        >
          {{ comment.language.name }}
        </v-chip>
      </span>
      <v-btn color="primary" size="small" class="ml-2" @click="showAddCommentPopup"> <v-icon>mdi-plus-thick</v-icon></v-btn>
    </div>
    <div v-for="comment in localValue" class="mt-2">
      <v-textarea
        v-if="comment.language.name === activeLang"
        v-model="comment.value"
        :readonly="!disabled || !editEnabled"
      />
    </div>
    <div v-if="!activeLang">
      No comment for your language!
    </div>
  </div>
</template>

<script>
  import languageServices from '@/shared/services/language-services'
  import GokbAddCommentPopup from '@/shared/popups/gokb-add-comment-popup'

  export default {
    name: 'GokbCommentsField',
    components: { GokbAddCommentPopup },
    emits: ['update:model-value', 'update'],
    props: {
      modelValue: {
        type: Array,
        required: true
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {
        addCommentPopupVisible: false,
        showError: false,
        activeLang: undefined,
        editEnabled: false
      }
    },
    computed: {
      localValue: {
        get () {
          return this.modelValue
        },
        set (localValue) {
          this.$emit('update:model-value', localValue)
        }
      },
      currentLocale () {
        return this.$i18n.locale
      }
    },
    watch: {
    },
    created () {
      this.selectActiveLang(this.currentLocale)
    },
    methods: {
      tempId () {
        return 'tempId' + Math.random().toString(36).substring(2, 5)
      },
      addNewComment (cmt) {
        if (this.localValue.some(item => (item.language.name == cmt.language.name))) {
          this.errorMessage = this.$i18n.t('component.comments.validation.list.duplicate')
          this.showError = true
        }
        else {
          this.localValue.push({
            id: this.tempId(),
            value: cmt.value,
            language: cmt.language,
            isDeletable: undefined,
            _pending: 'added'
          })
        }

        this.selectActiveLang(cmt.language.name)

        this.$emit('update', 'comments')
      },
      selectActiveLang(lang) {
        let cmt_eng = this.localValue.filter(item => (item.language.name === 'eng'))
        let cmt_ger = this.localValue.filter(item => (item.language.name === 'ger'))

        if (lang === 'en') {
          this.activeLang = !!cmt_eng ? 'eng' : undefined
        }
        else if (lang === 'de') {
          this.activeLang = !!cmt_ger ? 'ger' : (!!cmt_eng ? 'eng' : undefined)
        }
        else {
          this.activeLang = this.localValue.filter(item => (item.language.name === lang)) ? lang : undefined
        }
      },
      showAddCommentPopup() {
        this.addCommentPopupVisible = true
      }
    }
  }
</script>
