var week = {},
  data = { daysOfWeek: [
    {day: "Sunday"},
    {day: "Monday"},
    {day: "Tuesday"},
    {day: "Wednesday"},
    {day: "Thursday"},
    {day: "Friday"},
    {day: "Saturday"}
  ],

result: [{hour: "0:00"},{hour: "1:00"},{hour: "2:00"},{hour: "3:00"},{hour: "4:00"},{hour: "5:00"},
  {hour: "6:00"},{hour: "7:00"},{hour: "8:00"},{hour: "9:00"},{hour: "10:00"},{hour: "11:00"},
  {hour: "12:00"},{hour: "13:00"},{hour: "14:00"},{hour: "15:00"},{hour: "16:00"},{hour: "17:00"},
  {hour: "18:00"},{hour: "19:00"},{hour: "20:00"},{hour: "21:00"},{hour: "22:00"},{hour: "23:00"},
]},
  source   = $("#calendar-template").html(),
  template = Handlebars.compile(source);
  

// Handlebars.registerHelper('ifNotZero', function (index, options) {
//    if(index !== 0){
//       return options.fn(this);
//    } else {
//       return options.inverse(this);
//    }

// });
//   Handlebars.registerHelper('eachRow', function (items, numColumns, options) {
//     var result = '';
//     var indexData = Handlebars.createFrame(options.indexData);
//     for (var i = 0; i < items.length; i += numColumns) {
//         indexData.index = i;
//         result += options.fn({
//             columns: items.slice(i, i + numColumns)
//             //index: i;
//         }, {indexData: indexData});
//     }

//     return result;
// });

Handlebars.registerHelper( 'concat', function(path, element) {
    return element + path.split(':')[0];
});

Handlebars.registerHelper( 'concatWords', function(one, two) {
    return one + two;
});

$("#content-placeholder").html(template(data));
week.Appointment = Backbone.Model.extend({
  defaults: {
        eventName: '',
        startTime: '',
        endTime: '',
        locationName: ''
      },
  url: '/appointment'
});

week.Appointments = Backbone.Collection.extend({
  model: week.Appointment,
  url: '/appointments'
});

week.appointments = new week.Appointments();

week.AppointmentView = Backbone.View.extend({
  tagName: 'button',
      //template: _.template($('#item-template').html()),
      render: function(){
        this.$el.html(this.model.attributes.eventName + " at " + this.model.attributes.locationName);
        //this.input = this.$('.edit');
        return this; // enable chained calls
      },
      initialize: function(){
        //this.model.fetch();
        this.model.on('change', this.render, this);
        this.model.on('destroy', this.remove, this); // remove: Convenience Backbone
      },
      events: {
        'dblclick label' : 'edit',
        'keypress .edit' : 'updateOnEnter',
        'blur .edit' : 'close',
        'click .toggle': 'toggleCompleted',
        'click .destroy': 'destroy'
      },
      edit: function(){
        this.$el.addClass('editing');
        this.input.focus();
      },
      toggleCompleted: function(){
         this.model.toggle();
      },
      destroy: function(){
         this.model.destroy({headers: {id: this.model.id}});
      },
      close: function(){
        var value = this.input.val().trim();
        if(value) {
          this.model.save({title: value});
        }
        this.$el.removeClass('editing');
      },
      updateOnEnter: function(e){
        if(e.which == 13){
          this.close();
        }
      }
});

week.CalendarView = Backbone.View.extend({
      el: $('#content-placeholder'),
      initialize: function () {
        // this.input = this.$('#new-todo');
         week.appointments.on('add', this.addOne, this);
         //week.appointments.on('reset', this.addAll, this);
         week.appointments.fetch(); // Loads list from local storage
      },
      events: {
        'click #tableBody': 'displayModal'
      },
      displayModal: function(e){
        var $dialog = $('#dialog');
        //clearPrevValuesInModal();
        $dialog.dialog({autoOpen: false});
        $dialog.dialog('open');
        // var todo = new app.Todo({title: this.input.val().trim(), completed: '0'});
        // app.todoList.create(todo);
        // this.input.val('');
      },
      // addOne: function(appointments){
      //   var view = new week.AppointmentView({model: appointment});
        
      //   $('#todo-list').append(view.render().el);
      // }
      addOne: function(appointment){
        //this.$('#todo-list').html(''); // clean the todo list
        //app.todoList.each(this.addOne, this);
        updateCalendar(appointment.attributes);
      },
    });

