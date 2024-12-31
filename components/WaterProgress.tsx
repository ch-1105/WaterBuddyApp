import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';
import Animated, { 
  useAnimatedProps, 
  withTiming, 
  useSharedValue, 
  withRepeat,
  withSpring,
  interpolate,
  withSequence,
  withDelay
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

interface WaterProgressProps {
  consumed: number;
  goal: number;
}

const WaterProgress: React.FC<WaterProgressProps> = ({ consumed, goal }) => {
  const percentage = Math.min((consumed / goal) * 100, 100);
  const waveAnimation = useSharedValue(0);
  const characterAnimation = useSharedValue(0);
  const celebrateAnimation = useSharedValue(0);

  React.useEffect(() => {
    waveAnimation.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    );
    
    // 检查是否达到500ml的倍数
    if (consumed > 0 && consumed % 500 === 0) {
      // 庆祝动画
      celebrateAnimation.value = withSequence(
        withSpring(1, { damping: 2, stiffness: 80 }),
        withDelay(500, withSpring(0))
      );
    } else {
      // 普通喝水动作
      characterAnimation.value = withSpring(1, {}, () => {
        characterAnimation.value = withSpring(0);
      });
    }
  }, [consumed]);

  const waveProps = useAnimatedProps(() => ({
    d: `M0,50 
       C20,${45 + waveAnimation.value * 10} 
         40,${55 - waveAnimation.value * 10} 
         60,50 
       C80,${45 + waveAnimation.value * 10} 
         100,${55 - waveAnimation.value * 10} 
         120,50 
       V100 H0 Z`
  }));

  const characterProps = useAnimatedProps(() => {
    const celebrateRotation = interpolate(
      celebrateAnimation.value,
      [0, 1],
      [0, 360]
    );
    
    const celebrateScale = interpolate(
      celebrateAnimation.value,
      [0, 0.5, 1],
      [1, 1.2, 1]
    );

    return {
      transform: [
        { translateY: -10 * characterAnimation.value },
        { rotate: celebrateAnimation.value > 0 
          ? `${celebrateRotation}deg` 
          : `${5 * characterAnimation.value}deg` 
        },
        { scale: celebrateScale }
      ]
    };
  });

  return (
    <View style={styles.container}>
      <Svg height={200} width={200} viewBox="0 0 100 100">
        {/* 背景圆 */}
        <Circle
          cx="50"
          cy="50"
          r="45"
          fill="white"
          stroke="#3B82F6"
          strokeWidth="2"
        />
        
        {/* 水波纹 */}
        <AnimatedPath
          animatedProps={waveProps}
          fill="#3B82F6"
          opacity={0.6}
          transform={`translate(0, ${50 - percentage/2})`}
        />

        {/* 喝水小人 */}
        <AnimatedG
          animatedProps={characterProps}
          transform={`translate(35, ${30 - percentage/4})`}
        >
          {/* 身体 */}
          <Path
            d="M15,30 Q15,45 15,50 L25,50 Q25,45 25,30 Z"
            fill="#333"
          />
          {/* 头 */}
          <Circle cx="20" cy="25" r="8" fill="#333" />
          {/* 手臂 */}
          <Path
            d="M15,35 L10,40 M25,35 L30,40"
            stroke="#333"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* 水杯 */}
          <Path
            d="M28,38 L32,38 L31,42 L29,42 Z"
            fill="#3B82F6"
          />
          {/* 庆祝表情 - 笑脸 */}
          <Path
            d="M17,24 Q20,26 23,24"
            stroke="#FFF"
            strokeWidth="1"
            fill="none"
          />
        </AnimatedG>
      </Svg>

      <View style={styles.textContainer}>
        <Text style={styles.progressText}>
          {consumed} / {goal} ml
        </Text>
        <Text style={styles.percentageText}>
          {Math.round(percentage)}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  textContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  percentageText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
  },
});

export default WaterProgress;