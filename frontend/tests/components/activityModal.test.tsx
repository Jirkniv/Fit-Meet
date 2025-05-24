import { vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import ActivityModal from "../../src/components/ui/activityModal";
import { fetchParticipants } from "../../src/api/getParticipants";
import { postSubscription } from "../../src/api/postActivitySubscribe";



vi.mock("../../src/api/getParticipants");
vi.mock("../../src/api/postActivitySubscribe");
vi.mock("../../src/api/deleteActivityUnsubscribe");
vi.mock("../../src/api/putActivityCheckIn");
vi.mock("../../src/api/putActivityConclude");


const mockActivityData = {
  id: "1",
  image: "image.jpg",
  title: "Test Activity",
  description: "This is a test activity",
  scheduledDate: new Date(Date.now() + 60 * 60000).toISOString(), 
  confirmationCode: "12345",
  private: false,
  address: {
    latitude: 0,
    longitude: 0,
  },
  participantCount: 5,
  userSubscriptionStatus: "NOT_SUBSCRIBED",  
  creator: {
    id: "creator-id",
    name: "Creator Name",
    avatar: "creator-avatar.jpg",
  },
};

const mockParticipants = [
  {
    id: "1",
    userId: "user-id",
    name: "Participant 1",
    avatar: "avatar1.jpg",
    userSubscriptionStatus: "APPROVED",
    confirmedAt: null,
  },
];

const activityDataConclude = {
    ...mockActivityData,
   
    creator: {
      id: "user-id", 
      name: "Creator Name",
      avatar: "creator-avatar.jpg",
    },

    scheduledDate: new Date(Date.now() + 20 * 60000).toISOString(),
  };



describe("ActivityModal", () => {
    const onClose = vi.fn();
  
    beforeEach(() => {
      vi.clearAllMocks();
      localStorage.setItem("token", "test-token");
      localStorage.setItem("userId", "user-id");
    });
  
    it("renders activity details correctly", () => {
      render(<ActivityModal activityId="1" onClose={onClose} activityData={mockActivityData} />);
      
      const formattedDate = new Date(mockActivityData.scheduledDate).toLocaleString("default", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
  
      expect(screen.getByText("Detalhes da Atividade")).toBeInTheDocument();
      expect(screen.getByText("TEST ACTIVITY")).toBeInTheDocument();
      expect(screen.getByText("This is a test activity")).toBeInTheDocument();
      expect(screen.getByText("5 participantes")).toBeInTheDocument();
      expect(screen.getByText("Aberta")).toBeInTheDocument();
      expect(screen.getByText(formattedDate)).toBeInTheDocument();
    });
  
    it("fetches and displays participants", async () => {
      (fetchParticipants as vi.Mock).mockResolvedValue(mockParticipants);
  
      render(<ActivityModal activityId="1" onClose={onClose} activityData={mockActivityData} />);
  
      await waitFor(() => {
        expect(fetchParticipants).toHaveBeenCalledWith("1", "test-token");
        expect(screen.getByText("Participant 1")).toBeInTheDocument();
      });
    });
  
    it("handles subscription", async () => {
      (postSubscription as vi.Mock).mockResolvedValue({});
      (fetchParticipants as vi.Mock).mockResolvedValue(mockParticipants);
  
      render(<ActivityModal activityId="1" onClose={onClose} activityData={mockActivityData} />);
  
      const subscribeButton = screen.getByText("Participar");
      fireEvent.click(subscribeButton);
  
      await waitFor(() => {
        expect(postSubscription).toHaveBeenCalledWith("1", "test-token", false);
        expect(fetchParticipants).toHaveBeenCalledWith("1", "test-token");
      });
    });
}); 