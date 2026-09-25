// src/app/index.tsxS
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, StyleSheet, TextInput,TouchableWithoutFeedback, Keyboard } from 'react-native';
import { View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context"

export default function HomeScreen() {
 const [name, setName] = useState<string>("")
 const [submittedName, setSubmittedName] = useState<string>('')
 const handleName = (): void => {
    setSubmittedName(name)
  }

  return (
    <SafeAreaView style={{flex: 1}}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
    <View style={styles.container}>
      <TextInput
      style={styles.input}
      placeholder="whats your name"
      value={name}
      onChangeText={setName}
      
      
      />
      
      {/* <Text style={styles.header}>{name? `Hello ${name}` : "enter your name"  }</Text> */}
      <Pressable style={styles.button} onPress={handleName}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
      <Text style={styles.header}>
        {submittedName ? `Hello ${submittedName}` : 'enter your name'}
      </Text>
      <Pressable style={styles.button} onPress={() => router.push('/counter')}>
        <Text style={styles.buttonText}>Counter</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => router.push('/about')}>
        <Text style={styles.buttonText}>About</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => router.push('/signup')}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </View>
    </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
    
  


const styles = StyleSheet.create({
  button: { backgroundColor: 'blue', padding: 10, borderRadius: 5, margin: 10 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  container: { flex: 1, alignItems: 'center', backgroundColor: '#f5f5f5' },
  header: {
    fontSize: 36,
    color: "gray",
    fontWeight: "600"
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    width: 150,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    textAlign: 'center',
  },
});