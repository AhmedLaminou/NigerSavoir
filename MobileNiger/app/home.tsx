import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { authAPI } from '../services/api';

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const user = await authAPI.getCurrentUser();
    if (user.name) {
      setUserName(user.name);
    } else {
      router.replace('/login');
    }
  };

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnexion',
        style: 'destructive',
        onPress: async () => {
          await authAPI.logout();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <LinearGradient colors={['#E67E22', '#D35400', '#0077BE']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>NS+</Text>
          <Text style={styles.welcome}>Bienvenue, {userName}!</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1,250+</Text>
            <Text style={styles.statLabel}>Documents</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>15+</Text>
            <Text style={styles.statLabel}>Écoles</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3,400+</Text>
            <Text style={styles.statLabel}>Étudiants</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuCard}>
            <Text style={styles.menuIcon}>📚</Text>
            <Text style={styles.menuTitle}>Explorer</Text>
            <Text style={styles.menuSubtitle}>Parcourir les documents</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuCard}
            onPress={() => router.push('/search')}
          >
            <Text style={styles.menuIcon}>🔍</Text>
            <Text style={styles.menuTitle}>Rechercher</Text>
            <Text style={styles.menuSubtitle}>Trouver des sujets</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard}>
            <Text style={styles.menuIcon}>📤</Text>
            <Text style={styles.menuTitle}>Publier</Text>
            <Text style={styles.menuSubtitle}>Partager un document</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuCard}
            onPress={() => router.push('/networks')}
          >
            <Text style={styles.menuIcon}>🌐</Text>
            <Text style={styles.menuTitle}>Réseaux</Text>
            <Text style={styles.menuSubtitle}>Votre communauté</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard}>
            <Text style={styles.menuIcon}>👤</Text>
            <Text style={styles.menuTitle}>Profil</Text>
            <Text style={styles.menuSubtitle}>Vos informations</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuCard, styles.logoutCard]} onPress={handleLogout}>
            <Text style={styles.menuIcon}>🚪</Text>
            <Text style={styles.menuTitle}>Déconnexion</Text>
            <Text style={styles.menuSubtitle}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  welcome: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E67E22',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutCard: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  menuIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
