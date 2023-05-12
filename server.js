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
        name: 'Add Role',
        value: 'addRole'
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
        message: 'What is the name of the department?',
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
    },
    {
        type: 'input',
        message: 'What is the title of the role?',
        name: 'newRoleTitle',
        filter: (value) => value.trim(),
        validate: (value) => {
            if (value.length) {
                return true;
            } else {
                return 'Please enter a value';
            }
        },
        when: (answers) => answers['option'] === 'addRole'
    },
    {
        type: 'number',
        message: 'What is the salary of the role?',
        name: 'newRoleSalary',
        filter: (value) => {
            return (Number.isNaN(value) || value < 0) ? '' : value;
        },
        validate: (value) => {
            if (value > 0) {
                return true;
            } else {
                return 'Please enter a correct salary amount';
            }
        },
        when: (answers) => answers['option'] === 'addRole'
    },
    {
        type: 'list',
        message: 'Which department does this role belong to?',
        choices: () => getList('roles'),
        name: 'newRoleDept',
        when: (answers) => answers['option'] === 'addRole'
    }
];

// Initialize prompter
function init() {

    inquirer.prompt(questions)
        .then(answers => {
            if (answers['option'] === 'getAllDepts' ||
                answers['option'] === 'getAllRoles' ||
                answers['option'] === 'getAllEmployees'
            ) {
                getAllEntries(answers['option']);
            }
            else if (answers['option'] === 'addDept') {
                addDepartment(answers['newDeptName']);
            }
            else if (answers['option'] === 'addRole') {
                addRole(answers['newRoleTitle'],
                        answers['newRoleSalary'],
                        answers['newRoleDept']
                );
            }
            else if (answers['option'] === 'exit') {
                process.exit(0);
            }
        });

};

function getAllEntries(option) {
    switch (option) {
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
    });
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
    });
}

function addRole(roleTitle, roleSalary, roleDepartmentId) {
    query = DbInterface.addRole(roleTitle, roleSalary, roleDepartmentId);

    db.query(query, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('\n');
        console.log(`Added ${roleTitle} to the database`);
        init();
    });
}

async function getList(type) {
    query = DbInterface.getDepartmentList();

    results = await db.promise().query(query);

    return results[0];
}

// Initialize app
init();