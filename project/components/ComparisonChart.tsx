import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-svg-charts';
import { Circle, Path, G, Line, Text as SvgText } from 'react-native-svg';
import { format } from 'date-fns';

interface ComparisonChartProps {
  data: any;
  assets: any[];
  getAssetColor: (index: number) => string;
}

export default function ComparisonChart({ data, assets, getAssetColor }: ComparisonChartProps) {
  if (!data || !data.series || Object.keys(data.series).length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No comparison data available</Text>
      </View>
    );
  }
  
  // Extract series data for each asset
  const seriesData = Object.keys(data.series).map((assetId, index) => {
    return {
      data: data.series[assetId],
      svg: { stroke: getAssetColor(index), strokeWidth: 2 },
      key: assetId,
    };
  });
  
  // Calculate min and max values for y-axis
  const allValues = Object.values(data.series).flat().map((item: any) => item.value);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  
  // Add some padding to the min/max values
  const yMin = Math.floor(minValue * 1.1);
  const yMax = Math.ceil(maxValue * 1.1);
  
  // Format x-axis labels
  const formatXLabel = (date: Date) => {
    return format(date, 'dd MMM');
  };
  
  // Calculate how many x-axis labels to show
  const xLabelCount = 5;
  
  // Get dates for x-axis from the first series (all series have the same dates)
  const firstAssetId = Object.keys(data.series)[0];
  const dates = data.series[firstAssetId].map(item => new Date(item.date));
  
  // Create x-axis labels at even intervals
  const interval = Math.ceil(dates.length / xLabelCount);
  const xLabels = [];
  
  for (let i = 0; i < dates.length; i += interval) {
    if (i < dates.length) {
      xLabels.push({
        index: i,
        label: formatXLabel(dates[i]),
      });
    }
  }
  
  // Custom decorators for each line
  const Decorator = ({ x, y, data, line }: { x: any; y: any; data: any; line: any }) => {
    return data.map((value, index) => (
      <Circle
        key={index}
        cx={x(index)}
        cy={y(value.value)}
        r={3}
        stroke={line.svg.stroke}
        strokeWidth={1.5}
        fill="white"
      />
    ));
  };
  
  // Create grid lines
  const HorizontalGrid = ({ y }: { y: any }) => {
    const gridCount = 5;
    const gridValues = [];
    
    for (let i = 0; i <= gridCount; i++) {
      const value = yMin + ((yMax - yMin) * i) / gridCount;
      gridValues.push(value);
    }
    
    return (
      <>
        {gridValues.map((value, index) => (
          <G key={index}>
            <Line
              x1="0%"
              x2="100%"
              y1={y(value)}
              y2={y(value)}
              stroke="#E2E8F0"
              strokeWidth={1}
            />
            <SvgText
              x={10}
              y={y(value) - 5}
              textAnchor="start"
              fontSize={10}
              fill="#94A3B8"
            >
              {value.toFixed(1)}
            </SvgText>
          </G>
        ))}
      </>
    );
  };
  
  // X-axis labels
  const XLabels = ({ x }: { x: any }) => (
    <>
      {xLabels.map(({ index, label }) => (
        <SvgText
          key={index}
          x={x(index)}
          y={Dimensions.get('window').height - 30}
          textAnchor="middle"
          fontSize={10}
          fill="#94A3B8"
        >
          {label}
        </SvgText>
      ))}
    </>
  );
  
  // Legend component
  const renderLegend = () => (
    <View style={styles.legendContainer}>
      {assets.map((asset, index) => (
        <View key={asset.id} style={styles.legendItem}>
          <View 
            style={[
              styles.legendColor,
              { backgroundColor: getAssetColor(index) }
            ]} 
          />
          <Text style={styles.legendText}>{asset.symbol}</Text>
        </View>
      ))}
    </View>
  );
  
  return (
    <View style={styles.container}>
      {renderLegend()}
      
      <LineChart
        style={styles.chart}
        data={seriesData}
        yMin={yMin}
        yMax={yMax}
        contentInset={{ top: 20, bottom: 20, left: 10, right: 10 }}
      >
        <HorizontalGrid />
        <XLabels />
        {seriesData.map((series, index) => (
          <Decorator 
            key={index} 
            line={series} 
            data={series.data}
          />
        ))}
      </LineChart>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
  },
  chart: {
    flex: 1,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1E293B',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
  },
  noDataText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#94A3B8',
  },
});