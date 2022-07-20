<template>

    <div class="position-relative">
        
        <div class="py-1 text-green h5 border-bottom border-green d-inline-block px-5">ثبت بار جدید</div><br>
        <div v-if="!isAuthenticated" class="p-2 mt-5"> <h3 class="text-danger">شما هنوز احراز هویت نشدید</h3> از منو پروفایل احراز هویت کنید تا بتوانید بار ثبت کنید </div>
        
        <div v-else class="text-end p-4" id="newBarContainer" dir="rtl">
            <!-- <button :disabled="!isAuthenticated" class="btn btn-success position-fixed w-50" style="bottom: 70px; left: 25%;"> ثبت بار جدید </button> -->


            <label class="form-label" for="companyAddress"> مبدا بار <span class="text-danger">*</span></label>
                <div id="beginningContainer" class="btn-group w-100">
                  <button id="companyAddress" class="btn border shadow text-muted text-end" type="button" data-bs-toggle="dropdown">
                    <div v-if="newBar.beginning"> {{ newBar.beginning }} </div>
                    <div v-else> انتخاب کنید. </div>
                  </button>
                  <ul @click="selectBeg($event)" class="dropdown-menu text-end w-100" dir="ltr">
             
                    <button class="w-100 btn dropdown-item mb-1"> مشهد </button>
                    <button class="w-100 btn dropdown-item mb-1"> اخلمد چناران </button>
                    <button class="w-100 btn dropdown-item mb-1"> بینالود </button>
                    <button class="w-100 btn dropdown-item mb-1"> پایانه مرزی سرخس </button>
                    <button class="w-100 btn dropdown-item mb-1"> چناران </button>
                    <button class="w-100 btn dropdown-item mb-1"> خانگیران </button>
                    <button class="w-100 btn dropdown-item mb-1"> رباط سفید </button>
                    <button class="w-100 btn dropdown-item mb-1"> سرخس </button>
                    <button class="w-100 btn dropdown-item mb-1"> سنگ بست </button>
                    <button class="w-100 btn dropdown-item mb-1"> سیدآباد چناران </button>
                    <button class="w-100 btn dropdown-item mb-1"> شهرک صنعتی کاویان </button>
                    <button class="w-100 btn dropdown-item mb-1"> فاز </button>
                    <button class="w-100 btn dropdown-item mb-1"> فرهادگر </button>
                    <button class="w-100 btn dropdown-item mb-1"> کارخانه سیمان مشهد </button>
                    <button class="w-100 btn dropdown-item mb-1"> کارخانه قند مشهد </button>
                    <button class="w-100 btn dropdown-item mb-1"> گنبدلی </button>

                  </ul>
                </div>


                <label class="form-label mt-4" for="destinationInput"> مقصد <span class="text-danger">*</span></label>
                <div v-if="showSearchField" class="dropdown">
                    <div class="input-group" dir="ltr">
                        <button @click="showSearchField = false" v-if="newBar.destinations[0]" class="btn btn-danger"><i class="fa fa-times"></i></button>
                        <input v-model.trim="searchField" id="destinationsContainer" class="form-control shadow" placeholder="جستجو کنید" dir="rtl">
                    </div>
                    <div class="dropdown-menu show w-100 text-end" v-if="showSearchRes">
                        <Loading v-if="citiesLoading" style="width: 70px" color="#42b983"/>
                        <div v-else>
                            <div v-if="!searchRes[0]" class="pe-2">
                                نتیجه ای یافت نشد 
                            </div>
                            <div v-else v-for="res in searchRes" @click="selectDes($event)" class="py-2 pe-2 border-top pointer">
                                {{res}}
                            </div>
                        </div>
                    </div>
                </div>
                <button v-else class="btn btn-success btn-sm me-4" @click="addDes"> افزودن مقصد </button>
                <div class="border rounded shadow d-flex my-2" v-for="(des, index) in newBar.destinations" :key="index">
                  <span class="align-self-center me-2"> {{ des }} </span>
                  <button @click="removeDes(index)" class="btn btn-danger me-auto"><i class="fa fa-times"></i></button>
                </div>
              
              <div>
              <label class="form-label mt-4" for="dropdownMenuButton">نوع ناوگان <span class="text-danger">*</span></label>
                <div class="btn-group w-100" id="fleet_typeContainer">
                  <button class="btn border shadow text-muted text-end" type="button" id="dropdownMenuButton" data-bs-toggle="modal" data-bs-target="#fleetModal" @click="loadFleetCheckBox">
                    <div> انتخاب کنید. </div>
                  </button>
                  <div class="modal fade" id="fleetModal" data-bs-backdrop="static" data-bs-keyboard="false">
                    <div class="modal-dialog modal-dialog-scrollable">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="staticBackdropLabel"> نوع ناوگان </h5>
                                <button type="button" class="btn btn-light" data-bs-dismiss="modal" aria-label="Close"><i class="fas fa-arrow-left fs-3"></i></button>
                            </div>
                            <div class="modal-body" dir="ltr">
                                <div v-for="(value, key) in fleets">
                                    <div  class="text-end my-2" data-bs-toggle="collapse" :data-bs-target="'#'+key.split(' ')[0]+'collapse'">
                                        <label class="p-2 pointer w-100  fw-bold text-green" :for="key"> {{key}}
                                            <input :id="key" type="checkbox" name="fleetCategory" class="form-check-input ms-2">
                                        </label>
                                    </div>
                                    <div class="collapse pe-2 text-end bg-lightGray" :id="key.split(' ')[0]+'collapse'">
                                        <div v-for="fleet in value" class="w-50 d-inline-block">
                                            <label class="py-2 pointer w-100" :for="key+'-'+fleet"> {{fleet}}
                                                <input :id="key+'-'+fleet" name="fleetSubItem" type="checkbox" class="form-check-input ms-2">
                                            </label>
                                        </div>
                                    </div>
                                </div>                  
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-success bg-green text-light w-100" @click="setFleet" data-bs-dismiss="modal"> ثبت </button>
                            </div>
                        </div>
                    </div>
                </div>
                  
                </div>
                <div v-for="(values, name) in newBar.fleet_type" :key="name" class="mt-2">
                    <div v-if="values[0]"> <span class="p-1 border border-dark rounded"> <button @click="clear_fleet_category(name)" class="fs-4 p-0 btn text-danger"><i class="fal fa-times-circle"></i></button> {{ name }}: </span></div>
                      <div class="d-inline-block m-1" v-for="(value, index) in values" :key="index">
                        <span class="py-1 pe-2 ms-2 mt-2 border border-danger rounded"> {{ value }} <button @click="remove_item_from_fleet(name, value)" class="btn btn-outline-danger border-0 fs-4 p-0"><i class="fal fa-times-circle"></i></button> </span>
                      </div>
                      <hr v-if="values[0]">
                </div>
              </div>


                <label class="form-label mt-4" for="priceContainer"> کرایه <span class="text-danger">*</span></label>
                <div class="form-check form-check-inline pe-3">
                  <input @change="setPriceSpan" class="form-check-input cursor-pointer" type="radio" checked name="priceType" id="به ازای هر سرویس">
                  <label class="form-check-label cursor-pointer" for="به ازای هر سرویس">به ازای هر سرویس</label>
                </div>
                <div class="form-check form-check-inline">
                  <input @change="setPriceSpan" class="form-check-input cursor-pointer" type="radio" name="priceType" id="به ازای هر تن">
                  <label class="form-check-label cursor-pointer" for="به ازای هر تن">به ازای هر تن</label>
                </div>
                <div class="form-check form-check-inline">
                  <input @change="setPriceSpan" class="form-check-input cursor-pointer" type="radio" name="priceType" id="توافقی">
                  <label class="form-check-label cursor-pointer" for="توافقی">توافقی</label>
                </div>
                <input v-model.trim="priceNumber" type="text" id="priceContainer" :disabled='disablePriceInput' class="form-control float-start shadow">
                <br>
                <span> {{ newBar.price }} </span>


                <br>
                <label class="form-label mt-4" for="dropdownDate">  تاریخ بارگیری <span class="text-danger">*</span></label>
                <div class="btn-group w-100" id="dateContainer">
                  <button class="btn border shadow text-muted text-end" type="button" id="dropdownDate" data-bs-toggle="dropdown" @click="getDate">
                    <div v-if="newBar.date"> {{ newBar.date }} </div>
                    <div v-else> انتخاب کنید. </div>
                  </button>
                  <ul class="dropdown-menu text-end w-100" dir="ltr">
                    <Loading v-if="dateLoading" style="width: 70px" color="#42b983"/>
                    <div v-else>
                        <button @click="selectDate(dateData.today, $event)" class="w-100 btn dropdown-item mb-1"> امروز </button>
                        <button @click="selectDate(dateData.tomorrow, $event)" class="w-100 btn dropdown-item mb-1"> فردا </button>
                        <button @click="selectDate(dateData.tomorrow1, $event)" class="w-100 btn dropdown-item mb-1"> {{ dateData.afterTomorrow }} </button>
                        <button @click="selectDate(dateData.tomorrow2, $event)" class="w-100 btn dropdown-item mb-1"> {{ dateData.twoAfterTomorrow }} </button>
                        <button @click="selectDate(dateData.tomorrow3, $event)" class="w-100 btn dropdown-item mb-1"> {{ dateData.threeAfterTomorrow }} </button>
                    </div>
                  </ul>
                </div>
                <span> {{ dateSelectedSpan }} </span>


                <div id="weightDiv" class="mt-4 text-end order-1">
                    <label class="form-label" for="weightContainer">  تناژ <span class="text-danger">*</span></label>
                    <input v-model.lazy.trim="newBar.weight" maxlength="2" type="text" id="weightContainer" class="form-control shadow">
                </div>


                <div class="mt-4 text-end order-1">
                    <label class="form-label" for="category">  نوع کالا </label>
                    <input v-model.lazy.trim="newBar.product_type" type="text" id="category" class="form-control shadow">
                </div>

              <div class="mt-4 text-end order-1">
                <label class="form-label" for="descriptions" dir="ltr"> (اختیاری) توضیحات </label>
                <textarea v-model.lazy.trim="newBar.description" id="descriptions" class="form-control shadow" rows="6"></textarea>
              </div>

              <button :disabled="submitLoading" @click="submit" class="w-100 my-5 btn btn-success bg-green"> ثبت <Loading v-if="submitLoading" style="width: 40px; display: inline;" color="#fff"/> </button>


        </div>
    </div>

