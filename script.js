const moodButtons = document.querySelectorAll(".moods button");
const saveButton = document.querySelector(".save-btn");
const journalText = document.querySelector("textarea");
const entriesContainer = document.querySelector("#entries");
const moodGreeting = document.querySelector("#mood-greeting");
const moodCount = document.querySelector("#mood-count");
const darkModeButton = document.querySelector("#dark-mode-btn");
const clearButton = document.querySelector("#clear-btn");



let selectedMood = "";
let editingIndex = null;



const greetings = {
    Happy: "Yayyy! Keep that beautiful energy going! 💗",
    Calm: "Enjoy this peaceful moment. 🌿",
    Okay: "It's okay to simply be okay. 🌷",
    Sad: "Be gentle with yourself today. 💗",
    Frustrated: "Take a breath. You've got this. 🌸",
    Tired: "Rest is important too. 💤"
}

moodButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        moodButtons.forEach(function(btn) {
            btn.classList.remove("selected");
        });

        button.classList.add("selected");

        selectedMood = button.querySelector("span").textContent;

        moodGreeting.textContent = greetings[selectedMood];
    });

});



saveButton.addEventListener("click", function() {

    if (selectedMood === "") {
        alert("Please choose a mood first 🌷");
        return;
    }

    if (journalText.value.trim() === "") {
        alert("Write something about your day first 💭");
        return;
    }

    let entries = JSON.parse(
        localStorage.getItem("moodEntries")
    ) || [];


    if (editingIndex !== null) {

        entries[editingIndex].mood = selectedMood;
        entries[editingIndex].text = journalText.value;

        editingIndex = null;

        saveButton.textContent = "Save Entry 💗";

    }

    
    else {

        const entry = {
            mood: selectedMood,
            text: journalText.value,
            date: new Date().toLocaleString()
        };

        entries.unshift(entry);
    }

    
    localStorage.setItem(
        "moodEntries",
        JSON.stringify(entries)
    );


    
    journalText.value = "";

    moodButtons.forEach(function(btn) {
        btn.classList.remove("selected");
    });

    selectedMood = "";

    moodGreeting.textContent =
        "Choose a mood and I'll be here with you. 🌷";


    
    displayEntries();
    displayMoodSummary();

});



function displayEntries() {

    entriesContainer.innerHTML = "";

    let entries = JSON.parse(
        localStorage.getItem("moodEntries")
    ) || [];


    
    if (entries.length === 0) {

        entriesContainer.innerHTML = `
            <p class="empty-message">
                No entries yet 🌷<br>
                Start by writing about your day.
            </p>
        `;

        return;
    }


    
    entries.forEach(function(entry, index) {

        const entryElement =
            document.createElement("div");

        entryElement.classList.add("entry");

        entryElement.innerHTML = `
            <h3>${entry.mood} • ${entry.date}</h3>

            <p>${entry.text}</p>

            <button class="edit-btn">
                Edit ✏️
            </button>

            <button class="delete-btn">
                Delete 🗑️
            </button>
        `;


        const editButton =
            entryElement.querySelector(".edit-btn");

        const deleteButton =
            entryElement.querySelector(".delete-btn");


        

        editButton.addEventListener("click", function() {

            selectedMood = entry.mood;

            moodButtons.forEach(function(btn) {

                btn.classList.remove("selected");

                if (
                    btn.querySelector("span").textContent
                    === entry.mood
                ) {
                    btn.classList.add("selected");
                }

            });

            journalText.value = entry.text;

            editingIndex = index;

            saveButton.textContent =
                "Update Entry ✏️";

            moodGreeting.textContent =
                greetings[entry.mood];

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });



        deleteButton.addEventListener("click", function() {

            entries.splice(index, 1);

            localStorage.setItem(
                "moodEntries",
                JSON.stringify(entries)
            );

            displayEntries();
            displayMoodSummary();

        });


        entriesContainer.appendChild(entryElement);

    });

}




function displayMoodSummary() {

    let entries = JSON.parse(
        localStorage.getItem("moodEntries")
    ) || [];


    if (entries.length === 0) {

        moodCount.textContent =
            "No moods recorded yet 🌷";

        return;
    }


    let moodTotals = {};


    entries.forEach(function(entry) {

        if (moodTotals[entry.mood]) {
            moodTotals[entry.mood]++;
        } else {
            moodTotals[entry.mood] = 1;
        }

    });


    let summary = "";


    for (let mood in moodTotals) {

        summary += `${mood}: ${moodTotals[mood]} `;

        summary +=
            moodTotals[mood] === 1
                ? "entry"
                : "entries";

        summary += "<br>";

    }


    moodCount.innerHTML = summary;
}

darkModeButton.addEventListener("click", function() {

    document.body.classList.toggle("dark-mode");


    if (document.body.classList.contains("dark-mode")) {

        darkModeButton.textContent = "☀️";

        localStorage.setItem(
            "darkMode",
            "enabled"
        );

    } else {

        darkModeButton.textContent = "🌙";

        localStorage.setItem(
            "darkMode",
            "disabled"
        );

    }

});


if (
    localStorage.getItem("darkMode")
    === "enabled"
) {

    document.body.classList.add("dark-mode");

    darkModeButton.textContent = "☀️";

}



clearButton.addEventListener("click", function() {

    let entries = JSON.parse(
        localStorage.getItem("moodEntries")
    ) || [];


    if (entries.length === 0) {

        alert("There are no entries to clear 🌷");

        return;
    }


    const confirmClear = confirm(
        "Are you sure you want to delete all your journal entries? 🥺"
    );


    if (confirmClear) {

        localStorage.removeItem("moodEntries");

        displayEntries();
        displayMoodSummary();

        alert(
            "All entries have been cleared 🧹🌷"
        );

    }

});


displayEntries();
displayMoodSummary();