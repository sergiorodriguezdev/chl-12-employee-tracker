// Class definition containing static methods
//  This acts more like a helper than an actual Class
class DbInterface {

    // Return SELECT statement to retrieve a formatted list of all departments
    static getAllDepartments() {
        return `SELECT id AS ID, name AS Name FROM department 
        ORDER BY id;`;
    };

    // Return SELECT statement to retrieve a formatted list of all roles
    static getAllRoles() {
        return `SELECT role.id AS ID, role.title AS Title, department.name AS DepartmentName, role.salary AS Salary
        FROM role
        JOIN department ON role.department_id = department.id
        ORDER BY role.id;`;
    };

    // Return SELECT statement to retrieve a formatted list of all employees
    static getAllEmployees() {
        return `SELECT employee.id AS ID, employee.first_name AS FirstName, employee.last_name AS LastName, 
        role.title AS Title, department.name AS DepartmentName, role.salary AS Salary, CONCAT(manager.first_name, " ", manager.last_name) AS ManagerName
        FROM employee
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        ORDER BY employee.id;`;
    };

    // Return SELECT statement to retrieve a formatted list of employees, filtered by manager
    static getEmployeesByManager(managerId) {
        return `SELECT employee.id AS ID, employee.first_name AS FirstName, employee.last_name AS LastName, 
        role.title AS Title, department.name AS DepartmentName, role.salary AS Salary
        FROM employee
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        WHERE manager.id = ${managerId}
        ORDER BY employee.id;`;
    }

    // Return SELECT statement to retrieve a formatted list of employees, filtered by department
    static getEmployeesByDept(departmentId) {
        return `SELECT employee.id AS ID, employee.first_name AS FirstName, employee.last_name AS LastName, 
        role.title AS Title, role.salary AS Salary, CONCAT(manager.first_name, " ", manager.last_name) AS ManagerName
        FROM employee
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        WHERE department.id = ${departmentId}
        ORDER BY employee.id;`;
    }

    // Return formatted INSERT statement to add a department
    static addDepartment(name) {
        return `INSERT INTO department (name) VALUES ("${name}");`;
    }

    // Return formatted INSERT statement to add a role
    static addRole(title, salary, departmentId) {
        return `INSERT INTO role (title, salary, department_id) 
        VALUES ("${title}", ${salary}, ${departmentId});`;
    }

    // Return formatted INSERT statement to add an employee
    static addEmployee(firstName, lastName, roleId, managerId) {
        return `INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES ("${firstName}", "${lastName}", ${roleId}, ${managerId});`;
    }

    // Return formatted UPDATE statement to update an employee's role
    static updateEmployeeRole(id, roleId) {
        return `UPDATE employee
        SET role_id = ${roleId}
        WHERE id = ${id};`;
    }

    // Return formatted UPDATE statement to update an employee's manager
    static updateEmployeeManager(id, managerId) {
        return `UPDATE employee
        SET manager_id = ${managerId}
        WHERE id = ${id};`;
    }

    // Return SELECT statement to retrieve a list of all departments
    //  to be used in inquirer list objects
    static getDepartmentList() {
        return `SELECT name AS name, id AS value FROM department
        ORDER BY id;`;
    }

    // Return SELECT statement to retrieve a list of all roles
    //  to be used in inquirer list objects
    static getRoleList() {
        return `SELECT title AS name, id AS value FROM role
        ORDER BY id;`;
    }

    // Return SELECT statement to retrieve a list of all employees
    //  to be used in inquirer list objects
    //  If includeNone is set to true, then it will add a "None" entry to list
    static getEmployeeList(includeNone) {
        let query = `SELECT CONCAT(first_name, " ", last_name) AS name, id AS value FROM employee
        ORDER BY value;`;

        if (includeNone) {
            query = `SELECT "None" AS name, NULL AS value
            UNION ${query}`;
        }

        return query;
    }

    // Return SELECT statement to retrieve list of employees who have direct reports only (managers)
    //  to be used in inquirer list objects
    static getManagerList() {
        return `SELECT CONCAT(employee.first_name, " ", employee.last_name) AS name, id AS value
        FROM employee
        WHERE id IN (
        SELECT DISTINCT manager_id
        FROM employee
        )
        ORDER BY value;`;
    }

    // Return SELECT statement to retrieve the department name and the sum of salaries for all employees in department
    //  It uses a GROUP BY clause and a SUM aggregate function
    static getDepartmentBudget(departmentId) {
        return `SELECT department.name AS DepartmentName, SUM(role.salary) AS DepartmentBudget
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        WHERE department.id = ${departmentId}
	    GROUP BY department.id
	    ORDER BY department.id;`;
    }

    // Return formatted DELETE statement
    //  This works for any table name as long as it exists and as long as the PK is 'id'
    static deleteEntry(tableName, id) {
        return `DELETE FROM ${tableName} WHERE id = ${id};`;
    }
}

module.exports = DbInterface;