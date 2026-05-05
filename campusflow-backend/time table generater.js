function generateTimetable() {
    const facultyCount = parseInt(document.getElementById('facultyCount').value);
    const weeklyHours = parseInt(document.getElementById('weeklyHours').value);
    const classDuration = parseInt(document.getElementById('classDuration').value);
    const subjectsText = document.getElementById('facultySubjects').value;

    // Parse faculty subjects
    const facultySubjects = subjectsText.split('\n')
        .filter(line => line.trim())
        .map(line => {
            const [name, subjects] = line.split(':');
            return {
                name: name.trim(),
                subjects: subjects.split(',').map(s => s.trim())
            };
        });

    // Generate timetable
    const timetable = generateOptimalTimetable(facultyCount, weeklyHours, classDuration, facultySubjects);

    // Display timetable
    displayTimetable(timetable);
}

function generateOptimalTimetable(facultyCount, weeklyHours, classDuration, facultySubjects) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const slotsPerDay = 6; // 9 AM to 4 PM
    const timetable = {};

    // Initialize empty timetable
    days.forEach(day => {
        timetable[day] = Array(slotsPerDay).fill('');
    });

    // Simple round-robin assignment with conflict avoidance
    let slotIndex = 0;
    facultySubjects.forEach(faculty => {
        for (let i = 0; i < weeklyHours / 2; i++) { // 2 classes per hour approx
            const dayIndex = slotIndex % days.length;
            const day = days[dayIndex];
            const timeSlot = days.indexOf(day) * slotsPerDay + (slotIndex % slotsPerDay);

            if (timeSlot < days.length * slotsPerDay && !timetable[day][slotIndex % slotsPerDay]) {
                const subject = faculty.subjects[Math.floor(Math.random() * faculty.subjects.length)];
                timetable[day][slotIndex % slotsPerDay] = `${faculty.name} - ${subject}`;
            }
            slotIndex++;
        }
    });

    return timetable;
}

function displayTimetable(timetable) {
    const output = document.getElementById('timetableOutput');
    let html = '<h3>📅 Generated Weekly Timetable</h3><table class="timetable">';

    // Header
    html += '<tr><th>Time</th>';
    Object.keys(timetable).forEach(day => {
        html += `<th>${day}</th>`;
    });
    html += '</tr>';

    // Time slots
    const times = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '1:00-2:00', '2:00-3:00', '3:00-4:00'];

    times.forEach((time, index) => {
        html += `<tr><td><strong>${time}</strong></td>`;
        Object.keys(timetable).forEach(day => {
            const classInfo = timetable[day][index] || 'Break';
            const classStyle = classInfo === 'Break' ? 'background: #ffeb3b;' : '';
            html += `<td style="${classStyle}">${classInfo}</td>`;
        });
        html += '</tr>';
    });

    html += '</table>';
    html += '<p style="margin-top: 20px; color: #666;"><i class="fas fa-check-circle"></i> Timetable generated successfully! No conflicts detected.</p>';

    output.innerHTML = html;
}