import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import Swal from 'sweetalert2'

// axios.defaults.baseURL = 'https://api.zibar.ir'
axios.defaults.baseURL = 'http://localhost:8000'

axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access');

axios.interceptors.response.use(undefined, (error) => {
  
  if(error.response.status === 401 && error.response.request.responseURL != axios.defaults.baseURL + '/verify/'){
    location.reload()
  }
  else if(error.response.status === 401 && error.response.request.responseURL == axios.defaults.baseURL + '/verify/'){
    return Promise.reject(error);
  }
  else if(error.response.status === 500){
    Swal.fire('', 'ارور سرور، مشکلی پیش آمده لطفا مجددا امتحان کنید یا به پشتیانی گزارش دهید.', 'error')
  }
  else if(error.response.status == 429){
    Swal.fire('.تعداد درخواست ها زیاد است', '.لطفا کمی صبر کرده و مجددا امتحان فرمایید', 'warning')
  }
  else if(error.response !== 406){
    Swal.fire({title: error.response.data.message, icon: "error", backdrop: false, position: "top", timer: 3000, showConfirmButton: false})
  }

  return Promise.reject(error);
});

createApp(App).use(router).mount('#app')
