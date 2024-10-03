import { invoke } from "@tauri-apps/api/core";
import { createErrorToast } from "../Toast.js";
import { Calendar } from "./Calendar.js";

// script.js
const monthYearElement = document.getElementById("month-year");
const calendarDatesElement = document.getElementById("calendar-dates");
const navigateToNextMonthBtn = document.getElementById("next-month-btn");
const navigateToPrevMonthBtn = document.getElementById("prev-month-btn");
const selectCalendarDropdown = document.getElementById("select-calendar");

// Get current date
let currentDate = new Date();

/**
 * @type{Calendar[]}
 */
let calendars = [];

export async function loadUserCalendarData() {
    await invoke("get_calendar_of_current_user")
        .then((cal) => {
            calendars = Calendar.map(cal);
        })
        .catch((e) => createErrorToast(e));

    // Add calendar names to dropdown menu
    let i = 0;
    while (i < calendars.length) {
        const calendar = calendars[i];
        const option = document.createElement("option");
        option.setAttribute("value", calendar.name);
        option.textContent = calendar.name;
        selectCalendarDropdown.appendChild(option);
        i++;
    }
}

/**
 *   Renders the calendar to the home page
 *
 *   @param {Date} date - The current date
 */
function renderCalendar(date) {
    const month = date.getMonth();
    const year = date.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Calculate the day of the week on which the month starts
    const firstDayOfMonth = new Date(year, month, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();

    // Clear previous dates
    calendarDatesElement.innerHTML = "";

    // Render blank cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
        const blankCell = document.createElement("div");
        blankCell.classList.add("date");
        blankCell.classList.add("blank");
        calendarDatesElement.appendChild(blankCell);
    }

    // Render dates
    for (let i = 1; i <= daysInMonth; i++) {
        const dateElement = document.createElement("div");
        dateElement.classList.add("date");
        dateElement.value = i;
        dateElement.textContent = i;
        calendarDatesElement.appendChild(dateElement);
    }

    // Update month and year
    monthYearElement.textContent = `${date.toLocaleString("default", { month: "long" })} ${year}`;
}

// Appends data of the currently selected calendar into the calendar gui.
function validateCalendarAndAppendUserData() {
    const selectedCalendarName = selectCalendarDropdown.value;
    //const calendarDateElements = calendarDatesElement.children;

    console.log("SELECTED CALENDAR: " + selectedCalendarName);

    // No calendar selected
    if (selectedCalendarName === "") {
        return;
    }

    const selectedCalendar = calendars.find(
        (cal) => cal.name === selectedCalendarName,
    );

    if (!selectedCalendar) {
        console.error("Invalid calendar selected: " + selectedCalendar);
        return;
    }

    appendUserDataToCalendar(selectedCalendar);
}

/**
 * Does the actual data appending to the calendar.
 *
 * @param {Calendar} selectedCalendar - The selected calendar
 */
function appendUserDataToCalendar(selectedCalendar) {
    const amountOfComponents = selectedCalendar.components.length;
    let i = 0;

    while (i < amountOfComponents) {
        let startDate = "";
        let endDate = "";
        const component = selectedCalendar.components[i];
        const entries = component.properties.entries();
        let iterator = entries.next();

        while (!iterator.done) {
            console.log(iterator);
            const [key, value] = iterator.value;

            if (key === "START_DATE") {
                startDate = value;
                console.log(startDate);
            } else if (key === "END_DATE") {
                endDate = value;
                console.log(endDate);
            }

            if (startDate !== "" && endDate !== "") {
                break;
            }

            iterator = entries.next();
        }

        // Converting plain string dates into Date objects
        startDate = new Date(startDate);
        endDate = new Date(endDate);

        let dateSpan = new Set();
        let tempDate = startDate;

        while (tempDate <= endDate) {
            dateSpan.push(tempDate);
            tempDate.setDate(tempDate.getDate() + 1);
        }

        // Get html elements where the date matches here
        const calendarDateElements = calendarDatesElement.children;
        const amountOfCalendarDateElements = calendarDateElements.length;
        let j = 0;
        // let affectedCalendarDateElements = new Set();

        while (j < amountOfCalendarDateElements) {
            const element = calendarDateElements[j];
            const day = parseInt(element.textContent);

            if (dateSpan.has(day)) {
                element.textContent = "This is inside of a date span!";
                // affectedCalendarDateElements.push(element);
            }

            j++;
        }

        i++;
    }
}

// Render calendar for current date
renderCalendar(currentDate);

// Render next month
navigateToNextMonthBtn.addEventListener("click", function () {
    currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
    );
    renderCalendar(currentDate);
});

// Render previous month
navigateToPrevMonthBtn.addEventListener("click", function () {
    currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
    );
    renderCalendar(currentDate);
});

selectCalendarDropdown.addEventListener("change", () =>
    validateCalendarAndAppendUserData(),
);
