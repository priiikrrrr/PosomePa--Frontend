import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { bookingsAPI, usersAPI, spacesAPI } from '../../src/api/client';
import BookingCard from '../../src/components/BookingCard';
import PageHeader from '../../src/components/PageHeader';
import StatCard from '../../src/components/StatCard';
import MenuItem from '../../src/components/MenuItem';
import { colors, spacing, borderRadius, shadows } from '../../src/utils/theme';

export default function AdminDashboard() {
  const router = useRouter();
  const { logout } = useAuth();

  const { data: bookingStats } = useQuery({
    queryKey: ['bookingStats'],
    queryFn: () => bookingsAPI.getStats().then(res => res.data),
  });

  const { data: userStats } = useQuery({
    queryKey: ['userStats'],
    queryFn: () => usersAPI.getStats().then(res => res.data),
  });

  const { data: spacesData } = useQuery({
    queryKey: ['allSpaces'],
    queryFn: () => spacesAPI.getAll({ limit: 100 }).then(res => res.data),
  });

  const stats = bookingStats?.stats || {};
  const userStatsData = userStats?.stats || {};
  const totalSpaces = spacesData?.spaces?.length || 0;

  const menuItems = [
    { icon: 'wallet', label: 'Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, sublabel: 'Total Revenue', color: colors.primary },
    { icon: 'calendar', label: 'Bookings', value: stats.totalBookings || 0, sublabel: 'Total Bookings', color: colors.secondary },
    { icon: 'home', label: 'Spaces', value: totalSpaces, sublabel: 'Active Listings', color: colors.accent },
    { icon: 'people', label: 'Users', value: userStatsData.totalUsers || 0, sublabel: 'Total Users', color: '#8B5CF6' },
  ];

  const quickActions = [
    { icon: 'home-outline', label: 'Manage Spaces', description: 'Add, edit, or remove spaces', route: '/admin/spaces', color: colors.primary },
    { icon: 'calendar-outline', label: 'Manage Bookings', description: 'View and manage bookings', route: '/admin/bookings', color: colors.secondary },
    { icon: 'people-outline', label: 'Manage Users', description: 'View and manage users', route: '/admin/users', color: '#8B5CF6' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <PageHeader
          title="Admin Panel"
          subtitle="Dashboard"
          variant="simple"
          rightAction={
            <TouchableOpacity onPress={() => logout()} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={22} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>
          }
        />

        <View style={styles.content}>
          <View style={styles.statsGrid}>
            {menuItems.map((item, idx) => (
              <StatCard key={idx} {...item} colors={colors} />
            ))}
          </View>

          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.menuCard}>
            {quickActions.map((item, idx) => (
              <MenuItem 
                key={idx} 
                {...item} 
                colors={colors}
                onPress={() => router.push(item.route)} 
              />
            ))}
          </View>

          <Text style={styles.sectionTitle}>Recent Bookings</Text>
          <View style={styles.menuCard}>
            {(bookingStats?.recentBookings || []).length > 0 ? (
              bookingStats.recentBookings.slice(0, 3).map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  isAdmin
                  onPress={() => router.push(`/admin/bookings?id=${booking._id}`)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={48} color={colors.textLight} />
                <Text style={styles.emptyText}>No recent bookings</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    ...shadows.md,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: spacing.md,
  },
});
