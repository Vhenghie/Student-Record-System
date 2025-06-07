const itemsPerPage = 10;
let currentPage = 1;
let academicYears = [];
let isNewItem = false;
let currentItem = null;

const editModal = document.getElementById("modalPage");
let academicYearIdModal = document.getElementById("academicYearId");
let academicYearNameModal = document.getElementById("academicYearName");
let academicYearLevelModal = document.getElementById("academicYearLevel");
const idSpan = document.getElementById("IdSpan");

document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = 'login.html';
    }

    getData("https://localhost:7064/api/AcademicYear", null);
    populateSelect("academicLevelFilter", "AcademicLevel", "academic_level");

    document.getElementById('btnPrev').addEventListener("click", (event) => {
        event.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderTable(academicYears);
        }
    });

    document.getElementById('btnNext').addEventListener("click", (event) => {
        event.preventDefault();
        if (currentPage * itemsPerPage < academicYears.length) {
            currentPage++;
            renderTable(academicYears);
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
        getData("https://localhost:7064/api/AcademicYear", null);
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
                academicYears = data;
                renderTable(academicYears);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

    } catch (error) {
        console.error("Error fetching grade levels:", error);
    }
};

const formSubmit = (isNew) =>{
    const Id = document.getElementById("academicYearId").value;
    const Name = document.getElementById("academicYearName").value;
    const levelId = document.getElementById("academicYearLevel").value;

    let url = `https://localhost:7064/api/AcademicYear`;

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
            academic_year_name: Name,
            academic_year_level_id: parseInt(levelId)
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
        getData("https://localhost:7064/api/AcademicYear", null);
    });
};

const renderTable = (data) => {
    const table = document.getElementById("tblAcademicYear");
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = ""; 

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = data.slice(start, end);

    paginatedData.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.academic_year_id}</td>
            <td>${item.academic_year_name}</td>
            <td>${item.academic_year_level_name}</td>
            <td>
                <div class="action-buttons">
                    <button class="btnActions" onclick="onEditClick(${item.academic_year_id}, '${item.academic_year_name}', ${item.academic_year_level_id})">Edit</button>
                    <button class="btnActions" onclick="onDeleteClick(${item.academic_year_id})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    //pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(data.length / itemsPerPage)}`;
    document.getElementById('btnPrev').disabled = currentPage === 1;
    document.getElementById('btnNext').disabled = currentPage * itemsPerPage >= data.length;
    padEmptyRows('tblAcademicYear', 10, paginatedData.length);
    updatePageInfo();
}

function padEmptyRows(tableId, itemsPerPage, currentItemCount) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    const missingRows = itemsPerPage - currentItemCount;

    for (let i = 0; i < missingRows; i++) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>&nbsp;</td><td></td><td></td><td></td>`;
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
    await populateSelect("academicYearLevel", "AcademicLevel", "academic_level");
    academicYearIdModal.value = null;
    academicYearNameModal.value = null;
    academicYearLevelModal.value = null;
    isNewItem = true;
    idSpan.style.display = "none";
    editModal.style.display = "flex";
}

const onEditClick = async(id, name, levelId) => {
    await populateSelect("academicYearLevel", "AcademicLevel", "academic_level");

    isNewItem = false;
    currentItem = id;
    academicYearIdModal.value = id;
    academicYearNameModal.value = name;
    academicYearLevelModal.value = levelId;
    idSpan.style.display = "flex";
    editModal.style.display = "flex";
};

const onDeleteClick = (id) => {
    fetch(`https://localhost:7064/api/AcademicYear/${id}`, {
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

    const academicLevelFilter = document.getElementById("academicLevelFilter");
    let academicLevelRawText = academicLevelFilter?.options[academicLevelFilter.selectedIndex]?.textContent?.trim() || "";

    const academicYearText = academicLevelRawText === "--- Select ---" ? "" : academicLevelRawText;

    const filteredData = academicYears.filter(item => {
        const textMatch = item.academic_year_name.toLowerCase().includes(searchValue);
        const selectMatch = !academicYearText || item.academic_year_level_name == academicYearText;

        return textMatch && selectMatch;
    });
    currentPage = 1;
    renderTable(filteredData);
}

const onClearInput = () => {
    document.getElementById("textInputSearch").value = "";
    renderTable(academicYears);
}

const updatePageInfo = () => {
    const pageInfo = document.getElementById("pageInfo");
    const itemCount = document.getElementById("itemNumber");
    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(academicYears.length / itemsPerPage)}`;
    itemCount.textContent = `Total items: ${academicYears.length}`;
}