const itemsPerPage = 10;
let currentPage = 1;
let academicLevels = [];
let isNewItem = false;
let currentItem = null;

const baseURL = "https://student-record-system.runasp.net/api/";

const editModal = document.getElementById("modalPage");
const academicLevelIdModal = document.getElementById("academicLevelId");
const academicLevelNameModal = document.getElementById("academicLevelName");
const idSpan = document.getElementById("IdSpan");

document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem('jwtToken');
    if (!token) {
        window.location.href = 'Login.html';
    }

    getData(`${baseURL}AcademicLevel`, null);

    document.getElementById('btnPrev').addEventListener("click", (event) => {
        event.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderTable(academicLevels);
        }
    });

    document.getElementById('btnNext').addEventListener("click", (event) => {
        event.preventDefault();
        if (currentPage * itemsPerPage < academicLevels.length) {
            currentPage++;
            renderTable(academicLevels);
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
        getData(`${baseURL}AcademicLevel`, null);
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
                academicLevels = data;
                renderTable(academicLevels);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

    } catch (error) {
        console.error("Error fetching grade levels:", error);
    }
};

const formSubmit = (isNew) =>{
    const Id = document.getElementById("academicLevelId").value;
    const Name = document.getElementById("academicLevelName").value;

    let url = `${baseURL}AcademicLevel`;

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
            academic_level_name: Name
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
        getData(`${baseURL}AcademicLevel`, null);
    });
};

const renderTable = (data) => {
    const table = document.getElementById("tblAcademicLevel");
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = ""; 

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = data.slice(start, end);

    paginatedData.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.academic_level_id}</td>
            <td>${item.academic_level_name}</td>
            <td>
                <div class="action-buttons">
                    <button class="btnActions" onclick="onEditClick(${item.academic_level_id}, '${item.academic_level_name}')">Edit</button>
                    <button class="btnActions" onclick="onDeleteClick(${item.academic_level_id})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(data.length / itemsPerPage)}`;
    document.getElementById('btnPrev').disabled = currentPage === 1;
    document.getElementById('btnNext').disabled = currentPage * itemsPerPage >= data.length;
    padEmptyRows('tblAcademicLevel', 10, paginatedData.length);
    updatePageInfo();
}

function padEmptyRows(tableId, itemsPerPage, currentItemCount) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    const missingRows = itemsPerPage - currentItemCount;

    for (let i = 0; i < missingRows; i++) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>&nbsp;</td><td></td><td></td>`;
        tableBody.appendChild(tr);
    }
}

const onAddClick = () => {
    academicLevelIdModal.value = null;
    academicLevelNameModal.value = null;
    isNewItem = true;
    idSpan.style.display = "none";
    editModal.style.display = "flex";
}

const onEditClick = (id, name) => {
    isNewItem = false;
    currentItem = id;
    academicLevelIdModal.value = id;
    academicLevelNameModal.value = name;
    idSpan.style.display = "flex";
    editModal.style.display = "flex";
};

const onDeleteClick = (id) => {
    fetch(`${baseURL}AcademicLevel/${id}`, {
        method: 'DELETE',
        headers:{
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
    const filteredData = academicLevels.filter(item => 
        item.academic_level_name.toLowerCase().includes(searchValue)
    );
    renderTable(filteredData);
}

const onClearInput = () => {
    document.getElementById("textInputSearch").value = "";
    renderTable(academicLevels);
}

const updatePageInfo = () => {
    const pageInfo = document.getElementById("pageInfo");
    const itemCount = document.getElementById("itemNumber");
    pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(academicLevels.length / itemsPerPage)}`;
    itemCount.textContent = `Total items: ${academicLevels.length}`;
}