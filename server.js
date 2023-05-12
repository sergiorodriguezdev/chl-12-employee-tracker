// Import required modules
const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');
const DbInterface = require('./DbInterface');

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
        name: 'Add Department',
        value: 'addDept'
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
    },
    {
        type: 'input',
        message: 'What is the name of the Department?',
        name: 'newDeptName',
        filter: (value) => value.trim(),
        validate: (value) => {
            if (value.length) {
                return true;
            } else {
                return 'Please enter a value';
            }
        },
        when: (answers) => answers['option'] === 'addDept'
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
                getAllEntries(answers['option']);
            }
            else if (answers['option'] === 'addDept') {
                addDepartment(answers['newDeptName']);
            }
            else if (answers['option'] === 'exit') {
                process.exit(0);
            }
        });
    
};

function getAllEntries(option) {
    switch(option) {
        case 'getAllDepts':
            query = DbInterface.getAllDepartments();
            break;
        case 'getAllRoles':
            query = DbInterface.getAllRoles();
            break;
        case 'getAllEmployees':
            query = DbInterface.getAllEmployees();
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

function addDepartment(departmentName) {
    query = DbInterface.addDepartment(departmentName);

    db.query(query, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('\n');
        console.log(`Added ${departmentName} to the database`);
        init();
    })
}

// Initialize app
init();