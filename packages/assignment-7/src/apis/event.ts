import { Event } from "../App";

export const eventApi = {
  fetch: async () => {
    const response = await fetch("/api/events");
    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }
    return await response.json();
  },

  create: async (event: Event) => {
    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      throw new Error("Failed to add event");
    }
  },

  update: async (event: Event) => {
    const response = await fetch(`/api/events/${event.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      throw new Error("Failed to update event");
    }
  },

  delete: async (id: string) => {
    const response = await fetch(`/api/events/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete event");
    }
  },
};
