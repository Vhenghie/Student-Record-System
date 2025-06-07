const itemsPerPage = 10;
let currentPage = 1;
let students = [];
let selectItems = [];
let isNewItem = false;
let currentItem = null;

let academicYearSelectOptions = [];
let courseYearSelectOptions = [];

const baseURL = "https://student-record-system.runasp.net/api/Student";

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phonePattern = /^05[0|2|4|5|6|8][0-9]{7}$/;

const editModal = document.getElementById("modalPage");
const idSpan = document.getElementById("IdSpan");

const levelSelect = document.getElementById('studentAcademicLevel');
const yearSelect = document.getElementById('studentAcademicYear');
const courseSelect = document.getElementById('studentCourse');
let yearSelectOriginal = [];
let courseSelectOriginal = [];

document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = 'login.html';
    }

    getData(`${baseURL}`, null);

    document.getElementById('btnPrev').addEventListener("click", (event) => {
        event.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderTable(students);
        }
    });

    document.getElementById('btnNext').addEventListener("click", (event) => {
        event.preventDefault();
        if (currentPage * itemsPerPage < students.length) {
            currentPage++;
            renderTable(students);
        }
    });
    
    document.getElementById('btnCancel').addEventListener("click", (event) => {
        event.preventDefault();
        editModal.style.display = "none";
    });
    
    document.getElementById('btnSearch').addEventListener("click", (event) => {
        event.preventDefault();
        onSearch();
    });
    
    document.getElementById('btnClear').addEventListener("click", (event) => {
        event.preventDefault();
        onClearInput();
    });
      
    document.getElementById('modalForm').addEventListener("submit", function(event) {
        event.preventDefault();
        formSubmit(isNewItem);
    });

    document.getElementById('btnAdd').addEventListener("click", (event) => {
        event.preventDefault();
        onAddClick();
    });

    document.getElementById('btnReload').addEventListener("click", (event) => {
        event.preventDefault();
        getData(`${baseURL}`, null);
        console.log("Reloaded");
    });

    populateSelectFilters();

    document.getElementById('studentEmail').addEventListener('blur', () => {
        if (!emailPattern.test(document.getElementById('studentEmail').value.trim())) document.getElementById('studentEmail').style.border = '2px solid red';
        else document.getElementById('studentEmail').style.border = '';
    });

    document.getElementById('studentMobile').addEventListener('blur', () => {
        if (!phonePattern.test(document.getElementById('studentMobile').value)) document.getElementById('studentMobile').style.border = '2px solid red';
        else document.getElementById('studentMobile').style.border = '';
    });
});

