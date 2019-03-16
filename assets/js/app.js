'use strict'

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyAZbXq8IYq1HcTReBlOrwjsQk6tHUvB_M8',
  authDomain: 'uw-bootcamp-f90ad.firebaseapp.com',
  databaseURL: 'https://uw-bootcamp-f90ad.firebaseio.com',
  projectId: 'uw-bootcamp-f90ad',
  storageBucket: 'uw-bootcamp-f90ad.appspot.com',
  messagingSenderId: '322632099797'
}
firebase.initializeApp(config)

const database = firebase.database()

$('#add-schedule-btn').on('click', function (event) {
  event.preventDefault()

  const scheduleNameValue = $('#schedule-name-input').val().trim()
  const destinationValue = $('#destination-input').val().trim()
  const firstTrainValue = moment($('#first-train-input').val().trim(), 'HH:mm').format('X')
  const frequencyValue = $('#frequency-input').val().trim()

  let newSchedule = {
    schedule: scheduleNameValue,
    destination: destinationValue,
    firstTrain: firstTrainValue,
    frequency: frequencyValue
  }

  database.ref().push(newSchedule)

  $('#schedule-name-input').val('')
  $('#destination-input').val('')
  $('#first-train-input').val('')
  $('#frequency-input').val('')
})

database.ref().on('child_added', function (childSnapshot) {
  const schedule = childSnapshot.val().schedule
  const destination = childSnapshot.val().destination
  const firstTrain = childSnapshot.val().firstTrain
  const frequency = childSnapshot.val().frequency

  const firstTrainTime = moment(firstTrain, 'HH:mm').subtract(1, 'years')
  const timeDifference = moment().diff(moment(firstTrainTime), 'minutes')
  const remainder = timeDifference % frequency
  const minutesUntilTrain = frequency - remainder
  const nextTrain = moment().add(minutesUntilTrain, 'minutes').format('hh:mm A')

  const newRow = $('<tr>').append(
    $('<td>').text(schedule),
    $('<td>').text(destination),
    $('<td>').text(frequency),
    $('<td>').text(nextTrain),
    $('<td>').text(minutesUntilTrain)
  )

  $('#train-schedules').append(newRow)
})
