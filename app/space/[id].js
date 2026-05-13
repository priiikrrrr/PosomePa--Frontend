import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Dimensions, Alert,
  StyleSheet, Animated, StatusBar, ImageBackground,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Image } from 'react-native';
import { spacesAPI, messagesAPI, reviewsAPI } from '../../src/api/client';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { useThemeColors } from '../../src/utils/theme';
import MapView from '../../src/components/MapView';
import SectionTitle from '../../src/components/SectionTitle';
import MessageModal from '../../src/components/MessageModal';
import ReviewModal from '../../src/components/ReviewModal';
import { checkSocialMedia } from '../../src/utils/helpers';
import { createSpaceDetailStyles, IMAGE_HEIGHT } from '../../src/styles/spaceDetailStyles';

const { width } = Dimensions.get('window');

function AmenityChip({ label, colors }) {
  return (
    <View style={[achStyles.chip, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '30' }]}>
      <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
      <Text style={[achStyles.text, { color: colors.primary }]}>{label}</Text>
    </View>
  );
}
const achStyles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 6, borderRadius: 20, borderWidth: 1, marginRight: 7, marginBottom: 7 },
  text: { fontSize: 11, fontWeight: '600' },
});

function RuleChip({ label }) {
  const restrictive = label.includes('Not ') || label.includes('Not Allowed') || label.startsWith('No ') || label.startsWith('No ') || label.includes('Max ');
  return (
    <View style={[rchStyles.chip, restrictive ? rchStyles.bad : rchStyles.good]}>
      <Ionicons name={restrictive ? 'close-circle' : 'checkmark-circle'} size={12} color={restrictive ? '#DC2626' : '#16A34A'} />
      <Text style={[rchStyles.text, { color: restrictive ? '#DC2626' : '#16A34A' }]}>{label}</Text>
    </View>
  );
}
const rchStyles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 6, borderRadius: 20, borderWidth: 1, marginRight: 7, marginBottom: 7 },
  good: { backgroundColor: '#DCFCE7', borderColor: '#16A34A40' },
  bad: { backgroundColor: '#FEE2E2', borderColor: '#DC262640' },
  text: { fontSize: 11, fontWeight: '600' },
});

function StarRow({ rating, onPress, size = 14 }) {
  return (
    <TouchableOpacity style={srStyles.row} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      {[1, 2, 3, 4, 5].map(s => (
        <Ionicons key={s} name={s <= Math.round(rating) ? 'star' : 'star-outline'} size={size} color="#F59E0B" />
      ))}
    </TouchableOpacity>
  );
}
const srStyles = StyleSheet.create({ row: { flexDirection: 'row', gap: 2 } });

function InfoRow({ icon, label, value, colors }) {
  return (
    <View style={irStyles.row}>
      <View style={[irStyles.iconBox, { backgroundColor: colors.primary + '14' }]}>
        <Ionicons name={icon} size={16} color={colors.primary} />
      </View>
      <View>
        <Text style={[irStyles.label, { color: colors.textLight }]}>{label}</Text>
        <Text style={[irStyles.value, { color: colors.textPrimary }]}>{value}</Text>
      </View>
    </View>
  );
}
const irStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  value: { fontSize: 13, fontWeight: '700', marginTop: 1 },
});

