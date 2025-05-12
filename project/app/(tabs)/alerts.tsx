import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Switch } from 'react-native';
import { Bell, Plus, ChevronRight, AlertTriangle } from 'lucide-react-native';
import Header from '@/components/Header';
import { fetchAlerts } from '@/services/alertService';
import AlertModal from '@/components/AlertModal';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  
  useEffect(() => {
    loadAlerts();
  }, []);
  
  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleAlert = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, enabled: !alert.enabled }
        : alert
    ));
  };
  
  const saveAlert = (alert) => {
    if (editingAlert) {
      // Update existing alert
      setAlerts(alerts.map(a => a.id === alert.id ? alert : a));
    } else {
      // Add new alert
      const newAlert = {
        ...alert,
        id: String(Date.now()),
      };
      setAlerts([...alerts, newAlert]);
    }
    setShowAlertModal(false);
    setEditingAlert(null);
  };
  
  const editAlert = (alert) => {
    setEditingAlert(alert);
    setShowAlertModal(true);
  };
  
  const deleteAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };
  
  const addNewAlert = () => {
    setEditingAlert(null);
    setShowAlertModal(true);
  };
  
  const renderAlertItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.alertItem}
      onPress={() => editAlert(item)}
    >
      <View style={styles.alertHeader}>
        <View style={[
          styles.alertIconContainer,
          item.type === 'bullish' ? styles.bullishIcon : 
          item.type === 'bearish' ? styles.bearishIcon : styles.neutralIcon
        ]}>
          {item.type === 'bullish' ? (
            <Bell size={18} color="#22C55E" />
          ) : item.type === 'bearish' ? (
            <Bell size={18} color="#EF4444" />
          ) : (
            <Bell size={18} color="#64748B" />
          )}
        </View>
        
        <View style={styles.alertDetails}>
          <Text style={styles.alertTitle}>{item.name}</Text>
          <Text style={styles.alertAsset}>{item.asset}</Text>
        </View>
        
        <Switch
          value={item.enabled}
          onValueChange={() => toggleAlert(item.id)}
          trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
          thumbColor={item.enabled ? '#1E3A8A' : '#F1F5F9'}
        />
      </View>
      
      <View style={styles.alertCondition}>
        <Text style={styles.conditionText}>
          {item.type === 'bullish' ? 'Bullish sentiment above ' : 
           item.type === 'bearish' ? 'Bearish sentiment below ' : 
           'Sentiment change '}
          <Text style={styles.thresholdText}>{item.threshold}{item.type === 'change' ? '%' : ''}</Text>
        </Text>
        
        <ChevronRight size={16} color="#64748B" />
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <Header title="Alerts" />
      
      <FlatList
        data={alerts}
        renderItem={renderAlertItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AlertTriangle size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Alerts Set</Text>
            <Text style={styles.emptyText}>
              Get notified when sentiment changes significantly for assets you care about.
            </Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={addNewAlert}
            >
              <Text style={styles.createButtonText}>Create Alert</Text>
            </TouchableOpacity>
          </View>
        }
      />
      
      {alerts.length > 0 && (
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={addNewAlert}
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      )}
      
      <AlertModal 
        visible={showAlertModal}
        onClose={() => {
          setShowAlertModal(false);
          setEditingAlert(null);
        }}
        onSave={saveAlert}
        onDelete={editingAlert ? () => deleteAlert(editingAlert.id) : null}
        alert={editingAlert}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  alertItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bullishIcon: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  bearishIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  neutralIcon: {
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
  },
  alertDetails: {
    flex: 1,
  },
  alertTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 2,
  },
  alertAsset: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  alertCondition: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  conditionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  thresholdText: {
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  createButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E3A8A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
});