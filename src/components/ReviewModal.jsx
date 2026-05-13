import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../utils/theme';

const STAR_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'];

function ReviewModal({ visible, onClose, rating, setRating, comment, setComment, onSend, isPending }) {
  const colors = useThemeColors();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.textPrimary }]}>Leave a Review</Text>
              <Text style={[styles.sub, { color: colors.textLight }]}>How was your experience?</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.background }]}>
              <Ionicons name="close" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.starPicker}>
            {[1, 2, 3, 4, 5].map(s => (
              <TouchableOpacity key={s} onPress={() => setRating(s)} activeOpacity={0.7}>
                <Ionicons name={s <= rating ? 'star' : 'star-outline'} size={42} color={s <= rating ? '#F59E0B' : colors.textLight} />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.starLabel, { color: colors.textSecondary }]}>{STAR_LABELS[rating]}</Text>

          <TextInput
            style={[styles.input, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border }]}
            placeholder="Tell us what you loved (or didn't)..."
            placeholderTextColor={colors.textLight}
            value={comment}
            onChangeText={setComment}
            multiline
            maxLength={500}
          />
          <Text style={[styles.charCount, { color: colors.textLight }]}>{comment.length}/500</Text>

          <TouchableOpacity
            style={[styles.sendBtn, isPending && { opacity: 0.5 }]}
            onPress={() => onSend()}
            disabled={isPending}
          >
            <LinearGradient colors={['#8B5CF6', '#7C3AED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.sendBtnGrad}>
              <Ionicons name="checkmark-circle" size={16} color="#fff" />
              <Text style={styles.sendBtnText}>{isPending ? 'Submitting...' : 'Submit Review'}</Text>
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
  starPicker: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 8 },
  starLabel: { textAlign: 'center', fontSize: 13, fontWeight: '600', marginBottom: 18 },
  input: { borderRadius: 14, borderWidth: 1, padding: 14, fontSize: 14, minHeight: 110, textAlignVertical: 'top' },
  charCount: { fontSize: 11, textAlign: 'right', marginTop: 6, marginBottom: 4 },
  sendBtn: { borderRadius: 14, overflow: 'hidden' },
  sendBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 15 },
  sendBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});

export default ReviewModal;
