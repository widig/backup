//var app = require("widig_start");
var inquirer = require("inquirer");

// setuser
//	username
//	password
//	token
//	< server-token
//

// < server-token
// add app
//	name
//	< server-token-app
//

// < server-token
// select app
// 	...
//	< server-token-app
//

// add directory (public/? -> sync folder)
function main() {
	var questions = [
		{
			type: 'input',
			name: 'username',
			message: 'username:'
		},
		{
			type: 'password',
			name: 'password',
			message: 'password:'
		},
		{
			type: 'input',
			name: 'token',
			message: 'token:'
		}
	];
	// if not have server token saved
	inquirer.prompt(questions).then(function (answers) {
		// request variavel a server token
		// save token
		console.log(JSON.stringify(answers, null, '  '));
	});
}

main();