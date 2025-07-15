import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";
import AuthenticatedNavigator from "./CustomNavigator/AuthenticatedNavigator";
import UnAuthenticatedNavigator from "./CustomNavigator/UnAuthenticatedNavigator";
import { useSelector } from "react-redux";

export default function App() {
  const isUserLoggedIn = useSelector((state) => state.user.isUserLoggedIn);
  const loading = useSelector((state) => state.user.loading);

  useEffect(() => {
    // console.log(isUserLoggedIn);
  }, [isUserLoggedIn]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e0e5ec' }}>
        <ActivityIndicator size="large" color="#6e7b8b" />
      </View>
    );
  }
  return (
    <NavigationContainer>
      {isUserLoggedIn ? (
        <AuthenticatedNavigator />
      ) : (
        <UnAuthenticatedNavigator />
      )}
    </NavigationContainer>
  );
}
