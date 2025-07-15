import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Platform } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { getUser, setIsUSerLoggedIn, setLoading } from "../slices/userSlice";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const loading = useSelector((state) => state.user.loading);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    setError("");
    setSuccess("");
    if (!email || !password) {
      setError("All fields are required.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      dispatch(setLoading(true));
      await AsyncStorage.setItem("token", "abcd");
      dispatch(await getUser());
      setSuccess("Login successful!");
    } catch (e) {
      setError("Login failed. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <LinearGradient
      colors={["#a18cd1", "#fbc2eb", "#fad0c4", "#fcb69f"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBg}
    >
      <View style={styles.neumorphContainer}>
        <FontAwesome name="user-circle" size={60} color="#6e7b8b" style={styles.userIcon} />
        <Text style={styles.title}>Welcome Back</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#6e7b8b" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.switchText} onPress={() => navigation.navigate("Register")}>New User? Register</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  neumorphContainer: {
    width: '90%',
    padding: 30,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.7)',
    shadowColor: '#fff',
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 8,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(209,234,255,0.5)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  userIcon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6e7b8b',
    marginBottom: 20,
    textShadowColor: 'rgba(255,255,255,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    width: '100%',
    padding: 14,
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: '#e0e5ec',
    shadowColor: '#fff',
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 4,
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#e0e5ec',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#b8bac6',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: '#6e7b8b',
    fontWeight: 'bold',
    fontSize: 18,
  },
  error: {
    color: '#e57373',
    marginTop: 10,
    fontWeight: 'bold',
  },
  success: {
    color: '#4caf50',
    marginTop: 10,
    fontWeight: 'bold',
  },
  switchText: {
    color: '#6e7b8b',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
