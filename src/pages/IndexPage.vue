<template>
  <q-page class="q-ma-xl">
    <q-table
      title="List of users"
      :rows="rows"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
          <q-th>Action</q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.value }}
          </q-td>
          <q-td auto-width>
            <q-btn size="sm" color="primary" round dense @click="handleUpdate(props.row)" icon="edit" style="padding: 8px; margin: 8px;" />
            <q-btn size="sm" color="negative" round dense @click="handleDelete(props.row)" icon="delete" style="padding: 8px; margin: 8px;" />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
  import axios from "axios";
  import { ref } from "vue";
  import {users as rows, selectedUser} from "../composable/Users";
  import { useRouter } from "vue-router";
  import { useQuasar } from 'quasar';

  export default {
    setup() {
      selectedUser.value = null;
      const router = useRouter();
      const $q = useQuasar()
      let columns = ref([
        {
          name: "name",
          label: "Name",
          align: "left",
          field: "name",
          sortable: true,
        },
        {
          name: "username",
          label: "Username",
          align: "left",
          field: "username",
        },
        {
          name: "email",
          label: "Email",
          align: "left",
          field: "email",
        },
        {
          name: "address",
          label: "Address",
          align: "left",
          field: row => `${row.address.street}, ${row.address.suite}, ${row.address.city} ${row.address.zipcode ? `(${row.address.zipcode})` : ''}`,
        },
        {
          name: "phone",
          label: "Contact Number",
          align: "left",
          field: "phone",
        },
        {
          name: "website",
          label: "Website",
          align: "left",
          field: "website",
        },
        {
          name: "company",
          label: "Company",
          align: "left",
          field: row => row.company.name,
        },
      ]);

      const getUsers = () => {
        axios
          .get("https://jsonplaceholder.typicode.com/users")
          .then((response) => {
            rows.value = response.data;
          });
      };
      
      if(rows.value.length === 0){
        getUsers();
      }

      const handleUpdate = (row)=>{
        let user = {...row};
        if(user.middleName){
          let name = user.name.split(`${' '+user.middleName.charAt(0).toUpperCase()+'. '}`);
          user.name = {
            firstName: name[0],
            lastName: name[1]
          }
        }else{
          let name = user.name.split(' ');
          user.name = {
            firstName: name.slice(0, name.length - 1).join(' '),
            lastName: name[name.length - 1]
          }
          user.middleName = null;
        }
        
        selectedUser.value = user;
        router.push({ path: 'form' })
      }

      const handleDelete = (row)=>{
        $q.dialog({
          title: 'Confirm',
          message: 'Are you sure you want to delete the user?',
          cancel: true,
          persistent: true
        }).onOk(() => {
          axios.delete(`https://jsonplaceholder.typicode.com/users/${row.id}`)
          .then((response) => {
            if (response.status === 200) {
              rows.value = rows.value.filter(
                (user) => user.id !== row.id
              );
              $q.notify({ position: 'top', color: 'positive', message: 'User data successfully deleted!', icon: 'check_circle_outline' })
            }
          });
        })
      }

      return { rows, columns, handleUpdate, handleDelete };
    }
  }
</script>
