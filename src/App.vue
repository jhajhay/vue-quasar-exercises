<script setup>
  import {ref} from 'vue';
  
  let userList = ref([]);
  let archive = ref([]);
  let username = ref(null);
  let fullname = ref(null);
  let email = ref(null);
  let selectedUpdate = ref(false);
  let selectedUserID = ref(null);
  let showArchive = ref(false);

  const handleSubmit = ()=>{
    userList.value.push({
      id: getUserID(),
      username: username.value,
      fullname: fullname.value,
      email: email.value
    });
    resetForm();
  }

  const getUserID = ()=>{
    if(userList.value.length === 0){
      return 0;
    }else{
      return userList.value[userList.value.length - 1].id + 1;
    }
  }

  const handleUpdateOnclick = (index)=>{
    username.value = userList.value[index].username;
    fullname.value = userList.value[index].fullname;
    email.value = userList.value[index].email;
    selectedUpdate.value = true;
    selectedUserID.value = index;
  }

  const handleSubmitUpdate = ()=>{
    userList.value[selectedUserID.value].username = username.value;
    userList.value[selectedUserID.value].fullname = fullname.value;
    userList.value[selectedUserID.value].email = email.value;
    selectedUpdate.value = false;
    selectedUserID.value = null;
    resetForm();
  } 

  const resetForm = ()=>{
    username.value = null;
    fullname.value = null;
    email.value = null;
  }

  const handleDelete = (index)=>{
    if (confirm(`Are you sure you want to delete ${userList.value[index].fullname} data?`)) {
      archive.value.push(userList.value[index])
      userList.value.splice(index, 1);
    }
    console.log("archive",archive.value)
  }

  const handleShowArchive = ()=>{
    showArchive.value = true;
  }

  const handleHideArchive = ()=>{
    showArchive.value = false;
  }

  const handleRestore = (index)=>{
    archive.value[index].id = getUserID();
    userList.value.push(archive.value[index]);
    archive.value.splice(index, 1);
    console.log("userList.value:",userList.value)
    console.log("archive.value:",archive.value)
  }
</script>

<template>
  <div class="d-flex justify-content-center container">
    <div class="w-75 mt-5">
      <form class="w-50 mb-5" @submit.prevent="!selectedUpdate ? handleSubmit() : handleSubmitUpdate()">
        <input v-model="username" type="text" class="form-control mb-2" id="username" placeholder="Enter Username" required>
        <input v-model="fullname" type="text" class="form-control mb-2" id="fullname" placeholder="Enter Fullname" required>
        <input v-model="email" type="email" class="form-control mb-2" id="email" placeholder="Enter Email" required>
        <div class="d-flex justify-content-between">
          <button 
            @click.prevent="!showArchive ? handleShowArchive() : handleHideArchive()"
            :class="`btn btn-${!showArchive ? 'secondary' : 'success'} btn-sm`"
          >
            <i :class="`bi bi-${!showArchive ? 'archive' : 'people'}`"></i> Show {{ !showArchive ? "Archive" : "Active" }} Users List
          </button>
          <button class="btn btn-primary"><i :class="`bi bi-${!selectedUpdate ? 'person-add' : 'save2'}`"></i> {{ !selectedUpdate ? "Add User" : "Save" }}</button>
        </div>
      </form>
      <div v-if="!showArchive" class="card mb-2" v-for="(user, index) in userList" :key="user.id">
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-10">
              <i class="bi bi-person-circle" id="user-icon"></i>
              <div class="user-info d-inline-block ms-3">
                <h4>{{ user.fullname }} ({{ user.username }}) <span class="badge text-bg-success">Active</span></h4>
                <p>{{ user.email }}</p>
              </div>
            </div>
            <div class="col-2">
              <div class="d-flex justify-content-around">
                <button class="btn btn-primary" @click.stop="handleUpdateOnclick(index)"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-danger" @click.stop="handleDelete(index)"><i class="bi bi-trash-fill"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showArchive" class="card mb-2" v-for="(user, index) in archive" :key="user.id">
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-10">
              <i class="bi bi-person-circle" id="user-icon"></i>
              <div class="user-info d-inline-block ms-3">
                <h4>{{ user.fullname }} ({{ user.username }}) <span class="badge text-bg-danger">Deleted</span></h4>
                <p>{{ user.email }}</p>
              </div>
            </div>
            <div class="col-2">
              <div class="d-flex justify-content-center">
                <button class="btn btn-success" @click.stop="handleRestore(index)"><i class="bi bi-person-up"></i> Restore User</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  #user-icon{
    font-size: 60px;
  }

  .user-info *{
    margin: 0px
  }
</style>
