// Import required modules
const db = require('./config/dbConnection');
const DbInterface = require('./lib/DbInterface');

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
        name: 'View Department Budget',
        value: 'viewDeptBudget'
    },
    {
        name: 'Delete Department',
        value: 'delDept'
    },
    {
        name: 'Delete Role',
        value: 'delRole'
    },
    {
        name: 'Delete Employee',
        value: 'delEmployee'
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
    },
    {
        type: 'list',
        message: 'Select a department:',
        choices: () => getList('departments', false),
        name: 'departmentId',
        // This prompt will be used under 2 selections
        when: (answers) => answers['option'] === 'viewDeptBudget' || answers['option'] === 'delDept'
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
        message: 'Select an employee:',
        choices: () => getList('employees', false),
        name: 'employeeId',
        when: (answers) => answers['option'] === 'delEmployee'
    }
];

// Export array of questions that will be used by inquirer
module.exports = questions;