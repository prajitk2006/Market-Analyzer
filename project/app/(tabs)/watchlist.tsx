import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Plus, X, ArrowUp, ArrowDown, Search } from 'lucide-react-native';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import { fetchWatchlistData } from '@/services/marketService';
import AssetPickerModal from '@/components/AssetPickerModal';

export default function WatchlistScreen() {
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    loadWatchlistData();
  }, []);
  
  const loadWatchlistData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchWatchlistData();
      setWatchlist(data);
    } catch (error) {
      console.error('Error loading watchlist:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const addToWatchlist = (asset) => {
    setWatchlist([...watchlist, asset]);
    setShowAssetPicker(false);
  };
  
  const removeFromWatchlist = (assetId) => {
    setWatchlist(watchlist.filter(asset => asset.id !== assetId));
  };
  
  const filteredWatchlist = searchQuery 
    ? watchlist.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : watchlist;
  
  const renderWatchlistItem = ({ item }) => (
    <View style={styles.watchlistItem}>
      <View style={styles.assetInfo}>
        <View style={styles.assetIconContainer}>
          <Text style={styles.assetIconText}>{item.symbol.substring(0, 2)}</Text>
        </View>
        <View style={styles.assetDetails}>
          <Text style={styles.assetName}>{item.name}</Text>
          <Text style={styles.assetSymbol}>{item.symbol}</Text>
        </View>
      </View>
      
      <View style={styles.assetMetrics}>
        <View style={styles.metricContainer}>
          <Text style={styles.metricLabel}>Sentiment</Text>
          <View style={[
            styles.sentimentBadge,
            item.sentiment > 0.3 ? styles.bullishBadge : 
            item.sentiment < -0.3 ? styles.bearishBadge : styles.neutralBadge
          ]}>
            <Text style={styles.sentimentText}>
              {item.sentiment > 0.3 ? 'Bullish' : 
               item.sentiment < -0.3 ? 'Bearish' : 'Neutral'}
            </Text>
          </View>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${item.price.toLocaleString()}</Text>
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
        
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeFromWatchlist(item.id)}
        >
          <X size={16} color="#64748B" />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <Header title="Watchlist" />
      
      <View style={styles.searchContainer}>
        <SearchBar 
          placeholder="Search assets..." 
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1E3A8A" />
        </View>
      ) : (
        <>
          <FlatList
            data={filteredWatchlist}
            renderItem={renderWatchlistItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No assets in your watchlist</Text>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => setShowAssetPicker(true)}
                >
                  <Text style={styles.addButtonText}>Add Assets</Text>
                </TouchableOpacity>
              </View>
            }
          />
          
          {watchlist.length > 0 && (
            <TouchableOpacity 
              style={styles.floatingButton}
              onPress={() => setShowAssetPicker(true)}
            >
              <Plus size={24} color="white" />
            </TouchableOpacity>
          )}
        </>
      )}
      
      <AssetPickerModal 
        visible={showAssetPicker}
        onClose={() => setShowAssetPicker(false)}
        onSelectAsset={addToWatchlist}
        currentWatchlist={watchlist}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  watchlistItem: {
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
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  assetMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricContainer: {
    flex: 1,
  },
  metricLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  sentimentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  bullishBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  bearishBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  neutralBadge: {
    backgroundColor: 'rgba(100, 116, 139, 0.1)',
  },
  sentimentText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#1E293B',
  },
  priceContainer: {
    alignItems: 'flex-end',
    flex: 1,
  },
  price: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 2,
  },
  positiveChange: {
    color: '#22C55E',
  },
  negativeChange: {
    color: '#EF4444',
  },
  removeButton: {
    padding: 8,
    marginLeft: 12,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
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