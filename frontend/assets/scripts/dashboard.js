// Initialize Charts
let courseChart, genderChart, levelChart;

document.addEventListener('DOMContentLoaded', function () {

  const token = localStorage.getItem('jwtToken');
  if (!token) {
    window.location.href = 'login.html';
  }

  const courseCtx = document.getElementById('studentsPerCourseChart').getContext('2d');
  const genderCtx = document.getElementById('studentsPerGenderChart').getContext('2d');
  const levelCtx = document.getElementById('studentsPerLevelChart').getContext('2d');


  courseChart = new Chart(courseCtx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Students per Course',
        data: [],
        backgroundColor: '#4e73df'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  genderChart = new Chart(genderCtx, {
    type: 'pie',
    data: {
      labels: [],
      datasets: [{
        label: 'Gender Distribution',
        data: [],
        backgroundColor: ['#36a2eb', '#ff6384', '#f6c23e']
      }]
    },
    options: {
      responsive: true
    }
  });

  levelChart = new Chart(levelCtx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Students per Academic Level',
        data: [],
        backgroundColor: '#1cc88a'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  loadCourseData();
  loadGenderData();
  loadLevelData();
});

function loadCourseData() {
  fetch('https://localhost:7064/api/Chart/students-per-course', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
    }
  })
    .then(res => res.json())
    .then(data => {
      courseChart.data.labels = data.map(d => d.course);
      courseChart.data.datasets[0].data = data.map(d => d.count);
      courseChart.update();
    })
    .catch(err => console.error('Error loading course data:', err));
}

function loadGenderData() {
  fetch('https://localhost:7064/api/Chart/students-per-gender', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
    }
  })
    .then(res => res.json())
    .then(data => {
      genderChart.data.labels = data.map(d => d.gender);
      genderChart.data.datasets[0].data = data.map(d => d.count);
      genderChart.update();
    })
    .catch(err => console.error('Error loading gender data:', err));
}

function loadLevelData() {
  fetch('https://localhost:7064/api/Chart/students-per-level', {
    headers: {
    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
    }
  })
    .then(res => res.json())
    .then(data => {
      levelChart.data.labels = data.map(d => d.level);
      levelChart.data.datasets[0].data = data.map(d => d.count);
      levelChart.update();
    })
    .catch(err => console.error('Error loading academic level data:', err));
}
