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
            <img src="${employee.imageUrl}" alt="${employee.name}'s picture" width="100" height="100">
            <h3>${employee.name}</h3>
            <p><strong>Role:</strong> ${employee.role}</p>
            <p><strong>Biography:</strong> ${employee.bio}</p>
            <button class="delete-employee" data-id="${employee._id}">Delete</button>
        `;
        const deleteButton = profile.querySelector('.delete-employee');
        deleteButton.addEventListener('click', handleDeleteEmployee);

        employeeList.appendChild(profile);
    });
}

async function handleEmployeeFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('employee-name').value;
    const role = document.getElementById('employee-role').value;
    const bio = document.getElementById('employee-bio').value;
    const imageUrl = document.getElementById('employee-image').value;

    const newEmployee = {name, role, bio, imageUrl};
    const savedEmployee = await postEmployeeData(newEmployee);

    const employees = await fetchEmployeeData();
    renderEmployees(employees);

    e.target.reset();
}

async function handleDeleteEmployee(e) {
    const employeeId = e.target.dataset.id;
    await deleteEmployeeData(employeeId);
    const employees = await fetchEmployeeData();
    renderEmployees(employees);
}

async function deleteEmployeeData(id) {
    const response = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
    });
    return response.ok;
}


document.addEventListener('DOMContentLoaded', async () => {
    const employeeForm = document.getElementById('add-employee-form');
    employeeForm.addEventListener('submit', handleEmployeeFormSubmit);

    const employees = await fetchEmployeeData();
    renderEmployees(employees);
});
