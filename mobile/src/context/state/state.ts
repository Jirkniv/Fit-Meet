interface AuthState {
    token: string;
    isAuthenticated: boolean | null;
    login: (email: string, password: string) => void;
    logout: () => void;
    refreshToken: (token: string) => void;
    isLoading: boolean;
    user: any;
    hasSkippedPreferences?: boolean;
    skipPreferences?: () => void;
}

export interface AppState {
    auth: AuthState;
    getUser: () => void; 
    
}

export const initialState: AppState = {
    auth: {
        token: '',
        isAuthenticated: null,
        login: (email: string, password: string) => {},
        logout: () => {},
        refreshToken: (token: string) => {},
        isLoading: false,
        user: null,
        hasSkippedPreferences: false,
    },
    getUser: () => {}, 
};