week.calendarView = new week.CalendarView();


 function updateCalendar(appointment) {
    var locale = 'en-US',
      eventName,
      startRow,
      startTimeDay,
      locationName,
      startTimeHour,
      endTimeHour;
    //$.each(appointments, function displayAppointments(i, item) {
      eventName = appointment.eventName;
      locationName = appointment.locationName;
      startTimeDay = getDayOfWeekInShortStringFormat(appointment.startTime, locale);
      startTimeHour = getHour(appointment.startTime);
      endTimeHour = getHour(appointment.endTime);
      startRow = document.getElementById(startTimeHour);
      numberOfHours = endTimeHour - startTimeHour;
      $.each(startRow.childNodes, function displayParticularAppointment(j, eachAppointment) {
        var eventButton = document.createElement('button'),
          cell = document.getElementById(eachAppointment.id),
          count = $('#' + eachAppointment.id).children().length;
        if (eachAppointment.id.includes(startTimeDay)) {
          eventButton.type = 'button';
          eventButton.id = eachAppointment.id + 'Appointment' + parseInt(count + 1, 10);
          eventButton.innerHTML = eventName + ' at ' + locationName;
          eventButton.dataset.eventName = eventName;
          eventButton.dataset.startTime = item.startTime;
          eventButton.dataset.endTime = item.endTime;
          eventButton.dataset.locationName = locationName;
          cell.appendChild(eventButton);
        }
      });
    //});
  }











// (function weekView() {// function to create the skeleton of the calendar
//   function createCalendarView(id, currentWeeksDates, epochFirstDayOfWeek) {
//     var table,
//       thElements,
//       th,
//       i,
//       tr,
//       td,
//       j = 0;
//     function createTableHeader(day) {
//       th = document.createElement('th');
//       th.id = j + day;
//       th.innerText = day + currentWeeksDates[j];
//       j++;
//       table.appendChild(th);
//     }

//     function createTableCell(day) {
//       td = document.createElement('td');
//       td.id = day + i;
//       tr.appendChild(td);
//     }

//     table = document.createElement('table');
//     table.id = id;
//     table.dataset.sundayepochtime = epochFirstDayOfWeek;
//     thElements = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//     th = document.createElement('th');
//     th.innerText = 'Hour of day';
//     table.appendChild(th);
//     thElements.forEach(createTableHeader);

//     for (i = 0; i < 24; i++) {
//       tr = document.createElement('tr');
//       tr.id = i;
//       table.appendChild(tr);
//       td = document.createElement('td');
//       td.innerText = i + ':00';
//       tr.appendChild(td);
//       thElements.forEach(createTableCell);
//     }
//     return table;
//   }


//   // function to update the table according to the booked appointments
//   function updateCalendar(data) {
//     var locale = 'en-US',
//       eventName,
//       startRow,
//       startTimeDay,
//       locationName,
//       startTimeHour,
//       endTimeHour;
//     $.each(data, function displayAppointments(i, item) {
//       eventName = item.eventName;
//       locationName = item.locationName;
//       startTimeDay = getDayOfWeekInShortStringFormat(item.startTime, locale);
//       startTimeHour = getHour(item.startTime);
//       endTimeHour = getHour(item.endTime);
//       startRow = document.getElementById(startTimeHour);
//       numberOfHours = endTimeHour - startTimeHour;
//       $.each(startRow.childNodes, function displayParticularAppointment(j, eachAppointment) {
//         var eventButton,
//           cell,
//           count;
//         if (eachAppointment.id !== '') {
//           eventButton = document.createElement('button');
//           cell = document.getElementById(eachAppointment.id);
//           // count = $('#' + eachAppointment.id).children().length;
//           if (eachAppointment.id.includes(startTimeDay)) {
//             eventButton.type = 'button';
//             eventButton.id = eachAppointment.id;
//             eventButton.innerHTML = eventName + ' at ' + locationName;
//             eventButton.dataset.eventName = eventName;
//             eventButton.dataset.startTime = item.startTime;
//             eventButton.dataset.endTime = item.endTime;
//             eventButton.dataset.locationName = locationName;
//             cell.appendChild(eventButton);
//           }
//         }
//       });
//     });
//   }

