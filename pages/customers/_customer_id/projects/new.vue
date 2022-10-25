<template>
  <div class="mx-4 my-4" style="max-width: 500px; margin: auto">
    <h1 class="is-size-3">New Project for {{customer.name}}</h1>
    <div
      style="display: none"
      ref="customer_dropdown"
      :data-customer="JSON.stringify(customer)"
    ></div>
    <b-field label="Name*">
      <b-input v-model="name"></b-input>
    </b-field>
    <b-field label="Specification">
      <b-input type="textarea" v-model="specification"></b-input>
    </b-field>
    <b-field label="Project Date">
      <b-datepicker
        v-model="project_date"
        placeholder="Click to select..."
        icon="calendar-today"
        :mobile-native="false"
        trap-focus
      >
      </b-datepicker>
    </b-field>
    <b-field label="Deliver Date">
      <b-datepicker
        v-model="deliver_date"
        placeholder="Click to select..."
        icon="calendar-today"
        :mobile-native="false"
        trap-focus
      >
      </b-datepicker>
    </b-field>
    <b-field label="Amount">
      <b-input type="number" v-model="amount"></b-input>
    </b-field>
    <b-field label="Half Bill">
      <b-input v-model="half_bill"></b-input>
    </b-field>    <b-button
      :loading="isCreating"
      type="is-primary is-light"
      @click="createProject"
    >
      Create Project
    </b-button>
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
  name = ''
  customer = '';
  specification = '';
  amount = 0;
  isCreating = false;

  data() {
    return {
      project_date: null,
      half_bill: null,
      deliver_date: null
    }
  }

  async asyncData({$axios, params}) {
    const [customer] = await $axios.$get(`/api/${tableNames.customers}/${params.customer_id}`);
    return {
      customer
    }
  }

  mounted() {
    //@ts-ignore
    this.customer = JSON.parse(this.$refs.customer_dropdown.getAttribute('data-customer'))
  }

  async createProject() {
    if (!this.name || this.customer === '') {
      $warn('Project name & Customer is mandatory')
      return;
    }
    try {
      this.isCreating = true;
      $indefinite('Creating Project')
      const {insertId} = (await this.$axios.post(`/api/${tableNames.projects}`, {
        name: this.name,
        //@ts-ignore
        customer_id: this.customer.id,
        specification: this.specification,
        amount: this.amount,
        //@ts-ignore
        project_date: formatDateToSQLFormat(this.project_date),
        //@ts-ignore
        deliver_date: formatDateToSQLFormat(this.deliver_date),
        //@ts-ignore
        half_bill: this.half_bill
      })).data
      const config: Record<string, string | number | boolean> = {
        narration: `New Project: ${this.name}`,
        //@ts-ignore
        customer_id: this.customer.id,
        project_id: insertId,
        debit_amount: this.amount,
        //@ts-ignore
        transact_date: formatDateToSQLFormat(this.project_date)
      }
      await this.$axios.post(`/api/${tableNames.transactions}`, config)
      await this.$router.push({
        //@ts-ignore
        path: `/customers/${this.customer.id}/projects`
      })
      $success('Project created');
    } catch (e) {
      $error('Error: ' + e)
    }
    this.isCreating = false;
  }
}
</script>
