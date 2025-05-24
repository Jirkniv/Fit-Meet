import { fetchActivities } from "../../src/api/getActitvities";
import { describe, it, expect, vi } from "vitest";

describe("fetchActivities", () => {
  it("deve chamar o endpoint correto", async () => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(() => "mocked-jwt-token"), 
      },
      writable: true,
    });

  
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ activities: [] }),
      })
    ) as unknown as jest.Mock;

    await fetchActivities();

  
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:3000/activities?", {
      method: "GET",
      headers: {
        Authorization: "Bearer mocked-jwt-token", 
        "Content-Type": "application/json",
      },
    });
  });
});