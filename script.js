class Calendar extends HTMLElement {

  constructor() {
    super();
    this.now = new Date();
    this.firstSelected = null;
    this.secondSelected = null;
    this.monthOffset = 0;
    this.currentMonth = this.now.getMonth();
    this.currentYear = this.now.getFullYear();

    this.config = {
      highlightedDate: "#00d1b2",
      inBetweenDate: "rgba(0, 209, 178, 0.35)",
      invalidDate: "#dddddd",
      hoverDate: "#00d1b2",
      border: "#d3d3d3",
      fontFamily: "Arial, Helvetica, sans-serif"
    }


    this.addEventListener("click", this.handleClick)
  }

  setConfig(options){
    this.config = options;
  }

  getAllDaysInMonth(year, month){
    var days = []
    var date = new Date(year, month, 1);
    while(date.getMonth() === month){
      days.push(new Date(date));
      date.setDate(date.getDate() + 1)
    }

    var fillEmptyDays = days[0].getDay()
    fillEmptyDays = fillEmptyDays < 0 ? 0 : fillEmptyDays
    days = (new Array(fillEmptyDays).fill(null)).concat(days)

    return days;
  }

  populateCalendar() {
    var days = this.getAllDaysInMonth(this.currentYear, this.currentMonth);

    var tbody = document.createElement("tbody")
     for(var row = 0; row < Math.ceil(days.length / 7); row++ ){
       var currentRow = tbody.insertRow(row);

       //per day/date:
       for(var day = 0; day < 7; day++){

         //make sure still within month
         if(!(day+(row*7) >= days.length)){
           var thisCell = currentRow.insertCell(day);

           //null means should be empty
           if(days[day+row*7] == null){
             thisCell.textContent = "";
           }
           else
           {
             var date = days[day+(row*7)]
             thisCell.setAttribute("date", date)
             thisCell.textContent = date.getDate();
            thisCell.setAttribute("class", "valid")
             if((this.firstSelected != null && this.firstSelected.getTime() == date.getTime()) || (this.secondSelected != null && this.secondSelected.getTime() == date.getTime())){
               thisCell.setAttribute("class", "valid focused") //first/second selected color
             }
             if(this.secondSelected != null && this.firstSelected != null && date.getTime() > this.firstSelected.getTime() && date.getTime() < this.secondSelected.getTime()){
               thisCell.setAttribute("class", "valid in") //in between colors
             }
             if(date.getTime() < this.now.getTime()){
               thisCell.setAttribute("class", "invalid"); //gray out days that have already passed
             }


           }
         }
       }
     }




    return tbody;
  }

  handleClick(ev){
    if(ev.srcElement.getAttribute("type") == "button"){
      var btnValue = parseInt(ev.srcElement.getAttribute("direction"))
      this.moveMonth(btnValue);
      console.log(btnValue)
      return
    }
    //save for later
    var selectedDay = parseInt(ev.srcElement.textContent)
    var selectedDate = new Date(ev.srcElement.getAttribute("date"))




    // Checks if the target element is a 'td'
    if(selectedDate == null){return}
    //if selected time is in past
    if(selectedDate.getTime() < this.now.getTime()){
      return;
    }

    //nothing selected as first
    if(this.firstSelected == null){
      this.firstSelected = selectedDate

      var ev_firstSelected = new CustomEvent("onFirstDateSelected", {detail: {firstSelected: this.firstSelected}})
      this.dispatchEvent(ev_firstSelected)
    }

    //something selected as first
    else if(this.secondSelected == null){

      //if second selected is before first selected
      if(this.firstSelected.getTime() > selectedDate.getTime()){
        this.firstSelected = selectedDate
        var ev_firstSelected = new CustomEvent("onFirstDateSelected", {detail: {firstSelected: this.firstSelected}})
        this.dispatchEvent(ev_firstSelected)
        this.secondSelected = null
      }
      else {
        this.secondSelected = selectedDate
        var ev_secondSelected = new CustomEvent("onSecondDateSelected", {detail: {secondSelected: this.secondSelected}})
        this.dispatchEvent(ev_secondSelected)
        //output here
      }
    }

    //if both first and second selected, start as new
    else {
      this.firstSelected = selectedDate
      var ev_firstSelected = new CustomEvent("onFirstDateSelected", {detail: {firstSelected: this.firstSelected}})
      this.dispatchEvent(ev_firstSelected)
      this.secondSelected = null;
    }

    this.innerHTML = this.render();
  }

  moveMonth(direction) {
    // ((n % m) + m) % m  <- true modulo operator. JS uses % as remainder
    //change initial variables for populateCalendar
    this.monthOffset += direction;
    this.currentYear = this.now.getFullYear() + (Math.floor((this.now.getMonth()+this.monthOffset)/12));
    this.currentMonth = (((this.now.getMonth()+this.monthOffset) + 12) % 12);
    this.innerHTML = this.render();

    var ev = new CustomEvent("onMonthMoved")

    this.dispatchEvent(ev)
  }

  //called when element is added into HTML
  connectedCallback() {
    this.innerHTML = this.render();

  }
  //the HTML part
  render(){

    return `
    <style>
      fanimal-calendar .focused {
        background-color: ${this.config.highlightedDate};
      }
      fanimal-calendar .focused:hover {
        background-color: ${this.config.hoverDate};
      }
      fanimal-calendar .in {
        background-color: ${this.config.inBetweenDate};
      }
      fanimal-calendar .in:hover {
        background-color: ${this.config.hoverDate};
      }
      fanimal-calendar .invalid {
        background-color: ${this.config.invalidDate};
      }
      fanimal-calendar .valid:not(.in):not(.focused):hover {
        color: ${this.config.hoverDate};
      }

      fanimal-calendar .table {
        border-collapse: collapse;
        border-spacing: 0;
        margin: auto;
      }
      fanimal-calendar td {
        font-size: 1rem;
        border: 1px solid ${this.config.border};
        padding: 8px;
        text-align: center;
        font-family: ${this.config.fontFamily};
      }
      fanimal-calendar td:not(.invalid) {
        cursor: pointer;
      }
      fanimal-calendar tbody td:not(.invalid):not(.valid) {
        visibility: hidden;
        border: none;
      }
      fanimal-calendar .column {
        padding: 24px 0;
      }
      fanimal-calendar .column .title {
        font-size: 1.75rem;
        margin: 0 8px;

        display: inline-block;
        font-family: ${this.config.fontFamily};
      }
      fanimal-calendar .column input {
        font-size: 1.5rem;
        background-color: white;
        border-radius: 2px;
        border: 1px solid ${this.config.border};
        cursor: pointer;

        display: inline-block;
        font-family: ${this.config.fontFamily};
      }
      fanimal-calendar .column .left-arrow {
        float: left;
      }
      fanimal-calendar .column .right-arrow {
        float: right;
      }
    </style>


    <div class="datepicker" id="calendar" style="position: fixed;">
      <div class="">
          <div class="container" style="position: relative; display: block;">
              <div class="columns is-vcentered">

                <div class="column">
                  <input class="left-arrow" type="button" value="&larr;" direction="-1"></input>
                  <p class="title is-6 has-text-black has-text-centered" id="MonthLabel">
                    ${ (new Date(this.currentYear, this.currentMonth).toLocaleDateString('en-us', { year: 'numeric', month: 'long'})) }
                  </p>
                  <input class="right-arrow" type="button" value="&rarr;" direction="1"></input>
                </div>

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
              ${this.populateCalendar().outerHTML}
            </table>
          </div>
        </div>
      </div>`
  }
}

//define the element
customElements.define('fanimal-calendar', Calendar);
