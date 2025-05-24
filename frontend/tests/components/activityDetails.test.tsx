import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import ActivityDetails, { ActivityDetailsProps } from "../../src/components/ui/activityDetails";


describe("ActivityDetails Component", () => {
    const mockProps: ActivityDetailsProps = {
        image: "https://via.placeholder.com/150",
        title: "Test Activity",
        description: "This is a test description for the activity.",
        scheduledDate: "2023-12-31T23:59:59",
        private: true,
        participantCount: 10,
    };

    it("renders the image with the correct src and alt attributes", () => {
        render(<ActivityDetails {...mockProps} />);
        const image = screen.getByRole("img", { name: /test activity/i });
        expect(image).toHaveAttribute("src", mockProps.image);
        expect(image).toHaveAttribute("alt", mockProps.title);
    });

    it("renders the title in uppercase", () => {
        render(<ActivityDetails {...mockProps} />);
        const title = screen.getByText(mockProps.title.toUpperCase());
        expect(title).toBeInTheDocument();
    });

    it("renders the description", () => {
        render(<ActivityDetails {...mockProps} />);
        const description = screen.getByText(mockProps.description);
        expect(description).toBeInTheDocument();
    });

    it("renders the formatted scheduled date", () => {
        render(<ActivityDetails {...mockProps} />);
        const formattedDate = new Date(mockProps.scheduledDate).toLocaleString("default", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
        const dateElement = screen.getByText(formattedDate);
        expect(dateElement).toBeInTheDocument();
    });

    it("renders the participant count", () => {
        render(<ActivityDetails {...mockProps} />);
        const participantText = screen.getByText(`${mockProps.participantCount} participantes`);
        expect(participantText).toBeInTheDocument();
    });

    it("renders the private status when private is true", () => {
        render(<ActivityDetails {...mockProps} />);
        const privateStatus = screen.getByText(/mediante aprovação/i);
        expect(privateStatus).toBeInTheDocument();
    });

    it("renders the open status when private is false", () => {
        render(<ActivityDetails {...mockProps} private={false} />);
        const openStatus = screen.getByText(/aberta/i);
        expect(openStatus).toBeInTheDocument();
    });
});




