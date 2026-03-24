
// Wait for the page to fully load before running any JavaScript
document.addEventListener('DOMContentLoaded', function () {

  // --- STEP 1: Get the progress bar and its text from the page ---
  // These match the id="dailyProgress" in tracker.html
  const progressBar = document.getElementById('dailyProgress');
  const progressText = document.querySelector('#daily-progress small');

  // --- STEP 2: Find all habit checkboxes on the page ---
  // querySelectorAll finds every checkbox inside habit articles
  const habitCheckboxes = document.querySelectorAll('.habit-item input[type="checkbox"]');

  // --- STEP 3: Function to update progress bar ---
  function updateProgress() {
    // Count how many checkboxes are currently checked
    let completedCount = 0;
    habitCheckboxes.forEach(function (checkbox) {
      if (checkbox.checked) {
        completedCount++;
      }
    });

    // Get total number of habits (checked + unchecked)
    const totalCount = habitCheckboxes.length;

    // Update the progress bar value
    progressBar.value = completedCount;
    progressBar.max = totalCount;

    // Update the text below the progress bar
    progressText.textContent = completedCount + ' out of ' + totalCount + ' habits completed today';

    // Check if all habits are done
    checkAllComplete(completedCount, totalCount);
  }

  // --- STEP 4: Listen for clicks on every checkbox ---
  habitCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      updateProgress();

      // Strike through the habit title when checked
      const habitCard = checkbox.closest('.habit-item');
      const habitTitle = habitCard.querySelector('h4');
      if (checkbox.checked) {
        habitTitle.style.textDecoration = 'line-through';
        habitTitle.style.color = '#999';
      } else {
        habitTitle.style.textDecoration = 'none';
        habitTitle.style.color = '';
      }
    });
  });


  /* =============================================
     FEATURE 2: COMPLETION MESSAGE
     
     How it works:
     - When all habits are checked a
       congratulations message appears
     - When any habit is unchecked the
       message disappears again
     ============================================= */

  function checkAllComplete(completed, total) {
    // Look for an existing message so we don't add duplicates
    let existingMessage = document.getElementById('completion-message');

    if (completed === total && total > 0) {
      // All habits done — show the message if not already there
      if (!existingMessage) {
        // Create a new paragraph element for the message
        const message = document.createElement('p');
        message.id = 'completion-message';
        message.textContent = '🎉 Amazing! You completed all your habits today! Keep it up!';
        // Style the message directly with JavaScript
        message.style.backgroundColor = '#e8f5e9';
        message.style.color = '#2d6a4f';
        message.style.padding = '1rem';
        message.style.borderRadius = '8px';
        message.style.fontWeight = 'bold';
        message.style.marginTop = '1rem';
        message.style.border = '2px solid #4caf7d';
        message.style.textAlign = 'center';

        // Insert the message after the progress bar section
        const progressSection = document.getElementById('daily-progress');
        progressSection.appendChild(message);
      }
    } else {
      // Not all done — remove the message if it exists
      if (existingMessage) {
        existingMessage.remove();
      }
    }
  }


  /* =============================================
     FEATURE 3: ADD NEW HABIT FORM
     
     How it works:
     - User fills in the habit name and category
     - Clicks Add Habit button
     - A new habit card appears in the list
     - The progress bar updates to include
       the new habit
     - The form clears after adding
     ============================================= */

  // Get the add habit form
  const addHabitForm = document.getElementById('add-habit').querySelector('form');

  // Listen for the form submission
  addHabitForm.addEventListener('submit', function (e) {
    // Prevent the page from reloading when form is submitted
    e.preventDefault();

    // Get the values the user typed in
    const habitName = document.getElementById('habitName').value.trim();
    const habitCategory = document.getElementById('habitCategory').value;
    const habitNote = document.getElementById('habitNote').value.trim();

    // Don't add if the name field is empty
    if (habitName === '') {
      alert('Please enter a habit name!');
      return;
    }

    // Pick an emoji based on the category selected
    const categoryEmojis = {
      health: '💪',
      mind: '🧠',
      learning: '📚',
      social: '🤝',
      other: '✨'
    };
    const emoji = categoryEmojis[habitCategory] || '✨';

    // Create a unique id for the new checkbox
    const newId = 'habit' + Date.now();

    // --- Build the new habit card HTML ---
    const newHabit = document.createElement('article');
    newHabit.classList.add('habit-item');
    newHabit.innerHTML = `
      <h4>${emoji} ${habitName}</h4>
      ${habitNote ? '<p>' + habitNote + '</p>' : ''}
      <input type="checkbox" id="${newId}" name="${newId}" />
      <label for="${newId}">Mark as completed</label>
    `;

    // Add a divider before the new card
    const divider = document.createElement('hr');

    // Find the habit list section and add the new card to it
    const habitList = document.getElementById('habit-list');
    habitList.appendChild(divider);
    habitList.appendChild(newHabit);

    // Add checkbox event listener to the new habit card
    const newCheckbox = newHabit.querySelector('input[type="checkbox"]');
    newCheckbox.addEventListener('change', function () {
      updateProgress();
      const habitTitle = newHabit.querySelector('h4');
      if (newCheckbox.checked) {
        habitTitle.style.textDecoration = 'line-through';
        habitTitle.style.color = '#999';
      } else {
        habitTitle.style.textDecoration = 'none';
        habitTitle.style.color = '';
      }
    });

    // Update the progress bar to include the new habit
    updateProgress();

    // Clear the form fields after adding
    addHabitForm.reset();

    // Show a quick confirmation message
    alert('✅ "' + habitName + '" has been added to your habits!');
  });

}); // End of DOMContentLoaded