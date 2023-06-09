// Import required modules
const db = require('./config/dbConnection');
const DbInterface = require('./lib/DbInterface');
const inquirer = require('inquirer');

// Array of options
const initialOptions = [
    new inquirer.Separator('Admin'),
    new inquirer.Separator(' Add'),
    {
        name: '  Add Department',
        value: 'addDept'
    },
    {
        name: '  Add Role',
        value: 'addRole'
    },
    {
        name: '  Add Employee',
        value: 'addEmployee'
    },
    new inquirer.Separator(' Update'),
    {
        name: '  Update Employee Role',
        value: 'updateEmployeeRole'
    },
    {
        name: '  Update Employee\'s Manager',
        value: 'updateEmployeeManager'
    },
    new inquirer.Separator(' Delete'),
    {
        name: '  Delete Department',
        value: 'delDept'
    },
    {
        name: '  Delete Role',
        value: 'delRole'
    },
    {
        name: '  Delete Employee',
        value: 'delEmployee'
    },
    new inquirer.Separator(),
    new inquirer.Separator('Reports'),
    {
        name: ' View All Departments',
        value: 'getAllDepts'
    },
    {
        name: ' View All Roles',
        value: 'getAllRoles'
    },
    {
        name: ' View All Employees',
        value: 'getAllEmployees'
    },
    {
        name: ' View Employees by Manager',
        value: 'viewEmployeesByMgr'
    },
    {
        name: ' View Employees by Department',
        value: 'viewEmployeesByDept'
    },
    {
        name: ' View Department Budget',
        value: 'viewDeptBudget'
    },
    new inquirer.Separator(),
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

// Helper function used to populate inquirer list objects with values from database
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
        case 'managers':
            query = DbInterface.getManagerList();
            break;
        default:
            console.log(`There's an error...`)
            return;
    };
    results = await db.promise().query(query);

    return results[0];
}

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
    },
    {
        type: 'list',
        message: 'Select a department:',
        choices: () => getList('departments', false),
        name: 'departmentId',
        // This prompt will be used under 3 selections
        when: (answers) => answers['option'] === 'viewDeptBudget' || 
                            answers['option'] === 'delDept' ||
                            answers['option'] === 'viewEmployeesByDept'
    },
    {
        type: 'list',
        message: 'Select a role:',
        choices: () => getList('roles', false),
        name: 'roleId',
        when: (answers) => answers['option'] === 'delRole'
    },
    {
        type: 'list',
        // Dynamically set the prompt text based on a previous prompt selection
        message: (answers) => (answers['option'] === 'delEmployee') ? 'Select an employee:' : 'Which employee\'s manager do you want to udpate',
        choices: () => getList('employees', false),
        name: 'employeeId',
        // This prompt will be used under 2 selections
        when: (answers) => answers['option'] === 'delEmployee' || answers['option'] === 'updateEmployeeManager'
    },
    {
        type: 'list',
        message: 'Select a manager:',
        choices: () => getList('managers', false),
        name: 'managerId',
        when: (answers) => answers['option'] === 'viewEmployeesByMgr'
    },
    {
        type: 'list',
        // Dynamically set the prompt text based on a previous prompt selection
        message: (answers) => (answers['option'] === 'addEmployee') ? 'Who is the employee\'s manager?' : 'Who is the employee\'s new manager?',
        choices: () => getList('employees', true),
        name: 'newEmployeeMgr',
        // This prompt will be used under 2 selections
        when: (answers) => answers['option'] === 'addEmployee' || answers['option'] === 'updateEmployeeManager'
    }
];

// Export array of questions that will be used by inquirer
module.exports = questions;