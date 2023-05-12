// Import required modules
const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');
const dbInterface = require('./dbInterface');

// Connect to MySQL instance
const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'employee_tracker_db'
    }
);

// Array of options
const initialOptions = [
    {
        name: 'View All Departments',
        value: 'getAllDepts'
    },
    {
        name: 'View All Roles',
        value: 'getAllRoles'
    },
    {
        name: 'View All Employees',
        value: 'getAllEmployees'
    },
    {
        name: 'Exit',
        value: 'exit'
    }
]

// Array of questions
const questions = [
    {
        type: 'list',
        message: 'What woud you like to do?',
        choices: initialOptions,
        name: 'option'
    }
];

// Initialize prompter
function init() {
    inquirer.prompt(questions)
        .then( answers => {
            if (answers['option'] === 'getAllDepts' || 
                answers['option'] === 'getAllRoles' ||
                answers['option'] === 'getAllEmployees'
            ) {
                // console.table(getAllEntries(answers['option']));
                getAllEntries(answers['option']);
            }
            else if (answers['option'] === 'exit') {
                process.exit(0);
            }

            // init();
        });
    
};

async function getAllEntries(option) {
    switch(option) {
        case 'getAllDepts':
            query = dbInterface.getAllDepartments();
            break;
        case 'getAllRoles':
            query = dbInterface.getAllRoles();
            break;
        case 'getAllEmployees':
            query = dbInterface.getAllEmployees();
            break;
        default:
            console.log(`There's an error...`)
            return;
    };

    db.query(query, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('\n');
        console.log(consoleTable.getTable(results));
        init();
    })
}

// Initialize app
init();