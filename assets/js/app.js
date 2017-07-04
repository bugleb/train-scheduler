$(document).ready(function() {
	var config = {
		apiKey: "AIzaSyBFmNBr7OLonBQCBH2jXezr0-KLuE7zOCs",
		authDomain: "train-scheduler-7b8a9.firebaseapp.com",
		databaseURL: "https://train-scheduler-7b8a9.firebaseio.com",
		projectId: "train-scheduler-7b8a9",
		storageBucket: "train-scheduler-7b8a9.appspot.com",
		messagingSenderId: "401699380482"
	};

	firebase.initializeApp(config);

	const database = firebase.database();

	database.ref().on("child_added", function(childSnapshot, prevChildKey) {
		const snapshot = childSnapshot.val();

		const firstTrainTime = moment(snapshot.firstTrainTime, 'HH:mm');
		const minutesSince = moment().diff(firstTrainTime, 'minutes');
		const minutesAway = snapshot.frequency - (minutesSince % snapshot.frequency);
		const nextArrival = moment().add(minutesAway, 'minutes').format('HH:mm');

		let row = $('<tr>');
		row.append($('<td>').text(snapshot.trainName.toUpperCase()));
		row.append($('<td>').text(snapshot.destination.toUpperCase()));
		row.append($('<td>').text(snapshot.frequency.toUpperCase()));
		row.append($('<td>').text(nextArrival));
		row.append($('<td>').text(minutesAway));
		$('#table-body').append(row);
	});

	$('button').on('click', function() {
		const trainName = $('#train-name').val();
		const destination = $('#destination').val();
		const firstTrainTime = $('#first-train-time').val();
		const frequency = $('#frequency').val();

		const trainInfo = {
			trainName: trainName,
			destination: destination,
			firstTrainTime: firstTrainTime,
			frequency: frequency
		};

		database.ref().push(trainInfo);
	});
});