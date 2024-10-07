<template>
    <q-page class="q-ma-xl">
        <div class="text-h5" style="font-weight: bolder;">User Form:</div>
        <q-form @submit.prevent="selected === null ? handleSubmit() : handleUpdate()" class="q-my-xl">
            <p class="q-mt-lg q-mb-none q-mx-none">Name:</p>
            <div class="flex flex-center justify-between">
                <q-input v-model="form.name.firstName" outlined label="First Name" stack-label dense class="name-input" lazy-rules :rules="[(val) => !!val || 'Field is required']" />
                <q-input v-model="form.middleName" outlined label="Middle Name" stack-label dense class="name-input" style="padding-bottom: 20px;" />
                <q-input v-model="form.name.lastName" outlined label="Last Name" stack-label dense class="name-input" lazy-rules :rules="[(val) => !!val || 'Field is required']" />
                <q-input v-model="form.username" outlined label="Username" stack-label dense class="name-input" lazy-rules :rules="[(val) => !!val || 'Field is required']" />
            </div>
            <p class="q-mt-lg q-mb-none q-mx-none">Address:</p>
            <div class="flex flex-center justify-between">
                <q-input v-model="form.address.street" outlined label="Street" stack-label dense class="address-input" lazy-rules :rules="[(val) => !!val || 'Field is required']" />
                <q-input v-model="form.address.suite" outlined label="Suite" stack-label dense class="address-input" lazy-rules :rules="[(val) => !!val || 'Field is required']" />
                <q-input v-model="form.address.city" outlined label="City" stack-label dense class="address-input" lazy-rules :rules="[(val) => !!val || 'Field is required']" />
                <q-input v-model="form.address.zipcode" outlined label="Zipcode" stack-label dense class="address-input" style="padding-bottom: 20px;" />
            </div>
            <p class="q-mt-lg q-mb-none q-mx-none">Company:</p>
            <div class="flex flex-center justify-between">
                <q-input v-model="form.company.name" outlined label="Name" stack-label dense class="company-input" />
                <q-input v-model="form.company.catchPhrase" outlined label="Moto" stack-label dense class="company-input" />
                <q-input v-model="form.company.bs" outlined label="BS" stack-label dense class="company-input" />
            </div>
            <p class="q-mt-lg q-mb-none q-mx-none">Other information:</p>
            <div class="flex flex-center justify-between">
                <q-input v-model="form.phone" outlined label="Contact number" stack-label dense class="company-input" lazy-rules :rules="[(val) => !!val || 'Field is required']" />
                <q-input v-model="form.email" outlined label="Email" type="email" stack-label dense class="company-input" lazy-rules :rules="[(val) => !!val || 'Field is required']" />
                <q-input v-model="form.website" outlined label="Website" stack-label dense class="company-input" style="padding-bottom: 20px;" />
            </div>
            <hr class="q-mt-lg">
            <div class="flex flex-center justify-center q-mt-lg">
                <q-btn :label="selected === null ? 'Submit' : 'Save Update'" :color="selected === null ? 'primary' : 'positive'" type="submit" style="width: 150px"/>
            </div>
        </q-form>
    </q-page>
</template>

<script>
    import axios from "axios";
    import { ref } from "vue";
    import {users, selectedUser} from "../composable/Users";
    import { useQuasar } from 'quasar';

    export default {
        setup() {
            const $q = useQuasar()
            const selected = selectedUser.value !== null ? {...selectedUser.value} : null;
            console.log("selectedUser:", selected)
            let form = ref(selected === null ? {
                id: null,
                name: {
                    firstName: null,
                    lastName: null
                },
                middleName: null,
                username: null,
                email: null,
                address: {
                    street: null,
                    suite: null,
                    city: null,
                    zipcode: null,
                    geo:{
                        lat: null,
                        lng: null
                    }
                },
                phone: null,
                website: null,
                company: {
                    name: null,
                    catchPhrase: null,
                    bs: null,
                }
            } : selected)

            console.log("Form:", form.value)

            const handleSubmit = ()=>{
                console.log("submit")
                $q.loading.show();
                let name = form.value.name;
                form.value.name = `${name.firstName} ${form.value.middleName ? form.value.middleName.charAt(0).toUpperCase()+'. ' : ''}${name.lastName}`
                axios.post("https://jsonplaceholder.typicode.com/users", form.value)
                .then((response) => {
                    if (response.status === 201) {
                        users.value.unshift(response.data);
                        handleReset();
                        $q.loading.hide();
                        $q.notify({ position: 'top', color: 'positive', message: 'User data successfully saved!', icon: 'check_circle_outline' })
                    }else{
                        $q.loading.hide()
                        $q.notify({ position: 'top', color: 'negative', message: 'Something went wrong!', icon: 'error_outline' })
                    }
                });
            }

            const  handleUpdate = ()=>{
                console.log("update",form.value.id)
                $q.loading.show();
                let name = form.value.name;
                form.value.name = `${name.firstName} ${form.value.middleName ? form.value.middleName.charAt(0).toUpperCase()+'. ' : ''}${name.lastName}`
                axios.put(`https://jsonplaceholder.typicode.com/users/${selectedUser.value.id}`, form.value)
                .then((response) => {
                    if (response.status === 200) {
                        let index = users.value.findIndex(
                            (users) => users.id === selectedUser.value.id
                        );
                        users.value[index] = form.value;
                        handleReset();
                        selectedUser.value = null;
                        $q.loading.hide();
                        $q.notify({ position: 'top', color: 'positive', message: 'User data successfully updated!', icon: 'check_circle_outline' })
                    }else{
                        $q.loading.hide()
                        $q.notify({ position: 'top', color: 'negative', message: 'Something went wrong!', icon: 'error_outline' })
                    }
                });
            }

            const handleReset = ()=>{
                form.value = {
                    id: null,
                    name: {
                        firstName: null,
                        lastName: null
                    },
                    middleName: null,
                    username: null,
                    email: null,
                    address: {
                        street: null,
                        suite: null,
                        city: null,
                        zipcode: null,
                        geo:{
                            lat: null,
                            lng: null
                        }
                    },
                    phone: null,
                    website: null,
                    company: {
                        name: null,
                        catchPhrase: null,
                        bs: null,
                    }
                }
            }

            return {form, selected, handleSubmit, handleUpdate};
        }
    }
</script>

<style scoped>
    .name-input{
        width: 370px;
        margin: 10px;
    }

    .address-input{
        width: 370px;
        margin: 10px
    }

    .company-input{
        width: 502px;
        margin: 10px
    }
</style>