
const dateForm = document.querySelector("#date-form"); 
const startDate = dateForm.querySelector("input[name='start']");
const endDate = dateForm.querySelector("input[name='end']");
const MAX_DAYS = 4;
const today = new Date();
const Year = `${today.getFullYear()}`;
const Month = (today.getMonth() + 1) < 10? `0${today.getMonth() + 1}` : `${today.getMonth() + 1}`;
const Day = (today.getDate()) < 10? `0${today.getDate()}` : `${today.getDate()}`;

const toDay = `${Year}-${Month}-${Day}`


startDate.min = toDay;
startDate.value = toDay;

endDate.min = toDay;

startDateChange();

endDate.value = toDay;

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

startDate.addEventListener("change", startDateChange);


//뒤로가기 하면 새로고침
window.addEventListener('pageshow', function(event) {
    if (event.persisted || window.performance.navigation.type == 2) {
      location.reload();
    }
});
