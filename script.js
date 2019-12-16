const now = new Date();
var firstSelected = null;
var secondSelected = null;
var monthOffset = 0;
var currentMonth = now.getMonth();
var currentYear = now.getFullYear();
var calendar;

// Initial Launch



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


function populateCalendar(y, m) {
  calendarBody = WholeCalendar.shadowRoot.getElementById("calendarBody")
  days = getAllDaysInMonth(y, m);
  // Fill days so that they are organized.
  fillEmptyDays = days[0].getDay()
  fillEmptyDays = fillEmptyDays < 0 ? 0 : fillEmptyDays
  days = (new Array(fillEmptyDays).fill("-")).concat(days)
  for(var row = 0; row < Math.ceil(days.length / 7); row++ ){
    currentRow = calendarBody.insertRow(row);
    for(var day = 0; day < 7; day++){

      if(day+(row*7) >= days.length){
        // Ignore that for now.
      }
      else
      {

          if(days[day+row*7] == "-"){
            thisCell = currentRow.insertCell(day);
            thisCell.textContent = ""
          }
          else
          {
            date = days[day+(row*7)]
            thisCell = currentRow.insertCell(day);
            thisCell.onclick = daySelected
            thisCell.textContent = date.getDate();

            if(firstSelected != null && firstSelected.getTime() == date.getTime()){
              thisCell.style["background-color"] = "#00d1b2"
            }
            if(secondSelected != null && secondSelected.getTime() == date.getTime()){
              thisCell.style["background-color"] = "#00d1b2"
            }
            if(secondSelected != null && firstSelected != null && date.getTime() > firstSelected.getTime() && date.getTime() < secondSelected.getTime()){
              thisCell.style["background-color"] = "rgba(0, 209, 178, 0.35)"
            }
            if(date.getTime() < now.getTime()){
              thisCell.style["background-color"] = "#dddddd";
            }

          }
      }

    }
  }

}
// calendar.hidden = true;



function calendarForward() {
  calendarBody = WholeCalendar.shadowRoot.getElementById("calendarBody")
  CurrentDay = WholeCalendar.shadowRoot.getElementById("CurrentDay");
  calendarBody.innerHTML = ""
  monthOffset++;
  desiredYear = now.getFullYear() + (Math.floor((now.getMonth()+monthOffset)/12));
  desiredMonth = ((now.getMonth()+monthOffset) % 12);
  populateCalendar(desiredYear, desiredMonth);
  currentYear = desiredYear;
  currentMonth = desiredMonth;
  CurrentDay.textContent = new Date(desiredYear, desiredMonth).toLocaleDateString('en-us', { year: 'numeric', month: 'long'})
}

function calendarBackwards() {
  calendarBody = WholeCalendar.shadowRoot.getElementById("calendarBody")
  CurrentDay = WholeCalendar.shadowRoot.getElementById("CurrentDay");
  calendarBody.innerHTML = ""
  monthOffset--;
  desiredYear = now.getFullYear() + (Math.floor((now.getMonth()+monthOffset)/12));
  desiredMonth = ((now.getMonth()+monthOffset) % 12);
  populateCalendar(desiredYear, desiredMonth);
  currentYear = desiredYear;
  currentMonth = desiredMonth;
  CurrentDay.textContent = new Date(desiredYear, desiredMonth).toLocaleDateString('en-us', { year: 'numeric', month: 'long'})
}

function daySelected(ev){
  calendarBody = WholeCalendar.shadowRoot.getElementById("calendarBody")
  selectedDay = parseInt(ev.srcElement.textContent)
  selectedDate = new Date(currentYear, currentMonth, selectedDay)
  if(selectedDate.getTime() < now.getTime()){
    return;
  }

  if(firstSelected == null){
    firstSelected = selectedDate
  }
  else if(secondSelected == null){
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
  else {
    firstSelected = selectedDate
    secondSelected = null;
  }

  calendarBody.innerHTML = ""
  populateCalendar(currentYear, currentMonth)
}

class Calendar extends HTMLElement {

  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = this.render();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));

  }

  render(){
    return `<div class="datepicker" id="calendar" style="position: fixed;">
          <div class="">
              <div class="container" style="position: relative; display: block;">
                  <div class="columns is-vcentered">
                    <div class="column is-one-fifth"><button onclick="calendarBackwards()" class="button"><i class="fas fa-arrow-left">backwards</i></button></div>
                    <div class="column"> <h6 class="title is-6 has-text-black has-text-centered" id="CurrentDay">---</h6> </div>
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

customElements.define('fanimal-calendar', Calendar);


window.onload = function() {
  calendar = WholeCalendar.shadowRoot.getElementById("calendar");
  CurrentDay = WholeCalendar.shadowRoot.getElementById("CurrentDay");
  populateCalendar(now.getFullYear(), now.getMonth())
  CurrentDay.textContent = now.toLocaleDateString('en-us', { year: 'numeric', month: 'long'})
}
