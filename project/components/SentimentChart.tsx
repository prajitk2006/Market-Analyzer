import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-svg-charts';
import { Circle, Path, G, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { format } from 'date-fns';

interface SentimentChartProps {
  data: any[];
  timeRange: string;
}

export default function SentimentChart({ data = [], timeRange }: SentimentChartProps) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No sentiment data available</Text>
      </View>
    );
  }
  
  // Find min and max values for y-axis
  const values = data.map(item => item.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  
  // Add some padding to the min/max values
  const yMin = Math.floor(minValue * 1.1);
  const yMax = Math.ceil(maxValue * 1.1);
  
  // Format x-axis labels based on timeRange
  const formatXLabel = (date: Date) => {
    switch (timeRange) {
      case '1D':
        return format(date, 'HH:mm');
      case '1W':
        return format(date, 'EEE');
      case '1M':
        return format(date, 'dd MMM');
      case '3M':
      case '1Y':
      case 'All':
        return format(date, 'MMM yyyy');
      default:
        return format(date, 'dd MMM');
    }
  };
  
  // Calculate how many x-axis labels to show
  const getXLabels = () => {
    switch (timeRange) {
      case '1D':
        return 6; // Every 4 hours
      case '1W':
        return 7; // Every day
      case '1M':
        return 4; // Weekly
      case '3M':
        return 3; // Monthly
      case '1Y':
        return 4; // Quarterly
      case 'All':
        return 5; // Yearly
      default:
        return 5;
    }
  };
  
  const xLabelCount = getXLabels();
  const interval = Math.ceil(data.length / xLabelCount);
  
  // Create x-axis labels
  const xLabels = [];
  for (let i = 0; i < data.length; i += interval) {
    if (i < data.length) {
      xLabels.push({
        index: i,
        label: formatXLabel(new Date(data[i].date)),
      });
    }
  }
  
  // Add gradient to the line
  const Gradient = () => (
    <Defs>
      <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#1E3A8A" stopOpacity={0.8} />
        <Stop offset="100%" stopColor="#1E3A8A" stopOpacity={0.2} />
      </LinearGradient>
    </Defs>
  );
  
  // Area under the line
  const Area = ({ line }: { line: string }) => (
    <Path
      d={`${line} L ${Dimensions.get('window').width} ${Dimensions.get('window').height} L 0 ${Dimensions.get('window').height}`}
      fill="url(#gradient)"
      opacity={0.2}
    />
  );
  
  // Decorators for points on the line
  const Decorator = ({ x, y, data }: { x: any; y: any; data: any[] }) => {
    return data.map((value, index) => (
      <Circle
        key={index}
        cx={x(index)}
        cy={y(value.value)}
        r={4}
        stroke="#1E3A8A"
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
            <Text
              x={10}
              y={y(value) - 5}
              textAnchor="start"
              fontSize={10}
              fill="#94A3B8"
            >
              {value.toFixed(1)}
            </Text>
          </G>
        ))}
      </>
    );
  };
  
  // X-axis labels
  const XLabels = ({ x }: { x: any }) => (
    <>
      {xLabels.map(({ index, label }) => (
        <Text
          key={index}
          x={x(index)}
          y={Dimensions.get('window').height - 30}
          textAnchor="middle"
          fontSize={10}
          fill="#94A3B8"
        >
          {label}
        </Text>
      ))}
    </>
  );
  
  return (
    <View style={styles.container}>
      <LineChart
        style={styles.chart}
        data={data}
        yAccessor={({ item }) => item.value}
        xAccessor={({ index }) => index}
        yMin={yMin}
        yMax={yMax}
        svg={{ stroke: '#1E3A8A', strokeWidth: 2 }}
        contentInset={{ top: 20, bottom: 20, left: 10, right: 10 }}
      >
        <Gradient />
        <Area />
        <Decorator />
        <HorizontalGrid />
        <XLabels />
      </LineChart>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
  },
  chart: {
    flex: 1,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#94A3B8',
  },
});