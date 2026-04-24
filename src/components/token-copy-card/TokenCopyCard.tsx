import { COLORS } from "@/src/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Platform, Pressable, Text, View } from "react-native";
import { styles } from "./styles";
import type { TokenCopyCardProps } from "./types";

const DEFAULT_COPY_LABEL = "Скопировать этот токен";

const TokenCopyCard = ({
  title,
  value,
  copyButtonLabel = DEFAULT_COPY_LABEL,
}: TokenCopyCardProps) => {
  const onCopy = async () => {
    await Clipboard.setStringAsync(value);
    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>{title}</Text>
      <Text selectable style={styles.value}>
        {value}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={copyButtonLabel}
        style={({ pressed }) => [
          styles.copyPressable,
          pressed && { opacity: 0.75 },
        ]}
        onPress={() => {
          void onCopy();
        }}
      >
        <Ionicons name="copy-outline" size={20} color={COLORS.PRIMARY} />
        <Text style={styles.copyLabel}>{copyButtonLabel}</Text>
      </Pressable>
    </View>
  );
};

export default TokenCopyCard;
