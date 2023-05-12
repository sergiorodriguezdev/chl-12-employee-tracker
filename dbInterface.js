class DbInterface {
    static getAllDepartments() {
        return `SELECT id AS ID, name AS Name FROM department 
        ORDER BY id;`;
    };

    static getAllRoles() {
        return `SELECT role.id AS ID, role.title AS Title, department.name AS DepartmentName, role.salary AS Salary
        FROM role
        JOIN department ON role.department_id = department.id
        ORDER BY role.id;`;
    };

    static getAllEmployees() {
        return `SELECT employee.id AS ID, employee.first_name AS FirstName, employee.last_name AS LastName, 
        role.title AS Title, department.name AS DepartmentName, role.salary AS Salary, CONCAT(manager.first_name, " ", manager.last_name) AS ManagerName
        FROM employee
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        ORDER BY employee.id;`;
    };

    static addDepartment(name) {
        return `INSERT INTO department (name) VALUES ("${name}");`
    }

    static addRole(title, salary, departmentId) {
        return `INSERT INTO role (title, salary, department_id) 
        VALUES ("${title}", ${salary}, ${departmentId});`
    }

    static getDepartmentList(){
        return `SELECT name AS name, id AS value FROM department
        ORDER BY id;`
    }
}

module.exports = DbInterface;