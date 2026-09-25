import { useEffect, useState } from "react";
import {View, Text, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, Pressable} from "react-native";
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'
import axios from 'axios'
import {SafeAreaView} from "react-native-safe-area-context"

type UserData = {
    id: string
    name: string;
    email: string;
    phone: string;
    image: string | null;

}
export default function ProfileScreen() {
    
    const [data, setData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [uploading, setUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await SecureStore.getItemAsync('token');
                if(!token){
                    router.replace('/login')
                }
                const response = await fetch('https://ejtech.duckdns.org/api/v1/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
            });
                const userData = await response.json();
                setData(userData);
                console.log(userData)
            }catch (error) {
                console.log("something broke", error)
                setError("something broke")
            }finally{
                setLoading(false);

            }
        };
        fetchData();
    },[]
)
const handlePickImage = async (): Promise<void> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Permission to access photos is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !data) return;

    const asset = result.assets[0];
    setUploading(true);

    try {
      const token = await SecureStore.getItemAsync('authToken');

      const formData = new FormData();
      formData.append('image', {
        uri: asset.uri,
        name: 'avatar.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await axios.patch(
        `https://ejtech.duckdns.org/api/v1/users/${data?.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setData(response.data); // update local state with whatever the server confirms was saved
    } catch (err) {
      console.log('image upload failed', err);
      setError('Could not upload image');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <ActivityIndicator style={styles.container} size="large" />;
  if (error) return <Text style={styles.error}>{error}</Text>;
  return (
    <SafeAreaView style={{flex: 1}}>
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        {data?.image ? (
          <Image source={{ uri: data.image }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={48} color="#999" />
          </View>
        )}

        <Pressable style={styles.editButton} onPress={handlePickImage} disabled={uploading}>
          {uploading ? <ActivityIndicator size="small" color="white" /> : <Ionicons name="pencil" size={16} color="white" />}
        </Pressable>
      </View>

      <Text style={styles.name}>{data?.name}</Text>
      <Text>{data?.email}</Text>
      <Text>{data?.phone}</Text>
    </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatarWrapper: { width: 120, height: 120, marginBottom: 16 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  avatarPlaceholder: { backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
  editButton: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: '#2563eb', width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white',
  },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  error: { color: 'red', textAlign: 'center', marginTop: 40 },
});
