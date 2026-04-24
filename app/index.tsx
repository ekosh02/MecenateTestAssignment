import { authStore } from "@/src/store";
import { Redirect } from "expo-router";
import { observer } from "mobx-react-lite";

const Index = observer(function Index() {
  if (authStore.token) {
    return <Redirect href="/(private)/(tabs)" />;
  }
  return <Redirect href="/(public)/auth" />;
});

export default Index;
