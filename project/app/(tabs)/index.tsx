import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowUp, ArrowDown, Filter } from 'lucide-react-native';
import Header from '@/components/Header';
import SentimentChart from '@/components/SentimentChart';
import MarketOverview from '@/components/MarketOverview';
import { fetchMarketData } from '@/services/marketService';
import FilterModal from '@/components/FilterModal';

export default function DashboardScreen() {
  const [marketData, setMarketData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('1D');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  
  const timeRanges = ['1D', '1W', '1M', '3M', '1Y', 'All'];
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchMarketData(selectedAsset, timeRange);
        setMarketData(data);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Set up polling for real-time updates
    const interval = setInterval(loadData, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [selectedAsset, timeRange]);
  
  return (
    <View style={styles.container}>
      <Header title="Market Sentiment" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.overviewCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.assetName}>{marketData?.name || selectedAsset}</Text>
              {marketData && (
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>${marketData.price.toLocaleString()}</Text>
                  <View style={[
                    styles.changeContainer, 
                    marketData.change >= 0 ? styles.positive : styles.negative
                  ]}>
                    {marketData.change >= 0 ? (
                      <ArrowUp size={14} color="#22C55E" />
                    ) : (
                      <ArrowDown size={14} color="#EF4444" />
                    )}
                    <Text style={[
                      styles.changeText,
                      marketData.change >= 0 ? styles.positiveText : styles.negativeText
                    ]}>
                      {Math.abs(marketData?.change || 0).toFixed(2)}%
                    </Text>
                  </View>
                </View>
              )}
            </View>
            
            <View style={styles.timeRangeContainer}>
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
              
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => setShowFilterModal(true)}
              >
                <Filter size={16} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.chartContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#1E3A8A" />
              ) : (
                <SentimentChart data={marketData?.sentimentData || []} timeRange={timeRange} />
              )}
            </View>
            
            <View style={styles.sentimentMetricsContainer}>
              <View style={styles.sentimentMetric}>
                <Text style={styles.metricLabel}>Sentiment Score</Text>
                <Text style={[
                  styles.metricValue,
                  (marketData?.sentimentScore || 0) > 0 ? styles.positiveText : 
                  (marketData?.sentimentScore || 0) < 0 ? styles.negativeText : styles.neutralText
                ]}>
                  {marketData?.sentimentScore?.toFixed(2) || "-"}
                </Text>
              </View>
              
              <View style={styles.sentimentMetric}>
                <Text style={styles.metricLabel}>Bullish</Text>
                <Text style={styles.metricValue}>{marketData?.bullishPercentage || "-"}%</Text>
              </View>
              
              <View style={styles.sentimentMetric}>
                <Text style={styles.metricLabel}>Bearish</Text>
                <Text style={styles.metricValue}>{marketData?.bearishPercentage || "-"}%</Text>
              </View>
            </View>
          </View>
          
          <MarketOverview onSelectAsset={setSelectedAsset} selectedAsset={selectedAsset} />
        </View>
      </ScrollView>
      
      <FilterModal 
        visible={showFilterModal} 
        onClose={() => setShowFilterModal(false)} 
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
  overviewCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  assetName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  positive: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  negative: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  changeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 2,
  },
  positiveText: {
    color: '#22C55E',
  },
  negativeText: {
    color: '#EF4444',
  },
  neutralText: {
    color: '#64748B',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  timeRangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  activeTimeRange: {
    backgroundColor: '#1E3A8A',
  },
  timeRangeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  activeTimeRangeText: {
    color: 'white',
  },
  filterButton: {
    marginLeft: 'auto',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  chartContainer: {
    height: 250,
    marginBottom: 16,
    justifyContent: 'center',
  },
  sentimentMetricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sentimentMetric: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
  },
});