export default function SpaceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const colors = useThemeColors();
  const queryClient = useQueryClient();

  const [currentImage, setCurrentImage] = useState(0);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({ inputRange: [IMAGE_HEIGHT - 100, IMAGE_HEIGHT - 40], outputRange: [0, 1], extrapolate: 'clamp' });
  const imageScale = scrollY.interpolate({ inputRange: [-80, 0], outputRange: [1.18, 1], extrapolate: 'clamp' });

  const s = createSpaceDetailStyles(colors);

  const { data: space, isLoading } = useQuery({
    queryKey: ['space', id],
    queryFn: () => spacesAPI.getById(id).then(res => res.data),
  });

  const { data: myMessages } = useQuery({
    queryKey: ['myMessages'],
    queryFn: () => messagesAPI.getMy().then(res => res.data),
    enabled: !!user,
  });

  const existingThread = space && myMessages?.messages?.find(
    m => m.property?._id === space._id && !m.deletedBySender
  );
  const isThreadOpen = existingThread && (!existingThread.closedAt || new Date() <= new Date(existingThread.closedAt));

  const sendMessageMutation = useMutation({
    mutationFn: (content) => messagesAPI.send({ propertyId: space._id, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myMessages'] });
      setMessageModalVisible(false);
      setMessageText('');
      Alert.alert('Sent!', 'Your message is on its way to the host.');
    },
    onError: (error) => Alert.alert('Failed', error.response?.data?.message || 'Failed to send message'),
  });

  const addReviewMutation = useMutation({
    mutationFn: (data) => reviewsAPI.add(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['space', id] });
      setReviewModalVisible(false);
      setReviewRating(5);
      setReviewComment('');
      Alert.alert('Review added!', 'Thanks for sharing your experience.');
    },
    onError: (error) => Alert.alert('Failed', error.response?.data?.message || 'Failed to add review'),
  });

  const handleSendMessage = (content) => {
    if (checkSocialMedia(content)) {
      Alert.alert(
        'Message Not Allowed',
        'Social media abbreviations (ig, wa, wp, tg, sc, tt, fb, x, yt) are not allowed. Please rephrase your message.',
        [{ text: 'OK' }]
      );
      return;
    }
    sendMessageMutation.mutate(content);
  };

  const handleMessageHost = () => {
    if (!user) { Alert.alert('Login Required', 'Please login to message the host', [{ text: 'Cancel', style: 'cancel' }, { text: 'Login', onPress: () => router.push('/login') }]); return; }
    if (user.id === space.owner?._id || user._id === space.owner?._id) { Alert.alert('Cannot Message', 'You cannot message yourself'); return; }
    if (isThreadOpen) { Alert.alert('Thread Exists', 'You already have an open conversation. Visit Notifications to continue.', [{ text: 'View Thread', onPress: () => router.push('/profile/notifications') }, { text: 'Cancel', style: 'cancel' }]); return; }
    setMessageModalVisible(true);
  };

  const handleBookPress = () => {
    if (!user) { Alert.alert('Login Required', 'Please login to book this space', [{ text: 'Cancel', style: 'cancel' }, { text: 'Login', onPress: () => router.push('/login') }]); return; }
    router.push(`/space/book?id=${space._id}`);
  };

  const formatPrice = (price, priceType) => {
    if (priceType === 'hourly') return `₹${price}/hr`;
    if (priceType === 'daily') return `₹${price}/day`;
    if (priceType === 'monthly') return `₹${price}/mo`;
    return `₹${price}`;
  };

  if (isLoading || !space) {
    return (
      <View style={[s.loadingContainer, { backgroundColor: colors.background }]}>
        <View style={[s.loadingPulse, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name="home-outline" size={32} color={colors.primary} />
        </View>
        <Text style={[s.loadingText, { color: colors.textSecondary }]}>Loading space...</Text>
      </View>
    );
  }

  const images = space.images?.length > 0 ? space.images : [null];

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      <Animated.View style={[s.stickyHeader, { backgroundColor: colors.background, opacity: headerOpacity, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={[s.stickyBackBtn, { backgroundColor: colors.surface }]}>
          <Ionicons name="arrow-back" size={18} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[s.stickyTitle, { color: colors.textPrimary }]} numberOfLines={1}>{space.name}</Text>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >

        <View style={s.imageContainer}>
          <Animated.View style={[{ transform: [{ scale: imageScale }], height: IMAGE_HEIGHT }]}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={e => setCurrentImage(Math.round(e.nativeEvent.contentOffset.x / width))}
            >
              {images.map((img, idx) =>
                img ? (
                  <ImageBackground key={idx} source={{ uri: img }} style={s.image}>
                    <LinearGradient colors={['rgba(0,0,0,0.25)', 'transparent', 'rgba(0,0,0,0.55)']} style={StyleSheet.absoluteFillObject} />
                  </ImageBackground>
                ) : (
                  <LinearGradient key={idx} colors={[colors.primary + '30', colors.primary + '10']} style={[s.image, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Ionicons name="home-outline" size={48} color={colors.primary} />
                  </LinearGradient>
                )
              )}
            </ScrollView>
          </Animated.View>

          <TouchableOpacity onPress={() => router.back()} style={s.backButton}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          {images.length > 1 && (
            <View style={s.imageCounter}>
              <Text style={s.imageCounterText}>{currentImage + 1} / {images.length}</Text>
            </View>
          )}

          <View style={s.ratingOverlay}>
            <Ionicons name="star" size={13} color="#F59E0B" />
            <Text style={s.ratingOverlayText}>{space.rating?.toFixed(1) || '0.0'}</Text>
            <Text style={s.ratingOverlaySub}>({space.reviewCount || 0})</Text>
          </View>

          {images.length > 1 && (
            <View style={s.imageDots}>
              {images.map((_, i) => (
                <View key={i} style={[s.imageDot, i === currentImage && s.imageDotActive]} />
              ))}
            </View>
          )}
        </View>
        <View style={[s.content, { backgroundColor: colors.background }]}>

          <View style={s.titleBlock}>
            <View style={[s.categoryPill, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
              <Text style={[s.categoryPillText, { color: colors.primary }]}>{space.category?.name || 'Space'}</Text>
            </View>
            <Text style={[s.title, { color: colors.textPrimary }]}>{space.name}</Text>
            <View style={s.titleMeta}>
              <Ionicons name="location-outline" size={13} color={colors.textLight} />
              <Text style={[s.titleMetaText, { color: colors.textLight }]}>{space.location?.address}, {space.location?.city}</Text>
            </View>
          </View>

          <LinearGradient
            colors={isDark ? ['#1e1040', '#2d1870'] : ['#7C3AED', '#9333EA']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={s.priceCard}
          >
            <View style={s.priceLeft}>
              <Text style={s.priceLabel}>Price</Text>
              <Text style={s.priceValue}>{formatPrice(space.price, space.priceType)}</Text>
            </View>
            <View style={s.priceDivider} />
            <View style={s.priceRight}>
              <StarRow rating={space.rating || 0} size={13} />
              <Text style={s.priceReviews}>{space.reviewCount || 0} reviews</Text>
              <TouchableOpacity onPress={() => setReviewModalVisible(true)} style={s.addReviewBtn}>
                <Ionicons name="add" size={11} color="#fff" />
                <Text style={s.addReviewBtnText}>Add Review</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View style={[s.infoGrid, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <InfoRow icon="people-outline" label="Capacity" value={space.capacity ? `${space.capacity} guests` : 'Flexible'} colors={colors} />
            <View style={[s.infoGridDivider, { backgroundColor: colors.border }]} />
            <InfoRow icon="time-outline" label="Availability" value={space.availability || 'Flexible'} colors={colors} />
          </View>

          <SectionTitle title="About this space" colors={colors} />
          <Text style={[s.description, { color: colors.textSecondary }]}>{space.description}</Text>

          {space.notes && (
            <>
              <SectionTitle title="Host Notes" colors={colors} />
              <View style={[s.notesCard, { backgroundColor: colors.primary + '0C', borderColor: colors.primary + '25' }]}>
                <Ionicons name="information-circle-outline" size={18} color={colors.primary} style={{ marginTop: 1 }} />
                <Text style={[s.notesText, { color: colors.textPrimary }]}>{space.notes}</Text>
              </View>
            </>
          )}

          {space.amenities?.length > 0 && (
            <>
              <SectionTitle title="Amenities" colors={colors} />
              <View style={s.chipsWrap}>
                {space.amenities.map((a, i) => <AmenityChip key={i} label={a} colors={colors} />)}
              </View>
            </>
          )}

          {space.rules?.length > 0 && (
            <>
              <SectionTitle title="House Rules" colors={colors} />
              <View style={s.chipsWrap}>
                {[...new Set(space.rules)].map((r, i) => <RuleChip key={i} label={r} />)}
              </View>
            </>
          )}

          <SectionTitle title="Location" colors={colors} />
          <View style={[s.mapWrapper, { borderColor: colors.border }]}>
            <MapView
              coordinates={space.location?.coordinates}
              address={`${space.location?.address}, ${space.location?.city}`}
            />
          </View>
          <SectionTitle title="Your Host" colors={colors} />
          <View style={[s.hostCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[s.hostAvatar, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="person" size={24} color={colors.primary} />
            </View>
            <View style={s.hostInfo}>
              <Text style={[s.hostName, { color: colors.textPrimary }]}>{space.owner?.name}</Text>
              {space.owner?.hostApplicationStatus === 'verified' && (
                <View style={s.verifiedBadge}>
                  <Ionicons name="shield-checkmark" size={12} color="#16A34A" />
                  <Text style={s.verifiedText}>Verified Host</Text>
                </View>
              )}
              {space.owner?.phone && (
                <Text style={[s.hostPhone, { color: colors.textLight }]}>{space.owner.phone}</Text>
              )}
            </View>
            <TouchableOpacity onPress={handleMessageHost} style={[s.hostMsgBtn, { borderColor: colors.primary }]}>
              <Ionicons name="chatbubble-outline" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={{ height: 120 }} />
        </View>
      </Animated.ScrollView>

      <View style={[s.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        {isThreadOpen ? (
          <TouchableOpacity onPress={() => router.push('/profile/notifications')} style={[s.msgBtn, { backgroundColor: colors.primary }]}>
            <Ionicons name="chatbubbles" size={18} color="#fff" />
            <Text style={s.msgBtnTextActive}>Conversation</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleMessageHost} style={[s.msgBtn, { borderWidth: 1.5, borderColor: colors.primary, backgroundColor: 'transparent' }]}>
            <Ionicons name="chatbubble-outline" size={18} color={colors.primary} />
            <Text style={[s.msgBtnText, { color: colors.primary }]}>Message</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleBookPress} activeOpacity={0.88} style={s.bookBtnWrapper}>
          <LinearGradient
            colors={['#A78BFA', '#8B5CF6', '#7C3AED']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={s.bookBtn}
          >
            <Text style={s.bookBtnText}>Book Now</Text>
            <View style={s.bookBtnArrow}>
              <Ionicons name="arrow-forward" size={13} color="#8B5CF6" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <MessageModal
        visible={messageModalVisible}
        onClose={() => { setMessageModalVisible(false); setMessageText(''); }}
        space={space}
        messageText={messageText}
        setMessageText={setMessageText}
        onSend={handleSendMessage}
        isPending={sendMessageMutation.isPending}
        title="Message Host"
        subtitle="Ask anything before you book"
      />

      <ReviewModal
        visible={reviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        rating={reviewRating}
        setRating={setReviewRating}
        comment={reviewComment}
        setComment={setReviewComment}
        onSend={() => addReviewMutation.mutate({ spaceId: id, rating: reviewRating, comment: reviewComment })}
        isPending={addReviewMutation.isPending}
      />
    </View>
  );
}
