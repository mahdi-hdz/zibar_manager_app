<template>
    <div id="notifAlert" class="position-fixed container" style="z-index: 100; top:10px;left:50%;transform: translateX(-50%)" dir="rtl" role="alert"></div>
    <div v-if="firstLoading" class="d-flex justify-content-center" style="height: 100vh;">
        <loading style="width: 100px" color="#42b983" />
    </div>
    <div v-else>

        
        <div class="m-auto bg-light" v-if="online">
            <div id="nav" class="position-fixed w-100 d-flex" style="bottom: 0px">
                <router-link class="col nav-link mx-3 my-1 p-0 py-1 rounded-3" to="/profile"> <i class="fad fa-user-circle"></i></router-link> 
                <router-link class="col nav-link mx-3 my-1 p-0 py-1 rounded-3" to="/bars"> <i class="fad fa-list-alt"></i></router-link> 
                <router-link class="col nav-link mx-3 my-1 p-0 py-1 rounded-3" to="/newBar" replace> <i class="fad fa-plus"></i></router-link> 
                <router-link class="col nav-link mx-3 my-1 p-0 py-1 rounded-3" to="/myHistory"> <i class="fad fa-history"></i></router-link> 
                <router-link class="col nav-link mx-3 my-1 p-0 py-1 rounded-3" to="/notifications"> <i class="fad fa-bell"></i></router-link>
            </div>
            <!-- <div id="nav" class="position-fixed bg-lightgray rounded-top container pb-0 row m-0" style="bottom: 0px">
                <router-link class="col nav-link border-end" to="/profile"> <img src="./icons/user-circle-solid.svg"> <br> پروفایل</router-link> 
                <router-link id="BarsNavLink" class="col nav-link border-end" to="/bars"> <img src="./icons/bars.svg"> <br> بارها</router-link> 
                <router-link id="NewBarNavLink" class="col nav-link border-end" to="/newBar" replace> <img src="./icons/plus.svg"> <br> ثبت بار</router-link> 
                <router-link class="col nav-link border-end" to="/myHistory"> <img src="./icons/history.svg"> <br> تاریخچه</router-link> 
                <router-link class="col nav-link" to="/notifications"> <img src="./icons/notification.svg"> <br> اطلاعیه ها</router-link>
            </div> -->
            <router-view/>
    </div>

    <div v-else>
        <img class="mt-5 pt-5" src="./icons/offline.png" alt="" srcset="">
        <h3 class="mt-2"> به اینترنت دسترسی ندارید </h3>
        <button class="btn btn-outline-success mt-2" @click="checkOnline"> <loading v-if="connectLoading" style="width: 30px; display: inline;" color="#fff" /> تلاش مجدد </button>
    </div>
    
    </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import Loading from './views/Loading.vue'
import router from './router'
// import modal from "bootstrap"

export default{
    setup() {
        let firstLoading = ref(true);
        let online = ref(navigator.onLine);
        let token
        let connectLoading = ref(false)
        if(online.value == false){
            firstLoading.value = false
        }
        
        let refreshed = false;

        function checkOnline() {
            connectLoading.value = true
            online.value = navigator.onLine;
            setTimeout(() => {
                connectLoading.value = false
            }, 500);
        }

        function checkLogin() {
            if(location.pathname == "/login"){
                firstLoading.value = false
            }
            token = localStorage.getItem("access");
            if (!token & location.pathname !== "/login") {
                firstLoading.value = false
                router.replace({ path: '/login' })
            }
            else if (token) {
                axios.post("/verify/", {
                    token: token
                }).then((res) => {
                    firstLoading.value = false
                    localStorage.setItem("isAuthenticated", res.data.userInfo[0].isAuthenticated);
                    localStorage.setItem("name", res.data.userInfo[0].name);
                    localStorage.setItem("phoneNumber", res.data.userInfo[0].phone_number);
                    router.replace({ path: '/profile' })

                    if(res.data.notification){
                        let notifAlertContainer = document.getElementById('notifAlert')
                        for (let i = 0; i < res.data.notification.length; i++) {
                        notifAlertContainer.innerHTML += `<div class="alert alert-${res.data.notification[i].color} alert-dismissible fade" <strong> اطلاعیه، توجه کنید </strong> <hr> <strong> ${res.data.notification[i].title} </strong> <br/> ${res.data.notification[i].description} <button id="${res.data.notification[i].notifId}" type="button" class="btn-close eventfor" data-bs-dismiss="alert"></button> </div>`
                        }
                        let btns = document.getElementsByClassName('eventfor')
                        for (let i = 0; i < btns.length; i++) {
                        btns[i].addEventListener('click', SeenNotif)
                        
                        }
                        let indexes = []
                        for (var i = 0; i < notifAlertContainer.children.length; i++) {
                            indexes.push(i)
                        }
                        if(indexes){
                        fadeShow(0)
                        }

                        function fadeShow(i){
                        setTimeout(() => {
                            notifAlertContainer.children[i].classList.add('show')
                            if(indexes[i+1]){
                            fadeShow(i+1)
                            }
                        }, 500);
                        }
                    }

                }).catch((res) => {
                    console.log(res);
                    if (res.code == "ERR_NETWORK") {
                        firstLoading.value = false
                        Swal.fire("خطا در برقراری ارتباط با سرور", "لطفا بعدا مجددا تلاش کنید.", "error");
                        return;
                    }
                    if (refreshed) {
                        localStorage.clear();
                        firstLoading.value = false
                        router.replace({ path: '/login' })
                    }
                    if (res.response.status == 401) {
                        refreshToken();
                    }
                    else {
                        localStorage.clear();
                        firstLoading.value = false
                        router.replace({ path: '/login' })
                    }
                });
            }
        }
        checkLogin()
        function refreshToken() {
            axios.post("/api/token/refresh/", {
                refresh: localStorage.getItem("refresh")
            }).then((res) => {
                localStorage.setItem("access", res.data.access);
                token = res.data.access;
                axios.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("access");
                refreshed = true;
                checkLogin();
            }).catch(() => {
                localStorage.clear();
                router.replace({ path: '/login' })
            });
        }

        function SeenNotif(e){
            axios
            .post('/SeenNotification/', {
                token: token,
                notifId: e.target.id
            })
        }

        return { online, checkOnline, firstLoading, connectLoading };
    },
    components: { Loading }
}
</script>

<style>
@import url(~bootstrap/dist/css/bootstrap.min.css);

@font-face {
   font-family: Sahel;
   src: url(./fonts/Sahel.woff);
}

* {
   font-family: Sahel;
   /* direction: rtl !important; */
}

body {
    height: 100vh;
    background-color: #2c3e50;
}

.text-green{
  color: #42b983 !important;
} 
/* 42b983 */

.bg-green{
  background-color: #42b983;
}

.bg-darkgreen{
  background-color: #2d805a;
}

.border-green{
  border-color: #42b983 !important;
}

.btn-outline-green{
  color: #42b983 ;
  border-color: #42b983 ;
}
.btn-outline-green:hover{
  background-color: #42b983;
  color: white;
}

.pointer {
    cursor: pointer !important;
}

.swal2-popup {
font-size: .5rem !important;
}

#app {
  text-align: center;
  color: #2c3e50;
}


a > i{
  font-size: 2rem;
}

#nav {
    background-color: #aee4cc;
    z-index: 10;
}


.nav-link > i{
    color: #42b983;
}

.router-link-active > i{
    color: #fff;
}
.router-link-active {
    background-color: #42b983;
}



</style>
