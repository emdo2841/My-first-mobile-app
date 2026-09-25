import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator,
  Keyboard, Platform, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

type formData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob: string;
};

export default function SignupScreen() {
  const [form, setForm] = useState<formData>({
    firstName: '', lastName: '', email: '', password: '', dob: '',
  });
  const [dobDate, setDobDate] = useState<Date>(new Date(2000, 0, 1));
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof formData) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event: any, selectedDate?: Date): void => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDobDate(selectedDate);
      const isoDate = selectedDate.toISOString().split('T')[0];
      setForm((prev) => ({ ...prev, dob: isoDate }));
    }
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('https://ejtech.duckdns.org/api/v1/users', form);
      console.log('success', response.data);
    } catch (error) {
      console.log('oops, something broke', error);
      setError('Oops something broke');
    } finally {
      setLoading(false);
    }
  };

  return (
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
            <TextInput style={styles.input} placeholder="First Name" value={form.firstName} onChangeText={handleInputChange('firstName')} />
            <TextInput style={styles.input} placeholder="Last Name" value={form.lastName} onChangeText={handleInputChange('lastName')} />

            <Pressable style={styles.input} onPress={() => setShowPicker(true)}>
              <Text style={{ color: form.dob ? 'black' : '#4d4d4d' }}>
                {form.dob || 'Date of Birth'}
              </Text>
            </Pressable>

            {showPicker && (
              <DateTimePicker
                value={dobDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                themeVariant="light"
                textColor="black"
                maximumDate={new Date()}
                onValueChange={handleDateChange}
              />
            )}

            <TextInput style={styles.input} placeholder="email" value={form.email} keyboardType="email-address" onChangeText={handleInputChange('email')} />
            <TextInput style={styles.input} placeholder="password" value={form.password} keyboardType="visible-password" secureTextEntry onChangeText={handleInputChange('password')} />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable style={styles.button} onPress={handleSubmit}>
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Sign Up</Text>}
            </Pressable>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: 'white' },
  input: { borderWidth: 2, borderColor: 'gray', backgroundColor: 'gray', color: 'black', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, fontSize: 16, marginBottom: 12 },
  button: { backgroundColor: 'blue', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  errorText: { color: 'red', marginBottom: 12, textAlign: 'center' },
});