</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2';
import { reactive, ref, toRaw, watch } from 'vue'
import Loading from './Loading.vue'

export default {
    setup() {
        let isAuthenticated = (localStorage.getItem("isAuthenticated") === "true");
        let searchField = ref("");
        let showSearchRes = ref(false)
        let showSearchField = ref(true)

        let newBar = reactive({
            beginning: "",
            destinations: [],
            fleet_type: {},
            price: 'به ازای هر سرویس 0 تومان',
            date: '',
            weight: '',
            product_type: '',
            description: ''
        })

        function selectBeg(e) {
            newBar.beginning = ` خراسان رضوی،${e.target.textContent}`;
        }
        let lessChar = ref(true);
        let citiesLoading = ref(false);
        let searchRes = ref([]);
        watch([searchField], () => {
            if (searchField.value.length < 2) {
                lessChar.value = true;
                showSearchRes.value = false
                return;
            }
            showSearchRes.value = true
            citiesLoading.value = true;
            axios
                .get("/SearchDestinations/", {
                params: { pattern: searchField.value }
            })
                .then((res) => {
                searchRes.value = res.data;
                citiesLoading.value = false;
            }).catch(() => {
                citiesLoading.value = false;
            });
            lessChar.value = false;
        });

        function selectDes(e){
            if(newBar.destinations.indexOf(e.target.textContent) > -1){
                Swal.fire({title: 'این مقصد انتخاب شده', icon: "error", backdrop: false, position: "top", timer: 2000, showConfirmButton: false})
                return
            }
            showSearchRes.value = false
            showSearchField.value = false
            searchField.value = ""
            newBar.destinations.push(e.target.textContent)
        }
        function removeDes(index){
            newBar.destinations.splice(index, 1)
        }
        function addDes(){
            if(newBar.destinations.length > 9){
                Swal.fire({title: 'حداکثر ده مقصد قابل ثبت است', icon: "error", backdrop: false, position: "top", timer: 2000, showConfirmButton: false})
                return
            }
            showSearchField.value = true
            setTimeout(() => {
                document.getElementById('destinationsContainer').focus()
            }, 500);
        }

        let fleets = {
            'کامیونت (خاور)': ['اتاق دار', 'مسقف فلزی', 'مسقف چادری', 'مسقف تا ۵.۵ متر', 'مسقف تا ۶ متر', 'یخچالی', 'بغلدار چادری', 'بغلدار معمولی', 'کمپرسی', 'تانکر'],
            'تک': ['اتاق دار', 'کمپرسی', 'تانکر', 'یخچالی', 'کفی', 'بغلدار چادری', 'بغلدار معمولی', 'مسقف فلزی', 'مسقف چادری', 'بونکر'],
            'جفت': ['کمپرسی', 'تانکر', 'بونکر', 'یخچالی', 'اتاق دار', 'کفی', 'مسقف فلزی', 'مسقف چادری', 'بغلدار چادری', 'بغلدار معمولی'],
            'تریلی': ['کفی ۱۲.۲۰', 'کفی ۱۳.۶۰', 'کمپرسی', 'تانکر', 'بغلدار ۱۲.۲۰', 'بغلدار ۱۳.۶۰', 'ترانزیت چادری ۱۲.۲۰', 'ترانزیت چادری ۱۳.۶۰', 'بونکر', 'خودرو بر', 'یخچالی', 'تیغه کانتینر بر', 'کمرشکن', 'مسقف (کانتینردار)', 'نیم لبه', '۲۰ فوت', '۴۰ فوت'],
            '۹۱۱': ['اتاق دار', 'کمپرسی', 'تانکر', 'یخچالی', 'مسقف فلزی', 'مسقف چادری', 'کفی', 'بغلدار چادری', 'بغلدار معمولی', 'بونکر'],
        }

        let priceNumber = ref('')
        let disablePriceInput = ref(false)
        watch([priceNumber], ()=>{
            setPriceSpan()
        })

        function setPriceSpan(){
            let priceType = document.querySelector('input[name="priceType"]:checked').id
            if(priceType == 'به ازای هر تن'){
                    document.getElementById('weightDiv').style.display = 'none'
                    newBar.weight = ''
            }else{
                document.getElementById('weightDiv').style.display = 'block'
            }
            if(priceType == 'توافقی'){
                disablePriceInput.value = true
                newBar.price = priceType
                priceNumber.value = ''
            }else{
                disablePriceInput.value = false            
                newBar.price =  `${priceType} ${Number(priceNumber.value).toLocaleString()} تومان`
            }
        }


        let dateLoading = ref(true)
        let dateData = ref()
        let dateSelectedSpan = ref('')

        function getDate(){
            if(dateLoading.value == false){
                return
            }
            axios.get('/GetDate/').then((res)=>{
                dateData.value = res.data[0]
                dateLoading.value = false
            })
        }

        function selectDate(date, e){
          newBar.date = date
          dateSelectedSpan.value = e.target.textContent
        }

        function loadFleetCheckBox(){
            let catList = Object.keys(newBar.fleet_type)
            
            for (const [key, value] of Object.entries(fleets)) {
                if(catList.includes(key)){
                    document.getElementById(key).checked = true
                    for (let i = 0; i < value.length; i++) {
                        if(newBar.fleet_type[key].includes(value[i])){
                            document.getElementById(`${key}-${value[i]}`).checked = true
                        }else{
                            document.getElementById(`${key}-${value[i]}`).checked = false
                        }
                    }
                }else{
                    document.getElementById(key).checked = false
                    document.getElementById(key.split(' ')[0]+ 'collapse').classList.remove('show')
                    for (let i = 0; i < value.length; i++) {
                        document.getElementById(`${key}-${value[i]}`).checked = false
                    }
                }
            }
        }

        function setFleet(){
            newBar.fleet_type = {}
            let fleetCategory = []
            document.querySelectorAll('input[name="fleetCategory"]:checked').forEach((element)=>{fleetCategory.push(element.id)})
        
            document.querySelectorAll('input[name="fleetSubItem"]:checked').forEach((e)=>{
                let fleetCat = e.id.split('-')[0]
                let fleetSub = e.id.split('-')[1]
                if(fleetCategory.indexOf(fleetCat) > -1){
                    if(newBar.fleet_type[fleetCat]){
                        newBar.fleet_type[fleetCat].push(fleetSub)
                    }else{
                        newBar.fleet_type[fleetCat] = [fleetSub]
                    }
                }
            })
        }

        function remove_item_from_fleet(fleetCategory, item){
            document.getElementById(`${fleetCategory}-${item}`).checked = false
            var index = newBar.fleet_type[fleetCategory].indexOf(item)
            newBar.fleet_type[fleetCategory].splice(index, 1)
        }

        function clear_fleet_category(category){
            let el = document.getElementById(category)
            el.checked = false
            let el2 = document.getElementById(category.split(' ')[0]+'collapse')
            el2.classList.remove('show')
            newBar.fleet_type[category] = []
        }


        let submitLoading = ref(false)
        function submit(){
            let requiredField = ['beginning', 'destinations', 'price', 'date', 'weight']
            if(newBar.price.includes('به ازای هر تن')){
                delete requiredField[4]
            }

            let validate = true

            document.querySelectorAll('.empty-field').forEach((element)=>{element.classList.remove('empty-field')})

            let obj = Object.keys(toRaw(newBar))
            for (let i = 0; i < obj.length; i++) {
                if(priceNumber.value == '' && !newBar.price.includes('توافقی')){
                    validate = false
                    document.getElementById('priceContainer').classList.add('empty-field')
                }
                if(Object.keys(newBar.fleet_type).length == 0){
                    document.getElementById('fleet_typeContainer').classList.add('empty-field')
                }
                if((!newBar[obj[i]] || !newBar[obj[i]][0] ) && requiredField.indexOf(obj[i]) > -1){
                    validate = false
                    document.getElementById(`${obj[i]}Container`).classList.add('empty-field')
                }
            }
            if(!validate){
                Swal.fire({title: 'فیلدهای اجباری که با رنگ قرمز نشان داده شده اند باید پر شوند', icon: "error", backdrop: false, position: "top", timer: 4000, showConfirmButton: false})
                return
            }else{
                submitLoading.value = true
                axios.post('/AddBar/', toRaw(newBar))
                .then(()=>{
                    Swal.fire({title: 'ثبت شد', icon: "success", backdrop: false, position: "top", timer: 1500, showConfirmButton: false})
                    submitLoading.value = false
                    newBar.beginning= ""
                    newBar.destinations= []
                    newBar.fleet_type= {}
                    newBar.price= 'به ازای هر سرویس 0 تومان'
                    newBar.date= ''
                    newBar.weight= ''
                    newBar.product_type= ''
                    newBar.description= ''
                    document.getElementById('به ازای هر سرویس').checked = true
                    disablePriceInput.value = false
                    priceNumber.value = ''
                    dateSelectedSpan.value = ''
                    showSearchField.value = true

                }).catch(()=>{
                    submitLoading.value = false
                })
            }
        }

        return { isAuthenticated, newBar, selectBeg, searchField, searchRes, citiesLoading, showSearchRes, selectDes, removeDes,
                addDes, showSearchField, fleets, priceNumber, setPriceSpan, disablePriceInput, getDate, dateLoading, dateData, selectDate,
                dateSelectedSpan, submit, submitLoading, setFleet, remove_item_from_fleet, clear_fleet_category, loadFleetCheckBox
        }
    },
    components: { Loading }
}
</script>


<style>

.bg-lightGray{
    background-color: rgb(230, 230, 230);
}

.empty-field{
    border: 1px solid red !important;
}

</style>