// AboutScreen.tsx
import { View, Text, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Built by Ej Tech while learning React Native.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "white"},
  text: { fontSize: 18, textAlign: 'center', padding: 20 },
});