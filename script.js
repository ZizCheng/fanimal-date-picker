const now = new Date();
var firstSelected = null;
var secondSelected = null;
var monthOffset = 0;
var currentMonth = now.getMonth();
var currentYear = now.getFullYear();
calendar.hidden = true;
populateCalendar(now.getFullYear(), now.getMonth())
CurrentDay.textContent = now.toLocaleDateString('en-us', { year: 'numeric', month: 'long'})

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
    }
  }
  else {
    firstSelected = selectedDate
    secondSelected = null;
  }

  calendarBody.innerHTML = ""
  populateCalendar(currentYear, currentMonth)


  if(firstSelected != null){
    dateBegin.value = firstSelected.toLocaleDateString("en-us")
  }
  else {
    dateBegin.value = ""
  }
  if(secondSelected != null){
    dateEnd.value = secondSelected.toLocaleDateString("en-us")
  }
  else {
    dateEnd.value = ""
  }
}

// dateBegin.addEventListener('focusout', (event) => {
//   calendar.hidden = true;
// });
// dateEnd.addEventListener('focusout', (event) => {
//   calendar.hidden = true;
// });
