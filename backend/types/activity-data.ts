type activityData = {
  title: string;
  description: string;
  image: string;
  address: {
    latitude: number;
    longitude: number;
  };
  scheduledDate: string;
  typeId: string;
  private: boolean;
  creatorId?: string; 
};

export default activityData;