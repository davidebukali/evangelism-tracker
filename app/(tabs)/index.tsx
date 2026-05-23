import { commonStyles } from "@/assets/styles/theme";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={[commonStyles.container, commonStyles.center]}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
