import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../utils/theme';

function MessageModal({ visible, onClose, space, messageText, setMessageText, charLimit = 500, hint, onSend, isPending, title, subtitle }) {
  const colors = useThemeColors();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.textPrimary }]}>{title || 'Message'}</Text>
              <Text style={[styles.sub, { color: colors.textLight }]}>{subtitle || ''}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.background }]}>
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {space?.images?.[0] && (
            <View style={[styles.miniCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Image source={{ uri: space.images[0] }} style={styles.miniImg} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.miniTitle, { color: colors.textPrimary }]} numberOfLines={1}>{space.name}</Text>
                <Text style={[styles.miniSub, { color: colors.textLight }]}>{space.location?.city}</Text>
              </View>
            </View>
          )}

          <TextInput
            style={[styles.input, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border }]}
            placeholder={hint || 'Type your message...'}
            placeholderTextColor={colors.textLight}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={charLimit}
          />
          <Text style={[styles.charCount, { color: colors.textLight }]}>{messageText.length}/{charLimit}</Text>
          <Text style={[styles.msgHint, { color: colors.textLight }]}>Keep messages property-related. Contact info and payment details are not allowed.</Text>

          <TouchableOpacity
            style={[styles.sendBtn, (!messageText.trim() || isPending) && { opacity: 0.5 }]}
            onPress={() => onSend(messageText)}
            disabled={!messageText.trim() || isPending}
          >
            <LinearGradient colors={['#8B5CF6', '#7C3AED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.sendBtnGrad}>
              <Ionicons name="send" size={16} color="#fff" />
              <Text style={styles.sendBtnText}>{isPending ? 'Sending...' : 'Send Message'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 40 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.15)', alignSelf: 'center', marginBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  title: { fontSize: 19, fontWeight: '800', letterSpacing: -0.4 },
  sub: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  miniCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 14, borderWidth: 1, marginBottom: 16 },
  miniImg: { width: 48, height: 48, borderRadius: 10 },
  miniTitle: { fontSize: 13, fontWeight: '700' },
  miniSub: { fontSize: 11, marginTop: 2 },
  input: { borderRadius: 14, borderWidth: 1, padding: 14, fontSize: 14, minHeight: 110, textAlignVertical: 'top' },
  charCount: { fontSize: 11, textAlign: 'right', marginTop: 6, marginBottom: 4 },
  msgHint: { fontSize: 11, color: '#6B7280', marginBottom: 16, lineHeight: 16 },
  sendBtn: { borderRadius: 14, overflow: 'hidden' },
  sendBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15 },
  sendBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});

export default MessageModal;
