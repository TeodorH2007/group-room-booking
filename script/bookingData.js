const STORAGE_KEY = "group-room-bookings";

const starterBookings = [
    {
        id: "starter-1",
        room: "room1",
        name: "Teodor",
        email: "teodor@example.com",
        date: "2026-08-24",
        time: "10:00",
        duration: 2,
        attendees: 5,
        purpose: "Meeting",
        status: "Confirmed"
    },
    {
        id: "starter-2",
        room: "room2",
        name: "Atha",
        email: "atha@example.com",
        date: "2026-08-25",
        time: "14:00",
        duration: 1,
        attendees: 3,
        purpose: "Meeting",
        status: "Pending"
    }
];

export function getBookings() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(saved) ? saved : starterBookings;
    } catch {
        return starterBookings;
    }
}

export function saveBookings(bookings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}