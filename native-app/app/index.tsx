import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, Redirect } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Laddar RidSportPro...</Text>
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.title}>RidSportPro</Text>
        <Text style={styles.subtitle}>
          Komplett system för ridhantering med ryttare, tränare och administratörer
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Logga In</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(auth)/register" asChild>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Skapa Konto</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Features Preview */}
      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Funktioner</Text>
        <View style={styles.featuresList}>
          <Text style={styles.featureItem}>📅 Boka ridlektioner</Text>
          <Text style={styles.featureItem}>💬 Meddelandesystem</Text>
          <Text style={styles.featureItem}>📊 Följ din progress</Text>
          <Text style={styles.featureItem}>👥 Hantera användare</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: 18,
    color: '#0ea5e9',
    fontWeight: '600',
  },
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#e0f2fe',
    textAlign: 'center',
    lineHeight: 26,
  },
  buttonContainer: {
    paddingHorizontal: 32,
    paddingVertical: 32,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  secondaryButtonText: {
    color: '#0ea5e9',
    fontSize: 18,
    fontWeight: '600',
  },
  featuresContainer: {
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 24,
  },
});