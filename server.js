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
                // If user selects to view all departments/roles/employees,
                //  call function and pass the option they selected
                getAllEntries(answers['option']);
            }
            else if (answers['option'] === 'addDept' ||
                     answers['option'] === 'addRole' ||
                     answers['option'] === 'addEmployee'
            ) {
                addEntry(answers);
            }
            else if (answers['option'] === 'updateEmployeeRole') {
                updateEmployeeRole(
                    answers['employeeRoleUpdate'],
                    answers['roleUpdate']
                )
            }
            else if (answers['option'] === 'exit') {
                process.exit(0); // Exit app gracefully
            }
        });

};

// Based on the option passed into this function,
//  the correct SELECT statement will be retrieved from helper Class
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

    // Data is retrieved
    db.query(query, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }

        // Data is printed using the console.table module
        console.log('\n');
        console.log(consoleTable.getTable(results));

        // Restart prompts
        init();
    });
}

// Based on the options passed into this function,
//  retrieve the appropriate values from answers and
//  retrieve the appropiate INSERT statement from helper Class
function addEntry(answers) {
    let entry;
    let departmentName;
    let roleTitle;
    let roleSalary;
    let roleDepartmentId;
    let employeeFName;
    let employeeLName;
    let employeeRoleId;
    let employeeMgrId;
    let query;

    switch (answers['option']) {
        case 'addDept':
            departmentName = answers['newDeptName'];
            entry = departmentName;
            query = DbInterface.addDepartment(departmentName);
            break;
        case 'addRole':
            roleTitle = answers['newRoleTitle'];
            roleSalary = answers['newRoleSalary'];
            roleDepartmentId = answers['newRoleDept'];
            entry = roleTitle;
            query = DbInterface.addRole(roleTitle, roleSalary, roleDepartmentId);
            break;
        case 'addEmployee':
            employeeFName = answers['newEmployeeFName'];
            employeeLName = answers['newEmployeeLName'];
            employeeRoleId = answers['newEmployeeRole'];
            employeeMgrId = answers['newEmployeeMgr'];
            entry = `${employeeFName} ${employeeLName}`;
            query = DbInterface.addEmployee(employeeFName, employeeLName, employeeRoleId, employeeMgrId);
            break;
        default:
            console.log(`There's an error...`)
            return;
    };


    // Data is retrieved
    db.query(query, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('\n');
        console.log(`Added ${entry} to the database`);

        // Restart prompts
        init();
    });
}

// Update employee role function
function updateEmployeeRole(employeeId, employeeRoleId) {
    // Get UPDATE statement
    query = DbInterface.updateEmployeeRole(employeeId, employeeRoleId);

    // Execute query
    db.query(query, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('\n');
        console.log(`Updated employee's role`);

        // Restart prompts
        init();
    });
}

// Initialize app
init();