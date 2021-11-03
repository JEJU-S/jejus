
const dateForm = document.querySelector("#date-form"); 
const startDate = dateForm.querySelector("input[name='start']");
const endDate = dateForm.querySelector("input[name='end']");

const MAX_DAYS = 4;

function check(event){
    event.preventDefualt();
}

function startDateChange(){
    endDate.max = "";
    endDate.min = startDate.value;
    console.log(endDate.min);

    const minDate = new Date(startDate.value);
    console.log(minDate);
    const maxDate = new Date(minDate);
    maxDate.setDate(maxDate.getDate() + MAX_DAYS);
    
    const Year = `${maxDate.getFullYear()}`;
    const Month = (maxDate.getMonth() + 1) < 10? `0${maxDate.getMonth() + 1}` : `${maxDate.getMonth() + 1}`;
    const Day = (maxDate.getDate()) < 10? `0${maxDate.getDate()}` : `${maxDate.getDate()}`;

    console.log(`max : ${Year}-${Month}-${Day}`);
    endDate.max = `${Year}-${Month}-${Day}`;
    
    endDate.value="";
}

dateForm.addEventListener("submit", check);
startDate.addEventListener("change", startDateChange);


//뒤로가기 하면 새로고침
window.addEventListener('pageshow', function(event) {
    if (event.persisted || window.performance.navigation.type == 2) {
      location.reload();
    }
});