//   function clearPrevValuesInModal() {
//     $('#dialog input').val('');
//     $('#dialog option[selected="selected"]').removeAttr('selected');
//   }

//   function getNumberFromString(stringInput) {
//     return parseInt(stringInput, 10);
//   }

//   function removePreviousAppointment(table, previousEvent) {
//     startTimeDay = getDayOfWeekInShortStringFormat(getNumberFromString(previousEvent.startTime), 'en-US');
//     startTimeHour = getHour(getNumberFromString(previousEvent.startTime));
//     endTimeHour = getHour(getNumberFromString(previousEvent.endTime));
//     startRow = document.getElementById(startTimeHour);
//     numberOfHours = endTimeHour - startTimeHour;
//     $.each(startRow.childNodes, function displayParticularAppointment(j, eachAppointment) {
//       var cell;
//       if (eachAppointment.id !== '') {
//         cell = document.getElementById(eachAppointment.id);
//         if (eachAppointment.id.includes(startTimeDay)) {
//           cell.removeChild(document.getElementById(eachAppointment.id));
//         }
//       }
//     });
//   }
//   function deleteAppointment(evt) {
//     var event = {
//       eventName: evt.target.dataset.eventName,
//       startTime: evt.target.dataset.startTime,
//       endTime: evt.target.dataset.endTime,
//       locationName: evt.target.dataset.locationName,
//     };
//     var table = document.getElementById('calendar-id'),
//       previousAppointment = {startTime: event.data.value.startTime, endTime: event.data.value.endTime, locationName: event.data.value.locationName, eventName: event.data.value.eventName},
//       retVal = true;
//     if ( retVal === true ) {
//       $.ajax({
//         url: '/deleteAppointment',
//         method: 'POST',
//         contentType: 'application/json; charset=utf-8',
//         data: JSON.stringify(event.data.value),
//         cache: false,
//         success: function deleteSelectedAppointment() {
//           $('#dialog').dialog('close');
//           removePreviousAppointment(table, previousAppointment);
//           // getScheduleAndupdateCalendar(table, getNumberFromString(table.dataset.sundayepochtime), getSaturdayOfCurrentWeek(convertEpochToDateTime(getNumberFromString(table.dataset.sundayepochtime))));
//         },
//       });
//     }
//   }

//   function confirmAppointment(event) {
//     var table = document.getElementById('calendar-id'),
//       epochTime = getNumberFromString(table.dataset.sundayepochtime),
//       //clickedIndex = event.data.clickedColumnIndex,
//       startTimeValue = $('#startTime option:selected').text(),
//       endTimeValue = $('#endTime option:selected').text(),
//       epochStartTimeOfEvent = getSelectedDateInCurrentWeek(convertEpochToDateTime(epochTime), clickedIndex, startTimeValue),
//       epochEndTimeOfEvent = getSelectedDateInCurrentWeek(convertEpochToDateTime(epochTime), clickedIndex, endTimeValue),
//       sendInfo = {
//         eventName: $('#eventName').val(),
//         startTime: epochStartTimeOfEvent,
//         endTime: epochEndTimeOfEvent,
//         locationName: $('#locationName').val(),
//       },
//       bookedEventArray = [sendInfo];

//     event.preventDefault();
//     $.ajax({
//       url: '/appointment',
//       method: 'POST',
//       contentType: 'application/json; charset=utf-8',
//       data: JSON.stringify(sendInfo),
//       cache: false,
//       success: function postNewAppointment() {
//         $('#dialog').dialog('close');
//         updateCalendar(bookedEventArray);
//       },
//     });
//   }


