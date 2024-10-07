import { ref } from "vue";

let users = ref([]);
let selectedUser = ref(null);

export {users, selectedUser};