<template>
  <div class="mx-4 my-4" style="max-width: 500px; margin: auto">
    <h1 class="is-size-3">New Customer</h1>
    <b-field label="Name">
      <b-input v-model="name"></b-input>
    </b-field>
    <b-field label="Company Name">
      <b-input v-model="company"></b-input>
    </b-field>
    <b-field label="Phone number">
      <b-input v-model="phone" type="tel"></b-input>
    </b-field>
    <b-button
        :loading="isCreating"
        type="is-primary is-light"
        @click="createCustomer"
    >
      Create Customer
    </b-button>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {$error, $indefinite, $success, $warn} from "@/helpers";
import {tableNames} from "@/constants";
import {execInsertQuery, generateInsertQuery} from "@/queries";

@Component({
  name: 'NewCustomer'
})
export default class NewCustomer extends Vue {
  name = ''
  company = ''
  phone = ''
  isCreating = false;

  async createCustomer() {
    if (!this.name) {
      $warn('Customer name is mandatory')
      return;
    }
    try {
      this.isCreating = true;
      $indefinite('Creating Customer')
      await execInsertQuery(
          generateInsertQuery(tableNames.customers, {
            name: this.name,
            company: this.company,
            phone: this.phone
          })
      )
      $success('Customer created');
      await this.$router.push({
        path: '/customers'
      })
    } catch (e) {
      $error('Error: ' + e)
    }
    this.isCreating = false;
  }
}
</script>
