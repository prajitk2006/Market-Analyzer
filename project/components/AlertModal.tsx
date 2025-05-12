import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  SafeAreaView,
  Pressable,
  TextInput,
  Switch,
  ScrollView
} from 'react-native';
import { X, Trash } from 'lucide-react-native';
import SearchBar from './SearchBar';
import { fetchAllAssets } from '@/services/marketService';

interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (alert: any) => void;
  onDelete?: (alertId: string) => void;
  alert?: any;
}

export default function AlertModal({ visible, onClose, onSave, onDelete, alert }: AlertModalProps) {
  const [name, setName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [alertType, setAlertType] = useState('bullish');
  const [threshold, setThreshold] = useState('0.5');
  const [enabled, setEnabled] = useState(true);
  
  useEffect(() => {
    if (visible) {
      loadAssets();
      
      // If editing an existing alert, populate the form
      if (alert) {
        setName(alert.name);
        setSelectedAsset(alert.asset);
        setAlertType(alert.type);
        setThreshold(String(alert.threshold));
        setEnabled(alert.enabled);
      } else {
        // Default values for new alert
        setName('');
        setSelectedAsset(null);
        setAlertType('bullish');
        setThreshold('0.5');
        setEnabled(true);
      }
    }
  }, [visible, alert]);
  
  useEffect(() => {
    filterAssets();
  }, [searchQuery, assets]);
  
  const loadAssets = async () => {
    try {
      const data = await fetchAllAssets();
      setAssets(data);
      setFilteredAssets(data);
    } catch (error) {
      console.error('Error loading assets:', error);
    }
  };
  
  const filterAssets = () => {
    if (searchQuery) {
      const filtered = assets.filter(
        asset => 
          asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAssets(filtered);
    } else {
      setFilteredAssets(assets);
    }
  };
  
  const handleSelectAsset = (asset) => {
    setSelectedAsset(asset);
    setShowAssetPicker(false);
  };
  
  const handleSave = () => {
    const alertData = {
      id: alert ? alert.id : null,
      name,
      asset: selectedAsset,
      type: alertType,
      threshold: parseFloat(threshold),
      enabled,
    };
    onSave(alertData);
  };
  
  const isFormValid = () => {
    return name.trim() !== '' && 
           selectedAsset !== null && 
           threshold !== '' && 
           !isNaN(parseFloat(threshold));
  };
  
  const renderAssetItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.assetItem}
      onPress={() => handleSelectAsset(item)}
    >
      <View style={styles.assetIconContainer}>
        <Text style={styles.assetIconText}>{item.symbol.substring(0, 2)}</Text>
      </View>
      
      <View style={styles.assetDetails}>
        <Text style={styles.assetName}>{item.name}</Text>
        <Text style={styles.assetSymbol}>{item.symbol}</Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <SafeAreaView style={styles.modalContent}>
          {showAssetPicker ? (
            // Asset picker view
            <>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Asset</Text>
                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={() => setShowAssetPicker(false)}
                >
                  <X size={24} color="#1E293B" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.searchContainer}>
                <SearchBar 
                  placeholder="Search assets..." 
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              
              <ScrollView>
                {filteredAssets.map((asset) => (
                  <TouchableOpacity 
                    key={asset.id}
                    style={styles.assetItem}
                    onPress={() => handleSelectAsset(asset)}
                  >
                    <View style={styles.assetIconContainer}>
                      <Text style={styles.assetIconText}>{asset.symbol.substring(0, 2)}</Text>
                    </View>
                    
                    <View style={styles.assetDetails}>
                      <Text style={styles.assetName}>{asset.name}</Text>
                      <Text style={styles.assetSymbol}>{asset.symbol}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          ) : (
            // Alert creation/editing view
            <>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {alert ? 'Edit Alert' : 'Create Alert'}
                </Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <X size={24} color="#1E293B" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.formContainer}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Alert Name</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter a name for this alert"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Asset</Text>
                  <TouchableOpacity 
                    style={styles.assetSelector}
                    onPress={() => setShowAssetPicker(true)}
                  >
                    {selectedAsset ? (
                      <View style={styles.selectedAsset}>
                        <View style={styles.assetIconContainer}>
                          <Text style={styles.assetIconText}>{selectedAsset.symbol.substring(0, 2)}</Text>
                        </View>
                        <View style={styles.assetDetails}>
                          <Text style={styles.assetName}>{selectedAsset.name}</Text>
                          <Text style={styles.assetSymbol}>{selectedAsset.symbol}</Text>
                        </View>
                      </View>
                    ) : (
                      <Text style={styles.assetPlaceholder}>Select an asset</Text>
                    )}
                  </TouchableOpacity>
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Alert Type</Text>
                  <View style={styles.alertTypeContainer}>
                    <TouchableOpacity 
                      style={[
                        styles.alertTypeButton,
                        alertType === 'bullish' && styles.activeAlertType
                      ]}
                      onPress={() => setAlertType('bullish')}
                    >
                      <Text style={[
                        styles.alertTypeText,
                        alertType === 'bullish' && styles.activeAlertTypeText
                      ]}>
                        Bullish
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.alertTypeButton,
                        alertType === 'bearish' && styles.activeAlertType
                      ]}
                      onPress={() => setAlertType('bearish')}
                    >
                      <Text style={[
                        styles.alertTypeText,
                        alertType === 'bearish' && styles.activeAlertTypeText
                      ]}>
                        Bearish
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[
                        styles.alertTypeButton,
                        alertType === 'change' && styles.activeAlertType
                      ]}
                      onPress={() => setAlertType('change')}
                    >
                      <Text style={[
                        styles.alertTypeText,
                        alertType === 'change' && styles.activeAlertTypeText
                      ]}>
                        Change
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Threshold</Text>
                  <View style={styles.thresholdContainer}>
                    <TextInput
                      style={styles.thresholdInput}
                      value={threshold}
                      onChangeText={setThreshold}
                      keyboardType="decimal-pad"
                    />
                    <Text style={styles.thresholdUnit}>
                      {alertType === 'change' ? '%' : ''}
                    </Text>
                  </View>
                  <Text style={styles.helperText}>
                    {alertType === 'bullish' 
                      ? 'Alert when sentiment is above this value'
                      : alertType === 'bearish'
                      ? 'Alert when sentiment is below this value'
                      : 'Alert when sentiment changes by this percentage'}
                  </Text>
                </View>
                
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Enabled</Text>
                  <Switch
                    value={enabled}
                    onValueChange={setEnabled}
                    trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                    thumbColor={enabled ? '#1E3A8A' : '#F1F5F9'}
                  />
                </View>
                
                {onDelete && (
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => onDelete(alert.id)}
                  >
                    <Trash size={20} color="#EF4444" />
                    <Text style={styles.deleteButtonText}>Delete Alert</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[
                    styles.saveButton,
                    !isFormValid() && styles.disabledButton
                  ]}
                  onPress={handleSave}
                  disabled={!isFormValid()}
                >
                  <Text style={styles.saveButtonText}>
                    {alert ? 'Update Alert' : 'Create Alert'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    padding: 16,
  },
  assetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  assetIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  assetIconText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#0369A1',
  },
  assetDetails: {
    flex: 1,
  },
  assetName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 2,
  },
  assetSymbol: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  assetSelector: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectedAsset: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetPlaceholder: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#94A3B8',
  },
  alertTypeContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 4,
  },
  alertTypeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeAlertType: {
    backgroundColor: '#1E3A8A',
  },
  alertTypeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  activeAlertTypeText: {
    color: 'white',
  },
  thresholdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thresholdInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  thresholdUnit: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 8,
  },
  helperText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  switchLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1E293B',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 16,
  },
  deleteButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#EF4444',
    marginLeft: 8,
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  saveButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CBD5E1',
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
  },
});