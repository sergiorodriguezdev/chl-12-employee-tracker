// Import required modules
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const db = require('./config/dbConnection');
const DbInterface = require('./lib/DbInterface');
const questions = require('./inquirerPrompts');

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

// Initialize app
init();