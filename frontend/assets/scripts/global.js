window.addEventListener('DOMContentLoaded', () => {

    if (window.innerWidth < 768) {
      document.body.innerHTML = `
        <div style="display:flex; justify-content:center; align-items:center; height:100vh; text-align:center; padding:20px;">
          <div>
            <h2>Unsupported Screen Size</h2>
            <p>Please use a tablet or desktop to access this system.</p>
          </div>
        </div>
      `;
    }
});

function toggleSidebar() {
    const sidebar = document.getElementById("sidebarMenu");
    sidebar.style.display = (sidebar.style.display === "block") ? "none" : "block";
}

document.getElementById('btnLogout').addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location.href = 'login.html';
});