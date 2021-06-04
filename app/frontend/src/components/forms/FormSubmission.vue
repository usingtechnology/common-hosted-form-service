<template>
  <div class="mt-5">
    <div v-if="loading">
      <v-skeleton-loader type="article" />
    </div>
    <div v-else>
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <h1>{{ form.name }}</h1>
          <p>
            <strong>Submitted: </strong>
            {{ formSubmission.createdAt | formatDateLong }} <br />
            <strong>Confirmation ID: </strong>
            {{ formSubmission.confirmationId }}
            <br />
            <strong>Submitted By: </strong> {{ formSubmission.createdBy }}
            <br />
          </p>
        </v-col>
        <v-spacer />
        <v-col class="text-sm-right" cols="12" sm="6">
          <span>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <router-link
                  :to="{ name: 'FormSubmissions', query: { f: form.id } }"
                >
                  <v-btn
                    class="mx-1"
                    color="primary"
                    icon
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon class="mr-1">view_list</v-icon>
                  </v-btn>
                </router-link>
              </template>
              <span>View All Submissions</span>
            </v-tooltip>
          </span>

          <DeleteSubmission :submissionId="submissionId" />
        </v-col>
      </v-row>
    </div>

    <v-row>
      <!-- The form submission -->
      <v-col
        cols="12"
        :md="form.enableStatusUpdates ? 8 : 12"
        class="pl-0 pt-0"
      >
        <v-card outlined class="review-form">
          <v-row no-gutters>
            <v-col cols="12" sm="6">
              <h2 class="review-heading">Submission</h2>
            </v-col>
            <v-spacer />
            <v-col
              v-if="form.enableStatusUpdates"
              class="text-sm-right"
              cols="12"
              sm="6"
            >
              <span v-if="submissionReadOnly">
                <AuditHistory :submissionId="submissionId" />
                <v-tooltip bottom>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      class="mx-1"
                      @click="toggleSubmissionEdit(true)"
                      color="primary"
                      :disabled="!submissionReadOnly"
                      icon
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mode_edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Edit This Submission</span>
                </v-tooltip>
              </span>
              <v-btn
                v-else
                outlined
                color="textLink"
                @click="toggleSubmissionEdit(false)"
              >
                <span>CANCEL</span>
              </v-btn>
            </v-col>
          </v-row>
          <FormViewer
            :displayTitle="false"
            :submissionId="submissionId"
            :readOnly="submissionReadOnly"
            :key="reRenderSubmission"
            @submission-updated="toggleSubmissionEdit(false)"
          />
        </v-card>
      </v-col>

      <!-- Status updates and notes -->
      <v-col
        v-if="form.enableStatusUpdates"
        cols="12"
        md="4"
        class="pl-0 pt-0 d-print-none"
        order="first"
        order-md="last"
      >
        <v-card outlined class="review-form">
          <h2 class="review-heading">Status</h2>
          <StatusPanel
            :submissionId="submissionId"
            :formId="form.id"
            @note-updated="refreshNotes"
          />
        </v-card>
        <v-card outlined class="review-form">
          <h2 class="review-heading">Notes</h2>
          <NotesPanel :submissionId="submissionId" ref="notesPanel" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import AuditHistory from '@/components/forms/submission/AuditHistory.vue';
import DeleteSubmission from '@/components/forms/submission/DeleteSubmission.vue';
import FormViewer from '@/components/designer/FormViewer.vue';
import NotesPanel from '@/components/forms/submission/NotesPanel.vue';
import StatusPanel from '@/components/forms/submission/StatusPanel.vue';

export default {
  name: 'FormSubmission',
  components: {
    AuditHistory,
    DeleteSubmission,
    FormViewer,
    NotesPanel,
    StatusPanel,
  },
  props: {
    submissionId: String,
  },
  data() {
    return {
      loading: true,
      reRenderSubmission: 0,
      submissionReadOnly: true,
    };
  },
  computed: mapGetters('form', ['form', 'formSubmission', 'permissions']),
  methods: {
    ...mapActions('form', ['fetchSubmission', 'getFormPermissionsForUser']),
    refreshNotes() {
      this.$refs.notesPanel.getNotes();
    },
    toggleSubmissionEdit(editing) {
      this.submissionReadOnly = !editing;
      this.reRenderSubmission += 1;
    },
  },
  async mounted() {
    await this.fetchSubmission({ submissionId: this.submissionId });
    // get current user's permissions on associated form
    await this.getFormPermissionsForUser(this.form.id);
    this.loading = false;
  },
};
</script>

<style lang="scss" scoped>
.review-form {
  margin-bottom: 2em;
  padding: 1em;
  background-color: #fafafa;
  .review-heading {
    color: #003366;
  }
}
</style>