import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator,
  Keyboard, Platform, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Alert
} from 'react-native';
import axios, {isAxiosError} from 'axios';
import {router} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

type formData = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

const extractErrorMessage = (data: any): string => {
  if (typeof data?.error === 'string') return data.error;
  if (typeof data?.message === 'string') return data.message;

  // Zod's .format() shape: { _errors: [], fieldName: { _errors: ['message'] }, ... }
  if (data?.error && typeof data.error === 'object') {
    const fieldErrors = Object.entries(data.error)
      .filter(([key]) => key !== '_errors')
      .map(([field, value]: [string, any]) => {
        const messages = value?._errors ?? [];
        return messages.length ? `${field}: ${messages.join(', ')}` : null;
      })
      .filter(Boolean);

    if (fieldErrors.length) return fieldErrors.join('\n');
  }

  return 'Something went wrong';
};

export default function SignupScreen() {
  const [form, setForm] = useState<formData>({
    name: '', email: '', password: '', phone: '',
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof formData) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  

  const handleSubmit = async (): Promise<void> => {
  try {
    setLoading(true);
    setError(null);
    const response = await axios.post('https://ejtech.duckdns.org/api/v1/users', form);
    console.log('success', response.data);
    Alert.alert('Success', 'User registered successfully', [{ text: 'Continue', onPress: () => router.replace('/login') }]);
  } catch (error) {
  if (isAxiosError(error) && error.response) {
    setError(extractErrorMessage(error.response.data));
  } else {
    setError('Network error — please check your connection');
  }
  console.log('signup error', error);
} finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={{flex:1}}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <TextInput style={styles.input} placeholder="Full Name" value={form.name} onChangeText={handleInputChange('name')} />
            <TextInput style={styles.input} placeholder="Phone" value={form.phone} onChangeText={handleInputChange('phone')} />
            <TextInput style={styles.input} placeholder="email" value={form.email} keyboardType="email-address" onChangeText={handleInputChange('email')} />
            <TextInput style={styles.input} placeholder="password" value={form.password} keyboardType="visible-password" secureTextEntry onChangeText={handleInputChange('password')} />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable style={styles.button} onPress={handleSubmit}>
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Sign Up</Text>}
            </Pressable>
            <Text style={{ textAlign: 'center', marginVertical: 10 }}>Already have an account?</Text>
                    <Pressable style={styles.button} onPress={() => router.push('/login')}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </Pressable>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: 'white' },
  input: { borderWidth: 2, borderColor: 'gray', backgroundColor: 'gray', color: 'black', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, fontSize: 16, marginBottom: 12 },
  button: { backgroundColor: 'blue', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  errorText: { color: 'red', marginBottom: 12, textAlign: 'center' },
});