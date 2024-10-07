<template>
  <q-form @submit="!selectedRow.id ? addTodo() : updateTodo()" class="q-ma-md">
    <q-input v-model="form.title" />
    <q-btn
      type="submit"
      :label="!selectedRow.id ? 'Submit' : 'Update'"
      color="primary"
    />
    <q-btn
		  :loading="deleteBtnLoadingState"
      v-if="selectedRow.id"
      @click="deleteTodo()"
      class="q-ml-md"
      label="Delete"
      color="negative"
    />
  </q-form>
  <q-page class="q-ma-xl">
    <q-table
      title="Todos"
      :rows="rows"
      :columns="columns"
      row-key="name"
      @row-click="onRowClick"
    />
  </q-page>
</template>

<script>
  import axios from "axios";
  import { ref } from "vue";
  export default {
    setup() {
      let rows = ref([]);
      let columns = ref([
        {
          name: "title",
          label: "Title",
          align: "left",
          field: "title",
        },
        {
          name: "completed",
          label: "Completed",
          align: "left",
          field: "completed",
        },
      ]);

      const getTodos = () => {
        axios
          .get("https://jsonplaceholder.typicode.com/todos")
          .then((response) => {
            rows.value = response.data;
          });
      };
      getTodos();


      let form = ref({
        userId: 1,
        title: null,
        completed: false,
      });
      
      let btnLoadingState = ref(false);
      const addTodo = () => {
        btnLoadingState.value = true;
        axios
          .post("https://jsonplaceholder.typicode.com/todos", form.value)
          .then((response) => {
            if (response.status === 201) {
              rows.value.unshift(response.data);
              form.value.title = null;
            }
            btnLoadingState.value = false;
          });
      };

      let selectedRow = ref({});
      const onRowClick = (evt, row) => {
        selectedRow.value = row;
        form.value.title = row.title;
      };


      const updateTodo = () => {
        btnLoadingState.value = true;
        axios
          .put(
            `https://jsonplaceholder.typicode.com/todos/${selectedRow.value.id}`,
            {
              title: form.value.title,
            }
          )
          .then((response) => {
            if (response.status === 200) {
              let index = rows.value.findIndex(
                (row) => row.id === selectedRow.value.id
              );
              rows.value[index].title = response.data.title;
              form.value.title = null;
              selectedRow.value = {};
            }
            btnLoadingState.value = false;
          });
      };

      let deleteBtnLoadingState = ref(false);
      const deleteTodo = () => {
        deleteBtnLoadingState.value = true;
        axios
          .delete(
            `https://jsonplaceholder.typicode.com/todos/${selectedRow.value.id}`
          )
          .then((response) => {
            if (response.status === 200) {
              rows.value = rows.value.filter(
                (row) => row.id !== selectedRow.value.id
              );
              form.value.title = null;
              selectedRow.value = {};
            }
            deleteBtnLoadingState.value = false;
          });
      };


      return {
        rows,
        columns,
        form,
        btnLoadingState,
        addTodo,
        selectedRow,
        onRowClick,
        updateTodo,
        deleteBtnLoadingState,
        deleteTodo,
      };
    },
  };
</script>
