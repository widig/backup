const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function ask() {
	rl.question("", function(data) {
		console.log(data);
		console.log();
		ask();
	});
}

ask();
