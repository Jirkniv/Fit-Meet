import { useNavigation } from "@react-navigation/native"
import { MainStackParamList } from "../routes/AppRoutes"
import { StackNavigationProp } from "@react-navigation/stack"

export const useTypedNavigation = ( ) => {
    return useNavigation<StackNavigationProp<MainStackParamList>>()
}