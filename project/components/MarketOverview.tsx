import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ArrowUp, ArrowDown } from 'lucide-react-native';
import { fetchTopAssets } from '@/services/marketService';

interface MarketOverviewProps {
  onSelectAsset: (asset: string) => void;
  selectedAsset: string;
}

export default function MarketOverview({ onSelectAsset, selectedAsset }: MarketOverviewProps) {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trending');
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTopAssets(activeTab);
        setAssets(data);
      } catch (error) {
        console.error('Error loading top assets:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [activeTab]);
  
  const renderAssetItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.assetItem,
        selectedAsset === item.symbol && styles.selectedAsset
      ]}
      onPress={() => onSelectAsset(item.symbol)}
    >
      <View style={styles.assetIconContainer}>
        <Text style={styles.assetIconText}>{item.symbol.substring(0, 2)}</Text>
      </View>
      
      <View style={styles.assetDetails}>
        <Text style={styles.assetName}>{item.name}</Text>
        <Text style={styles.assetSymbol}>{item.symbol}</Text>
      </View>
      
      <View style={styles.assetMetrics}>
        <Text style={styles.assetPrice}>${item.price.toLocaleString()}</Text>
        <View style={styles.changeContainer}>
          {item.change >= 0 ? (
            <ArrowUp size={12} color="#22C55E" />
          ) : (
            <ArrowDown size={12} color="#EF4444" />
          )}
          <Text style={[
            styles.changeText,
            item.change >= 0 ? styles.positiveChange : styles.negativeChange
          ]}>
            {Math.abs(item.change).toFixed(2)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Market Overview</Text>
        
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'trending' && styles.activeTab]}
            onPress={() => setActiveTab('trending')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'trending' && styles.activeTabText
            ]}>
              Trending
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'stocks' && styles.activeTab]}
            onPress={() => setActiveTab('stocks')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'stocks' && styles.activeTabText
            ]}>
              Stocks
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'crypto' && styles.activeTab]}
            onPress={() => setActiveTab('crypto')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'crypto' && styles.activeTabText
            ]}>
              Crypto
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={assets}
        renderItem={renderAssetItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.assetList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 2,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#1E3A8A',
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#64748B',
  },
  activeTabText: {
    color: 'white',
  },
  assetList: {
    paddingVertical: 8,
  },
  assetItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    width: 160,
    marginRight: 12,
  },
  selectedAsset: {
    borderWidth: 2,
    borderColor: '#1E3A8A',
  },
  assetIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  assetIconText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#0369A1',
  },
  assetDetails: {
    marginBottom: 12,
  },
  assetName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1E293B',
    marginBottom: 2,
  },
  assetSymbol: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
  },
  assetMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assetPrice: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1E293B',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginLeft: 2,
  },
  positiveChange: {
    color: '#22C55E',
  },
  negativeChange: {
    color: '#EF4444',
  },
});