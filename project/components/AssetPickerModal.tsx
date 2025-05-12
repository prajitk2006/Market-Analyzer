import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  Pressable,
  ActivityIndicator
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import SearchBar from './SearchBar';
import { fetchAllAssets } from '@/services/marketService';

interface AssetPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectAsset: (asset: any) => void;
  currentWatchlist: any[];
}

export default function AssetPickerModal({ 
  visible, 
  onClose, 
  onSelectAsset,
  currentWatchlist = []
}: AssetPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  
  useEffect(() => {
    if (visible) {
      loadAssets();
    }
  }, [visible]);
  
  useEffect(() => {
    filterAssets();
  }, [searchQuery, assets, activeFilter]);
  
  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllAssets();
      setAssets(data);
      setFilteredAssets(data);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const filterAssets = () => {
    // First filter by type
    let result = assets;
    if (activeFilter === 'stocks') {
      result = assets.filter(asset => asset.type === 'stock');
    } else if (activeFilter === 'crypto') {
      result = assets.filter(asset => asset.type === 'crypto');
    }
    
    // Then filter by search query
    if (searchQuery) {
      result = result.filter(
        asset => 
          asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredAssets(result);
  };
  
  const isAssetInWatchlist = (assetId) => {
    return currentWatchlist.some(item => item.id === assetId);
  };
  
  const renderAssetItem = ({ item }) => {
    const isInWatchlist = isAssetInWatchlist(item.id);
    
    return (
      <TouchableOpacity 
        style={styles.assetItem}
        onPress={() => onSelectAsset(item)}
        disabled={isInWatchlist}
      >
        <View style={styles.assetInfo}>
          <View style={[
            styles.assetIconContainer,
            { opacity: isInWatchlist ? 0.5 : 1 }
          ]}>
            <Text style={styles.assetIconText}>{item.symbol.substring(0, 2)}</Text>
          </View>
          
          <View style={styles.assetDetails}>
            <Text style={[
              styles.assetName,
              { opacity: isInWatchlist ? 0.5 : 1 }
            ]}>
              {item.name}
            </Text>
            <Text style={[
              styles.assetSymbol,
              { opacity: isInWatchlist ? 0.5 : 1 }
            ]}>
              {item.symbol} • {item.type === 'stock' ? 'Stock' : 'Crypto'}
            </Text>
          </View>
        </View>
        
        <View style={styles.actionContainer}>
          {isInWatchlist ? (
            <View style={styles.addedBadge}>
              <Check size={16} color="#22C55E" />
              <Text style={styles.addedText}>Added</Text>
            </View>
          ) : (
            <View style={styles.addButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
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
            <Text style={styles.modalTitle}>Add Asset</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#1E293B" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchContainer}>
            <SearchBar 
              placeholder="Search by name or symbol" 
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View style={styles.filterContainer}>
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === 'all' && styles.activeFilter]}
              onPress={() => setActiveFilter('all')}
            >
              <Text style={[
                styles.filterText,
                activeFilter === 'all' && styles.activeFilterText
              ]}>
                All
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === 'stocks' && styles.activeFilter]}
              onPress={() => setActiveFilter('stocks')}
            >
              <Text style={[
                styles.filterText,
                activeFilter === 'stocks' && styles.activeFilterText
              ]}>
                Stocks
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === 'crypto' && styles.activeFilter]}
              onPress={() => setActiveFilter('crypto')}
            >
              <Text style={[
                styles.filterText,
                activeFilter === 'crypto' && styles.activeFilterText
              ]}>
                Crypto
              </Text>
            </TouchableOpacity>
          </View>
          
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#1E3A8A" />
            </View>
          ) : (
            <FlatList
              data={filteredAssets}
              renderItem={renderAssetItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.assetList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No assets found</Text>
                </View>
              }
            />
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#1E3A8A',
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  activeFilterText: {
    color: 'white',
  },
  assetList: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  assetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  assetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  actionContainer: {
    marginLeft: 16,
  },
  addButton: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1E3A8A',
  },
  addedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#22C55E',
    marginLeft: 4,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#64748B',
  },
});