//   function editAppointment(evt) {
//     var event = {
//       eventName: evt.target.dataset.eventName,
//       startTime: evt.target.dataset.startTime,
//       endTime: evt.target.dataset.endTime,
//       locationName: evt.target.dataset.locationName,
//     };
//     var table = document.getElementById('calendar-id'),
//       epochTime = getNumberFromString(table.dataset.sundayepochtime),
//       clickedIndex = event.data.clickedColumnIndex,
//       startTimeValue = $('#startTime option:selected').text(),
//       endTimeValue = $('#endTime option:selected').text(),
//       epochStartTimeOfEvent = getSelectedDateInCurrentWeek(convertEpochToDateTime(epochTime), clickedIndex, startTimeValue),
//       epochEndTimeOfEvent = getSelectedDateInCurrentWeek(convertEpochToDateTime(epochTime), clickedIndex, endTimeValue),
//       sendInfo = {
//         eventName: $('#eventName').val(),
//         startTime: epochStartTimeOfEvent,
//         endTime: epochEndTimeOfEvent,
//         locationName: $('#locationName').val(),
//         previousEvent: event.data.value.startTime,
//       },
//       previousEvent = event.data.value,
//       bookedEventArray = [sendInfo];
//     event.preventDefault();
//     $.ajax({
//       url: '/editAppointment',
//       method: 'PUT',
//       contentType: 'application/json; charset=utf-8',
//       data: JSON.stringify(sendInfo),
//       cache: false,
//       success: function editAppointment() {
//         $('#dialog').dialog('close');
//         removePreviousAppointment(table, previousEvent);
//         updateCalendar(bookedEventArray);
//       },
//     });
//   }


//   // cancelModal is defined outside displayModal cause otherwise, it's entry is made in the event handler table each time it is
//   // encountered in the displayModal method and therefore is called multiple times on each cancel button click.
//   function cancelModal() {
//     $('#dialog').dialog('close');
//   }

//   function addEventHandlersToModal() {
//     $('#cancelOrDelete').click(deleteAppointment);
//     $('#confirm').click(confirmAppointment);
//   }

//   function populateModal(eventName, eventStartTime, eventEndTime, locationName) {
//     $('#eventName').val(eventName);
//     $('#st' + eventStartTime).attr('selected', 'selected');
//     $('#et' + eventEndTime).attr('selected', 'selected');
//     $('#locationName').val(locationName);
//   }

//   function displayModal(evt) {
//     var startTime,
//       deleteInfo,
//       regexInt = /\d+/,
//       $dialog = $('#dialog');
//     clearPrevValuesInModal();
//     $dialog.dialog({autoOpen: false});
//     $dialog.dialog('open');
//     if (evt.target.tagName === 'TD') {
//       hour = evt.target.id.match(regexInt);
//       startTime = hour ? parseInt(hour[0], 10) : 0;
//       endTime = (startTime + 1) % 24;
//       $('#st' + startTime).attr('selected', 'selected');
//       $('#et' + endTime).attr('selected', 'selected');
//     } else if (evt.target.tagName === 'BUTTON') {
//       deleteInfo = {
//         eventName: evt.target.dataset.eventName,
//         startTime: evt.target.dataset.startTime,
//         endTime: evt.target.dataset.endTime,
//         locationName: evt.target.dataset.locationName,
//       };
//       populateModal(deleteInfo.eventName, getHour(getNumberFromString(deleteInfo.startTime)), getHour(getNumberFromString(deleteInfo.endTime)), deleteInfo.locationName, 'Delete');
//     }
//   }

//   function addListenerToTable(table) {
//     $('#' + table.id).click(displayModal);
//   }


//   function getScheduleAndupdateCalendar(fromDate, toDate) {
//     $.ajax({
//       url: '/appointments',
//       data: {
//         'fromDate': fromDate,
//         'toDate': toDate,
//       },
//       type: 'get',
//       cache: false,
//       success: function getParticularAppointments(data) {
//         updateCalendar(data);
//       },
//     });
//   }

