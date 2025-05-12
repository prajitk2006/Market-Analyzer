import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { 
  Bell, 
  Moon, 
  Globe, 
  Clock, 
  Send, 
  Lock, 
  LogOut, 
  ChevronRight,
  Trash,
  HelpCircle
} from 'lucide-react-native';
import Header from '@/components/Header';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [timeFormat, setTimeFormat] = useState('24h');
  
  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            // Sign out logic here
            console.log('User signed out');
          },
        },
      ]
    );
  };
  
  const handleClearData = () => {
    Alert.alert(
      'Clear App Data',
      'This will remove all your watchlists and settings. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: () => {
            // Clear data logic here
            console.log('App data cleared');
          },
        },
      ]
    );
  };
  
  const openSupport = () => {
    // Open support webpage or email
    console.log('Opening support');
  };
  
  const renderSettingSwitch = (title, value, onToggle, icon) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>{icon}</View>
      <Text style={styles.settingText}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
        thumbColor={value ? '#1E3A8A' : '#F1F5F9'}
      />
    </View>
  );
  
  const renderSettingButton = (title, onPress, icon, isDestructive = false) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIcon}>{icon}</View>
      <Text style={[
        styles.settingText,
        isDestructive && styles.destructiveText
      ]}>
        {title}
      </Text>
      <ChevronRight size={20} color="#94A3B8" />
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <Header title="Settings" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          {renderSettingSwitch(
            'Notifications',
            notifications,
            setNotifications,
            <Bell size={22} color="#64748B" />
          )}
          
          {renderSettingSwitch(
            'Dark Mode',
            darkMode,
            setDarkMode,
            <Moon size={22} color="#64748B" />
          )}
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Clock size={22} color="#64748B" />
            </View>
            <Text style={styles.settingText}>Time Format</Text>
            <View style={styles.segmentedControl}>
              <TouchableOpacity 
                style={[
                  styles.segmentButton,
                  timeFormat === '12h' && styles.segmentButtonActive
                ]}
                onPress={() => setTimeFormat('12h')}
              >
                <Text style={[
                  styles.segmentButtonText,
                  timeFormat === '12h' && styles.segmentButtonTextActive
                ]}>
                  12h
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.segmentButton,
                  timeFormat === '24h' && styles.segmentButtonActive
                ]}
                onPress={() => setTimeFormat('24h')}
              >
                <Text style={[
                  styles.segmentButtonText,
                  timeFormat === '24h' && styles.segmentButtonTextActive
                ]}>
                  24h
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {renderSettingButton(
            'Language',
            () => {},
            <Globe size={22} color="#64748B" />
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          {renderSettingButton(
            'Notification Settings',
            () => {},
            <Bell size={22} color="#64748B" />
          )}
          
          {renderSettingButton(
            'Privacy',
            () => {},
            <Lock size={22} color="#64748B" />
          )}
          
          {renderSettingButton(
            'Contact Support',
            openSupport,
            <HelpCircle size={22} color="#64748B" />
          )}
          
          {renderSettingButton(
            'Sign Out',
            handleSignOut,
            <LogOut size={22} color="#64748B" />
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          {renderSettingButton(
            'Clear App Data',
            handleClearData,
            <Trash size={22} color="#EF4444" />,
            true
          )}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2025 Market Sentiment Analyzer</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 12,
    marginTop: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
  },
  destructiveText: {
    color: '#EF4444',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 2,
  },
  segmentButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  segmentButtonActive: {
    backgroundColor: '#1E3A8A',
  },
  segmentButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  segmentButtonTextActive: {
    color: 'white',
  },
  footer: {
    alignItems: 'center',
    marginVertical: 30,
    paddingBottom: 50,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 4,
  },
  copyrightText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#94A3B8',
  },
});