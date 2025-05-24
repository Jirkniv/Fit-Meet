import { renderHook, act } from "@testing-library/react";
import { useUser } from "../../src/hooks/useUser";
import { describe, it, expect, vi, beforeEach } from "vitest";
describe("useUser hook", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("should initialize user state from localStorage", () => {
        localStorage.setItem("userId", "123");
        localStorage.setItem("userAvatar", "avatar.png");
        localStorage.setItem("userName", "John Doe");
        localStorage.setItem("userLevel", "5");
        localStorage.setItem("token", "abc123");

        const { result } = renderHook(() => useUser());

        expect(result.current).toEqual({
            userId: "123",
            avatar: "avatar.png",
            name: "John Doe",
            level: 5,
            token: "abc123",
        });
    });

    it("should update user state when localStorage changes", () => {
        const { result } = renderHook(() => useUser());

        expect(result.current).toEqual({
            userId: null,
            avatar: null,
            name: null,
            level: 0,
            token: null,
        });

        act(() => {
            localStorage.setItem("userId", "456");
            localStorage.setItem("userAvatar", "new-avatar.png");
            localStorage.setItem("userName", "Jane Doe");
            localStorage.setItem("userLevel", "10");
            localStorage.setItem("token", "xyz789");

            window.dispatchEvent(new Event("storage"));
        });

        expect(result.current).toEqual({
            userId: "456",
            avatar: "new-avatar.png",
            name: "Jane Doe",
            level: 10,
            token: "xyz789",
        });
    });

    it("should clean up event listener on unmount", () => {
        const addEventListenerSpy = vi.spyOn(window, "addEventListener");
        const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

        const { unmount } = renderHook(() => useUser());

        expect(addEventListenerSpy).toHaveBeenCalledWith(
            "storage",
            expect.any(Function)
        );

        unmount();

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            "storage",
            expect.any(Function)
        );
    });
});