import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ArenaScreen from './src/screens/ArenaScreen';

type Language = 'tr' | 'en' | 'es';

export default function App() {
  const [lang, setLang] = useState<Language>('tr'); 

  // Dil döngüsü fonksiyonu
  const toggleLanguage = () => {
    if (lang === 'tr') setLang('en');
    else if (lang === 'en') setLang('es');
    else setLang('tr');
  };

  const getAppName = () => {
    if (lang === 'tr') return "Hodri";
    if (lang === 'es') return "El Pacto"; // İspanyolca için harika bir isim!
    return "The Pact";
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerLogo}>{getAppName()}</Text>
        <TouchableOpacity style={styles.iconButton} onPress={toggleLanguage}>
          <Text style={{color: '#FFF', fontWeight: 'bold', fontSize: 16}}>{lang.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>
      <ArenaScreen lang={lang} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15 },
  headerLogo: { color: '#F8FAFC', fontSize: 28, fontWeight: '900' }, iconButton: { padding: 8, backgroundColor: '#1E293B', borderRadius: 12, width: 40, alignItems: 'center' }
});