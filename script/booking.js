import { getRooms } from "./roomData.js";
import { getBookings, saveBookings } from "./bookingData.js";

const form = document.querySelector(".booking-form");

if (form) {
    const roomSelect = document.querySelector("#room");
    const message = document.createElement("p");
    message.setAttribute("role", "alert");
    form.prepend(message);

    getRooms().forEach(room => {
        if (roomSelect.querySelector(`option[value="${room.id}"]`)) return;
        const option = document.createElement("option");
        option.value = room.id;
        option.textContent = `${room.name} (up to ${room.capacity} people)`;
        roomSelect.append(option);
    });

    function showMessage(text, isError = true) {
        message.textContent = text;
        message.style.color = isError ? "#b42318" : "#147a3d";
    }

    function timeAsMinutes(time) {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    }

    form.addEventListener("submit", event => {
        event.preventDefault();

        const formData = new FormData(form);
        const booking = {
            id: `booking-${Date.now()}`,
            room: formData.get("room"),
            name: formData.get("name").trim(),
            email: formData.get("email").trim(),
            date: formData.get("date"),
            time: formData.get("time"),
            duration: Number(formData.get("duration").split("-")[0]),
            attendees: Number(formData.get("attendees")),
            purpose: formData.get("purpose").trim(),
            status: "Confirmed"
        };

        const room = getRooms().find(item => item.id === booking.room);
        const errors = [];
        if (!booking.room) errors.push("Please choose a room.");
        if (!booking.name) errors.push("Please enter your name.");
        if (!booking.email || !booking.email.includes("@")) errors.push("Please enter a valid email.");
        if (!booking.date || !booking.time) errors.push("Please choose a date and time.");
        if (!booking.duration) errors.push("Please choose a duration.");
        if (!Number.isInteger(booking.attendees) || booking.attendees < 1) errors.push("Enter at least one attendee.");
        if (room && booking.attendees > room.capacity) errors.push(`${room.name} allows a maximum of ${room.capacity} attendees.`);
        if (!booking.purpose) errors.push("Please enter the purpose of the booking.");
        if (!formData.get("terms")) errors.push("You must accept the terms and conditions.");

        const newStart = timeAsMinutes(booking.time);
        const newEnd = newStart + booking.duration * 60;
        const hasConflict = getBookings().some(existing => {
            if (existing.room !== booking.room || existing.date !== booking.date) return false;
            const existingStart = timeAsMinutes(existing.time);
            const existingEnd = existingStart + Number(existing.duration) * 60;
            return newStart < existingEnd && newEnd > existingStart;
        });
        if (hasConflict) errors.push("That room is already booked during this time.");

        if (errors.length) {
            showMessage(errors.join(" "));
            return;
        }

        saveBookings([...getBookings(), booking]);
        showMessage("Booking saved. You can view it on the bookings page.", false);
        form.reset();
    });
}