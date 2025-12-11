import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Linking,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { documentsAPI } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// We need to get the base URL to construct the download link
// This is a bit of a hack, in a real app we'd have this in a config file
// For now we'll try to extract it from the API service or just reconstruct it
const getDownloadUrl = async (docId: number) => {
  // This should match what's in api.ts
  // For Android Emulator
  const BASE_URL = 'http://10.0.2.2:8080/api'; 
  return `${BASE_URL}/documents/download/${docId}`;
};

export default function DocumentDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      loadDocument();
    }
  }, [id]);

  const loadDocument = async () => {
    try {
      const doc = await documentsAPI.getById(Number(id));
      setDocument(doc);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger le document');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!document) return;
    
    setDownloading(true);
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      const downloadUrl = await getDownloadUrl(document.id);
      
      // For simple file downloading/opening in browser
      // In a production app, you might use expo-file-system to download to local storage
      const supported = await Linking.canOpenURL(downloadUrl);
      
      if (supported) {
        await Linking.openURL(downloadUrl);
      } else {
        Alert.alert('Erreur', "Impossible d'ouvrir le lien de téléchargement");
      }
    } catch (error) {
      Alert.alert('Erreur', 'Échec du téléchargement');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!document) return;
    
    try {
      await Share.share({
        message: `Découvre ce document sur Niger Savoir+: ${document.title} (${document.subject})`,
        // url: ... link to web version if available
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E67E22" />
      </View>
    );
  }

  if (!document) return null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E67E22', '#D35400']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>Détails du document</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Ionicons name="share-social-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Text style={styles.docIcon}>📄</Text>
          </View>
          
          <Text style={styles.title}>{document.title}</Text>
          
          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{document.subject}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{document.level}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{document.type}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Année</Text>
              <Text style={styles.infoValue}>{document.year}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Format</Text>
              <Text style={styles.infoValue}>{document.format || 'PDF'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Taille</Text>
              <Text style={styles.infoValue}>2.5 MB</Text> 
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {document.description || "Aucune description disponible pour ce document."}
          </Text>

          <View style={styles.divider} />

          <View style={styles.uploaderContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {document.uploadedBy?.name?.charAt(0) || 'U'}
              </Text>
            </View>
            <View>
              <Text style={styles.uploaderLabel}>Publié par</Text>
              <Text style={styles.uploaderName}>
                {document.uploadedBy?.name || 'Utilisateur inconnu'}
              </Text>
              <Text style={styles.uploaderSchool}>
                {document.school?.name || document.uploadedBy?.school?.name || 'École inconnue'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.downloadButton}
          onPress={handleDownload}
          disabled={downloading}
        >
          {downloading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="download-outline" size={24} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.downloadText}>Télécharger le document</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#FFF3E0',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  docIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 24,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 4,
  },
  tagText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    width: '100%',
    marginVertical: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    alignSelf: 'flex-start',
  },
  uploaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E67E22',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  uploaderLabel: {
    fontSize: 12,
    color: '#999',
  },
  uploaderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  uploaderSchool: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  downloadButton: {
    backgroundColor: '#E67E22',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E67E22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  downloadText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