const getData = (url, payload) => {
    try {
        fetch(url, {
            headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch data");
                return response.json();
            })
            .then((data) => {
                students = data;
                renderTable(students);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

    } catch (error) {
        console.error("Error fetching students:", error);
    }
};

const formSubmit = (isNew) =>{

    let url = `${baseURL}`;

    if (isNew) newItem = true;
    else{
        newItem = false;  
        url = `${url}/${currentItem}`;
    } 
    
    let method = isNew ? "POST" : "PATCH";

    let studentData = {
        student_first_name: document.getElementById("studentFirstName").value,
        student_middle_name: document.getElementById("studentMiddleName").value,
        student_last_name: document.getElementById("studentLastName").value,
        student_gender: document.getElementById("studentGender").value,
        student_dob: document.getElementById("studentDob").value,
        student_email: document.getElementById("studentEmail").value,
        student_mobile: document.getElementById("studentMobile").value,
        student_address: document.getElementById("studentAddress").value,
        student_academic_level_id: parseInt(document.getElementById("studentAcademicLevel").value),
        student_academic_year_id: parseInt(document.getElementById("studentAcademicYear").value),
        student_course_id: parseInt(document.getElementById("studentCourse").value),
        ...(isNew && { student_enroll_date: new Date().toISOString() })
    }

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify(studentData)
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then((data) => {
        alert("Success!");
    })
    .catch(error => console.error('Failed to saved:', error))
    .finally(() => {
        editModal.style.display = "none";
        isNewItem = false;
        currentItem = null;
        getData(`${baseURL}`, null);
    });
};

const onSearch = () => {
    const nameValue = document.getElementById("textInputSearch").value.toLowerCase().trim();

    const academicLevelFilter = document.getElementById("academicLevelFilter");
    let academicLevelRawText = academicLevelFilter?.options[academicLevelFilter.selectedIndex]?.textContent?.trim() || "";

    const academicYearFilter = document.getElementById("academicYearFilter");
    let academicYearRawText = academicYearFilter?.options[academicYearFilter.selectedIndex]?.textContent?.trim() || "";

    const courseFilter = document.getElementById("courseFilter");
    let courseRawText = courseFilter?.options[courseFilter.selectedIndex]?.textContent?.trim() || "";

    const academicLevelText = academicLevelRawText === "--- Select ---" ? "" : academicLevelRawText;
    const academicYearText = academicYearRawText === "--- Select ---" ? "" : academicYearRawText;
    const courseText = courseRawText === "--- Select ---" ? "" : courseRawText;

    const filteredData = students.filter(student => {
        const fullName = `${student.student_first_name ?? ""} ${student.student_middle_name ?? ""} ${student.student_last_name ?? ""}`.toLowerCase();

        const nameMatch = !nameValue || fullName.includes(nameValue);
        const academicLevelTextMatch = !academicLevelText || student.student_academic_level_name == academicLevelText;
        const academicYearTextMatch = !academicYearText || student.student_academic_year_name == academicYearText;
        const courseTextMatch = !courseText || student.student_course_name == courseText;

        return nameMatch && academicLevelTextMatch && academicYearTextMatch && courseTextMatch;
    });

    currentPage = 1;    
    renderTable(filteredData);
};

const renderTable = (data) => {
    const table = document.getElementById("tblStudent");
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = ""; 

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = data.slice(start, end);

    const dateDisplayOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    paginatedData.forEach((item) => {
        const row = document.createElement("tr");

        const dateObject = new Date(item.student_dob);
        const formattedDate = dateObject.toLocaleDateString('en-US', dateDisplayOptions);

        row.innerHTML = `
            <td>${item.student_id}</td>
            <td>${item.student_first_name}</td>
            <td>${item.student_middle_name ?? ''}</td>
            <td>${item.student_last_name}</td>
            <td>${item.student_gender}</td>
            <td>${item.student_age}</td>
            <td>${formattedDate}</td>
            <td>${item.student_academic_level_name}</td>
            <td>${item.student_academic_year_name ?? ''}</td>
            <td>${item.student_course_name ?? ''}</td>
            <td>${item.student_email}</td>
            <td>${item.student_mobile}</td>
            <td>${item.student_address}</td>
            <td>
                <div class="action-buttons">
                    <button class="btnActions" onclick="onEditClick(${item.student_id})"><i class="fa-solid fa-pencil"></i></button>
                    <button class="btnActions" onclick="onDeleteClick(${item.student_id})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(data.length / itemsPerPage)}`;
    document.getElementById('btnPrev').disabled = currentPage === 1;
    document.getElementById('btnNext').disabled = currentPage * itemsPerPage >= data.length;
    padEmptyRows('tblStudent', 10, paginatedData.length);

    updatePageInfo();
}

function padEmptyRows(tableId, itemsPerPage, currentItemCount) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    const missingRows = itemsPerPage - currentItemCount;

    for (let i = 0; i < missingRows; i++) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>`;
        tableBody.appendChild(tr);
    }
}

const populateSelectFilters = async() => {
    await populateSelect("academicLevelFilter", "AcademicLevel", "academic_level");
    await populateSelect("academicYearFilter", "AcademicYear", "academic_year");
    await populateSelect("courseFilter", "Course", "course");
}

const populateSelectModals = async() => {
    await populateSelect("studentAcademicYear", "AcademicYear", "academic_year");
    await populateSelect("studentCourse", "Course", "course");
    await populateSelect("studentAcademicLevel", "AcademicLevel", "academic_level");
}

const onAddClick = async() => {;
    document.getElementById("modalForm").reset();
    isNewItem = true;
    idSpan.style.display = "none";
    editModal.style.display = "flex";
    await populateSelectModals();
    yearSelectOriginal = Array.from(yearSelect.options);
    courseSelectOriginal = Array.from(courseSelect.options);
}

const onEditClick = async(id) => {
    document.getElementById("modalForm").reset();
    await populateSelectModals();

    yearSelectOriginal = Array.from(yearSelect.options);
    courseSelectOriginal = Array.from(courseSelect.options);
    yearSelect.disabled = false;
    isNewItem = false;
    currentItem = id;
    idSpan.style.display = "flex";
    editModal.style.display = "flex";
    
    getStudentById(id);
};

const onDeleteClick = (id) => {
    fetch(`${baseURL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        currentPage = 1;
        renderTable(students);
        alert("Deleted successfully!");
    })
    .catch(error => console.error('There was a problem with your fetch operation:', error));
};

const onClearInput = () => {
    document.getElementById("textInputSearch").value = "";
    document.getElementById("academicLevelFilter").value = "";
    document.getElementById("academicYearFilter").value = "";
    document.getElementById("courseFilter").value = "";
    renderTable(students);
}

const updatePageInfo = () => {
    const pageInfo = document.getElementById("pageInfo");
    const itemCount = document.getElementById("itemNumber");
    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(students.length / itemsPerPage)}`;
    itemCount.textContent = `Total items: ${students.length}`;
}

const populateSelect = (selectId, selection, root_name) => {
    const select = document.getElementById(selectId);
    select.innerHTML = "";

    return new Promise((resolve, reject) => {
        fetch(`https://student-record-system.runasp.net/api/${selection}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch data");
                return response.json();
            })
            .then((data) => {
                const defaultOption = document.createElement("option");
                defaultOption.value = "";
                defaultOption.textContent = "--- Select ---";
                select.appendChild(defaultOption);

                data.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item[`${root_name}_id`];
                    option.textContent = item[`${root_name}_name`];
                    if(selectId !== 'academicLevelFilter' || selectId !== 'studentAcademicLevel'){
                        option.setAttribute('data-validation', item[`${root_name}_level_name`]);
                    }
                    select.appendChild(option); 
                });                
                resolve();
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                reject(error);
            });
    });
};

