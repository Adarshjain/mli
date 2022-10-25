<template>
  <div class="mx-4 my-4" style="max-width: 500px; margin: auto">
    <h1 class="is-size-3">New Transaction for {{customer.name}}</h1>
    <div
      style="display: none"
      ref="customer_dropdown"
      :data-customer="JSON.stringify(customer)"
    ></div>
    <b-field label="Date">
      <b-datepicker
        v-model="transact_date"
        :mobile-native="false"
        icon="calendar-today"
        placeholder="Click to select...."
        trap-focus
      >
      </b-datepicker>
    </b-field>
    <b-field label="Narration">
      <b-input v-model="narration"></b-input>
    </b-field>
    <b-field label="Select a project" v-if="projects.length">
      <b-dropdown :mobile-modal="false">
        <template #trigger="{ active }">
          <b-button
            :expanded="true"
            :icon-right="active ? 'menu-up' : 'menu-down'"
            :label="project !== '' ? project.name : 'Select a project'"
          />
        </template>
        <b-dropdown-item
          v-for="projectName in projects"
          :key="projectName.id"
          @click="project = projectName"
        >
          {{ projectName.name }}
        </b-dropdown-item>
      </b-dropdown>
    </b-field>
    <b-field>
      <b-radio-button
        v-model="transactionType"
        native-value="credit"
        type="is-light is-outlined is-primary"
      >
        Credit
      </b-radio-button>
      <b-radio-button
        v-model="transactionType"
        native-value="debit"
        type="is-light is-outlined is-primary"
      >
        Debit
      </b-radio-button>
    </b-field>
    <b-field label="Amount">
      <b-input type="number" v-model="amount"></b-input>
    </b-field>
    <b-button :loading="isCreating" type="is-primary is-light" @click="createTransaction">Create Transaction</b-button>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {$error, $indefinite, $success, $warn, formatDateToSQLFormat} from "~/helpers";
import {tableNames} from "~/constants/constants";

@Component({
  name: 'HomeView'
})
export default class ProjectNew extends Vue {
  narration = ''
  customer = '';
  amount = 0;
  isCreating = false;
  transactionType = 'credit';
  projects = [];
  project = ''

  data() {
    return {
      transact_date: null
    }
  }

  async asyncData({$axios, params}) {
    const [customer] = await $axios.$get(`/api/${tableNames.customers}/${params.customer_id}`);
    const projects = await $axios.$get(`/api/${tableNames.customers}/${params.customer_id}/${tableNames.projects}`)
    return {
      customer,
      projects
    }
  }


  mounted() {
    //@ts-ignore
    this.customer = JSON.parse(this.$refs.customer_dropdown.getAttribute('data-customer'))
  }

  async createTransaction() {
    //@ts-ignore
    if (!this.narration || this.customer === '' || !this.transact_date) {
      $warn('Narration, Customer, Date are mandatory')
      return;
    }
    try {
      this.isCreating = true;
      $indefinite('Creating Transaction');
      const config: Record<string, string | number | boolean> = {
        narration: this.narration,
        //@ts-ignore
        customer_id: this.customer.id,
        //@ts-ignore
        transact_date: formatDateToSQLFormat(this.transact_date),
      }
      if (this.transactionType === 'credit') {
        config.credit_amount = this.amount;
      } else {
        config.debit_amount = this.amount;
      }
      if (this.project !== '') {
        //@ts-ignore
        config.project_id = this.project.id;
      }
      await this.$axios.post(`/api/${tableNames.transactions}`, config)
      $success('Transaction created');
      let projectsUrl = ''
      if (this.project !== '') {
        //@ts-ignore
        projectsUrl += `/projects/${this.project.id}`
      }
      await this.$router.push({
        //@ts-ignore
        path: `/customers/${this.customer.id}${projectsUrl}`
      })
    } catch (e) {
      $error('Error: ' + e)
    }
    this.isCreating = false;
  }
}
</script>
