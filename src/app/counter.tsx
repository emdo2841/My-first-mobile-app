import { useState } from 'react';
import { Text, View, Pressable, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context"


export default function CounterScreen() {
  
  const [count, setCount] = useState<number>(0);
  const [step, setStep] = useState<number>(1);
  const [customStep, setCustomStep] = useState<string>('')
  
  const increment  = (): void => setCount(count + step);
  const decrement  = (): void => setCount(Math.max(0, count - step))


 const handleSetStep = () => {
  const parsed = Number(customStep)
  if(!isNaN(parsed) && parsed > 0){
    setStep(parsed)
    setCustomStep('')
  }
 }
  

  return (
     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <SafeAreaView style={{flex: 1}}>
    <View style={styles.container}>
      <Text style={styles.header}>Ej tech</Text>
      <TextInput
       style={styles.input} 
       placeholder="enter a step"
       keyboardType= "numeric"
       value={customStep}
       onChangeText={setCustomStep}
       />
       <Text style={styles.text}>{count}</Text>
      <Pressable style={styles.button} onPress={handleSetStep}>
        <Text style={styles.buttonText}>Set Step</Text>
      </Pressable>
      <Text style={styles.text}>{count}</Text>
      <Text style={styles.stepLabel}>Step: {step}</Text>

      <Pressable style={styles.button} onPress={increment}>
        <Text style={styles.buttonText}>increment</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={decrement}>
        <Text style={styles.buttonText}>decrement</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => setCount(0)}>
        <Text style={styles.buttonText}>reset</Text>
      </Pressable>

      
    </View>
    </SafeAreaView>
    </TouchableWithoutFeedback>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
    marginBottom: 8,
  },
  header: {
    fontSize: 32,
    marginBottom: 20,
  },
  stepLabel: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 20,
  },
  button: {
    borderColor: 'black',
    backgroundColor: 'gray',
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
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
