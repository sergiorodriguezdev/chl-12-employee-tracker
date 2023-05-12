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
        name: 'Add Employee',
        value: 'addEmployee'
    },
    {
        name: 'Update Employee Role',
        value: 'updateEmployeeRole'
    },
    {
        name: 'Exit',
        value: 'exit'
    }
]

// Filter and Validation functions
const filterInput = (value) => value.trim();

const validateInput = (value) => {
    if (value.length) {
        return true;
    } else {
        return 'Please enter a value';
    }
};

const filterSalary = (value) => (Number.isNaN(value) || value < 0) ? '' : value;

const validateSalary = (value) => {
    if (value > 0) {
        return true;
    } else {
        return 'Please enter a correct salary amount';
    }
};

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
        filter: filterInput,
        validate: validateInput,
        when: (answers) => answers['option'] === 'addDept'
    },
    {
        type: 'input',
        message: 'What is the title of the role?',
        name: 'newRoleTitle',
        filter: filterInput,
        validate: validateInput,
        when: (answers) => answers['option'] === 'addRole'
    },
    {
        type: 'number',
        message: 'What is the salary of the role?',
        name: 'newRoleSalary',
        filter: filterSalary,
        validate: validateSalary,
        when: (answers) => answers['option'] === 'addRole'
    },
    {
        type: 'list',
        message: 'Which department does this role belong to?',
        choices: () => getList('departments'),
        name: 'newRoleDept',
        when: (answers) => answers['option'] === 'addRole'
    },
    {
        type: 'input',
        message: 'What is the employee\'s first name?',
        name: 'newEmployeeFName',
        filter: filterInput,
        validate: validateInput,
        when: (answers) => answers['option'] === 'addEmployee'
    },
    {
        type: 'input',
        message: 'What is the employee\'s last name?',
        name: 'newEmployeeLName',
        filter: filterInput,
        validate: validateInput,
        when: (answers) => answers['option'] === 'addEmployee'
    },
    {
        type: 'list',
        message: 'What is the employee\'s role?',
        choices: () => getList('roles'),
        name: 'newEmployeeRole',
        when: (answers) => answers['option'] === 'addEmployee'
    },
    {
        type: 'list',
        message: 'Who is the employee\'s manager?',
        choices: () => getList('employees', true),
        name: 'newEmployeeMgr',
        when: (answers) => answers['option'] === 'addEmployee'
    },
    {
        type: 'list',
        message: 'Which employee\'s role do you want to update?',
        choices: () => getList('employees', false),
        name: 'employeeRoleUpdate',
        when: (answers) => answers['option'] === 'updateEmployeeRole'
    },
    {
        type: 'list',
        message: 'Which role do you want to assign to the selected employee?',
        choices: () => getList('roles', false),
        name: 'roleUpdate',
        when: (answers) => answers['option'] === 'updateEmployeeRole'
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
            else if (answers['option'] === 'addEmployee') {
                addEmployee(answers['newEmployeeFName'],
                    answers['newEmployeeLName'],
                    answers['newEmployeeRole'],
                    answers['newEmployeeMgr']
                );
            }
            else if (answers['option'] === 'updateEmployeeRole') {
                updateEmployeeRole(
                    answers['employeeRoleUpdate'],
                    answers['roleUpdate']
                )
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

function addEmployee(employeeFName, employeeLName, employeeRoleId, employeeMgrId) {
    query = DbInterface.addEmployee(employeeFName, employeeLName, employeeRoleId, employeeMgrId);

    db.query(query, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('\n');
        console.log(`Added ${employeeFName} ${employeeLName} to the database`);
        init();
    });
}

function updateEmployeeRole(employeeId, employeeRoleId) {
    query = DbInterface.updateEmployeeRole(employeeId, employeeRoleId);

    db.query(query, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('\n');
        console.log(`Updated employee's role`);
        init();
    });
}

async function getList(type, includeNone) {
    switch (type) {
        case 'departments':
            query = DbInterface.getDepartmentList();
            break;
        case 'roles':
            query = DbInterface.getRoleList();
            break;
        case 'employees':
            query = DbInterface.getEmployeeList(includeNone);
            break;
        default:
            console.log(`There's an error...`)
            return;
    };
    results = await db.promise().query(query);

    return results[0];
}

// Initialize app
init();