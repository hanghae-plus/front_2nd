import { Event } from "@/types";
import getEventGeneratedRepeatChildren from "@/utils/getEventGeneratedRepeatChildren";
import { describe, expect, it } from "vitest";

describe("getEventGeneratedRepeatChildren", () => {
  it('should return the same event when repeat type is "none"', () => {
    const event: Event = {
      id: 1,
      title: "Test Event",
      date: "2024-01-01",
      startTime: "10:00",
      endTime: "11:00",
      description: "Test description",
      location: "Test location",
      category: "Test category",
      repeat: {
        type: "none",
        interval: 1,
      },
      notificationTime: 10,
    };

    const result = getEventGeneratedRepeatChildren(event);
    expect(result).toEqual(event);
  });

  it("should generate children for daily repeat type", () => {
    const event: Event = {
      id: 1,
      title: "Daily Event",
      date: "2024-01-01",
      startTime: "10:00",
      endTime: "11:00",
      description: "Test description",
      location: "Test location",
      category: "Test category",
      repeat: {
        type: "daily",
        interval: 1,
        endDate: "2024-01-05",
      },
      notificationTime: 10,
    };

    const result = getEventGeneratedRepeatChildren(event);
    const expectedDates = [
      "2024-01-02",
      "2024-01-03",
      "2024-01-04",
      "2024-01-05",
    ];

    expect(result.children).toHaveLength(4);
    result.children?.forEach((child) => {
      expect(expectedDates).toContain(child.date);
    });
  });

  it("should generate children for weekly repeat type", () => {
    const event: Event = {
      id: 1,
      title: "Weekly Event",
      date: "2024-01-01",
      startTime: "10:00",
      endTime: "11:00",
      description: "Test description",
      location: "Test location",
      category: "Test category",
      repeat: {
        type: "weekly",
        interval: 1,
        endDate: "2024-01-15",
      },
      notificationTime: 10,
    };

    const result = getEventGeneratedRepeatChildren(event);
    const expectedDates = ["2024-01-08", "2024-01-15"];

    expect(result.children).toHaveLength(2);
    result.children?.forEach((child) => {
      expect(expectedDates).toContain(child.date);
    });
  });

  it("should generate children for monthly repeat type", () => {
    const event: Event = {
      id: 1,
      title: "Monthly Event",
      date: "2024-01-01",
      startTime: "10:00",
      endTime: "11:00",
      description: "Test description",
      location: "Test location",
      category: "Test category",
      repeat: {
        type: "monthly",
        interval: 1,
        endDate: "2024-04-01",
      },
      notificationTime: 10,
    };

    const result = getEventGeneratedRepeatChildren(event);
    const expectedDates = ["2024-02-01", "2024-03-01", "2024-04-01"];

    expect(result.children).toHaveLength(3);
    result.children?.forEach((child) => {
      expect(expectedDates).toContain(child.date);
    });
  });

  it("should generate children for yearly repeat type", () => {
    const event: Event = {
      id: 1,
      title: "Yearly Event",
      date: "2024-01-01",
      startTime: "10:00",
      endTime: "11:00",
      description: "Test description",
      location: "Test location",
      category: "Test category",
      repeat: {
        type: "yearly",
        interval: 1,
        endDate: "2026-01-01",
      },
      notificationTime: 10,
    };

    const result = getEventGeneratedRepeatChildren(event);
    const expectedDates = ["2025-01-01", "2026-01-01"];

    expect(result.children).toHaveLength(2);
    result.children?.forEach((child) => {
      expect(expectedDates).toContain(child.date);
    });
  });

  it("should use default end date for repeat types without endDate", () => {
    const event: Event = {
      id: 1,
      title: "Event Without End Date",
      date: "2024-01-01",
      startTime: "10:00",
      endTime: "11:00",
      description: "Test description",
      location: "Test location",
      category: "Test category",
      repeat: {
        type: "monthly",
        interval: 1,
      },
      notificationTime: 10,
    };

    const result = getEventGeneratedRepeatChildren(event);

    result.children?.forEach((child) => {
      expect(new Date(child.date).getFullYear()).toBeGreaterThanOrEqual(2024);
      expect(new Date(child.date).getFullYear()).toBeLessThanOrEqual(2027);
    });
  });
});
