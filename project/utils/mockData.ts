// Mock data utilities for the Market Sentiment Analyzer app
// These functions generate realistic-looking mock data for development and testing

// Generate random sentiment data points
const generateSentimentData = (timeRange, baseValue = 0, volatility = 0.3) => {
  const points = [];
  let numPoints;
  
  // Determine number of data points based on time range
  switch (timeRange) {
    case '1D': numPoints = 24; break;     // Hourly data
    case '1W': numPoints = 7; break;      // Daily data
    case '1M': numPoints = 30; break;     // Daily data
    case '3M': numPoints = 90; break;     // Daily data
    case '1Y': numPoints = 52; break;     // Weekly data
    case 'All': numPoints = 60; break;    // Monthly data
    default: numPoints = 30;
  }
  
  const now = new Date();
  let currentValue = baseValue;
  
  for (let i = 0; i < numPoints; i++) {
    // Create realistic-looking sentiment movement
    const change = (Math.random() - 0.5) * volatility;
    currentValue += change;
    
    // Keep values within a reasonable range (-1 to 1)
    currentValue = Math.max(-1, Math.min(1, currentValue));
    
    // Calculate the date
    const date = new Date(now);
    
    switch (timeRange) {
      case '1D':
        date.setHours(now.getHours() - (numPoints - i - 1));
        break;
      case '1W':
      case '1M':
      case '3M':
        date.setDate(now.getDate() - (numPoints - i - 1));
        break;
      case '1Y':
        date.setDate(now.getDate() - (numPoints - i - 1) * 7);
        break;
      case 'All':
        date.setMonth(now.getMonth() - (numPoints - i - 1));
        break;
      default:
        date.setDate(now.getDate() - (numPoints - i - 1));
    }
    
    points.push({
      date: date.toISOString(),
      value: currentValue
    });
  }
  
  return points;
};

// Mock market data for a specific asset and time range
export const mockMarketData = (symbol, timeRange) => {
  // Create base sentiment value based on symbol
  const symbolHash = symbol.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const baseSentiment = (symbolHash % 100) / 100 * 0.8 - 0.4; // Range between -0.4 and 0.4
  
  // Generate sentiment data for the time range
  const sentimentData = generateSentimentData(timeRange, baseSentiment, 0.3);
  
  // Calculate current sentiment score (last value)
  const sentimentScore = sentimentData[sentimentData.length - 1].value;
  
  // Generate a realistic price based on the symbol
  const basePrice = (symbolHash % 1000) + 10;
  
  // Calculate change percentage with some correlation to sentiment
  const change = sentimentScore * 10 + (Math.random() - 0.5) * 5;
  
  // Calculate bullish/bearish percentages
  const sentimentAverage = sentimentData.reduce((sum, item) => sum + item.value, 0) / sentimentData.length;
  const bullishPercentage = Math.round((sentimentAverage + 1) * 50);
  const bearishPercentage = 100 - bullishPercentage;
  
  return {
    name: getAssetName(symbol),
    symbol,
    price: basePrice,
    change,
    sentimentData,
    sentimentScore,
    bullishPercentage,
    bearishPercentage,
  };
};

// Mock watchlist data
export const mockWatchlistData = () => {
  const symbols = ['BTC', 'ETH', 'AAPL', 'MSFT', 'AMZN', 'GOOGL', 'TSLA'];
  const watchlistItems = [];
  
  // Choose a random number of items for the watchlist
  const numItems = Math.floor(Math.random() * 4) + 3; // 3 to 6 items
  
  for (let i = 0; i < numItems; i++) {
    const symbol = symbols[i];
    const symbolHash = symbol.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const baseSentiment = (symbolHash % 100) / 100 * 1.6 - 0.8; // Range between -0.8 and 0.8
    
    watchlistItems.push({
      id: `watchlist-${i}`,
      name: getAssetName(symbol),
      symbol,
      price: (symbolHash % 1000) + 10,
      change: baseSentiment * 8 + (Math.random() - 0.5) * 6,
      sentiment: baseSentiment,
    });
  }
  
  return watchlistItems;
};

// Mock top assets based on category
export const mockTopAssets = (category) => {
  let symbols;
  
  // Different assets for different categories
  switch (category) {
    case 'trending':
      symbols = ['BTC', 'AAPL', 'TSLA', 'ETH', 'NVDA'];
      break;
    case 'stocks':
      symbols = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'TSLA'];
      break;
    case 'crypto':
      symbols = ['BTC', 'ETH', 'XRP', 'ADA', 'SOL'];
      break;
    default:
      symbols = ['BTC', 'AAPL', 'TSLA', 'ETH', 'NVDA'];
  }
  
  return symbols.map((symbol, index) => {
    const symbolHash = symbol.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const baseSentiment = (symbolHash % 100) / 100 * 1.6 - 0.8; // Range between -0.8 and 0.8
    
    return {
      id: `top-${index}`,
      name: getAssetName(symbol),
      symbol,
      price: (symbolHash % 1000) + 10,
      change: baseSentiment * 8 + (Math.random() - 0.5) * 6,
      sentiment: baseSentiment,
    };
  });
};

