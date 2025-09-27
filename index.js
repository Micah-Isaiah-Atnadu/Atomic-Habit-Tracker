 // Habit tracker functionality
        document.addEventListener('DOMContentLoaded', function() {
            // DOM elements
            const habitForm = document.getElementById('habitForm');
            const habitsContainer = document.getElementById('habitsContainer');
            const todayCount = document.getElementById('todayCount');
            const weekCount = document.getElementById('weekCount');
            const totalTime = document.getElementById('totalTime');
            const totalHabits = document.getElementById('totalHabits');
            const currentMonth = document.getElementById('currentMonth');
            const calendarGrid = document.getElementById('calendarGrid');
            const currentStreak = document.getElementById('currentStreak');
            const bestStreak = document.getElementById('bestStreak');
            const streakCalendar = document.getElementById('streakCalendar');
            const streakMessage = document.getElementById('streakMessage');
            const enableNotifications = document.getElementById('enableNotifications');
            const reminderTime = document.getElementById('reminderTime');
            const testNotification = document.getElementById('testNotification');
            const tabs = document.querySelectorAll('.tab');
            const tabContents = document.querySelectorAll('.tab-content');
            const clearToday = document.getElementById('clearToday');
            const clearAll = document.getElementById('clearAll');
            const exportData = document.getElementById('exportData');
            const importData = document.getElementById('importData');
            const importFile = document.getElementById('importFile');
            
            // Data storage
            let habits = JSON.parse(localStorage.getItem('habits')) || [];
            let streakData = JSON.parse(localStorage.getItem('streakData')) || {
                currentStreak: 0,
                bestStreak: 0,
                lastActivity: null,
                history: {}
            };
            let notificationSettings = JSON.parse(localStorage.getItem('notificationSettings')) || {
                enabled: false,
                time: "19:00"
            };
            
            // Charts
            let timeChart, habitTypeChart;
            
            // Initialize the app
            initApp();
            
            // Form submission
            habitForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('habitName').value;
                const type = document.getElementById('habitType').value;
                const duration = parseInt(document.getElementById('habitDuration').value);
                const notes = document.getElementById('habitNotes').value;
                
                addHabit(name, type, duration, notes);
                
                // Reset form
                habitForm.reset();
                document.getElementById('habitDuration').value = 30;
            });
            
            // Tab switching
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const tabId = tab.getAttribute('data-tab');
                    
                    tabs.forEach(t => t.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    
                    tab.classList.add('active');
                    document.getElementById(`${tabId}-tab`).classList.add('active');
                });
            });
            
            // Notification settings
            enableNotifications.checked = notificationSettings.enabled;
            reminderTime.value = notificationSettings.time;
            
            enableNotifications.addEventListener('change', function() {
                notificationSettings.enabled = this.checked;
                saveNotificationSettings();
                
                if (this.checked && Notification.permission === 'default') {
                    requestNotificationPermission();
                }
            });
            
            reminderTime.addEventListener('change', function() {
                notificationSettings.time = this.value;
                saveNotificationSettings();
                scheduleNotification();
            });
            
            testNotification.addEventListener('click', function() {
                if (Notification.permission === 'granted') {
                    showNotification('Test Notification', 'This is a test of your habit tracker reminders!');
                } else {
                    requestNotificationPermission();
                }
            });
            
            // History management
            clearToday.addEventListener('click', function() {
                if (confirm('Are you sure you want to clear today\'s data?')) {
                    const today = new Date().toISOString().split('T')[0];
                    habits = habits.filter(habit => habit.date !== today);
                    saveHabits();
                    updateStreak();
                    renderHabits();
                    updateStats();
                    renderCalendar();
                    renderStreakCalendar();
                    updateCharts();
                    updateSummary();
                }
            });
            
            clearAll.addEventListener('click', function() {
                if (confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
                    habits = [];
                    streakData = {
                        currentStreak: 0,
                        bestStreak: 0,
                        lastActivity: null,
                        history: {}
                    };
                    saveHabits();
                    updateStreak();
                    renderHabits();
                    updateStats();
                    renderCalendar();
                    renderStreakCalendar();
                    updateCharts();
                    updateSummary();
                }
            });
            
            exportData.addEventListener('click', function() {
                const data = {
                    habits: habits,
                    streakData: streakData,
                    exportDate: new Date().toISOString()
                };
                
                const dataStr = JSON.stringify(data, null, 2);
                const dataBlob = new Blob([dataStr], {type: 'application/json'});
                
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            });
            
            importData.addEventListener('click', function() {
                importFile.click();
            });
            
            importFile.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const data = JSON.parse(e.target.result);
                        
                        if (confirm('Importing data will replace your current data. Continue?')) {
                            habits = data.habits || [];
                            streakData = data.streakData || {
                                currentStreak: 0,
                                bestStreak: 0,
                                lastActivity: null,
                                history: {}
                            };
                            
                            saveHabits();
                            updateStreak();
                            renderHabits();
                            updateStats();
                            renderCalendar();
                            renderStreakCalendar();
                            updateCharts();
                            updateSummary();
                            
                            alert('Data imported successfully!');
                        }
                    } catch (error) {
                        alert('Error importing data: Invalid file format');
                    }
                };
                reader.readAsText(file);
                importFile.value = '';
            });
            
            function initApp() {
                updateStreak();
                renderHabits();
                updateStats();
                renderCalendar();
                renderStreakCalendar();
                updateCharts();
                updateSummary();
                renderHistory();
                scheduleNotification();
                
                // Request notification permission if needed
                if (notificationSettings.enabled && Notification.permission === 'default') {
                    requestNotificationPermission();
                }
            }
            
            function addHabit(name, type, duration, notes) {
                const habit = {
                    id: Date.now(),
                    name,
                    type,
                    duration,
                    notes,
                    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
                    completed: false,
                    timestamp: new Date().toISOString()
                };
                
                habits.push(habit);
                saveHabits();
                updateStreak();
                renderHabits();
                updateStats();
                renderCalendar();
                renderStreakCalendar();
                updateCharts();
                updateSummary();
                renderHistory();
            }
            
            function completeHabit(id) {
                habits = habits.map(habit => {
                    if (habit.id === id) {
                        return { ...habit, completed: true };
                    }
                    return habit;
                });
                
                saveHabits();
                renderHabits();
                updateStats();
                updateCharts();
                updateSummary();
            }
            
            function deleteHabit(id) {
                habits = habits.filter(habit => habit.id !== id);
                saveHabits();
                updateStreak();
                renderHabits();
                updateStats();
                renderCalendar();
                renderStreakCalendar();
                updateCharts();
                updateSummary();
                renderHistory();
            }
            
            function saveHabits() {
                localStorage.setItem('habits', JSON.stringify(habits));
                localStorage.setItem('streakData', JSON.stringify(streakData));
            }
            
            function saveNotificationSettings() {
                localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
            }
            
            function updateStreak() {
                const today = new Date().toISOString().split('T')[0];
                const todayHabits = habits.filter(habit => habit.date === today);
                
                // If we have habits today, update streak
                if (todayHabits.length > 0) {
                    const lastActivity = streakData.lastActivity ? new Date(streakData.lastActivity) : null;
                    const todayDate = new Date(today);
                    
                    // If last activity was yesterday, increment streak
                    if (lastActivity) {
                        const yesterday = new Date(todayDate);
                        yesterday.setDate(yesterday.getDate() - 1);
                        
                        if (lastActivity.toDateString() === yesterday.toDateString()) {
                            streakData.currentStreak += 1;
                        } else if (lastActivity.toDateString() !== todayDate.toDateString()) {
                            // If we skipped days, reset streak
                            streakData.currentStreak = 1;
                        }
                    } else {
                        // First habit ever
                        streakData.currentStreak = 1;
                    }
                    
                    // Update best streak if needed
                    if (streakData.currentStreak > streakData.bestStreak) {
                        streakData.bestStreak = streakData.currentStreak;
                    }
                    
                    // Update last activity date
                    streakData.lastActivity = today;
                    
                    // Update history
                    streakData.history[today] = true;
                    
                    saveHabits();
                }
                
                // Update streak display
                currentStreak.textContent = `${streakData.currentStreak} day${streakData.currentStreak !== 1 ? 's' : ''}`;
                bestStreak.textContent = `${streakData.bestStreak} day${streakData.bestStreak !== 1 ? 's' : ''}`;
                
                // Update streak message
                if (streakData.currentStreak === 0) {
                    streakMessage.textContent = "Start a new streak today! Every journey begins with a single step.";
                } else if (streakData.currentStreak < 7) {
                    streakMessage.textContent = "Good start! Keep building momentum with daily consistency.";
                } else if (streakData.currentStreak < 21) {
                    streakMessage.textContent = "Great job! You're building a solid habit. Don't break the chain!";
                } else {
                    streakMessage.textContent = "Amazing! You've mastered consistency. This habit is becoming automatic.";
                }
            }
            
            function renderStreakCalendar() {
                streakCalendar.innerHTML = '';
                
                // Create last 90 days in a GitHub-style grid
                const today = new Date();
                const days = [];
                
                // Start from 89 days ago to today (90 days total)
                for (let i = 89; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    days.push(date);
                }
                
                // Group by weeks
                const weeks = [];
                let currentWeek = [];
                
                days.forEach((day, index) => {
                    currentWeek.push(day);
                    
                    // If it's Sunday or the last day, end the week
                    if (day.getDay() === 0 || index === days.length - 1) {
                        weeks.push(currentWeek);
                        currentWeek = [];
                    }
                });
                
                // Create the grid
                weeks.forEach(week => {
                    week.forEach(day => {
                        const dateString = day.toISOString().split('T')[0];
                        const dayElement = document.createElement('div');
                        dayElement.className = 'streak-day';
                        
                        if (streakData.history[dateString]) {
                            dayElement.classList.add('active');
                            
                            // Add intensity based on number of habits that day
                            const dayHabits = habits.filter(habit => habit.date === dateString);
                            if (dayHabits.length >= 3) {
                                dayElement.style.backgroundColor = '#006d32'; // Dark green for high activity
                            } else if (dayHabits.length >= 2) {
                                dayElement.style.backgroundColor = '#26a641'; // Medium green for medium activity
                            }
                        }
                        
                        if (dateString === today.toISOString().split('T')[0]) {
                            dayElement.classList.add('current');
                        }
                        
                        const habitCount = habits.filter(habit => habit.date === dateString).length;
                        dayElement.title = `${day.toLocaleDateString()} - ${habitCount} habit${habitCount !== 1 ? 's' : ''}`;
                        streakCalendar.appendChild(dayElement);
                    });
                    
                    // Add a spacer after each week for readability
                    const spacer = document.createElement('div');
                    spacer.style.width = '5px';
                    streakCalendar.appendChild(spacer);
                });
            }
            
            function renderHabits() {
                const today = new Date().toISOString().split('T')[0];
                const todayHabits = habits.filter(habit => habit.date === today);
                
                habitsContainer.innerHTML = '';
                
                if (todayHabits.length === 0) {
                    habitsContainer.innerHTML = '<p>No habits added for today. Start by adding one above!</p>';
                    return;
                }
                
                todayHabits.forEach(habit => {
                    const habitElement = document.createElement('div');
                    habitElement.className = `habit-item ${habit.completed ? 'completed' : ''}`;
                    habitElement.innerHTML = `
                        <div class="habit-info">
                            <div class="habit-name">${habit.name}</div>
                            <div class="habit-details">
                                ${habit.type} • ${habit.duration} minutes • ${habit.notes || 'No notes'}
                            </div>
                        </div>
                        <div class="habit-actions">
                            ${!habit.completed ? 
                                `<button class="btn-complete" onclick="completeHabit(${habit.id})">Complete</button>` : 
                                ''}
                            <button class="btn-delete" onclick="deleteHabit(${habit.id})">Delete</button>
                        </div>
                    `;
                    
                    habitsContainer.appendChild(habitElement);
                });
            }
            
            function updateStats() {
                const today = new Date().toISOString().split('T')[0];
                const todayHabits = habits.filter(habit => habit.date === today);
                
                // Calculate start of week (Monday)
                const now = new Date();
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
                startOfWeek.setHours(0, 0, 0, 0);
                
                const weekHabits = habits.filter(habit => {
                    const habitDate = new Date(habit.date);
                    return habitDate >= startOfWeek;
                });
                
                const totalMinutes = habits.reduce((total, habit) => total + habit.duration, 0);
                
                todayCount.textContent = todayHabits.length;
                weekCount.textContent = weekHabits.length;
                totalTime.textContent = totalMinutes;
                totalHabits.textContent = habits.length;
            }
            
            function updateCharts() {
                // Destroy existing charts if they exist
                if (timeChart) timeChart.destroy();
                if (habitTypeChart) habitTypeChart.destroy();
                
                // Prepare data for the time chart (last 7 days)
                const last7Days = [];
                for (let i = 6; i >= 0; i--) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    last7Days.push(date.toISOString().split('T')[0]);
                }
                
                const dailyData = last7Days.map(date => {
                    const dayHabits = habits.filter(habit => habit.date === date);
                    return dayHabits.reduce((total, habit) => total + habit.duration, 0);
                });
                
                const dailyLabels = last7Days.map(date => {
                    const d = new Date(date);
                    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                });
                
                // Time chart
                const timeCtx = document.getElementById('timeChart').getContext('2d');
                timeChart = new Chart(timeCtx, {
                    type: 'bar',
                    data: {
                        labels: dailyLabels,
                        datasets: [{
                            label: 'Minutes per Day',
                            data: dailyData,
                            backgroundColor: 'rgba(58, 134, 255, 0.7)',
                            borderColor: 'rgba(58, 134, 255, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Minutes'
                                }
                            }
                        }
                    }
                });
                
                // Habit type chart
                const codingTime = habits.filter(h => h.type === 'coding').reduce((total, habit) => total + habit.duration, 0);
                const studyTime = habits.filter(h => h.type === 'study').reduce((total, habit) => total + habit.duration, 0);
                const otherTime = habits.filter(h => h.type === 'other').reduce((total, habit) => total + habit.duration, 0);
                
                const typeCtx = document.getElementById('habitTypeChart').getContext('2d');
                habitTypeChart = new Chart(typeCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Coding', 'Study', 'Other'],
                        datasets: [{
                            data: [codingTime, studyTime, otherTime],
                            backgroundColor: [
                                'rgba(58, 134, 255, 0.7)',
                                'rgba(6, 214, 160, 0.7)',
                                'rgba(131, 56, 236, 0.7)'
                            ],
                            borderColor: [
                                'rgba(58, 134, 255, 1)',
                                'rgba(6, 214, 160, 1)',
                                'rgba(131, 56, 236, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }
                });
            }
            
            function updateSummary() {
                const now = new Date();
                
                // Weekly summary
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
                startOfWeek.setHours(0, 0, 0, 0);
                
                const weekHabits = habits.filter(habit => {
                    const habitDate = new Date(habit.date);
                    return habitDate >= startOfWeek;
                });
                
                const weekStudyTime = weekHabits.filter(h => h.type === 'study').reduce((total, habit) => total + habit.duration, 0);
                const weekCodingTime = weekHabits.filter(h => h.type === 'coding').reduce((total, habit) => total + habit.duration, 0);
                const weekActiveDays = new Set(weekHabits.map(h => h.date)).size;
                
                document.getElementById('weekStudyTime').textContent = weekStudyTime;
                document.getElementById('weekCodingTime').textContent = weekCodingTime;
                document.getElementById('weekActiveDays').textContent = weekActiveDays;
                
                // Monthly summary
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const monthHabits = habits.filter(habit => {
                    const habitDate = new Date(habit.date);
                    return habitDate >= startOfMonth;
                });
                
                const monthStudyTime = monthHabits.filter(h => h.type === 'study').reduce((total, habit) => total + habit.duration, 0);
                const monthCodingTime = monthHabits.filter(h => h.type === 'coding').reduce((total, habit) => total + habit.duration, 0);
                const monthActiveDays = new Set(monthHabits.map(h => h.date)).size;
                
                document.getElementById('monthStudyTime').textContent = monthStudyTime;
                document.getElementById('monthCodingTime').textContent = monthCodingTime;
                document.getElementById('monthActiveDays').textContent = monthActiveDays;
                
                // All time summary
                const allTimeHabits = habits.length;
                const allTimeMinutes = habits.reduce((total, habit) => total + habit.duration, 0);
                const uniqueDays = new Set(habits.map(h => h.date)).size;
                const avgDaily = uniqueDays > 0 ? Math.round(allTimeMinutes / uniqueDays) : 0;
                
                document.getElementById('allTimeHabits').textContent = allTimeHabits;
                document.getElementById('allTimeMinutes').textContent = allTimeMinutes;
                document.getElementById('avgDaily').textContent = avgDaily;
            }
            
            function renderHistory() {
                const historyList = document.getElementById('historyList');
                historyList.innerHTML = '';
                
                if (habits.length === 0) {
                    historyList.innerHTML = '<p>No habit history yet.</p>';
                    return;
                }
                
                // Group habits by date
                const habitsByDate = {};
                habits.forEach(habit => {
                    if (!habitsByDate[habit.date]) {
                        habitsByDate[habit.date] = [];
                    }
                    habitsByDate[habit.date].push(habit);
                });
                
                // Sort dates descending
                const sortedDates = Object.keys(habitsByDate).sort((a, b) => new Date(b) - new Date(a));
                
                // Display history
                sortedDates.forEach(date => {
                    const dateHeader = document.createElement('h3');
                    dateHeader.textContent = new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    });
                    
                    const dateSection = document.createElement('div');
                    dateSection.className = 'history-date-section';
                    dateSection.appendChild(dateHeader);
                    
                    habitsByDate[date].forEach(habit => {
                        const habitElement = document.createElement('div');
                        habitElement.className = `habit-item ${habit.completed ? 'completed' : ''}`;
                        habitElement.innerHTML = `
                            <div class="habit-info">
                                <div class="habit-name">${habit.name}</div>
                                <div class="habit-details">
                                    ${habit.type} • ${habit.duration} minutes • ${habit.notes || 'No notes'}
                                </div>
                            </div>
                            <div class="habit-actions">
                                <button class="btn-delete" onclick="deleteHabit(${habit.id})">Delete</button>
                            </div>
                        `;
                        dateSection.appendChild(habitElement);
                    });
                    
                    historyList.appendChild(dateSection);
                });
            }
            
            function renderCalendar() {
                const now = new Date();
                const year = now.getFullYear();
                const month = now.getMonth();
                
                currentMonth.textContent = now.toLocaleString('default', { month: 'long', year: 'numeric' });
                
                // Get first day of month and number of days
                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);
                const daysInMonth = lastDay.getDate();
                
                // Create calendar header (days of week)
                calendarGrid.innerHTML = '';
                
                const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                daysOfWeek.forEach(day => {
                    const dayElement = document.createElement('div');
                    dayElement.className = 'calendar-day header';
                    dayElement.textContent = day;
                    calendarGrid.appendChild(dayElement);
                });
                
                // Add empty cells for days before the first day of the month
                for (let i = 0; i < firstDay.getDay(); i++) {
                    const emptyElement = document.createElement('div');
                    emptyElement.className = 'calendar-day empty';
                    calendarGrid.appendChild(emptyElement);
                }
                
                // Add days of the month
                for (let day = 1; day <= daysInMonth; day++) {
                    const dayElement = document.createElement('div');
                    dayElement.className = 'calendar-day';
                    dayElement.textContent = day;
                    
                    // Check if there are habits for this day
                    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayHabits = habits.filter(habit => habit.date === dateString);
                    
                    if (dayHabits.length > 0) {
                        dayElement.classList.add('has-habit');
                        dayElement.title = `${dayHabits.length} habit(s) on this day`;
                    }
                    
                    calendarGrid.appendChild(dayElement);
                }
            }
            
            function requestNotificationPermission() {
                if ('Notification' in window) {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            console.log('Notification permission granted');
                        }
                    });
                }
            }
            
            function showNotification(title, body) {
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification(title, {
                        body: body,
                        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iIzNhODZmZiIvPgo8cGF0aCBkPSJNMzIgMTZDMzYuNDE4MyAxNiA0MCAxOS41ODE3IDQwIDI0VjM0QzQwIDM0LjU1MjMgNDAuNDQ3NyAzNSA0MSAzNUM0Mi42NTQzIDM1IDQ0IDMzLjY1NDMgNDQgMzJDMzIgMzIgMzIgMTYgMzIgMTZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzIgNDhDzNC4yMDkwMSA0OCAzNiA0Ni4yMDkgMzYgNDRIMjhDMjggNDYuMjA5IDI5Ljc5MDkgNDggMzIgNDhaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'
                    });
                }
            }
            
            function scheduleNotification() {
                // Clear any existing notifications
                if (window.notificationTimer) {
                    clearTimeout(window.notificationTimer);
                }
                
                if (!notificationSettings.enabled) return;
                
                const now = new Date();
                const [hours, minutes] = notificationSettings.time.split(':').map(Number);
                const notificationTime = new Date();
                notificationTime.setHours(hours, minutes, 0, 0);
                
                // If the notification time has already passed today, schedule for tomorrow
                if (notificationTime <= now) {
                    notificationTime.setDate(notificationTime.getDate() + 1);
                }
                
                const timeUntilNotification = notificationTime.getTime() - now.getTime();
                
                window.notificationTimer = setTimeout(() => {
                    // Check if we've already logged today
                    const today = new Date().toISOString().split('T')[0];
                    const todayHabits = habits.filter(habit => habit.date === today);
                    
                    if (todayHabits.length === 0) {
                        showNotification('Atomic Habits Reminder', 'Don\'t break your streak! Log your coding or study time today.');
                    }
                    
                    // Schedule the next notification
                    scheduleNotification();
                }, timeUntilNotification);
            }
            
            // Make functions available globally for onclick handlers
            window.completeHabit = completeHabit;
            window.deleteHabit = deleteHabit;
        });