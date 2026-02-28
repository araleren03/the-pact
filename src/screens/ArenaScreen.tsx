import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Modal, Image, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';

const t = {
  tr: { progress: '1. Gün • 23 saat kaldı', claims: 'bugünü tamamladı.', bluff: 'BLÖFÜ GÖR', error: 'Kamera izni şart!', sent: 'Kanıt onaylandı!', retake: 'Tekrar Çek', submit: 'Kanıtı Gönder', instruction: 'Anlık kanıtını çek', addTitle: 'Yeni İddia', pactName: 'İddia Başlığı (Örn: 30 Gün Şekersiz)', selectOpponent: 'Meydan Okunacak Arkadaşını Seç', create: 'MEYDAN OKU', cancel: 'İptal', approved: 'KANIT ONAYLANDI' },
  en: { progress: 'Day 1 • 23h remaining', claims: 'claims completion.', bluff: 'CALL BLUFF', error: 'Camera access required!', sent: 'Proof approved!', retake: 'Retake', submit: 'Submit Proof', instruction: 'Capture your proof', addTitle: 'New Pact', pactName: 'Pact Title (e.g. 30 Days No Sugar)', selectOpponent: 'Select a Friend to Challenge', create: 'CHALLENGE', cancel: 'Cancel', approved: 'PROOF APPROVED' },
  es: { progress: 'Día 1 • 23h restantes', claims: 'completó el día.', bluff: 'EXIGIR PRUEBA', error: '¡Se requiere cámara!', sent: '¡Prueba aprobada!', retake: 'Volver a tomar', submit: 'Enviar prueba', instruction: 'Captura tu prueba', addTitle: 'Nuevo Pacto', pactName: 'Título del Pacto (ej. Sin Azúcar)', selectOpponent: 'Selecciona un Amigo para Retar', create: 'RETAR', cancel: 'Cancelar', approved: 'PRUEBA APROBADA' }
};

