import { View, Text, Pressable, Image, StyleSheet, Platform, Dimensions, ImageBackground } from "react-native";
import React, { useState } from "react";
import { MEALS } from "../utils/dummy-data";
import { useNavigation } from "@react-navigation/native";

const bgImage = { uri: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80" };
const { width } = Dimensions.get('window');
const numColumns = width > 900 ? 3 : width > 600 ? 2 : 2;
const CARD_SIZE = width > 900 ? 140 : width > 600 ? 110 : 90;

const DishesScreen = ({ route }) => {
  const navigation = useNavigation();
  const filteredData = MEALS.filter((item) => {
    return item.categories.includes(route.params.categoryId);
  });
  const [hoveredIdx, setHoveredIdx] = useState(null);
  return (
    <ImageBackground source={bgImage} style={styles.bgImage} resizeMode="cover">
      <View style={styles.overlay} pointerEvents="none" />
      <View style={styles.container}>
        <Text style={styles.title}>Dishes</Text>
        <View style={styles.grid}>
          {filteredData.map((item, index) => {
            const isHovered = hoveredIdx === index;
            return (
              <Pressable
                style={[
                  styles.card,
                  { width: CARD_SIZE, height: CARD_SIZE },
                  isHovered && styles.cardHovered,
                ]}
                key={item.id}
                onPress={() => {
                  navigation.navigate("DisheDetail", {
                    mealId: item.id,
                  });
                }}
                onHoverIn={Platform.OS === 'web' ? () => setHoveredIdx(index) : undefined}
                onHoverOut={Platform.OS === 'web' ? () => setHoveredIdx(null) : undefined}
                onPressIn={Platform.OS !== 'web' ? () => setHoveredIdx(index) : undefined}
                onPressOut={Platform.OS !== 'web' ? () => setHoveredIdx(null) : undefined}
              >
                <Image
                  style={styles.imageStyle}
                  source={{ uri: item.imageUrl }}
                  alt={item.title}
                />
                <Text style={styles.cardText}>{item.title}</Text>
              </Pressable>
            );
          })}
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
    backgroundColor: 'rgba(30, 41, 59, 0.35)',
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
    fontSize: 22,
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
    maxWidth: width > 900 ? 420 : width > 600 ? 340 : 200,
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
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
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
  imageStyle: {
    width: CARD_SIZE - 30,
    height: CARD_SIZE - 30,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  cardText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(255,255,255,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default DishesScreen;
