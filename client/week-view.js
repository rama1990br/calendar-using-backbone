var week = {},
  daysOfWeek =['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  //   {day: "Sunday"},
  //   {day: "Monday"},
  //   {day: "Tuesday"},
  //   {day: "Wednesday"},
  //   {day: "Thursday"},
  //   {day: "Friday"},
  //   {day: "Saturday"}
  // ],
data ={
  result :[{hour: "0:00", days:daysOfWeek},{hour: "1:00",days:daysOfWeek},{hour: "2:00", days:daysOfWeek},{hour: "3:00", days:daysOfWeek},{hour: "4:00", days:daysOfWeek},{hour: "5:00", days:daysOfWeek},
  {hour: "6:00", days:daysOfWeek},{hour: "7:00", days:daysOfWeek},{hour: "8:00", days:daysOfWeek},{hour: "9:00", days:daysOfWeek},{hour: "10:00", days:daysOfWeek},{hour: "11:00", days:daysOfWeek},
  {hour: "12:00", days:daysOfWeek},{hour: "13:00", days:daysOfWeek},{hour: "14:00", days:daysOfWeek},{hour: "15:00", days:daysOfWeek},{hour: "16:00", days:daysOfWeek},{hour: "17:00", days:daysOfWeek},
  {hour: "18:00", days:daysOfWeek},{hour: "19:00", days:daysOfWeek},{hour: "20:00", days:daysOfWeek},{hour: "21:00", days:daysOfWeek},{hour: "22:00", days:daysOfWeek},{hour: "23:00", days:daysOfWeek}
]},

  source   = $("#calendar-template").html(),
  template = Handlebars.compile(source);


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

function getNumberFromString(stringInput) {
    return parseInt(stringInput, 10);
}

week.CalendarView = Backbone.View.extend({
  el: $('#content-placeholder'),
  initialize: function () {
    week.appointments.on('add', this.addEach, this);
    week.appointments.fetch();
  },
  events: {
    'click #tableBody': 'displayModal',
    'click button' : 'editAppointment'
  },
  displayModal: function(e){
    var $dialog = $('#dialog');
    //clearPrevValuesInModal();
    $dialog.dialog({autoOpen: false});
      $dialog.dialog('open');
    },
    editAppointment: function(e) {
      var dataset = e.currentTarget.dataset;
      $('#name').val(dataset.eventName);
      $('#st' + getHour(getNumberFromString(dataset.startTime))).attr('selected', 'selected');
      $('#et' + getHour(getNumberFromString(dataset.endTime))).attr('selected', 'selected');
      $('#location').val(dataset.locationName);
      $('#cancelOrDelete').text('Cancel');
    },
    addEach: function(appointment){
      var locale = 'en-US',
        eventName,
        startRow,
        startTimeDay,
        locationName,
        startTimeHour,
        endTimeHour;
      eventName = appointment.attributes.eventName;
      locationName = appointment.attributes.locationName;
      startTimeDay = getDayOfWeekInShortStringFormat(appointment.attributes.startTime, locale);
      startTimeHour = getHour(appointment.attributes.startTime);
      endTimeHour = getHour(appointment.attributes.endTime);
      startRow = document.getElementById(startTimeHour);
      numberOfHours = endTimeHour - startTimeHour;
      $.each(startRow.children, function displayParticularAppointment(j, eachAppointment) {
        var eventButton = document.createElement('button'),
          cell = document.getElementById(eachAppointment.id);
        if (eachAppointment.id.includes(startTimeDay)) {
          eventButton.type = 'button';
          eventButton.id = eachAppointment.id + 'Appointment1';
          eventButton.innerHTML = eventName + ' at ' + locationName;
          eventButton.dataset.eventName = eventName;
          eventButton.dataset.startTime = appointment.attributes.startTime;
          eventButton.dataset.endTime = appointment.attributes.endTime;
          eventButton.dataset.locationName = locationName;
          cell.appendChild(eventButton);
        }
      });
    }
  });

week.calendarView = new week.CalendarView();

