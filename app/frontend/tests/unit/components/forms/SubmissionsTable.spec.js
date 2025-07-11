import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import { flushPromises, mount, shallowMount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { beforeEach, expect, vi } from 'vitest';

import getRouter from '~/router';
import SubmissionsTable from '~/components/forms/SubmissionsTable.vue';
import { useAuthStore } from '~/store/auth';
import { useFormStore } from '~/store/form';

import { useAppStore } from '~/store/app';
import { FormRoleCodes } from '~/utils/constants';
import { STUBS } from '../../stubs';
import moment from 'moment';

describe('SubmissionsTable.vue', () => {
  const formId = '123-456';

  const pinia = createTestingPinia();

  const router = createRouter({
    history: createWebHistory(),
    routes: getRouter().getRoutes(),
  });

  setActivePinia(pinia);
  const authStore = useAuthStore(pinia);
  const formStore = useFormStore(pinia);
  const appStore = useAppStore(pinia);

  beforeEach(() => {
    authStore.$reset();
    formStore.$reset();
    appStore.$reset();
    formStore.form = require('../../fixtures/form.json');
  });

  it('renders', async () => {
    const getFormRolesForUserSpy = vi.spyOn(formStore, 'getFormRolesForUser');
    getFormRolesForUserSpy.mockImplementation(() => {
      formStore.roles = [
        FormRoleCodes.FORM_DESIGNER,
        FormRoleCodes.FORM_SUBMITTER,
        FormRoleCodes.OWNER,
        FormRoleCodes.SUBMISSION_APPROVER,
        FormRoleCodes.SUBMISSION_REVIEWER,
        FormRoleCodes.TEAM_MANAGER,
      ];
    });
    const getFormPermissionsForUserSpy = vi.spyOn(
      formStore,
      'getFormPermissionsForUser'
    );
    getFormPermissionsForUserSpy.mockImplementation(() => {
      formStore.permissions = require('../../fixtures/permissions.json');
    });
    const fetchFormSpy = vi.spyOn(formStore, 'fetchForm');
    fetchFormSpy.mockImplementation(() => {
      return Promise.resolve();
    });
    const fetchFormFieldsSpy = vi.spyOn(formStore, 'fetchFormFields');
    fetchFormFieldsSpy.mockImplementation(() => {
      formStore.formFields = ['firstName'];
    });

    const wrapper = mount(SubmissionsTable, {
      props: {
        formId: formId,
      },
      global: {
        plugins: [router, pinia],
      },
    });

    await flushPromises();

    expect(wrapper.text()).toContain('trans.formsTable.submissions');
  });

  it('multiDeleteMessage returns multiDelWarning, singleDeleteMessage returns singleDelWarning, multiRestoreMessage returns multiRestoreWarning, singleRestoreMessage returns singleRestoreWarning. all are translations.', () => {
    const getFormRolesForUserSpy = vi.spyOn(formStore, 'getFormRolesForUser');
    getFormRolesForUserSpy.mockImplementation(() => {
      formStore.roles = [
        FormRoleCodes.FORM_DESIGNER,
        FormRoleCodes.FORM_SUBMITTER,
        FormRoleCodes.OWNER,
        FormRoleCodes.SUBMISSION_APPROVER,
        FormRoleCodes.SUBMISSION_REVIEWER,
        FormRoleCodes.TEAM_MANAGER,
      ];
    });
    const getFormPermissionsForUserSpy = vi.spyOn(
      formStore,
      'getFormPermissionsForUser'
    );
    getFormPermissionsForUserSpy.mockImplementation(() => {
      formStore.permissions = require('../../fixtures/permissions.json');
    });
    const fetchFormSpy = vi.spyOn(formStore, 'fetchForm');
    fetchFormSpy.mockImplementation(() => {
      return Promise.resolve();
    });
    const fetchFormFieldsSpy = vi.spyOn(formStore, 'fetchFormFields');
    fetchFormFieldsSpy.mockImplementation(() => {
      formStore.formFields = ['firstName'];
    });

    const wrapper = shallowMount(SubmissionsTable, {
      props: {
        formId: formId,
      },
      global: {
        plugins: [router, pinia],
        stubs: STUBS,
      },
    });

    expect(wrapper.vm.multiDeleteMessage).toEqual(
      'trans.submissionsTable.multiDelWarning'
    );
    expect(wrapper.vm.singleDeleteMessage).toEqual(
      'trans.submissionsTable.singleDelWarning'
    );
    expect(wrapper.vm.multiRestoreMessage).toEqual(
      'trans.submissionsTable.multiRestoreWarning'
    );
    expect(wrapper.vm.singleRestoreMessage).toEqual(
      'trans.submissionsTable.singleRestoreWarning'
    );
  });

  it('showFormManage returns true if the permissions contains FormManagePermissions', () => {
    const getFormRolesForUserSpy = vi.spyOn(formStore, 'getFormRolesForUser');
    getFormRolesForUserSpy.mockImplementation(() => {
      formStore.roles = [
        FormRoleCodes.FORM_DESIGNER,
        FormRoleCodes.FORM_SUBMITTER,
        FormRoleCodes.OWNER,
        FormRoleCodes.SUBMISSION_APPROVER,
        FormRoleCodes.SUBMISSION_REVIEWER,
        FormRoleCodes.TEAM_MANAGER,
      ];
    });
    const getFormPermissionsForUserSpy = vi.spyOn(
      formStore,
      'getFormPermissionsForUser'
    );
    getFormPermissionsForUserSpy.mockImplementation(() => {
      formStore.permissions = require('../../fixtures/permissions.json');
    });
    const fetchFormSpy = vi.spyOn(formStore, 'fetchForm');
    fetchFormSpy.mockImplementation(() => {
      return Promise.resolve();
    });
    const fetchFormFieldsSpy = vi.spyOn(formStore, 'fetchFormFields');
    fetchFormFieldsSpy.mockImplementation(() => {
      formStore.formFields = ['firstName'];
    });

    const wrapper = shallowMount(SubmissionsTable, {
      props: {
        formId: formId,
      },
      global: {
        plugins: [router, pinia],
        stubs: STUBS,
      },
    });

    expect(wrapper.vm.showFormManage).toBeTruthy();

    formStore.permissions = [];

    expect(wrapper.vm.showFormManage).toBeFalsy();
  });

  it('showSelectColumns returns true if the permissions contains FormManagePermissions and submission read/update', () => {
    const getFormRolesForUserSpy = vi.spyOn(formStore, 'getFormRolesForUser');
    getFormRolesForUserSpy.mockImplementation(() => {
      formStore.roles = [
        FormRoleCodes.FORM_DESIGNER,
        FormRoleCodes.FORM_SUBMITTER,
        FormRoleCodes.OWNER,
        FormRoleCodes.SUBMISSION_APPROVER,
        FormRoleCodes.SUBMISSION_REVIEWER,
        FormRoleCodes.TEAM_MANAGER,
      ];
    });
    const getFormPermissionsForUserSpy = vi.spyOn(
      formStore,
      'getFormPermissionsForUser'
    );
    getFormPermissionsForUserSpy.mockImplementation(() => {
      formStore.permissions = require('../../fixtures/permissions.json');
    });
    const fetchFormSpy = vi.spyOn(formStore, 'fetchForm');
    fetchFormSpy.mockImplementation(() => {
      return Promise.resolve();
    });
    const fetchFormFieldsSpy = vi.spyOn(formStore, 'fetchFormFields');
    fetchFormFieldsSpy.mockImplementation(() => {
      formStore.formFields = ['firstName'];
    });

    const wrapper = shallowMount(SubmissionsTable, {
      props: {
        formId: formId,
      },
      global: {
        plugins: [router, pinia],
        stubs: STUBS,
      },
    });

    expect(wrapper.vm.showSelectColumns).toBeTruthy();

    formStore.permissions = [];

    expect(wrapper.vm.showSelectColumns).toBeFalsy();
  });

  it('showSubmissionsExport returns true if the permissions contains FormManagePermissions', () => {
    const getFormRolesForUserSpy = vi.spyOn(formStore, 'getFormRolesForUser');
    getFormRolesForUserSpy.mockImplementation(() => {
      formStore.roles = [
        FormRoleCodes.FORM_DESIGNER,
        FormRoleCodes.FORM_SUBMITTER,
        FormRoleCodes.OWNER,
        FormRoleCodes.SUBMISSION_APPROVER,
        FormRoleCodes.SUBMISSION_REVIEWER,
        FormRoleCodes.TEAM_MANAGER,
      ];
    });
    const getFormPermissionsForUserSpy = vi.spyOn(
      formStore,
      'getFormPermissionsForUser'
    );
    getFormPermissionsForUserSpy.mockImplementation(() => {
      formStore.permissions = require('../../fixtures/permissions.json');
    });
    const fetchFormSpy = vi.spyOn(formStore, 'fetchForm');
    fetchFormSpy.mockImplementation(() => {
      return Promise.resolve();
    });
    const fetchFormFieldsSpy = vi.spyOn(formStore, 'fetchFormFields');
    fetchFormFieldsSpy.mockImplementation(() => {
      formStore.formFields = ['firstName'];
    });

    const wrapper = shallowMount(SubmissionsTable, {
      props: {
        formId: formId,
      },
      global: {
        plugins: [router, pinia],
        stubs: STUBS,
      },
    });

    expect(wrapper.vm.showSubmissionsExport).toBeTruthy();

    formStore.permissions = [];

    expect(wrapper.vm.showSubmissionsExport).toBeFalsy();
  });

  it('userColumns will return the values inside of userFormPreferences.value.preferences.columns filtered by the specified formFields or an empty array', () => {
    const getFormRolesForUserSpy = vi.spyOn(formStore, 'getFormRolesForUser');
    getFormRolesForUserSpy.mockImplementation(() => {
      formStore.roles = [
        FormRoleCodes.FORM_DESIGNER,
        FormRoleCodes.FORM_SUBMITTER,
        FormRoleCodes.OWNER,
        FormRoleCodes.SUBMISSION_APPROVER,
        FormRoleCodes.SUBMISSION_REVIEWER,
        FormRoleCodes.TEAM_MANAGER,
      ];
    });
    const getFormPermissionsForUserSpy = vi.spyOn(
      formStore,
      'getFormPermissionsForUser'
    );
    getFormPermissionsForUserSpy.mockImplementation(() => {
      formStore.permissions = require('../../fixtures/permissions.json');
    });
    const fetchFormSpy = vi.spyOn(formStore, 'fetchForm');
    fetchFormSpy.mockImplementation(() => {
      return Promise.resolve();
    });
    const fetchFormFieldsSpy = vi.spyOn(formStore, 'fetchFormFields');
    fetchFormFieldsSpy.mockImplementation(() => {
      formStore.formFields = ['firstName'];
    });

    const wrapper = shallowMount(SubmissionsTable, {
      props: {
        formId: formId,
      },
      global: {
        plugins: [router, pinia],
        stubs: STUBS,
      },
    });

    formStore.userFormPreferences = {
      preferences: {
        submissionsTable: { columns: ['firstName', 'lastName'] },
      },
    };
    formStore.formFields = ['firstName'];
    // This should remove lastName
    expect(wrapper.vm.userColumns).toEqual(['firstName']);

    formStore.userFormPreferences = {};
    expect(wrapper.vm.userColumns).toEqual([]);
  });

  it('userColumns will return the values inside of userFormPreferences.value.preferences.columns filtered by the specified formFields or an empty array', () => {
    const getFormRolesForUserSpy = vi.spyOn(formStore, 'getFormRolesForUser');
    getFormRolesForUserSpy.mockImplementation(() => {
      formStore.roles = [
        FormRoleCodes.FORM_DESIGNER,
        FormRoleCodes.FORM_SUBMITTER,
        FormRoleCodes.OWNER,
        FormRoleCodes.SUBMISSION_APPROVER,
        FormRoleCodes.SUBMISSION_REVIEWER,
        FormRoleCodes.TEAM_MANAGER,
      ];
    });
    const getFormPermissionsForUserSpy = vi.spyOn(
      formStore,
      'getFormPermissionsForUser'
    );
    getFormPermissionsForUserSpy.mockImplementation(() => {
      formStore.permissions = require('../../fixtures/permissions.json');
    });
    const fetchFormSpy = vi.spyOn(formStore, 'fetchForm');
    fetchFormSpy.mockImplementation(() => {
      formStore.form = require('../../fixtures/form.json');
      return Promise.resolve();
    });
    const fetchFormFieldsSpy = vi.spyOn(formStore, 'fetchFormFields');
    fetchFormFieldsSpy.mockImplementation(() => {
      formStore.formFields = ['firstName'];
    });

    const wrapper = shallowMount(SubmissionsTable, {
      props: {
        formId: formId,
      },
      global: {
        plugins: [router, pinia],
        stubs: STUBS,
      },
    });

    formStore.userFormPreferences = {
      preferences: {
        submissionsTable: { columns: ['firstName', 'lastName'] },
      },
    };
    formStore.formFields = ['firstName'];
    // This should remove lastName
    expect(wrapper.vm.userColumns).toEqual(['firstName']);

    formStore.userFormPreferences = {};
    expect(wrapper.vm.userColumns).toEqual([]);
  });

  it('BASE_HEADERS will return an array of table headers. mandatory: confirmationId, submissionDate, submitter, status, updatedAt, updatedBy. optional: lateSubmission, [formfields]', async () => {
    const getFormRolesForUserSpy = vi.spyOn(formStore, 'getFormRolesForUser');
    getFormRolesForUserSpy.mockImplementation(() => {
      formStore.roles = [
        FormRoleCodes.FORM_DESIGNER,
        FormRoleCodes.FORM_SUBMITTER,
        FormRoleCodes.OWNER,
        FormRoleCodes.SUBMISSION_APPROVER,
        FormRoleCodes.SUBMISSION_REVIEWER,
        FormRoleCodes.TEAM_MANAGER,
      ];
    });
    const getFormPermissionsForUserSpy = vi.spyOn(
      formStore,
      'getFormPermissionsForUser'
    );
    getFormPermissionsForUserSpy.mockImplementation(() => {
      formStore.permissions = require('../../fixtures/permissions.json');
    });
    const fetchFormSpy = vi.spyOn(formStore, 'fetchForm');
    fetchFormSpy.mockImplementationOnce(() => {
      formStore.form = require('../../fixtures/form.json');
      return Promise.resolve();
    });
    const fetchFormFieldsSpy = vi.spyOn(formStore, 'fetchFormFields');
    fetchFormFieldsSpy.mockImplementationOnce(() => {
      formStore.formFields = [];
    });

    const wrapper = shallowMount(SubmissionsTable, {
      props: {
        formId: formId,
      },
      global: {
        plugins: [router, pinia],
        stubs: STUBS,
      },
    });
    formStore.formFields = [];

    await flushPromises();

    expect(wrapper.vm.BASE_HEADERS).toEqual([
      {
        title: 'trans.submissionsTable.confirmationID',
        align: 'start',
        key: 'confirmationId',
      },
      {
        title: 'trans.submissionsTable.submissionDate',
        align: 'start',
        key: 'date',
      },
      {
        title: 'trans.submissionsTable.submitter',
        align: 'start',
        key: 'submitter',
      },
      {
        title: 'trans.submissionsTable.status',
        align: 'start',
        key: 'status',
      },
      {
        title: 'trans.formSubmission.updatedAt',
        align: 'start',
        key: 'updatedAt',
      },
      {
        title: 'trans.formSubmission.updatedBy',
        align: 'start',
        key: 'updatedBy',
      },
    ]);

    formStore.formFields = ['firstName'];
    formStore.form.schedule.enabled = true;

    expect(wrapper.vm.BASE_HEADERS).toEqual([
      {
        title: 'trans.submissionsTable.confirmationID',
        align: 'start',
        key: 'confirmationId',
      },
      {
        title: 'trans.submissionsTable.submissionDate',
        align: 'start',
        key: 'date',
      },
      {
        title: 'trans.submissionsTable.submitter',
        align: 'start',
        key: 'submitter',
      },
      {
        title: 'trans.submissionsTable.status',
        align: 'start',
        key: 'status',
      },
      {
        title: 'trans.submissionsTable.lateSubmission',
        align: 'start',
        key: 'lateEntry',
      },
      {
        title: 'trans.formSubmission.updatedAt',
        align: 'start',
        key: 'updatedAt',
      },
      {
        title: 'trans.formSubmission.updatedBy',
        align: 'start',
        key: 'updatedBy',
      },
      {
        align: 'start',
        title: 'firstName',
        key: 'firstName',
      },
    ]);
  });

  it('HEADERS will return default values if there are no user selected columns but if the user selects columns, it will return them only', async () => {
    const getFormRolesForUserSpy = vi.spyOn(formStore, 'getFormRolesForUser');
    getFormRolesForUserSpy.mockImplementation(() => {
      formStore.roles = [
        FormRoleCodes.FORM_DESIGNER,
        FormRoleCodes.FORM_SUBMITTER,
        FormRoleCodes.OWNER,
        FormRoleCodes.SUBMISSION_APPROVER,
        FormRoleCodes.SUBMISSION_REVIEWER,
        FormRoleCodes.TEAM_MANAGER,
      ];
    });
    const getFormPermissionsForUserSpy = vi.spyOn(
      formStore,
      'getFormPermissionsForUser'
    );
    getFormPermissionsForUserSpy.mockImplementation(() => {
      formStore.permissions = require('../../fixtures/permissions.json');
    });
    const fetchFormSpy = vi.spyOn(formStore, 'fetchForm');
    fetchFormSpy.mockImplementationOnce(() => {
      return Promise.resolve();
    });
    const fetchFormFieldsSpy = vi.spyOn(formStore, 'fetchFormFields');
    fetchFormFieldsSpy.mockImplementationOnce(() => {
      formStore.formFields = ['firstName'];
    });

    const wrapper = shallowMount(SubmissionsTable, {
      props: {
        formId: formId,
      },
      global: {
        plugins: [router, pinia],
        stubs: STUBS,
      },
    });

    formStore.formFields = ['firstName'];
    formStore.form.schedule.enabled = null;

    await flushPromises();

    expect(wrapper.vm.HEADERS).toEqual([
      {
        title: 'trans.submissionsTable.confirmationID',
        align: 'start',
        key: 'confirmationId',
      },
      {
        title: 'trans.submissionsTable.submissionDate',
        align: 'start',
        key: 'date',
      },
      {
        title: 'trans.submissionsTable.submitter',
        align: 'start',
        key: 'submitter',
      },
      {
        title: 'trans.submissionsTable.status',
        align: 'start',
        key: 'status',
      },
      {
        title: 'trans.submissionsTable.view',
        align: 'end',
        key: 'actions',
        filterable: false,
        sortable: false,
        width: '40px',
      },
      {
        title: 'trans.submissionsTable.event',
        align: 'end',
        key: 'event',
        filterable: false,
        sortable: false,
        width: '40px',
      },
    ]);

    formStore.userFormPreferences = {
      preferences: {
        submissionsTable: { columns: ['submitter'] },
      },
    };

    expect(wrapper.vm.HEADERS).toEqual([
      {
        title: 'trans.submissionsTable.confirmationID',
        align: 'start',
        key: 'confirmationId',
      },
      {
        title: 'trans.submissionsTable.submitter',
        align: 'start',
        key: 'submitter',
      },
      {
        title: 'trans.submissionsTable.view',
        align: 'end',
        key: 'actions',
        filterable: false,
        sortable: false,
        width: '40px',
      },
      {
        title: 'trans.submissionsTable.event',
        align: 'end',
        key: 'event',
        filterable: false,
        sortable: false,
        width: '40px',
      },
    ]);
  });

  it('onShowColumnDialog will sort BASE_FILTER_HEADERS and then show the columns dialog', async () => {
    const getFormRolesForUserSpy = vi.spyOn(formStore, 'getFormRolesForUser');
    getFormRolesForUserSpy.mockImplementation(() => {
      formStore.roles = [
        FormRoleCodes.FORM_DESIGNER,
        FormRoleCodes.FORM_SUBMITTER,
        FormRoleCodes.OWNER,
        FormRoleCodes.SUBMISSION_APPROVER,
        FormRoleCodes.SUBMISSION_REVIEWER,
        FormRoleCodes.TEAM_MANAGER,
      ];
    });
    const getFormPermissionsForUserSpy = vi.spyOn(
      formStore,
      'getFormPermissionsForUser'
    );
    getFormPermissionsForUserSpy.mockImplementation(() => {
      formStore.permissions = require('../../fixtures/permissions.json');
    });
    const fetchFormSpy = vi.spyOn(formStore, 'fetchForm');
    fetchFormSpy.mockImplementationOnce(() => {
      return Promise.resolve();
    });
    const fetchFormFieldsSpy = vi.spyOn(formStore, 'fetchFormFields');
    fetchFormFieldsSpy.mockImplementationOnce(() => {
      formStore.formFields = ['firstName'];
    });

    const wrapper = shallowMount(SubmissionsTable, {
      props: {
        formId: formId,
      },
      global: {
        plugins: [router, pinia],
        stubs: STUBS,
      },
    });

    await flushPromises();

    wrapper.vm.onShowColumnDialog();
    expect(wrapper.vm.BASE_FILTER_HEADERS).toEqual([
      {
        title: 'trans.submissionsTable.status',
        align: 'start',
        key: 'status',
      },
      {
        title: 'trans.submissionsTable.submitter',
        align: 'start',
        key: 'submitter',
      },
      {
        align: 'start',
        title: 'trans.submissionsTable.submissionDate',
        key: 'date',
      },
      {
        title: 'trans.formSubmission.updatedAt',
        align: 'start',
        key: 'updatedAt',
      },
      {
        title: 'trans.formSubmission.updatedBy',
        align: 'start',
        key: 'updatedBy',
      },
      { title: 'firstName', align: 'start', key: 'firstName' },
    ]);
    expect(wrapper.vm.showColumnsDialog).toBeTruthy();
  });

  it('updateTableOptions will set page, sortBy, itemsPerpage if they exist, and refresh submissions if it is not the first data load', async () => {
    const getFormRolesForUserSpy = vi.spyOn(formStore, 'getFormRolesForUser');
    getFormRolesForUserSpy.mockImplementation(() => {
      formStore.roles = [
        FormRoleCodes.FORM_DESIGNER,
        FormRoleCodes.FORM_SUBMITTER,
        FormRoleCodes.OWNER,
        FormRoleCodes.SUBMISSION_APPROVER,
        FormRoleCodes.SUBMISSION_REVIEWER,
        FormRoleCodes.TEAM_MANAGER,
      ];
    });
    const getFormPermissionsForUserSpy = vi.spyOn(
      formStore,
      'getFormPermissionsForUser'
    );
    getFormPermissionsForUserSpy.mockImplementation(() => {
      formStore.permissions = require('../../fixtures/permissions.json');
    });
    const fetchFormSpy = vi.spyOn(formStore, 'fetchForm');
    fetchFormSpy.mockImplementation(() => {
      return Promise.resolve();
    });
    const fetchFormFieldsSpy = vi.spyOn(formStore, 'fetchFormFields');
    fetchFormFieldsSpy.mockImplementation(() => {
      formStore.formFields = ['firstName'];
    });
    const getFormPreferencesForCurrentUserSpy = vi.spyOn(
      formStore,
      'getFormPreferencesForCurrentUser'
    );
    getFormPreferencesForCurrentUserSpy.mockImplementation(() => {});
    const fetchSubmissionsSpy = vi.spyOn(formStore, 'fetchSubmissions');
    fetchSubmissionsSpy.mockImplementation(() => {});

    const wrapper = shallowMount(SubmissionsTable, {
      props: {
        formId: formId,
      },
      global: {
        plugins: [router, pinia],
        stubs: STUBS,
      },
    });

    await flushPromises();

    getFormPreferencesForCurrentUserSpy.mockReset();
    fetchSubmissionsSpy.mockReset();

    await wrapper.vm.updateTableOptions({});
    // should refresh submissions
    expect(getFormPreferencesForCurrentUserSpy).toBeCalledTimes(1);
    expect(fetchSubmissionsSpy).toBeCalledTimes(0);
    expect(wrapper.vm.currentPage).toEqual(1);
    expect(wrapper.vm.sort).toEqual({});
    expect(wrapper.vm.itemsPP).toEqual(10);

    getFormPreferencesForCurrentUserSpy.mockReset();
    fetchSubmissionsSpy.mockReset();
    wrapper.vm.firstDataLoad = true;
    await wrapper.vm.updateTableOptions({
      page: 5,
      itemsPerPage: 2,
      sortBy: [{ key: 'date', order: 'desc' }],
    });
    // should not refresh submissions
    expect(getFormPreferencesForCurrentUserSpy).toBeCalledTimes(1);
    expect(fetchSubmissionsSpy).toBeCalledTimes(0);
    expect(wrapper.vm.currentPage).toEqual(5);
    expect(wrapper.vm.sort).toEqual({ column: 'createdAt', order: 'desc' });
    expect(wrapper.vm.itemsPP).toEqual(2);
    wrapper.vm.firstDataLoad = true;

    await wrapper.vm.updateTableOptions({
      page: 5,
      itemsPerPage: 2,
      sortBy: [{ key: 'submitter', order: 'desc' }],
    });
    // should not refresh submissions
    expect(getFormPreferencesForCurrentUserSpy).toBeCalledTimes(2);
    expect(fetchSubmissionsSpy).toBeCalledTimes(0);
    expect(wrapper.vm.currentPage).toEqual(5);
    expect(wrapper.vm.sort).toEqual({ column: 'createdBy', order: 'desc' });
    expect(wrapper.vm.itemsPP).toEqual(2);
    wrapper.vm.firstDataLoad = true;

    await wrapper.vm.updateTableOptions({
      page: 5,
      itemsPerPage: 2,
      sortBy: [{ key: 'status', order: 'desc' }],
    });
    // should not refresh submissions
    expect(getFormPreferencesForCurrentUserSpy).toBeCalledTimes(3);
    expect(fetchSubmissionsSpy).toBeCalledTimes(0);
    expect(wrapper.vm.currentPage).toEqual(5);
    expect(wrapper.vm.sort).toEqual({
      column: 'formSubmissionStatusCode',
      order: 'desc',
    });
    expect(wrapper.vm.itemsPP).toEqual(2);
    wrapper.vm.firstDataLoad = true;
    await wrapper.vm.updateTableOptions({
      page: 5,
      itemsPerPage: 2,
      sortBy: [{ key: 'something', order: 'desc' }],
    });
    expect(getFormPreferencesForCurrentUserSpy).toBeCalledTimes(4);
    expect(fetchSubmissionsSpy).toBeCalledTimes(0);
    expect(wrapper.vm.currentPage).toEqual(5);
    expect(wrapper.vm.sort).toEqual({
      column: 'something',
      order: 'desc',
    });
    expect(wrapper.vm.itemsPP).toEqual(2);
  });

  it('getSubmissionData will fetchSubmissions in different ways', async () => {
    const getFormRolesForUserSpy = vi.spyOn(formStore, 'getFormRolesForUser');
    getFormRolesForUserSpy.mockImplementation(() => {
      formStore.roles = [
        FormRoleCodes.FORM_DESIGNER,
        FormRoleCodes.FORM_SUBMITTER,
        FormRoleCodes.OWNER,
        FormRoleCodes.SUBMISSION_APPROVER,
        FormRoleCodes.SUBMISSION_REVIEWER,
        FormRoleCodes.TEAM_MANAGER,
      ];
    });
    const getFormPermissionsForUserSpy = vi.spyOn(
      formStore,
      'getFormPermissionsForUser'
    );
    getFormPermissionsForUserSpy.mockImplementation(() => {
      formStore.permissions = require('../../fixtures/permissions.json');
    });
    const fetchFormSpy = vi.spyOn(formStore, 'fetchForm');
    fetchFormSpy.mockImplementation(() => {
      return Promise.resolve();
    });
    const fetchFormFieldsSpy = vi.spyOn(formStore, 'fetchFormFields');
    fetchFormFieldsSpy.mockImplementationOnce(() => {
      formStore.formFields = ['firstName'];
    });
    const fetchSubmissionsSpy = vi.spyOn(formStore, 'fetchSubmissions');
    fetchSubmissionsSpy.mockImplementationOnce(() => {});

    const wrapper = shallowMount(SubmissionsTable, {
      props: {
        formId: formId,
      },
      global: {
        plugins: [router, pinia],
        stubs: STUBS,
      },
    });

    await flushPromises();

    fetchSubmissionsSpy.mockReset();
    fetchSubmissionsSpy.mockImplementationOnce(() => {});
    await wrapper.vm.getSubmissionData();
    expect(fetchSubmissionsSpy).toBeCalledTimes(1);
    expect(fetchSubmissionsSpy).toBeCalledWith({
      createdAt: [
        moment().subtract(50, 'years').utc().format('YYYY-MM-DD'),
        moment().add(50, 'years').utc().format('YYYY-MM-DD'),
      ],
      createdBy: '',
      deletedOnly: false,
      filterformSubmissionStatusCode: true,
      filterAssignedToCurrentUser: false,
      formId: '123-456',
      itemsPerPage: 10,
      page: 0,
      paginationEnabled: true,
      search: '',
      searchEnabled: false,
      sortBy: {},
    });

    // if fetchSubmissions returns a submissionList we want to add custom columns
    fetchSubmissionsSpy.mockReset();
    fetchSubmissionsSpy.mockImplementationOnce(() => {});
    formStore.submissionList = [
      {
        confirmationId: '9830C27C',
        createdAt: '2024-05-30T20:40:47.131Z',
        formId: '8e436682-35be-4a93-82bc-08408d8fa606',
        formSubmissionStatusCode: 'REVISING',
        submissionId: '9830c27c-3c58-4bd1-b58e-5d83b29ab862',
        deleted: false,
        createdBy: 'TEST@idir',
        formVersionId: '33f93f2a-a8cb-4c73-8525-cd48325d35d1',
        updatedAt: '2024-07-30T06:46:38.535Z',
        updatedBy: 'TEST@idir',
        status: null,
        firstName: 'test',
        date: null,
        lateEntry: false,
        // this should be converted to a string
        customColumn: { key: 'value' },
      },
    ];
    // if a custom column is an object add it if it isn't already in the fields
    // also if it's a duplicate column, then we just add an _X to the end of the key X being some incremental number
    formStore.userFormPreferences = {
      preferences: {
        submissionsTable: {
          columns: ['firstName', 'customColumn', 'date', 'date'],
        },
      },
    };
    // userFormPreferences only gets used if they are in formFields
    formStore.formFields = ['firstName', 'customColumn', 'date'];
    await wrapper.vm.getSubmissionData();
    expect(fetchSubmissionsSpy).toBeCalledTimes(1);
  });

  it('delSub will deleteSingleSubs if single submission delete is enabled otherwise will call deleteMultiSubs', async () => {
    const getFormRolesForUserSpy = vi.spyOn(formStore, 'getFormRolesForUser');
    getFormRolesForUserSpy.mockImplementation(() => {
      formStore.roles = [
        FormRoleCodes.FORM_DESIGNER,
        FormRoleCodes.FORM_SUBMITTER,
        FormRoleCodes.OWNER,
        FormRoleCodes.SUBMISSION_APPROVER,
        FormRoleCodes.SUBMISSION_REVIEWER,
        FormRoleCodes.TEAM_MANAGER,
      ];
    });
    const getFormPermissionsForUserSpy = vi.spyOn(
      formStore,
      'getFormPermissionsForUser'
    );
    getFormPermissionsForUserSpy.mockImplementation(() => {
      formStore.permissions = require('../../fixtures/permissions.json');
    });
    const fetchFormSpy = vi.spyOn(formStore, 'fetchForm');
    fetchFormSpy.mockImplementation(() => {
      return Promise.resolve();
    });
    const fetchFormFieldsSpy = vi.spyOn(formStore, 'fetchFormFields');
    fetchFormFieldsSpy.mockImplementation(() => {
      formStore.formFields = ['firstName'];
    });
    const fetchSubmissionsSpy = vi.spyOn(formStore, 'fetchSubmissions');
    fetchSubmissionsSpy.mockImplementation(() => {});

    const deleteSubmissionSpy = vi.spyOn(formStore, 'deleteSubmission');
    deleteSubmissionSpy.mockImplementationOnce(() => {});
    const deleteMultiSubmissionsSpy = vi.spyOn(
      formStore,
      'deleteMultiSubmissions'
    );
    deleteMultiSubmissionsSpy.mockImplementationOnce(() => {});

    const restoreSubmissionSpy = vi.spyOn(formStore, 'restoreSubmission');
    restoreSubmissionSpy.mockImplementationOnce(() => {});
    const restoreMultiSubmissionsSpy = vi.spyOn(
      formStore,
      'restoreMultiSubmissions'
    );
    restoreMultiSubmissionsSpy.mockImplementationOnce(() => {});

    const wrapper = shallowMount(SubmissionsTable, {
      props: {
        formId: formId,
      },
      global: {
        plugins: [router, pinia],
        stubs: STUBS,
      },
    });

    await flushPromises();

    wrapper.vm.singleSubmissionDelete = true;
    await wrapper.vm.delSub();
    expect(deleteSubmissionSpy).toBeCalledTimes(1);
    expect(deleteMultiSubmissionsSpy).toBeCalledTimes(0);
    expect(restoreSubmissionSpy).toBeCalledTimes(0);
    expect(restoreMultiSubmissionsSpy).toBeCalledTimes(0);
    deleteSubmissionSpy.mockReset();
    deleteMultiSubmissionsSpy.mockReset();
    restoreSubmissionSpy.mockReset();
    restoreMultiSubmissionsSpy.mockReset();

    wrapper.vm.singleSubmissionDelete = false;
    await wrapper.vm.delSub();
    expect(deleteSubmissionSpy).toBeCalledTimes(0);
    expect(deleteMultiSubmissionsSpy).toBeCalledTimes(1);
    expect(restoreSubmissionSpy).toBeCalledTimes(0);
    expect(restoreMultiSubmissionsSpy).toBeCalledTimes(0);
    deleteSubmissionSpy.mockReset();
    deleteMultiSubmissionsSpy.mockReset();
    restoreSubmissionSpy.mockReset();
    restoreMultiSubmissionsSpy.mockReset();

    wrapper.vm.singleSubmissionRestore = true;
    await wrapper.vm.restoreSub();
    expect(deleteSubmissionSpy).toBeCalledTimes(0);
    expect(deleteMultiSubmissionsSpy).toBeCalledTimes(0);
    expect(restoreSubmissionSpy).toBeCalledTimes(1);
    expect(restoreMultiSubmissionsSpy).toBeCalledTimes(0);
    deleteSubmissionSpy.mockReset();
    deleteMultiSubmissionsSpy.mockReset();
    restoreSubmissionSpy.mockReset();
    restoreMultiSubmissionsSpy.mockReset();

    wrapper.vm.singleSubmissionRestore = false;
    await wrapper.vm.restoreSub();
    expect(deleteSubmissionSpy).toBeCalledTimes(0);
    expect(deleteMultiSubmissionsSpy).toBeCalledTimes(0);
    expect(restoreSubmissionSpy).toBeCalledTimes(0);
    expect(restoreMultiSubmissionsSpy).toBeCalledTimes(1);
    deleteSubmissionSpy.mockReset();
    deleteMultiSubmissionsSpy.mockReset();
    restoreSubmissionSpy.mockReset();
    restoreMultiSubmissionsSpy.mockReset();
  });

  it('when search gets updated, it should refreshSubmissions if there is a search value otherwise it will call debounceInput', async () => {
    const getFormRolesForUserSpy = vi.spyOn(formStore, 'getFormRolesForUser');
    getFormRolesForUserSpy.mockImplementation(() => {
      formStore.roles = [
        FormRoleCodes.FORM_DESIGNER,
        FormRoleCodes.FORM_SUBMITTER,
        FormRoleCodes.OWNER,
        FormRoleCodes.SUBMISSION_APPROVER,
        FormRoleCodes.SUBMISSION_REVIEWER,
        FormRoleCodes.TEAM_MANAGER,
      ];
    });
    const getFormPermissionsForUserSpy = vi.spyOn(
      formStore,
      'getFormPermissionsForUser'
    );
    getFormPermissionsForUserSpy.mockImplementation(() => {
      formStore.permissions = require('../../fixtures/permissions.json');
    });
    const fetchFormSpy = vi.spyOn(formStore, 'fetchForm');
    fetchFormSpy.mockImplementation(() => {
      return Promise.resolve();
    });
    const fetchFormFieldsSpy = vi.spyOn(formStore, 'fetchFormFields');
    fetchFormFieldsSpy.mockImplementation(() => {
      formStore.formFields = ['firstName'];
    });
    const getFormPreferencesForCurrentUserSpy = vi.spyOn(
      formStore,
      'getFormPreferencesForCurrentUser'
    );
    getFormPreferencesForCurrentUserSpy.mockImplementation(() => {});
    const fetchSubmissionsSpy = vi.spyOn(formStore, 'fetchSubmissions');
    fetchSubmissionsSpy.mockImplementation(() => {});

    const wrapper = shallowMount(SubmissionsTable, {
      props: {
        formId: formId,
      },
      global: {
        plugins: [router, pinia],
        stubs: STUBS,
      },
    });

    await flushPromises();

    const debounceSpy = vi.fn();

    wrapper.vm.debounceInput = debounceSpy;

    getFormPreferencesForCurrentUserSpy.mockReset();
    fetchSubmissionsSpy.mockReset();
    fetchFormFieldsSpy.mockReset();
    getFormPermissionsForUserSpy.mockReset();
    fetchFormSpy.mockReset();
    getFormRolesForUserSpy.mockReset();
    fetchFormSpy.mockImplementation(() => {
      return Promise.resolve();
    });

    await wrapper.vm.handleSearch('something');
    expect(debounceSpy).toBeCalledTimes(1);
    expect(getFormRolesForUserSpy).toBeCalledTimes(0);
    expect(getFormPermissionsForUserSpy).toBeCalledTimes(0);
    expect(fetchFormSpy).toBeCalledTimes(0);

    debounceSpy.mockReset();
    getFormPreferencesForCurrentUserSpy.mockReset();
    fetchSubmissionsSpy.mockReset();
    fetchFormFieldsSpy.mockReset();
    getFormPermissionsForUserSpy.mockReset();
    fetchFormSpy.mockReset();
    getFormRolesForUserSpy.mockReset();
    fetchFormSpy.mockImplementation(() => {
      return Promise.resolve();
    });
    await wrapper.vm.handleSearch('');
    expect(getFormRolesForUserSpy).toBeCalledTimes(1);
    expect(getFormPermissionsForUserSpy).toBeCalledTimes(1);
    expect(fetchFormSpy).toBeCalledTimes(1);
  });
  it('BASE_HEADERS includes assignee column when showAssigneeInSubmissionsTable is enabled', async () => {
    const getFormRolesForUserSpy = vi.spyOn(formStore, 'getFormRolesForUser');
    getFormRolesForUserSpy.mockImplementation(() => {
      formStore.roles = [FormRoleCodes.OWNER];
    });
    const getFormPermissionsForUserSpy = vi.spyOn(
      formStore,
      'getFormPermissionsForUser'
    );
    getFormPermissionsForUserSpy.mockImplementation(() => {
      formStore.permissions = require('../../fixtures/permissions.json');
    });
    const fetchFormSpy = vi.spyOn(formStore, 'fetchForm');
    fetchFormSpy.mockImplementation(() => {
      // Set form with assignee column enabled
      formStore.form = {
        ...require('../../fixtures/form.json'),
        enableStatusUpdates: true,
        showAssigneeInSubmissionsTable: true,
        schedule: { enabled: false },
      };
      return Promise.resolve();
    });
    const fetchFormFieldsSpy = vi.spyOn(formStore, 'fetchFormFields');
    fetchFormFieldsSpy.mockImplementation(() => {
      formStore.formFields = [];
    });

    const wrapper = shallowMount(SubmissionsTable, {
      props: { formId: formId },
      global: {
        plugins: [router, pinia],
        stubs: STUBS,
      },
    });

    await flushPromises();

    // Should include assignee column
    const headers = wrapper.vm.BASE_HEADERS;
    const assigneeHeader = headers.find((h) => h.key === 'assignee');

    expect(assigneeHeader).toBeTruthy();
    expect(assigneeHeader.title).toBe('trans.submissionsTable.assignee');
    expect(assigneeHeader.align).toBe('start');
    expect(assigneeHeader.key).toBe('assignee');
  });

  it('BASE_HEADERS does not include assignee column when showAssigneeInSubmissionsTable is disabled', async () => {
    const getFormRolesForUserSpy = vi.spyOn(formStore, 'getFormRolesForUser');
    getFormRolesForUserSpy.mockImplementation(() => {
      formStore.roles = [FormRoleCodes.OWNER];
    });
    const getFormPermissionsForUserSpy = vi.spyOn(
      formStore,
      'getFormPermissionsForUser'
    );
    getFormPermissionsForUserSpy.mockImplementation(() => {
      formStore.permissions = require('../../fixtures/permissions.json');
    });
    const fetchFormSpy = vi.spyOn(formStore, 'fetchForm');
    fetchFormSpy.mockImplementation(() => {
      // Set form with assignee column disabled
      formStore.form = {
        ...require('../../fixtures/form.json'),
        enableStatusUpdates: true,
        showAssigneeInSubmissionsTable: false,
        schedule: { enabled: false },
      };
      return Promise.resolve();
    });
    const fetchFormFieldsSpy = vi.spyOn(formStore, 'fetchFormFields');
    fetchFormFieldsSpy.mockImplementation(() => {
      formStore.formFields = [];
    });

    const wrapper = shallowMount(SubmissionsTable, {
      props: { formId: formId },
      global: {
        plugins: [router, pinia],
        stubs: STUBS,
      },
    });

    await flushPromises();

    // Should NOT include assignee column
    const headers = wrapper.vm.BASE_HEADERS;
    const assigneeHeader = headers.find((h) => h.key === 'assignee');

    expect(assigneeHeader).toBeFalsy();
  });
  it('filterAssignedToCurrentUser should be passed correctly when enabled', async () => {
    const getFormRolesForUserSpy = vi.spyOn(formStore, 'getFormRolesForUser');
    getFormRolesForUserSpy.mockImplementation(() => {
      formStore.roles = [FormRoleCodes.OWNER];
    });
    const getFormPermissionsForUserSpy = vi.spyOn(
      formStore,
      'getFormPermissionsForUser'
    );
    getFormPermissionsForUserSpy.mockImplementation(() => {
      formStore.permissions = require('../../fixtures/permissions.json');
    });
    const fetchFormSpy = vi.spyOn(formStore, 'fetchForm');
    fetchFormSpy.mockImplementation(() => {
      formStore.form = {
        ...require('../../fixtures/form.json'),
        enableStatusUpdates: true,
        showAssigneeInSubmissionsTable: true,
      };
      return Promise.resolve();
    });
    const fetchFormFieldsSpy = vi.spyOn(formStore, 'fetchFormFields');
    fetchFormFieldsSpy.mockImplementation(() => {
      formStore.formFields = ['firstName'];
    });
    const fetchSubmissionsSpy = vi.spyOn(formStore, 'fetchSubmissions');
    fetchSubmissionsSpy.mockImplementation(() => {});

    const wrapper = shallowMount(SubmissionsTable, {
      props: { formId: formId },
      global: {
        plugins: [router, pinia],
        stubs: STUBS,
      },
    });

    await flushPromises();

    // Test with filterAssignedToCurrentUser enabled
    wrapper.vm.assignedToMeOnly = true;

    fetchSubmissionsSpy.mockReset();
    await wrapper.vm.getSubmissionData();

    expect(fetchSubmissionsSpy).toBeCalledWith(
      expect.objectContaining({
        filterAssignedToCurrentUser: true,
      })
    );

    // Test with filterAssignedToCurrentUser disabled
    wrapper.vm.assignedToMeOnly = false;

    fetchSubmissionsSpy.mockReset();
    await wrapper.vm.getSubmissionData();

    expect(fetchSubmissionsSpy).toBeCalledWith(
      expect.objectContaining({
        filterAssignedToCurrentUser: false,
      })
    );
  });

  it('onBeforeMount sets filter refs from userFormPreferences', async () => {
    formStore.userFormPreferences = {
      preferences: {
        submissionsTable: {
          filters: {
            assignedToMeOnly: true,
            deletedOnly: true,
            currentUserOnly: false,
          },
        },
      },
    };
    vi.spyOn(formStore, 'getFormPreferencesForCurrentUser').mockResolvedValue(
      {}
    );
    vi.spyOn(formStore, 'getFormRolesForUser').mockResolvedValue({});
    vi.spyOn(formStore, 'getFormPermissionsForUser').mockResolvedValue({});
    vi.spyOn(formStore, 'fetchForm').mockImplementation(() =>
      Promise.resolve()
    );
    vi.spyOn(formStore, 'fetchFormFields').mockImplementation(() => {});

    const wrapper = shallowMount(SubmissionsTable, {
      props: { formId },
      global: { plugins: [router, pinia], stubs: STUBS },
    });
    await flushPromises();

    expect(wrapper.vm.assignedToMeOnly).toBe(true);
    expect(wrapper.vm.deletedOnly).toBe(true);
    expect(wrapper.vm.currentUserOnly).toBe(false);
  });

  it('updateFilters passes correct columns and sort to updateFormPreferencesForCurrentUser', async () => {
    // Setup user preferences with columns and sort
    formStore.userFormPreferences = {
      preferences: {
        submissionsTable: {
          columns: ['firstName', 'lastName'],
          sort: { column: 'firstName', order: 'asc' },
          filters: {},
        },
      },
    };

    vi.spyOn(formStore, 'getFormPreferencesForCurrentUser').mockResolvedValue(
      {}
    );

    const updateFormPreferencesForCurrentUser = vi
      .spyOn(formStore, 'updateFormPreferencesForCurrentUser')
      .mockResolvedValue({});

    vi.spyOn(formStore, 'fetchForm').mockImplementation(() => {
      return Promise.resolve();
    });

    const wrapper = shallowMount(SubmissionsTable, {
      props: { formId },
      global: { plugins: [router, pinia], stubs: STUBS },
    });

    await flushPromises();

    // Set filter refs
    wrapper.vm.deletedOnly = true;
    wrapper.vm.assignedToMeOnly = false;
    wrapper.vm.currentUserOnly = true;

    await wrapper.vm.updateFilters();
    await flushPromises();

    expect(updateFormPreferencesForCurrentUser).toHaveBeenCalledWith(
      expect.objectContaining({
        formId,
        preferences: expect.objectContaining({
          submissionsTable: expect.objectContaining({
            columns: ['firstName', 'lastName'],
            sort: { column: 'firstName', order: 'asc' },
            filters: {
              deletedOnly: true,
              assignedToMeOnly: false,
              currentUserOnly: true,
            },
          }),
        }),
      })
    );
  });

  it('updateSort saves sort and returns correct value', async () => {
    formStore.userFormPreferences = {
      preferences: {
        submissionsTable: {
          columns: ['firstName', 'lastName'],
          filters: {
            deletedOnly: true,
            assignedToMeOnly: false,
            currentUserOnly: true,
          },
          sort: {},
        },
      },
    };
    vi.spyOn(formStore, 'getFormPreferencesForCurrentUser').mockResolvedValue(
      {}
    );
    const updateFormPreferencesForCurrentUserSpy = vi
      .spyOn(formStore, 'updateFormPreferencesForCurrentUser')
      .mockResolvedValue({});
    vi.spyOn(formStore, 'fetchForm').mockImplementation(() =>
      Promise.resolve()
    );
    vi.spyOn(formStore, 'fetchFormFields').mockImplementation(() => {});
    vi.spyOn(formStore, 'getFormRolesForUser').mockResolvedValue({});
    vi.spyOn(formStore, 'getFormPermissionsForUser').mockResolvedValue({});

    const wrapper = shallowMount(SubmissionsTable, {
      props: { formId },
      global: { plugins: [router, pinia], stubs: STUBS },
    });
    await flushPromises();

    const sortBy = [{ key: 'date', order: 'desc' }];
    const result = await wrapper.vm.updateSort(sortBy);

    expect(result).toEqual({ column: 'createdAt', order: 'desc' });
    expect(updateFormPreferencesForCurrentUserSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        formId,
        preferences: expect.objectContaining({
          submissionsTable: expect.objectContaining({
            columns: ['firstName', 'lastName'],
            sort: { column: 'createdAt', order: 'desc' },
            filters: {
              deletedOnly: true,
              assignedToMeOnly: false,
              currentUserOnly: true,
            },
          }),
        }),
      })
    );
  });

  it('updateColumns updates columns and calls populateSubmissionsTable', async () => {
    formStore.userFormPreferences = {
      preferences: {
        submissionsTable: {
          columns: [],
          filters: {
            deletedOnly: true,
            assignedToMeOnly: false,
            currentUserOnly: true,
          },
          sort: { column: 'createdAt', order: 'desc' },
        },
      },
    };
    vi.spyOn(formStore, 'getFormPreferencesForCurrentUser').mockResolvedValue(
      {}
    );
    const updateFormPreferencesForCurrentUserSpy = vi
      .spyOn(formStore, 'updateFormPreferencesForCurrentUser')
      .mockResolvedValue({});
    vi.spyOn(formStore, 'fetchForm').mockImplementation(() =>
      Promise.resolve()
    );
    vi.spyOn(formStore, 'fetchFormFields').mockImplementation(() => {});
    vi.spyOn(formStore, 'getFormRolesForUser').mockResolvedValue({});
    vi.spyOn(formStore, 'getFormPermissionsForUser').mockResolvedValue({});

    const wrapper = shallowMount(SubmissionsTable, {
      props: { formId },
      global: { plugins: [router, pinia], stubs: STUBS },
    });
    await flushPromises();

    await wrapper.vm.updateColumns(['firstName', 'lastName']);
    await flushPromises();

    expect(updateFormPreferencesForCurrentUserSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        preferences: expect.objectContaining({
          submissionsTable: expect.objectContaining({
            columns: ['firstName', 'lastName'],
          }),
        }),
      })
    );
  });

  it('sortToSortBy converts sort object to sortBy array', () => {
    vi.spyOn(formStore, 'getFormPreferencesForCurrentUser').mockResolvedValue(
      {}
    );
    vi.spyOn(
      formStore,
      'updateFormPreferencesForCurrentUser'
    ).mockResolvedValue({});
    vi.spyOn(formStore, 'fetchForm').mockImplementation(() =>
      Promise.resolve()
    );
    vi.spyOn(formStore, 'fetchFormFields').mockImplementation(() => {});
    vi.spyOn(formStore, 'getFormRolesForUser').mockResolvedValue({});
    vi.spyOn(formStore, 'getFormPermissionsForUser').mockResolvedValue({});

    const wrapper = shallowMount(SubmissionsTable, {
      props: { formId },
      global: { plugins: [router, pinia], stubs: STUBS },
    });

    let sort = { column: 'createdAt', order: 'desc' };
    let result = wrapper.vm.sortToSortBy(sort);
    expect(result).toEqual([{ key: 'date', order: 'desc' }]);

    sort = { column: 'createdBy', order: 'asc' };
    result = wrapper.vm.sortToSortBy(sort);
    expect(result).toEqual([{ key: 'submitter', order: 'asc' }]);

    sort = { column: 'formSubmissionStatusCode', order: null };
    result = wrapper.vm.sortToSortBy(sort);
    expect(result).toEqual([{ key: 'status', order: 'asc' }]);

    sort = { column: 'formSubmissionAssignedToUsernameIdp', order: 'desc' };
    result = wrapper.vm.sortToSortBy(sort);
    expect(result).toEqual([{ key: 'assignee', order: 'desc' }]);

    sort = { column: 'randomName', order: 'asc' };
    result = wrapper.vm.sortToSortBy(sort);
    expect(result).toEqual([{ key: 'randomName', order: 'asc' }]);
  });
});
