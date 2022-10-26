<template>
  <div>
    <div class="is-flex is-justify-content-space-between px-4 is-align-items-center">
      <h1 class="is-size-3">Customers</h1>
      <router-link to="/customers/new">
        <b-button>New Customer</b-button>
      </router-link>
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
        <router-link :to="`/customers/${props.row.id}/projects`">View</router-link>
        /
        <router-link :to="`/customers/${props.row.id}/projects/new`">New</router-link>
      </b-table-column>
      <b-table-column v-slot="props" label="All transactions">
        <router-link :to="`/customers/${props.row.id}`">View</router-link>
        /
        <router-link :to="`/customers/${props.row.id}/transaction/new`">New</router-link>
      </b-table-column>
    </b-table>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {formatDateFromSQLFormat} from "@/helpers";
import {execQuery, getAllCustomersQuery, getAllTransactionsQuery} from "@/queries";
import {config} from "@/constants";

@Component({
  name: 'HomeView'
})
export default class HomeView extends Vue {
  customers: any[] = []

  async mounted() {
    console.log('sdfsdf',config.a)
    const customers = await execQuery(getAllCustomersQuery())
    const transactions = await execQuery(getAllTransactionsQuery())

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
    this.customers = customersWithTransactions;
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
