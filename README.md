# Atomic Habits Tracker - README

![Atomic Habits Tracker](https://img.shields.io/badge/Atomic-Habits%20Tracker-blue) 
![Version](https://img.shields.io/badge/Version-2.0-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

A comprehensive habit tracking application designed specifically for coders and students, inspired by James Clear's "Atomic Habits" principles. Track your coding and study habits with advanced analytics, streak tracking, and visual progress monitoring.

## 🌟 Features

### 🎯 Core Functionality
- **Daily Habit Tracking**: Log coding, study, and other activities with duration and notes
- **Completion System**: Mark habits as completed to track progress
- **Local Storage**: All data persists in your browser (no account required)

### 📊 Analytics & Visualization
- **Progress Charts**: Interactive bar charts showing daily time investment
- **Habit Distribution**: Doughnut chart visualizing coding vs study vs other activities
- **GitHub-style Calendar**: 90-day contribution heatmap showing activity intensity
- **Monthly Calendar View**: Traditional calendar with habit indicators

### 🔥 Streak System
- **Current Streak Counter**: Real-time tracking of consecutive active days
- **Longest Streak Record**: Personal best achievement tracker
- **Streak Calendar**: Visual representation of your consistency
- **Motivational Messages**: Encouraging feedback based on streak length

### 📈 Summary Reports
- **Weekly Summary**: Total time, active days, and category breakdown for current week
- **Monthly Summary**: Comprehensive monthly progress overview
- **All-Time Statistics**: Lifetime totals and averages

### ⏰ Smart Reminders
- **Customizable Notifications**: Set your preferred reminder time
- **Browser Notifications**: Get reminders even when the app is closed
- **Streak Protection**: Notifications to prevent breaking your streak

### 🔧 Data Management
- **Export/Import**: Backup and restore your data with JSON files
- **Selective Deletion**: Clear today's data or all historical data
- **History View**: Browse and manage past entries

## 🚀 Quick Start

### Method 1: Direct Use
1. Copy the entire HTML code from the provided file
2. Save it as `habit-tracker.html`
3. Open the file in any modern web browser

### Method 2: Online Deployment
You can also host this on:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

## 📖 How to Use

### Adding Habits
1. Fill in the habit name (e.g., "JavaScript Practice")
2. Select the type (Coding, Study, or Other)
3. Set the duration in minutes
4. Add optional notes about what you worked on
5. Click "Add Habit"

### Tracking Progress
- Use the "Complete" button to mark habits as done
- View your daily progress in the "Today's Habits" section
- Monitor streaks in the dedicated streak panel

### Using Analytics
- Switch between tabs to view different data perspectives:
  - **Progress Charts**: Visualize your time investment
  - **Weekly/Monthly Summary**: See aggregated statistics
  - **History Management**: Manage your historical data

### Setting Up Reminders
1. Check "Enable Daily Reminders"
2. Set your preferred reminder time
3. Allow browser notifications when prompted
4. Test with the "Test Notification" button

## 🎨 Customization

### Color Scheme
The application uses CSS variables for easy customization. Modify these values in the `<style>` section:

```css
:root {
    --primary-color: #3a86ff;    /* Main blue */
    --secondary-color: #8338ec;  /* Purple */
    --success-color: #06d6a0;    /* Green */
    --danger-color: #ef476f;     /* Red */
    /* ... more colors */
}
```

### Adding New Habit Types
Edit the `habitType` select element in the HTML to add new categories.

## 💾 Data Management

### Exporting Data
1. Go to the "History Management" tab
2. Click "Export Data"
3. A JSON file will download with all your habit data

### Importing Data
1. Click "Import Data"
2. Select your previously exported JSON file
3. Confirm to replace current data

### Resetting Data
- **Clear Today**: Remove only today's habits
- **Clear All**: Wipe all historical data (irreversible)

## 🔧 Technical Details

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Data Storage
- Uses localStorage API
- No server-side components
- Data remains on your device

### Dependencies
- Font Awesome 6.4.0 (icons)
- Chart.js 3.9.1 (data visualization)
- No other external dependencies

## 🎯 Atomic Habits Principles Applied

This tracker implements key concepts from James Clear's "Atomic Habits":

### 1. Make It Obvious
- Visual progress charts and calendars
- Clear streak counters
- Daily reminder notifications

### 2. Make It Attractive
- Gamified streak system
- Achievement tracking (longest streak)
- Beautiful, intuitive interface

### 3. Make It Easy
- One-click habit logging
- Quick completion tracking
- Mobile-responsive design

### 4. Make It Satisfying
- Immediate visual feedback
- Progress celebration messages
- Achievement milestones

## 🐛 Troubleshooting

### Notifications Not Working
1. Ensure you've clicked "Allow" when the permission prompt appears
2. Check browser settings for notification permissions
3. Verify the app is not blocked in notification settings

### Data Missing After Browser Clear
- The app uses localStorage, which clears with browser history
- Regularly export your data as backup
- Consider using browser sync features

### Performance Issues
- The app is optimized for modern browsers
- Clear old data if the history becomes too large
- Export and reset if experiencing slowdowns

## 🔮 Future Enhancements

Planned features for future versions:
- [ ] Cloud synchronization
- [ ] Multi-device support
- [ ] Advanced goal setting
- [ ] Social sharing features
- [ ] Custom habit templates
- [ ] Productivity analytics

## 🤝 Contributing

This is a standalone HTML application. To contribute:
1. Fork the code
2. Make enhancements
3. Test thoroughly
4. Submit improvements

## 📄 License

MIT License - feel free to use and modify for personal or commercial projects.

## 🙏 Acknowledgments

- Inspired by James Clear's "Atomic Habits"
- Icons by Font Awesome
- Charts by Chart.js
- Design principles from modern web applications

## 📞 Support

For issues or suggestions:
1. Check this README for solutions
2. Review the code comments
3. Test with different browsers

---

**Remember**: Consistency is key! Use this tracker daily to build powerful coding and study habits that compound over time.

*"You do not rise to the level of your goals. You fall to the level of your systems." - James Clear*
