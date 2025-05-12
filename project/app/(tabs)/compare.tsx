import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Plus, X, BarChartHorizontal } from 'lucide-react-native';
import Header from '@/components/Header';
import ComparisonChart from '@/components/ComparisonChart';
import { fetchComparisonData } from '@/services/marketService';
import AssetPickerModal from '@/components/AssetPickerModal';

export default function CompareScreen() {
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [timeRange, setTimeRange] = useState('1W');
  
  const timeRanges = ['1D', '1W', '1M', '3M', '1Y'];
  
  useEffect(() => {
    if (selectedAssets.length > 0) {
      loadComparisonData();
    }
  }, [selectedAssets, timeRange]);
  
  const loadComparisonData = async () => {
    if (selectedAssets.length === 0) return;
    
    setIsLoading(true);
    try {
      const assetIds = selectedAssets.map(asset => asset.id);
      const data = await fetchComparisonData(assetIds, timeRange);
      setComparisonData(data);
    } catch (error) {
      console.error('Error loading comparison data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const addAsset = (asset) => {
    if (selectedAssets.length < 3 && !selectedAssets.find(a => a.id === asset.id)) {
      setSelectedAssets([...selectedAssets, asset]);
    }
    setShowAssetPicker(false);
  };
  
  const removeAsset = (assetId) => {
    setSelectedAssets(selectedAssets.filter(asset => asset.id !== assetId));
  };
  
  const renderAssetChip = (asset, index) => (
    <View key={asset.id} 
      style={[
        styles.assetChip,
        { backgroundColor: getAssetColor(index) }
      ]}
    >
      <Text style={styles.assetChipText}>{asset.symbol}</Text>
      <TouchableOpacity
        style={styles.removeChipButton}
        onPress={() => removeAsset(asset.id)}
      >
        <X size={14} color="white" />
      </TouchableOpacity>
    </View>
  );
  
  const getAssetColor = (index) => {
    const colors = ['#1E3A8A', '#0D9488', '#EA580C'];
    return colors[index % colors.length];
  };
  
  return (
    <View style={styles.container}>
      <Header title="Compare Assets" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.assetSelectionContainer}>
            <Text style={styles.sectionTitle}>Selected Assets</Text>
            
            <View style={styles.chipsContainer}>
              {selectedAssets.map((asset, index) => renderAssetChip(asset, index))}
              
              {selectedAssets.length < 3 && (
                <TouchableOpacity 
                  style={styles.addChipButton}
                  onPress={() => setShowAssetPicker(true)}
                >
                  <Plus size={16} color="#1E3A8A" />
                  <Text style={styles.addChipText}>Add</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          {selectedAssets.length > 0 && (
            <View style={styles.timeRangeContainer}>
              <Text style={styles.sectionTitle}>Time Range</Text>
              
              <View style={styles.timeRangeButtons}>
                {timeRanges.map((range) => (
                  <TouchableOpacity 
                    key={range}
                    style={[
                      styles.timeRangeButton,
                      timeRange === range && styles.activeTimeRange
                    ]}
                    onPress={() => setTimeRange(range)}
                  >
                    <Text 
                      style={[
                        styles.timeRangeText,
                        timeRange === range && styles.activeTimeRangeText
                      ]}
                    >
                      {range}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          
          {selectedAssets.length > 0 ? (
            <View style={styles.chartCard}>
              {isLoading ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#1E3A8A" />
                </View>
              ) : (
                <>
                  <Text style={styles.chartTitle}>Sentiment Comparison</Text>
                  <ComparisonChart 
                    data={comparisonData} 
                    assets={selectedAssets}
                    getAssetColor={getAssetColor}
                  />
                  
                  {comparisonData && comparisonData.insights && (
                    <View style={styles.insightsContainer}>
                      <Text style={styles.insightsTitle}>Key Insights</Text>
                      {comparisonData.insights.map((insight, index) => (
                        <Text key={index} style={styles.insightText}>
                          • {insight}
                        </Text>
                      ))}
                    </View>
                  )}
                </>
              )}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <BarChartHorizontal size={48} color="#94A3B8" />
              <Text style={styles.emptyTitle}>Compare Assets</Text>
              <Text style={styles.emptyText}>
                Add up to 3 assets to compare their sentiment trends over time.
              </Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setShowAssetPicker(true)}
              >
                <Text style={styles.addButtonText}>Add Assets</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      
      <AssetPickerModal 
        visible={showAssetPicker}
        onClose={() => setShowAssetPicker(false)}
        onSelectAsset={addAsset}
        currentWatchlist={selectedAssets}
      />
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
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  assetSelectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  assetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  assetChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'white',
  },
  removeChipButton: {
    marginLeft: 6,
  },
  addChipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    marginBottom: 8,
  },
  addChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1E3A8A',
    marginLeft: 4,
  },
  timeRangeContainer: {
    marginBottom: 20,
  },
  timeRangeButtons: {
    flexDirection: 'row',
  },
  timeRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeTimeRange: {
    backgroundColor: '#1E3A8A',
  },
  timeRangeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  activeTimeRangeText: {
    color: 'white',
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  chartTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 16,
  },
  loaderContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightsContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  insightsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 12,
  },
  insightText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    lineHeight: 20,
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
  addButton: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  addButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
  },
});