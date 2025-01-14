import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { useAnimatedKeyboard, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const App = () => {
  const { height, state } = useAnimatedKeyboard();

  // Create an animated style to move a view when the keyboard appears
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(state === 'OPEN' ? -height : 0, { duration: 600 }) }],
  }));

  return (
    <View
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Animated.View style={[styles.box, animatedStyle]} />
      <TextInput style={styles.input} placeholder="Type here..." />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: 'blue',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

export default App;
