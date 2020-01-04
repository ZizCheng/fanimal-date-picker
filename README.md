# fanimal-date-picker

To get started, install and include script.js in your webpage:
`<script src="./script.js"></script>`

To implement the calendar into your website:
`<fanimal-calendar></fanimal-calendar>`

Fanimal date picker will create display a single page calendar with month and year allowing the user to select a first and second date and highlight all dates in between. Forward/backwards buttons will move one month in either direction. Current output format is an alert message.

Behavior:
1. Clicking a date in the past does nothing.
2. Clicking a second date before the first date changes the first date to that date.
3. Clicking the same day twice selects it as the start and end date.

Index.html provided is an example of usage.

## Config
### setConfig(options)
sets settings for styling
```
{
  highlightedDate: value,
  inBetweenDate: value,
  invalidDate: value,
  hoverDate: value
}


```


## onEvents
### Both events return an object ev that contains another object detail which contains the object firstSelected or secondSelected (depending on the event).
For example:
```
.addEventListener("onFirstDateSelected", function(ev){
  console.log(ev.detail.firstSelected)
  })


```
prints the first selected
#### onFirstDateSelected
An event named onFirstDateSelected is dispatched when the first date is selected.
#### onSecondDateSelected
An event named onFirstDateSelected is dispatched when the second date is selected.
