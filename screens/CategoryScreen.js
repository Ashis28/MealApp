import { View, Text, Pressable, StyleSheet, Image, Platform, ImageBackground, Dimensions } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { CATEGORIES } from "../utils/dummy-data";

const iconMap = [
  require("../assets/icon.png"),
  require("../assets/adaptive-icon.png"),
  require("../assets/favicon.png"),
  require("../assets/splash-icon.png"),
];

const bgImage = { uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80" };
const { width } = Dimensions.get('window');
const numColumns = width > 600 ? 3 : 2;
const CARD_SIZE = width > 600 ? 110 : 90;

const CategoryScreen = ({}) => {
  const navigation = useNavigation();
  const [hoveredIdx, setHoveredIdx] = useState(null);
  return (
    <ImageBackground source={bgImage} style={styles.bgImage} resizeMode="cover">
      <View style={styles.overlay} pointerEvents="none" />
      <View style={styles.container}>
        <Text style={styles.title}>Categories</Text>
        <View style={styles.grid}>
          {CATEGORIES.map((item, index) => (
            <Pressable
              key={index}
              style={[
                styles.card,
                { backgroundColor: 'rgba(255,255,255,0.25)', borderColor: item.color, width: CARD_SIZE, height: CARD_SIZE },
                hoveredIdx === index && styles.cardHovered,
              ]}
              onPress={() => {
                navigation.navigate("DishList", {
                  categoryId: item.id,
                });
              }}
              onHoverIn={Platform.OS === 'web' ? () => setHoveredIdx(index) : undefined}
              onHoverOut={Platform.OS === 'web' ? () => setHoveredIdx(null) : undefined}
              onPressIn={Platform.OS !== 'web' ? () => setHoveredIdx(index) : undefined}
              onPressOut={Platform.OS !== 'web' ? () => setHoveredIdx(null) : undefined}
            >
              <Image source={iconMap[index % iconMap.length]} style={styles.icon} />
              <Text style={styles.cardText}>{item.title}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 41, 59, 0.45)',
    zIndex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 24,
    zIndex: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: width > 600 ? 400 : 220,
    alignSelf: 'center',
    zIndex: 2,
    marginTop: 0,
    marginBottom: 0,
  },
  card: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 7,
    borderWidth: 2,
    shadowColor: '#b8bac6',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
    backdropFilter: Platform.OS === 'web' ? 'blur(6px)' : undefined,
    transitionProperty: Platform.OS === 'web' ? 'background-color, box-shadow' : undefined,
    transitionDuration: Platform.OS === 'web' ? '0.2s' : undefined,
  },
  cardHovered: {
    backgroundColor: 'rgba(209,234,255,0.7)',
    shadowColor: '#368dff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    width: 32,
    height: 32,
    marginBottom: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  cardText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
    textShadowColor: 'rgba(255,255,255,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default CategoryScreen;
