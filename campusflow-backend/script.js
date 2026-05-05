let currentUser = null;
let currentRole = null;
let charts = {};

// Mock data
const mockData = {
    students: {
        'student1': { attendance: 95, classes: ['Math 101', 'Physics'] }
    },
    faculty: {
        'faculty1': { classes: ['Math 101'], leave: false }
    },
    attendance: {
        Math101: { present: 25, total: 30 },
        Physics: { present: 28, total: 30 }
    }
};

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    if (username && password === '123') {
        currentUser = username;
        currentRole = role;
        document.getElementById('loginModal').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        document.getElementById('userInfo').textContent = `Welcome, ${role === 'admin' ? 'Admin' : role.charAt(0).toUpperCase() + role.slice(1)}`;
        initDashboard();
    } else {
        alert('Invalid credentials! Use password: 123');
    }
}

function logout() {
    currentUser = null;
    currentRole = null;
    document.getElementById('app').classList.add('hidden');
    document.getElementById('loginModal').classList.remove('hidden');
    document.getElementById('username').value = 'student1';
    document.getElementById('password').value = '123';
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section, .dashboard-grid').forEach(el => {
        el.classList.add('hidden');
    });

    // Show target section
    document.getElementById(sectionId).classList.remove('hidden');

    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.target.classList.add('active');
}

function showDashboard() {
    showSection(currentRole === 'admin' ? 'adminDashboard' :
        currentRole === 'faculty' ? 'facultyDashboard' : 'studentDashboard');
    document.getElementById('pageTitle').textContent = 'Dashboard';
}

function showAttendance() {
    showSection('studentDashboard');
    document.getElementById('pageTitle').textContent = 'Attendance';
}

function showSchedule() {
    showSection('studentDashboard');
    document.getElementById('pageTitle').textContent = 'Schedule';
}

function showAIAssistant() {
    showSection('aiAssistant');
    document.getElementById('pageTitle').textContent = 'AI Study Assistant';
}

function showTimetable() {
    showSection('timetableSection');
    document.getElementById('pageTitle').textContent = 'Timetable Generator';
}

function showLeave() {
    if (currentRole === 'faculty') {
        showSection('facultyDashboard');
    }
    document.getElementById('pageTitle').textContent = 'Leave Management';
}

function markAttendance() {
    alert('Attendance marked successfully!');
}

function markAbsent() {
    alert('Absent marked successfully!');
}

function applyLeave() {
    alert('Leave application submitted!');
}

function initDashboard() {
    if (currentRole === 'student') {
        initStudentCharts();
    } else if (currentRole === 'admin') {
        initAdminCharts();
    }
}

function initStudentCharts() {
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    charts.attendance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Present', 'Absent'],
            datasets: [{
                data: [95, 5],
                backgroundColor: ['#4ecdc4', '#ff6b6b']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function initAdminCharts() {
    // Attendance Chart
    const ctx1 = document.getElementById('adminAttendanceChart').getContext('2d');
    charts.adminAttendance = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['Math', 'Physics', 'Chemistry', 'English'],
            datasets: [{
                label: 'Attendance %',
                data: [95, 92, 88, 94],
                backgroundColor: '#667eea'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // Productivity Chart
    const ctx2 = document.getElementById('productivityChart').getContext('2d');
    charts.productivity = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [{
                label: 'Classes Conducted',
                data: [5, 6, 4, 7, 5],
                borderColor: '#4ecdc4',
                fill: false
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// Voice Recognition
let recognition = null;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
}

function toggleVoice() {
    const btn = document.getElementById('voiceBtn');
    if (!recognition) {
        alert('Voice recognition not supported in this browser');
        return;
    }

    if (btn.classList.contains('listening')) {
        recognition.stop();
        btn.classList.remove('listening');
    } else {
        recognition.start();
        btn.classList.add('listening');
        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('aiInput').value = transcript;
            sendMessage();
            btn.classList.remove('listening');
        };
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    // Enter key for AI input
    document.getElementById('aiInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') sendMessage();
    });
});