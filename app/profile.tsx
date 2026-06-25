import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { GradientBackground } from '@/components/ui/gradient-background';

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <GradientBackground style={styles.gradientBackground}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#000000" />
            </Pressable>
            <AppText variant="title" style={styles.headerTitle}>
              Settings
            </AppText>
          </View>

          {/* Profile Section */}
          <Pressable style={styles.profileCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <AppText variant="subtitle" style={styles.profileName}>
                Jane Cooper
              </AppText>
              <AppText style={styles.profileDescription}>
                Video maker & photographer
              </AppText>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </Pressable>

          {/* Other Settings Section */}
          <View style={styles.section}>
            <AppText variant="label" style={styles.sectionTitle}>
              Other Settings
            </AppText>
            
            <SettingItem
              icon="person-outline"
              title="Profile Details"
              onPress={() => {}}
            />
            <SettingItem
              icon="lock-closed-outline"
              title="Password"
              onPress={() => {}}
            />
            <SettingItem
              icon="notifications-outline"
              title="Notifications"
              onPress={() => {}}
            />
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#E8F4FD' }]}>
                  <Ionicons name="moon-outline" size={20} color="#2196F3" />
                </View>
                <AppText style={styles.settingTitle}>Dark Mode</AppText>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#E0E0E0', true: '#E31837' }}
                thumbColor={darkMode ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </View>

          {/* Support Section */}
          <View style={styles.section}>
            <AppText variant="label" style={styles.sectionTitle}>
              Support
            </AppText>
            
            <SettingItem
              icon="headset-outline"
              title="Support"
              onPress={() => {}}
            />
            <SettingItem
              icon="alert-circle-outline"
              title="Report an Issue"
              onPress={() => {}}
            />
            <SettingItem
              icon="information-circle-outline"
              title="About Character.Ai"
              onPress={() => {}}
            />
            <SettingItem
              icon="language-outline"
              title="Language"
              onPress={() => {}}
            />
          </View>

          {/* Log Out Button */}
          <Pressable style={styles.logoutCard}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFEBEE' }]}>
                <Ionicons name="log-out-outline" size={20} color="#E31837" />
              </View>
              <AppText style={[styles.settingTitle, { color: '#E31837' }]}>
                Log out
              </AppText>
            </View>
          </Pressable>

        </ScrollView>
      </GradientBackground>
    </SafeAreaView>
  );
}

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
}

function SettingItem({ icon, title, onPress }: SettingItemProps) {
  getIconColor(icon);

  return (
    <Pressable style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: getIconBgColor(icon) }]}>
          <Ionicons name={icon} size={20} color={getIconColor(icon)} />
        </View>
        <AppText style={styles.settingTitle}>{title}</AppText>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666666" />
    </Pressable>
  );
}

function getIconColor(icon: string): string {
  const colors: Record<string, string> = {
    'person-outline': '#4CAF50',
    'lock-closed-outline': '#FF9800',
    'notifications-outline': '#9C27B0',
    'headset-outline': '#2196F3',
    'alert-circle-outline': '#F44336',
    'information-circle-outline': '#607D8B',
    'language-outline': '#00BCD4',
  };
  return colors[icon] || '#666666';
}

function getIconBgColor(icon: string): string {
  const colors: Record<string, string> = {
    'person-outline': '#E8F5E9',
    'lock-closed-outline': '#FFF3E0',
    'notifications-outline': '#F3E5F5',
    'headset-outline': '#E8F4FD',
    'alert-circle-outline': '#FFEBEE',
    'information-circle-outline': '#ECEFF1',
    'language-outline': '#E0F7FA',
  };
  return colors[icon] || '#F5F5F5';
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  profileDescription: {
    fontSize: 14,
    color: '#666666',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666666',
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
});