//   function getDatesOfCurrentWeek(epochFirstDayOfWeek) {
//     var i,
//       monthOfFirstDayOfWeek = new Date(epochFirstDayOfWeek).getMonth(),
//       yearOfFirstDayOfWeek = new Date(epochFirstDayOfWeek).getYear(),
//       dateOfFirstDayOfWeek = new Date(epochFirstDayOfWeek).getDate(),
//       lastDateOfFirstDaysMonth = getTheLastDateOfMonth(monthOfFirstDayOfWeek, yearOfFirstDayOfWeek),
//       currentDate = dateOfFirstDayOfWeek,
//       currentWeeksDates = [];
//     for (i = 0; i < 7; i++) {
//       currentDate = (currentDate - 1 === lastDateOfFirstDaysMonth) ? 1 : currentDate;
//       currentWeeksDates[i] = currentDate;
//       currentDate++;
//     }
//     return currentWeeksDates;
//   }

//   function addListenersToPrevAndNextLinks() {
//     var calendarElement = document.getElementById('calendar-id'),
//       sundayOfCurrentWeek = getNumberFromString(calendarElement.dataset.sundayepochtime);
//     function createNewWeekViewAndUpdateAppointments(requiredWeeksSunday, requiredWeeksSaturday) {
//       document.body.removeChild(calendarElement);
//       requiredWeeksDates = getDatesOfCurrentWeek(requiredWeeksSunday);
//       calendarElement = createCalendarView('calendar-id', requiredWeeksDates, requiredWeeksSunday);
//       document.body.appendChild(calendarElement);
//       getScheduleAndupdateCalendar(requiredWeeksSunday, requiredWeeksSaturday);
//       sundayOfCurrentWeek = requiredWeeksSunday;
//     }
//     function getPreviousAppointments() {
//       var previousSunday = getSundayOfPreviousWeek(sundayOfCurrentWeek),
//         previousSaturday = getSaturdayOfPreviousWeek(sundayOfCurrentWeek);
//       createNewWeekViewAndUpdateAppointments(previousSunday, previousSaturday);
//     }
//     function getNextAppointments() {
//       var nextSunday = getSundayOfNextWeek(sundayOfCurrentWeek),
//         nextSaturday = getSaturdayOfNextWeek(sundayOfCurrentWeek);
//       createNewWeekViewAndUpdateAppointments(nextSunday, nextSaturday);
//     }
//     $('#prevButton').click(getPreviousAppointments);
//     $('#nextButton').click(getNextAppointments);
//   }

//   function createPrevAndNextLinks() {
//     function createButton(buttonId, buttonText, appendChildTo) {
//       var button = document.createElement('button');
//       button.id = buttonId;
//       button.innerHTML = buttonText;
//       appendChildTo.appendChild(button);
//     }
//     createButton('prevButton', '<', document.body);
//     createButton('nextButton', '>', document.body);
//   }


//   function removeExistingWeekView(calendarElement) {
//     document.body.removeChild(document.getElementById('prevButton'));
//     document.body.removeChild(document.getElementById('nextButton'));
//     document.body.removeChild(calendarElement);
//   }

//   function displayWeekView() {
//     var table,
//       epochFirstDayOfWeek = getSundayOfCurrentWeek(new Date()),
//       epochLastDayOfWeek = getSaturdayOfCurrentWeek(new Date()),
//       currentWeeksDates = getDatesOfCurrentWeek(epochFirstDayOfWeek);
//     createPrevAndNextLinks();
//     table = createCalendarView('calendar-id', currentWeeksDates, epochFirstDayOfWeek);
//     getScheduleAndupdateCalendar(epochFirstDayOfWeek, epochLastDayOfWeek);
//     document.body.appendChild(table);
//     addListenerToTable(table);
//     addListenersToPrevAndNextLinks();
//     addEventHandlersToModal();
//   }
//   $(displayWeekView);
// }());
