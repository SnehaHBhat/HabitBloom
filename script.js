
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
    // Re-query checkboxes every time so new habits are included
    const habitCheckboxes = document.querySelectorAll('.habit-item input[type="checkbox"]');
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


/* =============================================
   FEATURE 4: INDEX.HTML — FORM VALIDATION

   How it works:
   - When the user clicks Start My Journey
     we check the name field is not empty
   - If empty we show an error message
     below the field instead of submitting
   - If valid we show a welcome message
     before moving to tracker.html
   ============================================= */

const indexForm = document.getElementById('setup') ? document.getElementById('setup').querySelector('form') : null;

if (indexForm) {
  // Get the name input field
  const userNameInput = document.getElementById('userName');

  indexForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Remove any existing error message first
    const existingError = document.getElementById('name-error');
    if (existingError) existingError.remove();

    const nameValue = userNameInput.value.trim();

    // Check if name field is empty
    if (nameValue === '') {
      // Create and show an error message below the input
      const error = document.createElement('p');
      error.id = 'name-error';
      error.textContent = '⚠️ Please enter your name to get started!';
      error.style.color = '#e05c7e';
      error.style.fontWeight = 'bold';
      error.style.marginTop = '0.5rem';
      userNameInput.insertAdjacentElement('afterend', error);
      // Focus back on the name field
      userNameInput.focus();
      return;
    }

    // Name is valid — show a brief welcome message then go to tracker
    alert('🌱 Welcome to HabitBloom, ' + nameValue + '! Let\'s build some habits!');
    indexForm.submit();
  });

  // Remove error message as soon as user starts typing
  userNameInput.addEventListener('input', function () {
    const existingError = document.getElementById('name-error');
    if (existingError) existingError.remove();
  });
}


/* =============================================
   FEATURE 5: ABOUT.HTML — CONTACT FORM
   VALIDATION + CONFIRMATION

   How it works:
   - Checks name, email and message are filled
   - Shows individual error messages under
     each empty field
   - On success removes the form and shows
     a thank you confirmation message
   ============================================= */

const contactForm = document.getElementById('contact') ? document.getElementById('contact').querySelector('form') : null;

if (contactForm) {

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Remove all existing error messages first
    document.querySelectorAll('.field-error').forEach(function (el) { el.remove(); });

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    let hasError = false;

    // Validate name
    if (name === '') {
      showFieldError('contactName', '⚠️ Please enter your name.');
      hasError = true;
    }

    // Validate email
    if (email === '') {
      showFieldError('contactEmail', '⚠️ Please enter your email address.');
      hasError = true;
    } else if (!email.includes('@') || !email.includes('.')) {
      showFieldError('contactEmail', '⚠️ Please enter a valid email address.');
      hasError = true;
    }

    // Validate message
    if (message === '') {
      showFieldError('contactMessage', '⚠️ Please write a message before sending.');
      hasError = true;
    }

    // If any errors stop here
    if (hasError) return;

    // All fields valid — hide the form and show confirmation
    contactForm.style.display = 'none';

    const confirmation = document.createElement('div');
    confirmation.id = 'confirmation-message';
    confirmation.innerHTML = `
      <h4>📬 Message Sent!</h4>
      <p>Thank you <strong>${name}</strong>! We received your message and will get back to you at <strong>${email}</strong> soon.</p>
    `;
    confirmation.style.backgroundColor = '#e8f5e9';
    confirmation.style.border = '2px solid #4caf7d';
    confirmation.style.borderRadius = '8px';
    confirmation.style.padding = '1.5rem';
    confirmation.style.marginTop = '1rem';
    confirmation.style.color = '#2d6a4f';

    contactForm.insertAdjacentElement('afterend', confirmation);
  });

  // Helper function to show an error under a specific field
  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.createElement('p');
    error.classList.add('field-error');
    error.textContent = message;
    error.style.color = '#e05c7e';
    error.style.fontSize = '0.9rem';
    error.style.marginTop = '0.3rem';
    field.insertAdjacentElement('afterend', error);
  }

  // Clear field errors as user types
  ['contactName', 'contactEmail', 'contactMessage'].forEach(function (id) {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener('input', function () {
        const nextEl = field.nextElementSibling;
        if (nextEl && nextEl.classList.contains('field-error')) {
          nextEl.remove();
        }
      });
    }
  });
}


/* =============================================
   FEATURE 6: PROGRESS.HTML — DYNAMIC STATS

   How it works:
   - Reads the completion rate from each
     progress bar on the page
   - Calculates the overall average completion
   - Updates the Quick Stats sidebar with
     live calculated numbers
   ============================================= */

const progressPage = document.getElementById('completion-rates');

if (progressPage) {

  // Get all progress bars in the completion rates section
  const progressBars = progressPage.querySelectorAll('progress');

  let totalCompletion = 0;
  let barCount = progressBars.length;

  // Calculate total completion across all habits
  progressBars.forEach(function (bar) {
    const percentage = (bar.value / bar.max) * 100;
    totalCompletion += percentage;
  });

  // Calculate the average completion rate
  const averageCompletion = barCount > 0 ? Math.round(totalCompletion / barCount) : 0;

  // Find the quick stats aside and update the average
  const quickStats = document.querySelector('#progress-page aside ul');

  if (quickStats) {
    // Add a dynamically calculated average completion rate to the stats
    const newStat = document.createElement('li');
    newStat.innerHTML = '📊 <strong>Average completion rate:</strong> ' + averageCompletion + '%';
    quickStats.appendChild(newStat);
  }

  // Highlight habits that have 100% completion in green
  progressBars.forEach(function (bar) {
    if (bar.value === bar.max) {
      const parentArticle = bar.closest('article');
      if (parentArticle) {
        parentArticle.style.borderLeftColor = '#f78da7';
        const title = parentArticle.querySelector('h4');
        if (title) {
          title.textContent = title.textContent + ' 🏆';
        }
      }
    }
  });
}