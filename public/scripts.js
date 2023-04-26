// Heintar employee data frá API
async function fetchEmployeeData() {
    // Sendur GET request til API
    const response = await fetch('/api/employees');
    // Setur employee data til at vera JSON
    return await response.json();
}

// Sendur employee data til API
async function postEmployeeData(employee) {

    // Sendur POST request til API
    const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
            // Setur header til at siga við API at data er JSON
            'Content-Type': 'application/json',
        },
        // Setur body at innihalda employee data
        body: JSON.stringify(employee),
    });

    if (response.ok) {
        return await response.json();
    } else {
        console.error(`Error posting employee data: ${response.statusText}`);
    }
}

// Renderar employee profilar á heimasíðuna
function renderEmployees(employees) {
    const employeeList = document.getElementById('employee-list');
    employeeList.innerHTML = '';
    // Iterara gjøgnum employee array
    employees.forEach((employee) => {
        // ger eitt div element fyri hvønn employee profil
        const profile = document.createElement('div');
        // seta classa navn hjá profil div
        profile.className = 'employee-profile';
        // Seta innara HTML innihald av profile div við employee data
        profile.innerHTML = `
            <img src="${employee.imageUrl}" alt="${employee.name}'s picture" width="100" height="100">
            <h3>${employee.name}</h3>
            <p><strong>Role:</strong> ${employee.role}</p>
            <p><strong>Biography:</strong> ${employee.bio}</p>
            <button class="delete-employee" data-id="${employee._id}">Delete</button>
        `;
        //  ger delete button og vit gera ein event listener til knøttin at kalla á handleDeleteEmployee function
        const deleteButton = profile.querySelector('.delete-employee');
        deleteButton.addEventListener('click', handleDeleteEmployee);
        // Appenda profil div til employee listan
        employeeList.appendChild(profile);
    });
}

// Handfara employee form submission
async function handleEmployeeFormSubmit(e) {
    // forða default form submission
    e.preventDefault();

    // Samla input virði frá form fields
    const name = document.getElementById('employee-name').value;
    const role = document.getElementById('employee-role').value;
    const bio = document.getElementById('employee-bio').value;
    const imageUrl = document.getElementById('employee-image').value;

    // ger eitt nýtt employee object frá form data
    const newEmployee = { name, role, bio, imageUrl };

    // Sendur employee object til API
    const savedEmployee = await postEmployeeData(newEmployee);

    // Heintar nýggja employee data frá API og rendera á heimasíðuna
    renderEmployees([...(await fetchEmployeeData()), savedEmployee]);

    e.target.reset();
}


// Handfara delete employee button click
async function handleDeleteEmployee(e) {
    // Heinta employee id frá delete button
    const employeeId = e.target.dataset.id;
    // Senda employee id til API
    const isDeleted = await deleteEmployeeData(employeeId);
    // Heinta nýggja employee lista frá API
    if (isDeleted) {
        const employees = await fetchEmployeeData();
        // Rendera nýggja employee listan á heimasíðuna
        renderEmployees(employees);
    } else {
        console.error('Error deleting employee');
    }
}

// Senda employee id til API fyri at sletta employee
async function deleteEmployeeData(employeeId) {
    // Senda DELETE request til API
    const response = await fetch(`/api/employees/${employeeId}`, {
        method: 'DELETE',
    });

    return response.ok;
}

// Event listener til at handfara DOMContentLoaded event
document.addEventListener('DOMContentLoaded', async () => {
    // Heinta add employee data frá API
    const employeeForm = document.getElementById('add-employee-form');
    // SetA event listener á form submission
    employeeForm.addEventListener('submit', handleEmployeeFormSubmit);
    // Heinta employee data frá API
    const employees = await fetchEmployeeData();
    // Rendera employee lista á heimasíðuna
    renderEmployees(employees);
});
