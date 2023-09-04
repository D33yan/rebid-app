import { StackNavigation } from "./screens/stack-navigation";
import { NavigationContainer } from "@react-navigation/native";
import { AppProvider } from "./config/app-context";
export default function App() {
  return (
   <AppProvider>
       <NavigationContainer>
      <StackNavigation/>
    </NavigationContainer>
   </AppProvider>
  )
}
