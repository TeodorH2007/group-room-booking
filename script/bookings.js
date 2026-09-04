import { getBookings } from "./bookingData.js";
import { getRooms } from "./roomData.js";

const tableBody = document.querySelector("table tbody");

if (tableBody) {
    const roomNames = Object.fromEntries(getRooms().map(room => [room.id, room.name]));

    function render() {
        tableBody.replaceChildren();
        getBookings().forEach(booking => {
            const row = document.createElement("tr");
            const values = [
                roomNames[booking.room] || booking.room,
                booking.name,
                booking.date,
                booking.time,
                booking.duration,
                booking.attendees,
                booking.purpose,
                booking.status || "Confirmed"
            ];

            values.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.append(cell);
            });
            tableBody.append(row);
        });
    }

    render();
}