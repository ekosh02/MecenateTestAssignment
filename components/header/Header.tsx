import { BrandLogoMark } from "@/components/brand";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { styles } from "./styles";
import type { HeaderProps } from "./types";

const Header = ({
  title,
  onLogoLayout,
  showLogo,
  onBackPress,
}: HeaderProps) => {
  const hasLogoColumn = showLogo || onLogoLayout !== undefined;

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        {onBackPress !== undefined ? (
          <Pressable
            accessibilityRole="button"
            onPress={onBackPress}
            style={styles.backHit}
          >
            <Ionicons name="chevron-back" size={28} color={COLORS.PRIMARY} />
          </Pressable>
        ) : null}
        <View style={styles.brand}>
          {hasLogoColumn ? (
            <View style={styles.logoSlot} onLayout={onLogoLayout}>
              <BrandLogoMark visible={showLogo} />
            </View>
          ) : null}
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Header;
