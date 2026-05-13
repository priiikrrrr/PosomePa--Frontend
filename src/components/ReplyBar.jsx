import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../utils/theme';

function ReplyBar({ replyText, setReplyText, onSend, onCancel, isPending, showReplyInput, setShowReplyInput, charLimit = 200 }) {
  const colors = useThemeColors();

  if (showReplyInput) {
    return (
      <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border }]}
          value={replyText}
          onChangeText={setReplyText}
          placeholder="Type your reply..."
          placeholderTextColor={colors.textLight}
          maxLength={charLimit}
          multiline
        />
        <Text style={[styles.charCount, { color: colors.textLight }]}>{replyText.length}/{charLimit}</Text>
        <Text style={[styles.hint, { color: colors.textLight }]}>Keep replies property-related. Contact info not allowed.</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sendBtn, (!replyText.trim() || isPending) && { opacity: 0.5 }]}
            onPress={onSend}
            disabled={!replyText.trim() || isPending}
          >
            {isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity style={[styles.replyButton, { backgroundColor: colors.primary }]} onPress={() => setShowReplyInput(true)}>
      <Ionicons name="chatbubble-outline" size={20} color="#fff" />
      <Text style={styles.replyButtonText}>Reply</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { borderTopWidth: 1, padding: 16, paddingBottom: 24 },
  input: { borderRadius: 14, borderWidth: 1, padding: 14, fontSize: 15, maxHeight: 100 },
  charCount: { fontSize: 11, textAlign: 'right', marginTop: 4, marginBottom: 4 },
  hint: { fontSize: 11, marginBottom: 16, lineHeight: 16 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 4, gap: 8 },
  cancelBtn: { paddingVertical: 8, paddingHorizontal: 16 },
  cancelText: { fontSize: 14, fontWeight: '500' },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center' },
  replyButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginBottom: 16, paddingVertical: 14, borderRadius: 14 },
  replyButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});

export default ReplyBar;