export default function ArenaScreen({ lang }: { lang: 'tr' | 'en' | 'es' }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const [pacts, setPacts] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPactTitle, setNewPactTitle] = useState('');

  // --- HANGİ İDDİAYA KANIT GÖNDERDİĞİMİZİ TUTAN YENİ HAFIZA ---
  const [activePactId, setActivePactId] = useState<number | null>(null);

  // --- IP ADRESİNİ KENDİNKİYLE DEĞİŞTİR ---
  const API_URL = 'https://pact-backend-service.onrender.com/api/pacts';
  const FRIENDS_URL = 'https://pact-backend-service.onrender.com/api/users/eren/friends';

  useEffect(() => {
    fetchPacts();
    fetchFriends();
  }, []);

  const fetchPacts = async () => {
    try {
      const response = await fetch(API_URL); 
      const data = await response.json();
      setPacts(data.sort((a: any, b: any) => b.id - a.id));
    } catch (error) { console.error("İddialar çekilemedi:", error); }
  };

  const fetchFriends = async () => {
    try {
      const response = await fetch(FRIENDS_URL);
      const data = await response.json();
      setFriends(data);
    } catch (error) { console.error("Arkadaşlar çekilemedi:", error); }
  };

  const handleCreatePact = async () => {
    if (!newPactTitle.trim() || !selectedFriend) return Alert.alert("Hata", "Eksik bilgi!");
    const pactData = {
      titleTr: newPactTitle, titleEn: newPactTitle, titleEs: newPactTitle,
      challengerName: "Eren", opponentName: selectedFriend.displayName,
      opponentInitial: selectedFriend.displayName.charAt(0).toUpperCase(),
      status: "WAITING_ACTION"
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pactData)
      });
      if (response.ok) {
        setIsAddModalOpen(false); setNewPactTitle(''); setSelectedFriend(null); fetchPacts();
      }
    } catch (error) { console.error("İddia kaydedilemedi:", error); }
  };

  // --- KAMERA AÇILIRKEN ARTIK İDDİANIN ID'SİNİ DE ALIYORUZ ---
  const handleCallBluff = async (id: number) => { 
    setActivePactId(id); // Hafızaya al
    if (!permission) return;
    if (!permission.granted) {
      const result = await requestPermission();
      if (!result.granted) return Alert.alert("Hata", t[lang].error);
    }
    setIsCameraOpen(true);
  };
  
  const takePicture = async () => { 
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      setCapturedPhoto(photo?.uri || null);
    }
  };
  
  // --- KANITI GÖNDER BUTONUNA BASILINCA ÇALIŞACAK YEPYENİ KOD ---
  const submitProof = async () => { 
    if (!activePactId) return;

    try {
      // Backend'e gidip "Bu iddiayı Tamamlandı (COMPLETED) olarak güncelle" diyoruz
      const response = await fetch(`${API_URL}/${activePactId}/status?newStatus=COMPLETED`, {
        method: 'PUT'
      });

      if (response.ok) {
        Alert.alert("✅", t[lang].sent);
        setCapturedPhoto(null); 
        setIsCameraOpen(false);
        setActivePactId(null);
        fetchPacts(); // Listeyi yeniliyoruz ki yeşil rozet ekrana gelsin!
      }
    } catch (error) {
      console.error("Durum güncellenemedi:", error);
    }
  };

  const getDynamicTitle = (item: any) => {
    if (lang === 'tr') return item.titleTr;
    if (lang === 'es') return item.titleEs;
    return item.titleEn;
  };

  const renderPactCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{getDynamicTitle(item)}</Text>
        <Text style={styles.cardSubtitle}>{t[lang].progress}</Text>
      </View>
      <View style={styles.playersContainer}>
        <View style={[styles.avatar, { backgroundColor: '#3B82F6' }]}><Text style={styles.avatarText}>{item.challengerName ? item.challengerName.charAt(0) : 'E'}</Text></View>
        <View style={styles.vsBadge}><Text style={styles.vsText}>VS</Text></View>
        <View style={[styles.avatar, { backgroundColor: '#8B5CF6' }]}><Text style={styles.avatarText}>{item.opponentInitial}</Text></View>
      </View>
      <View style={styles.actionSection}>
        <Text style={styles.statusTextAlert}>{item.opponentName} {t[lang].claims}</Text>
        <View style={styles.buttonRow}>
          
          {/* EĞER İDDİA TAMAMLANDIYSA YEŞİL ROZET GÖSTER, DEĞİLSE KAMERA BUTONUNU GÖSTER */}
          {item.status === 'COMPLETED' ? (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" style={{marginRight: 6}} />
              <Text style={styles.completedBadgeText}>{t[lang].approved}</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.bluffButton} onPress={() => handleCallBluff(item.id)}>
              <Ionicons name="camera-outline" size={22} color="#FFF" style={{marginRight: 8}} />
              <Text style={styles.bluffButtonText}>{t[lang].bluff}</Text>
            </TouchableOpacity>
          )}

        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList data={pacts} keyExtractor={(item: any) => item.id ? item.id.toString() : Math.random().toString()} renderItem={renderPactCard} contentContainerStyle={styles.feedContainer} />

      <TouchableOpacity style={styles.fab} onPress={() => setIsAddModalOpen(true)}>
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      <Modal visible={isAddModalOpen} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>{t[lang].addTitle}</Text>
            <TextInput style={styles.input} placeholder={t[lang].pactName} placeholderTextColor="#94A3B8" value={newPactTitle} onChangeText={setNewPactTitle} />
            <Text style={styles.inputLabel}>{t[lang].selectOpponent}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.friendsContainer}>
              {friends.map(friend => (
                <TouchableOpacity key={friend.id} style={[styles.friendChip, selectedFriend?.id === friend.id && styles.friendChipSelected]} onPress={() => setSelectedFriend(friend)}>
                  <View style={styles.friendAvatar}><Text style={styles.friendAvatarText}>{friend.displayName.charAt(0)}</Text></View>
                  <Text style={[styles.friendChipText, selectedFriend?.id === friend.id && styles.friendChipTextSelected]}>{friend.displayName}</Text>
                </TouchableOpacity>
              ))}
              {friends.length === 0 && <Text style={styles.noFriendsText}>Arkadaş bulunamadı...</Text>}
            </ScrollView>
            <View style={styles.formButtonsRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAddModalOpen(false)}><Text style={styles.cancelButtonText}>{t[lang].cancel}</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.createButton, (!newPactTitle || !selectedFriend) && styles.createButtonDisabled]} onPress={handleCreatePact} disabled={!newPactTitle || !selectedFriend}><Text style={styles.createButtonText}>{t[lang].create}</Text></TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={isCameraOpen} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.cameraContainer}>
          {capturedPhoto ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
              <View style={styles.previewButtonsRow}>
                <TouchableOpacity style={styles.retakeButton} onPress={() => setCapturedPhoto(null)}><Text style={styles.retakeButtonText}>{t[lang].retake}</Text></TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={submitProof}><Text style={styles.submitButtonText}>{t[lang].submit}</Text></TouchableOpacity>
              </View>
            </View>
          ) : (
            <CameraView style={styles.camera} facing="back" ref={cameraRef}>
              <View style={styles.cameraOverlay}>
                <TouchableOpacity style={styles.closeCameraButton} onPress={() => setIsCameraOpen(false)}><Ionicons name="close" size={30} color="#FFF" /></TouchableOpacity>
                <View style={styles.cameraBottomBar}>
                  <Text style={styles.cameraInstruction}>{t[lang].instruction}</Text>
                  <TouchableOpacity style={styles.captureButtonOuter} onPress={takePicture}><View style={styles.captureButtonInner} /></TouchableOpacity>
                </View>
              </View>
            </CameraView>
          )}
        </SafeAreaView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  feedContainer: { padding: 20, paddingBottom: 100 }, card: { backgroundColor: '#1E293B', borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#334155' }, cardHeader: { marginBottom: 20 }, cardTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: '800' }, cardSubtitle: { color: '#94A3B8', fontSize: 13 }, playersContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 25, backgroundColor: '#0F172A', paddingVertical: 15, borderRadius: 15 }, avatar: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' }, avatarText: { color: '#FFF', fontSize: 24, fontWeight: 'bold' }, vsBadge: { backgroundColor: '#334155', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginHorizontal: 15 }, vsText: { color: '#F8FAFC', fontSize: 12, fontWeight: 'bold' }, actionSection: { marginTop: 5 }, statusTextAlert: { color: '#CBD5E1', fontSize: 14, textAlign: 'center', marginBottom: 15, fontStyle: 'italic' }, buttonRow: { flexDirection: 'row', gap: 12 }, bluffButton: { flex: 1, backgroundColor: '#EF4444', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 12 }, bluffButtonText: { color: '#FFF', fontSize: 14, fontWeight: '900' }, cameraContainer: { flex: 1, backgroundColor: '#000' }, camera: { flex: 1 }, cameraOverlay: { flex: 1, justifyContent: 'space-between', padding: 20 }, closeCameraButton: { alignSelf: 'flex-start', marginTop: 10, padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 }, cameraBottomBar: { alignItems: 'center', marginBottom: 30 }, cameraInstruction: { color: '#FFF', fontSize: 16, fontWeight: '600', marginBottom: 20, textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 }, captureButtonOuter: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center' }, captureButtonInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#EF4444' }, previewContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'flex-end' }, previewImage: { ...StyleSheet.absoluteFillObject, resizeMode: 'cover' }, previewButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 30, paddingBottom: 50, backgroundColor: 'rgba(0,0,0,0.6)' }, retakeButton: { paddingVertical: 15, paddingHorizontal: 25, borderRadius: 12, backgroundColor: '#334155' }, retakeButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }, submitButton: { paddingVertical: 15, paddingHorizontal: 25, borderRadius: 12, backgroundColor: '#10B981' }, submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  fab: { position: 'absolute', right: 20, bottom: 30, backgroundColor: '#10B981', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 }, modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }, formContainer: { backgroundColor: '#1E293B', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, paddingBottom: 40 }, formTitle: { color: '#F8FAFC', fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }, input: { backgroundColor: '#0F172A', color: '#FFF', padding: 15, borderRadius: 12, fontSize: 16, marginBottom: 15, borderWidth: 1, borderColor: '#334155' }, inputLabel: { color: '#94A3B8', fontSize: 14, fontWeight: 'bold', marginBottom: 10, marginTop: 5 }, friendsContainer: { flexDirection: 'row', marginBottom: 25 }, noFriendsText: { color: '#64748B', fontStyle: 'italic', paddingVertical: 10 }, friendChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F172A', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, marginRight: 10, borderWidth: 2, borderColor: '#334155' }, friendChipSelected: { borderColor: '#3B82F6', backgroundColor: '#1E3A8A' }, friendAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center', marginRight: 8 }, friendAvatarText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' }, friendChipText: { color: '#CBD5E1', fontSize: 14, fontWeight: '600' }, friendChipTextSelected: { color: '#FFF', fontWeight: 'bold' }, formButtonsRow: { flexDirection: 'row', gap: 12, marginTop: 10 }, cancelButton: { flex: 1, paddingVertical: 15, borderRadius: 12, backgroundColor: '#334155', alignItems: 'center' }, cancelButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }, createButton: { flex: 2, paddingVertical: 15, borderRadius: 12, backgroundColor: '#3B82F6', alignItems: 'center' }, createButtonDisabled: { backgroundColor: '#1E293B', borderColor: '#334155', borderWidth: 1 }, createButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  
  // --- YENİ EKLENEN ROZET STİLİ ---
  completedBadge: { flex: 1, backgroundColor: 'rgba(16, 185, 129, 0.15)', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#10B981' },
  completedBadgeText: { color: '#10B981', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 }
});