// Mock all available assets
export const mockAssets = () => {
  const stocks = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'TSLA', 'META', 'NFLX', 'AMD', 'NVDA', 'PYPL'];
  const cryptos = ['BTC', 'ETH', 'XRP', 'ADA', 'SOL', 'DOT', 'AVAX', 'LINK', 'UNI', 'DOGE'];
  
  const allAssets = [];
  
  stocks.forEach((symbol, index) => {
    allAssets.push({
      id: `stock-${index}`,
      name: getAssetName(symbol),
      symbol,
      type: 'stock',
    });
  });
  
  cryptos.forEach((symbol, index) => {
    allAssets.push({
      id: `crypto-${index}`,
      name: getAssetName(symbol),
      symbol,
      type: 'crypto',
    });
  });
  
  return allAssets;
};

// Mock alerts
export const mockAlerts = () => {
  return [
    {
      id: 'alert-1',
      name: 'Bitcoin Bull Run',
      asset: {
        id: 'crypto-0',
        name: 'Bitcoin',
        symbol: 'BTC',
        type: 'crypto',
      },
      type: 'bullish',
      threshold: 0.7,
      enabled: true,
    },
    {
      id: 'alert-2',
      name: 'Tesla Bear Warning',
      asset: {
        id: 'stock-4',
        name: 'Tesla, Inc.',
        symbol: 'TSLA',
        type: 'stock',
      },
      type: 'bearish',
      threshold: -0.6,
      enabled: false,
    },
    {
      id: 'alert-3',
      name: 'Ethereum Sentiment Change',
      asset: {
        id: 'crypto-1',
        name: 'Ethereum',
        symbol: 'ETH',
        type: 'crypto',
      },
      type: 'change',
      threshold: 15,
      enabled: true,
    }
  ];
};

// Mock comparison data
export const mockComparisonData = (assetIds, timeRange) => {
  const series = {};
  
  assetIds.forEach((assetId, index) => {
    // Create base sentiment value based on asset ID
    const assetHash = assetId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const baseSentiment = (assetHash % 100) / 100 * 0.8 - 0.4; // Range between -0.4 and 0.4
    
    // Generate sentiment data with different volatility for each asset
    const volatility = 0.2 + (index * 0.05);
    series[assetId] = generateSentimentData(timeRange, baseSentiment, volatility);
  });
  
  // Generate some insights
  const insights = [
    'Bitcoin shows the highest sentiment volatility over the period.',
    'Ethereum sentiment typically leads Bitcoin movements by 1-2 days.',
    'Tesla sentiment correlates more strongly with crypto than other tech stocks.',
    'Major news events on April 15 affected all assets simultaneously.'
  ];
  
  // Randomly select 2-3 insights
  const selectedInsights = [];
  const numInsights = Math.floor(Math.random() * 2) + 2; // 2-3 insights
  
  for (let i = 0; i < numInsights; i++) {
    const randomIndex = Math.floor(Math.random() * insights.length);
    selectedInsights.push(insights[randomIndex]);
    insights.splice(randomIndex, 1);
  }
  
  return {
    series,
    insights: selectedInsights
  };
};

// Helper function to get a full asset name from symbol
function getAssetName(symbol) {
  const assetNames = {
    BTC: 'Bitcoin',
    ETH: 'Ethereum',
    XRP: 'Ripple',
    ADA: 'Cardano',
    SOL: 'Solana',
    DOT: 'Polkadot',
    AVAX: 'Avalanche',
    LINK: 'Chainlink',
    UNI: 'Uniswap',
    DOGE: 'Dogecoin',
    AAPL: 'Apple Inc.',
    MSFT: 'Microsoft Corporation',
    AMZN: 'Amazon.com, Inc.',
    GOOGL: 'Alphabet Inc.',
    TSLA: 'Tesla, Inc.',
    META: 'Meta Platforms, Inc.',
    NFLX: 'Netflix, Inc.',
    AMD: 'Advanced Micro Devices, Inc.',
    NVDA: 'NVIDIA Corporation',
    PYPL: 'PayPal Holdings, Inc.'
  };
  
  return assetNames[symbol] || symbol;
}