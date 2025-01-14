import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { theme } from "@/constants/theme";
import { capitalize, hp } from "@/helpers/common";
import { ColorFilter, CommonFilterRow, SectionView } from "./FilterViews";
import { data } from "@/constants/data";

const FM = ({
  modalRef,
  onClose,
  onApply,

  onReset,
  filters,
  setFilters,
}) => {
  const snapPoints = useMemo(() => ["75%"], []);

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={CustomBackdrop}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filter</Text>

          {Object.keys(sections).map((sectionName, index) => {
            let sectionView = sections[sectionName];
            let sectionData = data.filters[sectionName];
            let title = capitalize(sectionName);

            return (
              <View key={sectionName}>
                <SectionView
                  title={title}
                  content={sectionView({
                    data: sectionData,

                    filters,
                    setFilters,
                    filterName: sectionName,
                  })}
                />
              </View>
            );
          })}

          {/* Actions */}
          <View style={styles.buttons}>
            <Pressable style={styles.resetButton} onPress={onReset}>
              <Text
                style={[styles.butonText, { color: theme.colors.neutral(0.9) }]}
              >
                Reset
              </Text>
            </Pressable>

            <Pressable style={styles.applyButton} onPress={onApply}>
              <Text style={[styles.butonText, { color: theme.colors.white }]}>
                Apply
              </Text>
            </Pressable>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const sections = {
  orientation: (props) => <CommonFilterRow {...props} />,
  order_by: (props) => <CommonFilterRow {...props} />,
  color: (props) => <ColorFilter {...props} />,
};

const CustomBackdrop = ({ animatedIndex, style }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity,
    };
  });

  const containerStyle = [
    StyleSheet.absoluteFill,
    style,
    styles.overlay,
    containerAnimatedStyle,
  ];

  return (
    <Animated.View style={containerStyle}>
      <BlurView style={StyleSheet.absoluteFill} tint="dark" intensity={25} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  content: {
    flex: 1,
    gap: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: theme.radius.md,
  },
  filterText: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(1),
    marginBottom: 15,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginTop: 30,
  },
 
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: theme.colors.neutral(0.2),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.neutral(0.5),
  },

  resetButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: theme.colors.neutral(0.2),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.neutral(0.5),
  },
  buttonText: {
    fontSize: hp(2.4),
    fontWeight: theme.fontWeights.medium,
    textAlign: "center",
  },
  applyButtonText: {
    color: theme.colors.white,
  },
  resetButtonText: {
    color: theme.colors.neutral(0.9),
  },
});

export default FM;
