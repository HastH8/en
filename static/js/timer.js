 

startTime = 0;
timerEvent = 0;

function startTimer() {
	stopTimer();
	document.getElementById("timer").innerHTML = "00:00:00";
	startTime = new Date().getTime();
	timerEvent = setInterval("updateTimer()", 1000);
}

function updateTimer() {
	var t = new Date().getTime() - startTime;
	t = Math.round(t/1000);

	var sec = t % 60;
	t = Math.floor(t/60);
	var min = t % 60;
	var hour = Math.floor(t/60);

	document.getElementById("timer").innerHTML =
			(hour < 10 ? "0" : "") + hour + ":" +
			(min < 10 ? "0" : "") + min + ":" +
			(sec < 10 ? "0" : "") + sec;
}

function stopTimer() {
	if (timerEvent) {
		clearInterval(timerEvent);
		timerEvent = 0;
	}
}