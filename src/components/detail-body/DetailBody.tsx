import { PAID_CONTENT_BLUR_INTENSITY } from "@/src/components/post-card/constants";
import { BlurView } from "expo-blur";
import { Pressable, Text, View } from "react-native";
import { BODY_COLLAPSED_LINES } from "./constants";
import { styles } from "./styles";
import type { DetailBodyProps } from "./types";

const PaidBlur = () => (
  <BlurView
    intensity={PAID_CONTENT_BLUR_INTENSITY}
    tint="light"
    style={styles.blurAbs}
  />
);

const DetailBody = ({
  post,
  isPaid,
  expanded,
  showToggle,
  onBodyTextLayout,
  onToggleExpand,
}: DetailBodyProps) =>
  isPaid ? (
    <View style={styles.bodyBlock}>
      <Text style={styles.previewText} numberOfLines={2}>
        {post.preview}
      </Text>
      <PaidBlur />
    </View>
  ) : (
    <>
      <View style={styles.bodyBlock}>
        <Text
          style={styles.bodyText}
          numberOfLines={expanded ? undefined : BODY_COLLAPSED_LINES}
          onTextLayout={onBodyTextLayout}
        >
          {post.body}
        </Text>
      </View>
      {showToggle ? (
        <Pressable
          accessibilityRole="button"
          onPress={onToggleExpand}
          hitSlop={8}
        >
          <Text style={styles.toggleText}>
            {expanded ? "Меньше" : "Показать ещё"}
          </Text>
        </Pressable>
      ) : null}
    </>
  );

export default DetailBody;
