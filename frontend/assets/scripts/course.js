const itemsPerPage = 10;
let currentPage = 1;
let courses = [];
let isNewItem = false;
let currentItem = null;

const editModal = document.getElementById("modalPage");
const courseIdModal = document.getElementById("courseId");
const courseNameModal = document.getElementById("courseName");
const courseLevelModal = document.getElementById("courseAcademicLevel");
const courseDescriptionModal = document.getElementById("courseDescription");
const idSpan = document.getElementById("IdSpan");

document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = 'login.html';
    }

    getData("https://localhost:7064/api/Course", null);
    populateSelect("courseLevelSearch", "AcademicLevel", "academic_level");
    document.getElementById('btnPrev').addEventListener("click", (event) => {
        event.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderTable(courses);
        }
    });

    document.getElementById('btnNext').addEventListener("click", (event) => {
        event.preventDefault();
        if (currentPage * itemsPerPage < courses.length) {
            currentPage++;
            renderTable(courses);
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
        getData("https://localhost:7064/api/Course", null);
        console.log("Reloaded");
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
                courses = data;
                renderTable(courses);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

    } catch (error) {
        console.error("Error fetching courses:", error);
    }
};

const formSubmit = (isNew) =>{
    const courseId = document.getElementById("courseId").value;
    const courseName = document.getElementById("courseName").value;
    const courseLevel = document.getElementById("courseAcademicLevel").value;
    const courseDescription = document.getElementById("courseDescription").value;

    let url = `https://localhost:7064/api/Course`;

    if (isNew) newItem = true;
    else{
        newItem = false;  
        url = `${url}/${currentItem}`;
    } 
    
    let method = isNew ? "POST" : "PATCH";

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                
        },
        body: JSON.stringify({ 
            course_name: courseName,
            course_description: courseDescription,
            course_academic_level_id: courseLevel,
        })
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
        getData("https://localhost:7064/api/Course", null);
    });
};

const renderTable = (data) => {
    const table = document.getElementById("tblCourse");
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = ""; 

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = data.slice(start, end);

    paginatedData.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.course_id}</td>
            <td>${item.course_name}</td>
            <td>${item.course_description}</td>
            <td>${item.course_level_name}</td>
            <td>
                <div class="action-buttons">
                    <button class="btnActions" onclick="onEditClick(${item.course_id}, '${item.course_name}', ${item.course_academic_level_id}, '${item.course_description}')">Edit</button>
                    <button class="btnActions" onclick="onDeleteClick(${item.course_id})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    //pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(data.length / itemsPerPage)}`;
    document.getElementById('btnPrev').disabled = currentPage === 1;
    document.getElementById('btnNext').disabled = currentPage * itemsPerPage >= data.length;
    padEmptyRows('tblCourse', 10, paginatedData.length);
    updatePageInfo();
}

function padEmptyRows(tableId, itemsPerPage, currentItemCount) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    const missingRows = itemsPerPage - currentItemCount;

    for (let i = 0; i < missingRows; i++) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>&nbsp;</td><td></td><td></td><td></td><td></td>`;
        tableBody.appendChild(tr);
    }
}

const populateSelect = (selectId, selection, root_name) => {
    const select = document.getElementById(selectId);
    select.innerHTML = "";

    return new Promise((resolve, reject) => {
        fetch(`https://localhost:7064/api/${selection}`, {
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

const onAddClick = async () => {
    await populateSelect("courseAcademicLevel", "AcademicLevel", "academic_level");
    courseIdModal.value = null;
    courseNameModal.value = null;
    courseLevelModal.value = null;
    courseDescriptionModal.value = null;
    isNewItem = true;
    idSpan.style.display = "none";
    editModal.style.display = "flex";
}

const onEditClick = async(id, name, levelId, desc) => {
    await populateSelect("courseAcademicLevel", "AcademicLevel", "academic_level");
    isNewItem = false;
    currentItem = id;
    courseIdModal.value = id;
    courseNameModal.value = name;
    courseLevelModal.value = levelId;
    courseDescriptionModal.value = desc;
    idSpan.style.display = "flex";
    editModal.style.display = "flex";
};

const onDeleteClick = (id) => {
    fetch(`https://localhost:7064/api/Course/${id}`, {
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
    .then(data => alert("Deleted successfully!"))
    .catch(error => console.error('There was a problem with your fetch operation:', error));
};

const onSearch = () => {
    const searchValue = document.getElementById("textInputSearch").value.toLowerCase();

    const academicLevelFilter = document.getElementById("courseLevelSearch");
    let academicLevelRawText = academicLevelFilter?.options[academicLevelFilter.selectedIndex]?.textContent?.trim() || "";

    const academicYearText = academicLevelRawText === "--- Select ---" ? "" : academicLevelRawText;

    const filteredData = courses.filter(item => {
        const textMatch = item.course_name.toLowerCase().includes(searchValue);
        const selectMatch = !academicYearText || item.course_level_name == academicYearText;

        return textMatch && selectMatch;
    });
    currentPage = 1;
    renderTable(filteredData);
}

const onClearInput = () => {
    document.getElementById("textInputSearch").value = "";
    renderTable(courses);
}

const updatePageInfo = () => {
    const pageInfo = document.getElementById("pageInfo");
    const itemCount = document.getElementById("itemNumber");
    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(courses.length / itemsPerPage)}`;
    itemCount.textContent = `Total items: ${courses.length}`;
}

