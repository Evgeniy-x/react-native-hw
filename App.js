import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";

import LoginScreen from "./Screens/LoginScreen";
import RegistrationScreen from "./Screens/RegistrationScreen";
import Home from "./Screens/Home";
import CommentsScreen from "./Screens/CommentsScreen";
import MapScreen from "./Screens/MapScreen";

const MainStack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <MainStack.Navigator initialRouteName='Home'>
            <MainStack.Screen
              name='Login'
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <MainStack.Screen
              name='Registration'
              component={RegistrationScreen}
              options={{ headerShown: false }}
            />
            <MainStack.Screen
              name='Home'
              component={Home}
              options={{ headerShown: false }}
            />
            <MainStack.Screen
              name='CommentsScreen'
              component={CommentsScreen}
              options={{
                title: "Коментарі",
                headerStyle: {
                  backgroundColor: "#FFFFFF",
                },
                headerTitleStyle: {
                  fontWeight: 500,
                  fontSize: 17,
                  lineHeight: 22,
                },
              }}
            />
            <MainStack.Screen
              name='MapScreen'
              component={MapScreen}
              options={{
                title: "Карта",
                headerStyle: {
                  backgroundColor: "#FFFFFF",
                },
                headerTitleStyle: {
                  fontWeight: 500,
                  fontSize: 17,
                  lineHeight: 22,
                },
              }}
            />
          </MainStack.Navigator>
          <StatusBar style='auto' />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}