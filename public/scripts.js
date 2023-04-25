async function fetchEmployeeData() {
    const response = await fetch('/api/employees');
    const employees = await response.json();
    return employees;
}

async function postEmployeeData(employee) {
    const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
    });
    const savedEmployee = await response.json();
    return savedEmployee;
}

function renderEmployees(employees) {
    const employeeList = document.getElementById('employee-list');
    employeeList.innerHTML = '';

    employees.forEach((employee) => {
        const profile = document.createElement('div');
        profile.className = 'employee-profile';
        profile.innerHTML = `
      <h3>${employee.name}</h3>
      <p><strong>Role:</strong> ${employee.role}</p>
      <p><strong>Biography:</strong> ${employee.bio}</p>
    `;
        employeeList.appendChild(profile);
    });
}

async function handleEmployeeFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('employee-name').value;
    const role = document.getElementById('employee-role').value;
    const bio = document.getElementById('employee-bio').value;

    const newEmployee = { name, role, bio };
    const savedEmployee = await postEmployeeData(newEmployee);

    const employees = await fetchEmployeeData();
    renderEmployees(employees);

    e.target.reset();
}

document.addEventListener('DOMContentLoaded', async () => {
    const employeeForm = document.getElementById('add-employee-form');
    employeeForm.addEventListener('submit', handleEmployeeFormSubmit);

    const employees = await fetchEmployeeData();
    renderEmployees(employees);
});
