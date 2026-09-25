import { useState } from 'react';
import { Text, TextInput, Pressable, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import axios, {isAxiosError} from 'axios';
import { useAuth } from '../context/AuthContext';
import {SafeAreaView} from "react-native-safe-area-context"


type formData = {
    email: string;
    password: string;
}

const isEmailLike = (email: string): boolean => /\S+@\S+\.\S+/.test(email);

const extractErrorMessage = (data: unknown): string => {
    if (typeof data === 'string') return data;
    if (!data || typeof data !== 'object') return 'Invalid email or password';

    const payload = data as Record<string, unknown>;
    if (typeof payload.error === 'string') return payload.error;
    if (typeof payload.message === 'string') return payload.message;

    const validationErrors = payload.error && typeof payload.error === 'object'
        ? payload.error as Record<string, unknown>
        : payload;

    const topLevelErrors = validationErrors._errors;
    if (Array.isArray(topLevelErrors) && topLevelErrors.length) {
        return topLevelErrors.join('\n');
    }

    const fieldErrors = Object.entries(validationErrors)
        .filter(([field]) => field !== '_errors')
        .flatMap(([field, value]) => {
            if (typeof value === 'string') return `${field}: ${value}`;
            if (Array.isArray(value)) return value.map(message => `${field}: ${message}`);
            if (!value || typeof value !== 'object') return [];
            const messages = (value as Record<string, unknown>)._errors;
            return Array.isArray(messages) && messages.length
                ? `${field}: ${messages.join(', ')}`
                : [];
        });

    return fieldErrors.join('\n') || 'Invalid email or password';
};

export default function LoginScreen() {
    const [form, setForm] = useState<formData>({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();

    const handleInputChange = (field: keyof formData) => (value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    const handleSubmit = async (): Promise<void> => {
        const email = form.email.trim();
        const password = form.password.trim();
        

        if (!email || !password) {
            setError('Please enter your email and password');
            return;
        }

        if (!isEmailLike(email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await axios.post('https://ejtech.duckdns.org/api/v1/auth/login', { email, password });
            console.log('login response:', JSON.stringify(response.data, null, 2));
            const token = response.data.accessToken;
            // await SecureStore.setItemAsync('token', token);
            await login(token);
            console.log("successful", response.data)
            Alert.alert("successfully login", "Welcome back!");
            router.replace('/profile');


        } catch (error) {
            if (isAxiosError(error) && error.response) {
                setError(extractErrorMessage(error.response.data));
            } else {
                setError('Network error - please check your connection');
            }
            console.log("oops, something broke", error);
        } finally {
            setLoading(false);
        }

    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={{flex: 1}}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                    <TextInput style={styles.input} placeholder="Email" value={form.email} onChangeText={handleInputChange('email')} keyboardType="email-address" />
                    <TextInput style={styles.input} placeholder="Password" value={form.password} onChangeText={handleInputChange('password')} secureTextEntry />
                    {error && <Text style={styles.errorText}>{error}</Text>}
                    <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
                        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Sign In</Text>}
                    </Pressable>
                    <Text style={{ textAlign: 'center', marginVertical: 10 }}>Already have an account?</Text>
                    <Pressable style={styles.button} onPress={() => router.push('/signup')}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )

}

const styles = StyleSheet.create({
    container: { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: 'white' },
    input: { borderWidth: 2, borderColor: 'gray', backgroundColor: 'gray', color: 'black', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, fontSize: 16, marginBottom: 12 },
    button: { backgroundColor: 'blue', padding: 12, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: 'white', fontWeight: 'bold' },
    errorText: { color: 'red', marginBottom: 12, textAlign: 'center' },
});
