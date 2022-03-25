import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Category from './Category';

export default function App() {
  Category = Category;
  return (
    <View style={styles.container}>
      <Text>second test hrnoh something something</Text>
      <Text>yjb</Text>
      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
