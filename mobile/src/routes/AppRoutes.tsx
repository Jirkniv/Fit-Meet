import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Home from "../pages/home/Home";
import Profile from "../pages/Profile/Profile";
import ActivityByType from "../pages/ActivityByType/activityByType";
import EditProfile from '../pages/EditProfile/EditProfile';
import { useEffect, useState } from "react";
import useAppContext from "../hooks/useAppContext";
import { ActivityIndicator, View } from "react-native";
import ActivityDetails from "../pages/ActivityDetails/ActivityDetails";
import NewActivity from "../pages/NewActivity/NewActivity";
import EditActivity from "../pages/EditActivity/EditActivity";
interface Props {
    name: string
    typeId: string
    
}
export type MainStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    EditProfile: undefined;
    ActivityByType: {typeId: string, name: string};
    Profile: undefined;
    ActivityDetails: { activityData: any; activityId: string };
    NewActivity: undefined;
    EditActivity: { activityId: string };
}

const MainStack = createStackNavigator<MainStackParamList>();

function MainStackScreen() {
    return (
        <MainStack.Navigator initialRouteName="Home">
            <MainStack.Group
                screenOptions={{
                    headerShown: false,
                }}
            >
                <MainStack.Screen name="Register" component={Register} />
                <MainStack.Screen name="Home" component={Home} />
                <MainStack.Screen name="ActivityByType" component={ActivityByType} />
                <MainStack.Screen name="Profile" component={Profile} />
                <MainStack.Screen name="ActivityDetails" component={ActivityDetails} />
                <MainStack.Screen name="NewActivity" component={NewActivity} />
                <MainStack.Screen name="EditActivity" component={EditActivity} />
                <MainStack.Screen name="EditProfile" component={EditProfile} />
                <MainStack.Screen name="Login" component={Login} />
            </MainStack.Group>
        </MainStack.Navigator>
    );
}

const LoginStack = createStackNavigator<MainStackParamList>();

function LoginStackScreen() {
    return (
        <LoginStack.Navigator initialRouteName="Login">
            <LoginStack.Group
                screenOptions={{
                    headerShown: false,
                }}
            >
                <LoginStack.Screen name="Login" component={Login} />
                <LoginStack.Screen name="Register" component={Register} />
                <LoginStack.Screen name="Home" component={Home} />
                
            </LoginStack.Group>
          
        </LoginStack.Navigator>
    );
}

export default function AppRoutes() {

    const [isLoading, setIsLoading] = useState(true);

    const { auth: { isAuthenticated } } = useAppContext();

    useEffect(() => {
        if (isAuthenticated !== null) {
            setIsLoading(false);
        }
    }, [isAuthenticated]);


    return (

        isLoading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#00BC7D" />
            </View>
        ) :
            (
                <NavigationContainer>
                    {isAuthenticated ? <MainStackScreen /> : <LoginStackScreen />}
                </NavigationContainer>
            )
    );

}