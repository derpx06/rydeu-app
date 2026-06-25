import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { useAppDispatch } from '@/store';
import { completeOnboarding } from '@/store/authSlice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDES = [
  {
    key: '1',
    title: 'Hassle-Free Airport',
    accentWord: 'Rides',
    description: 'Smooth, reliable rides to and from the airport—no stress, no delays.',
    image: require('@/assets/images/image.png'),
  },
  {
    key: '2',
    title: 'Choose Your Pickup\nand',
    accentWord: 'Destination',
    description: 'Set your pickup and drop-off in just a few taps.',
    image: require('@/assets/images/image copy.png'),
  },
  {
    key: '3',
    title: 'Find the Perfect Car for\nYour',
    accentWord: 'Trip',
    description: 'Pick the ride that fits your style and comfort.',
    image: require('@/assets/images/image copy 2.png'),
  },
  {
    key: '4',
    title: 'Your Driver Arrives\nRight on',
    accentWord: 'Time',
    description: 'Expect a punctual, ready-to-go driver every time.',
    image: require('@/assets/images/image copy 3.png'),
  },
];

export default function OnboardingScreen() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    dispatch(completeOnboarding());
    router.replace('/login');
  };

  const handleScroll = (event: any) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / SCREEN_WIDTH);
    if (index !== activeIndex && index >= 0 && index < SLIDES.length) {
      setActiveIndex(index);
    }
  };

  const renderTitle = (title: string, accentWord: string) => {
    return (
      <AppText variant="title" style={styles.title}>
        {title}{' '}
        <AppText variant="title" style={styles.accentText}>
          {accentWord}
        </AppText>
      </AppText>
    );
  };

  const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.textContainer}>
          {renderTitle(item.title, item.accentWord)}
          <AppText style={styles.description}>{item.description}</AppText>
        </View>
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.image} resizeMode="contain" />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
      />

      <View style={[styles.bottomRow, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity onPress={handleFinish} activeOpacity={0.7}>
          <AppText style={styles.skipText}>Skip</AppText>
        </TouchableOpacity>

        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => {
            const isActive = index === activeIndex;
            return (
              <View
                key={index}
                style={[
                  styles.dot,
                  isActive ? styles.dotActive : styles.dotInactive,
                ]}
              />
            );
          })}
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.8}>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 24,
    paddingBottom: 110,
  },
  textContainer: {
    marginTop: 20,
    minHeight: 140,
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 36,
  },
  accentText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#E11D48',
    lineHeight: 36,
  },
  description: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 12,
    lineHeight: 22,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    width: SCREEN_WIDTH,
    overflow: 'visible',
  },
  image: {
    width: '105%',
    height: '100%',
  },
  bottomRow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    backgroundColor: '#FFFFFF',
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#94A3B8',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 16,
    backgroundColor: '#0F172A',
  },
  dotInactive: {
    width: 6,
    backgroundColor: '#CBD5E1',
  },
  nextBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
