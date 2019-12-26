//Initialize variables
const now = new Date();
var firstSelected = null;
var secondSelected = null;
var monthOffset = 0;
var currentMonth = now.getMonth();
var currentYear = now.getFullYear();
var calendar;

function getAllDaysInMonth(year, month){
  var days = []
  var date = new Date(year, month, 1);
  while(date.getMonth() === month){
    days.push(new Date(date));
    date.setDate(date.getDate() + 1)
  }
  return days;
}

function toggleCalendar() {
  calendar.hidden = !calendar.hidden;
}

function populateCalendar() {
  //empty the current calendar
  document.getElementById("calendarBody").innerHTML = "";

  //save for later
  calendarBody = document.getElementById("calendarBody");
  days = getAllDaysInMonth(currentYear, currentMonth);

  // Fill days so that they are organized.
  fillEmptyDays = days[0].getDay()
  fillEmptyDays = fillEmptyDays < 0 ? 0 : fillEmptyDays
  days = (new Array(fillEmptyDays).fill(null)).concat(days)

  //population:
  //per week/row:
  for(var row = 0; row < Math.ceil(days.length / 7); row++ ){
    currentRow = calendarBody.insertRow(row);

    //per day/date:
    for(var day = 0; day < 7; day++){

      //make sure still within month
      if(!(day+(row*7) >= days.length)){
        thisCell = currentRow.insertCell(day);

        //null means should be empty
        if(days[day+row*7] == null){
          thisCell.textContent = "";
        }
        else
        {
          date = days[day+(row*7)]
          thisCell.onclick = daySelected
          thisCell.textContent = date.getDate();

          if((firstSelected != null && firstSelected.getTime() == date.getTime()) || (secondSelected != null && secondSelected.getTime() == date.getTime())){
            thisCell.style["background-color"] = "#00d1b2" //first/second selected color
          }
          if(secondSelected != null && firstSelected != null && date.getTime() > firstSelected.getTime() && date.getTime() < secondSelected.getTime()){
            thisCell.style["background-color"] = "rgba(0, 209, 178, 0.35)" //in between colors
          }
          if(date.getTime() < now.getTime()){
            thisCell.style["background-color"] = "#dddddd"; //gray out days that have already passed
          }
        }
      }
    }
  }
  //change the month name
  document.getElementById("MonthLabel").textContent = new Date(currentYear, currentMonth).toLocaleDateString('en-us', { year: 'numeric', month: 'long'});
}

function moveMonth(direction) {
  //change initial variables for populateCalendar
  monthOffset += direction;
  currentYear = now.getFullYear() + (Math.floor((now.getMonth()+monthOffset)/12));
  currentMonth = ((now.getMonth()+monthOffset) % 12);
  populateCalendar();
}
function calendarForward() {
  moveMonth(1);
}
function calendarBackwards() {
  moveMonth(-1);
}

function daySelected(ev){
  //save for later
  calendarBody = document.getElementById("calendarBody")
  selectedDay = parseInt(ev.srcElement.textContent)
  selectedDate = new Date(currentYear, currentMonth, selectedDay)

  //if selected time is in past
  if(selectedDate.getTime() < now.getTime()){
    return;
  }

  //nothing selected as first
  if(firstSelected == null){
    firstSelected = selectedDate
  }

  //something selected as first
  else if(secondSelected == null){

    //if second selected is before first selected
    if(firstSelected.getTime() > selectedDate.getTime()){
      firstSelected = selectedDate
      secondSelected = null
    }
    else {
      secondSelected = selectedDate
      //output here
      alert("dates chosen are: " + firstSelected + " until " + secondSelected)
    }
  }

  //if both first and second selected, start as new
  else {
    firstSelected = selectedDate
    secondSelected = null;
  }
  populateCalendar()
}

//tag stuff:
class Calendar extends HTMLElement {

  //called when element is added into HTML
  connectedCallback() {
    this.innerHTML = this.render();
    populateCalendar()
  }
  //the HTML part
  render(){
    return `<div class="datepicker" id="calendar" style="position: fixed;">
          <div class="">
              <div class="container" style="position: relative; display: block;">
                  <div class="columns is-vcentered">
                    <div class="column is-one-fifth"><button onclick="calendarBackwards()" class="button"><i class="fas fa-arrow-left">backwards</i></button></div>
                    <div class="column"> <h6 class="title is-6 has-text-black has-text-centered" id="MonthLabel">---</h6> </div>
                    <div class="column is-one-fifth" ><button class="button" onclick="calendarForward()"><i class="fas fa-arrow-right">forward</i></button></div>
                  </div>
                <table class="table is-bordered">
                  <thead>
                    <td style="border:none;"> Su </td>
                    <td style="border:none;"> M </td>
                    <td style="border:none;"> T </td>
                    <td style="border:none;"> W </td>
                    <td style="border:none;"> Th </td>
                    <td style="border:none;"> F </td>
                    <td style="border:none;"> Sa </td>
                  </thead>
                  <tbody id="calendarBody">
                  </tbody>
                </table>
              </div>
          </div>
          </div>`
  }
}

//define the element
customElements.define('fanimal-calendar', Calendar);
