type ActivityParticipantsData = {
    id: string;
    activityId: string;
    userId: string;
    approved: boolean;
    confirmedAt?: Date  | null
    
  };
  
  export default ActivityParticipantsData;