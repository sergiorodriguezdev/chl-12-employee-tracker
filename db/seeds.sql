USE employee_tracker_db;

INSERT INTO department (name)
VALUES 
    ("Leadership"),
    ("Human Resources"),
    ("Sales"),
    ("Accounting"),
    ("Warehouse"),
    ("Other");

INSERT INTO role (title, salary, department_id)
VALUES
    ("QA Representative",40000.00,6),
    ("Salesperson",70000.00,3),
    ("Regional Manager",100000.00,1),
    ("Human Resources Coordinator",60000.00,2),
    ("Director of Accounting",70000.00,4),
    ("Accountant",50000.00,4),
    ("Office Manager",60000.00,6),
    ("Supplier Relations Manager",40000.00,6),
    ("Customer Service Manager",40000.00,6),
    ("Warehouse Director",40000.00,5),
    ("Temp",35000.00,6),
    ("Receptionist",35000.00,6),
    ("Warehouse Manager",30000.00,5),
    ("Warehouse Associate",25000.00,5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Michael","Scott",3,NULL),
    ("Toby","Flenderson",4,NULL),
    ("Creed","Bratton",1,1),
    ("Stanley","Hudson",2,1),
    ("Phyllis","Vance",2,1),
    ("Dwight","Schrute",2,1),
    ("Jim","Halpert",2,1),
    ("Angela","Schrute",5,1),
    ("Oscar","Martinez",6,8),
    ("Pam","Halpert",7,1),
    ("Meredith","Palmer",8,1),
    ("Kelly","Kapoor",9,1),
    ("Todd","Packer",2,1),
    ("Andrew","Bernard",2,1),
    ("Darryl","Philbin",10,1),
    ("Kevin","Malone",6,8),
    ("Ryan","Howard",11,12),
    ("Erin","Hannon",12,1),
    ("Val","Johnson",13,15),
    ("Hidetoshi","Hasagawa",14,19),
    ("Nate","Nickerson",14,19),
    ("Glenn","Lester",14,19),
    ("Madge","Madsen",14,19);