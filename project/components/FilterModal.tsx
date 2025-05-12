import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  SafeAreaView,
  Pressable,
  ScrollView
} from 'react-native';
import { X, Check } from 'lucide-react-native';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function FilterModal({ visible, onClose }: FilterModalProps) {
  const [selectedSources, setSelectedSources] = useState(['twitter', 'reddit', 'news']);
  const [sentimentType, setSentimentType] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  
  const toggleSource = (source) => {
    if (selectedSources.includes(source)) {
      setSelectedSources(selectedSources.filter(s => s !== source));
    } else {
      setSelectedSources([...selectedSources, source]);
    }
  };
  
  const renderCheckbox = (value, selected, label) => (
    <TouchableOpacity 
      style={styles.checkboxItem}
      onPress={() => toggleSource(value)}
    >
      <View style={[
        styles.checkbox,
        selected && styles.checkboxSelected
      ]}>
        {selected && <Check size={16} color="white" />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
  
  const renderRadioButton = (value, selected, label, setter) => (
    <TouchableOpacity 
      style={styles.radioItem}
      onPress={() => setter(value)}
    >
      <View style={styles.radioOuter}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );
  
  const applyFilters = () => {
    // Apply the filter logic
    onClose();
  };
  
  const resetFilters = () => {
    setSelectedSources(['twitter', 'reddit', 'news']);
    setSentimentType('all');
    setTimeRange('all');
  };
  
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
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#1E293B" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.scrollView}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data Sources</Text>
              {renderCheckbox('twitter', selectedSources.includes('twitter'), 'Twitter')}
              {renderCheckbox('reddit', selectedSources.includes('reddit'), 'Reddit')}
              {renderCheckbox('news', selectedSources.includes('news'), 'News Articles')}
              {renderCheckbox('stocktwits', selectedSources.includes('stocktwits'), 'StockTwits')}
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sentiment Type</Text>
              {renderRadioButton('all', sentimentType === 'all', 'All', setSentimentType)}
              {renderRadioButton('positive', sentimentType === 'positive', 'Positive Only', setSentimentType)}
              {renderRadioButton('negative', sentimentType === 'negative', 'Negative Only', setSentimentType)}
              {renderRadioButton('neutral', sentimentType === 'neutral', 'Neutral Only', setSentimentType)}
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Time Range</Text>
              {renderRadioButton('all', timeRange === 'all', 'All Time', setTimeRange)}
              {renderRadioButton('day', timeRange === 'day', 'Last 24 Hours', setTimeRange)}
              {renderRadioButton('week', timeRange === 'week', 'Last Week', setTimeRange)}
              {renderRadioButton('month', timeRange === 'month', 'Last Month', setTimeRange)}
              {renderRadioButton('year', timeRange === 'year', 'Last Year', setTimeRange)}
            </View>
          </ScrollView>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={resetFilters}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={applyFilters}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
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
    maxHeight: '80%',
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
  scrollView: {
    maxHeight: '70%',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 16,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  checkboxLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1E3A8A',
  },
  radioLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 32,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    marginRight: 8,
  },
  resetButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#64748B',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 8,
  },
  applyButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
  },
});