const getStudentById = (id) => {
    fetch(`${baseURL}/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
        .then((response) => {
            if (!response.ok) throw new Error("Failed to fetch data");
            return response.json();
        })
        .then((data) => {
            document.getElementById("studentId").value = data.student_id;
            document.getElementById("studentFirstName").value = data.student_first_name;
            document.getElementById("studentMiddleName").value = data.student_middle_name;
            document.getElementById("studentLastName").value = data.student_last_name;
            document.getElementById("studentGender").value = data.student_gender;
            document.getElementById("studentAddress").value = data.student_address
            document.getElementById("studentDob").value = data.student_dob.split('T')[0];
            document.getElementById("studentEmail").value = data.student_email;
            document.getElementById("studentMobile").value = data.student_mobile;
            document.getElementById("studentAcademicLevel").value = data.student_academic_level_id;
            document.getElementById("studentAcademicYear").value = data.student_academic_year_id;
            document.getElementById("studentCourse").value = data.student_course_id;
            modalValidationOnEdit();
            if(!data.student_academic_year_id){
                document.getElementById("studentAcademicYear").disabled = true;
            }
            if(!data.student_course_id){
                document.getElementById("studentCourse").disabled = true;
            }
        })
        .catch((error) => {
            console.error("Error fetching student data:", error);
        });
}

/* MODAL SELECT VALIDATIONS */   

document.getElementById('studentAcademicLevel').addEventListener('change', function () {
    const selectedOption = this.options[this.selectedIndex];
    const selectedText = selectedOption.text;
    yearSelect.disabled = false;
    
    if(selectedText === 'Elementary' || selectedText === 'Kindergarten' || selectedText === 'High School'){
        courseSelect.disabled = true;
    }
    else{
        courseSelect.disabled = false;
    }

    const requiredOptionsYear = yearSelectOriginal.filter(
        option => option.getAttribute('data-validation') === selectedText
    );
    const requiredOptionsCourse = courseSelectOriginal.filter(
        option => option.getAttribute('data-validation') === selectedText
    );

    yearSelect.innerHTML = '';
    courseSelect.innerHTML = '';

    requiredOptionsYear.forEach(option => yearSelect.appendChild(option));
    requiredOptionsCourse.forEach(option => courseSelect.appendChild(option));
});

const modalValidationOnEdit = () => {
    const LevelSelected = levelSelect.options[levelSelect.selectedIndex];
    const selectedText = LevelSelected.text;

    if(selectedText === 'Elementary' || selectedText === 'Kindergarten' || selectedText === 'High School'){
        courseSelect.disabled = true;
    }
    else{
        courseSelect.disabled = false;
    }

    const requiredOptionsYear = yearSelectOriginal.filter(
        option => option.getAttribute('data-validation') === selectedText
    );
    const requiredOptionsCourse = courseSelectOriginal.filter(
        option => option.getAttribute('data-validation') === selectedText
    );

    yearSelect.innerHTML = '';
    courseSelect.innerHTML = '';

    requiredOptionsYear.forEach(option => yearSelect.appendChild(option));
    requiredOptionsCourse.forEach(option => courseSelect.appendChild(option));
}