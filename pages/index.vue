<template>
  <div>
    <div class="is-flex is-justify-content-space-between px-4 is-align-items-center">
      <h1 class="is-size-3">Customers</h1>
      <NuxtLink to="/customers/new">
        <b-button>New Customer</b-button>
      </NuxtLink>
    </div>
    <b-table :data="customers" class="p-2">
      <b-table-column v-slot="props" field="name" label="Name" sortable>
        {{ props.row.name }}
      </b-table-column>
      <b-table-column v-slot="props" field="company" label="Company" sortable>
        {{ props.row.company }}
      </b-table-column>
      <b-table-column v-slot="props" field="Phone" label="Phone">
        <a :href="`tel:${props.row.phone}`" class="is-size-6">{{ props.row.phone }}</a>
      </b-table-column>
      <b-table-column v-slot="props" field="balance" label="Balance">
        {{ props.row.balance }}
      </b-table-column>
      <b-table-column v-slot="props" label="Projects">
        <NuxtLink :to="`/customers/${props.row.id}/projects`">View</NuxtLink>
        /
        <NuxtLink :to="`/customers/${props.row.id}/projects/new`">New</NuxtLink>
      </b-table-column>
      <b-table-column v-slot="props" label="All transactions">
        <NuxtLink :to="`/customers/${props.row.id}`">View</NuxtLink>
        /
        <NuxtLink :to="`/customers/${props.row.id}/transaction/new`">New</NuxtLink>
      </b-table-column>
    </b-table>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {tableNames} from "~/constants/constants";
import {formatDateFromSQLFormat} from "~/helpers";

@Component({
  name: 'HomeView'
})
export default class HomeView extends Vue {

  transactionColumns = [
    {
      field: 'transact_date',
      label: 'Date'
    },
    {
      field: 'narration',
      label: 'Narration'
    },
    {
      field: 'credit_amount',
      label: 'Credit',
      numeric: true
    },
    {
      field: 'debit_amount',
      label: 'Debit',
      numeric: true
    },
  ]

  async asyncData({$axios}) {
    const customers: any[] = await $axios.$get(`/api/${tableNames.customers}`);
    const transactions: any[] = await $axios.$get(`/api/${tableNames.transactions}`);
    // const projects: any[] = await $axios.$get(`/api/${tableNames.projects}`);

    const customersWithTransactions = customers.map(customer => {
      let balance = 0;
      let currentCustomerTransactions = transactions
        .filter(transaction => transaction.customer_id === customer.id);
      currentCustomerTransactions = currentCustomerTransactions
        .map(transaction => {
          if (transaction.credit_amount) {
            balance += transaction.credit_amount;
            transaction.credit_amount = transaction.credit_amount.toLocaleString('en-IN', {minimumFractionDigits: 2});
          }
          if (transaction.debit_amount) {
            balance -= transaction.debit_amount;
            transaction.debit_amount = transaction.debit_amount.toLocaleString('en-IN', {minimumFractionDigits: 2});
          }
          transaction.transact_date = formatDateFromSQLFormat(transaction.transact_date);
          return transaction;
        })
      customer.balance = balance.toLocaleString('en-IN', {minimumFractionDigits: 2});
      customer.transactions = currentCustomerTransactions
      return customer;
    })
    return {customers: customersWithTransactions};
  }

}
</script>
<style>
.detail {
  background-color: #fff !important;
}
.detail-container {
  padding: 0 !important;
}

.table-mobile-sort {
  display: none;
}
</style>
