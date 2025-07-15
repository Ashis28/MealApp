import { View, Text, Image, StyleSheet, ScrollView, Animated, Easing, Dimensions, Platform, Pressable } from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { MEALS } from "../utils/dummy-data";
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const isWide = width > 900;

function parseIngredient(ingredient) {
  const match = ingredient.match(/^(\d+\s?[^\s]*)\s+(.*)$/);
  if (match) {
    return { amount: match[1], name: match[2] };
  }
  return { amount: '', name: ingredient };
}

const pillColors = [
  '#d1eaff', '#ffe0e0', '#e0ffe6', '#fff7d1', '#e0e5ec', '#f5e0ff', '#e0f7fa', '#fce4ec'
];

const bgImage = { uri: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=1200&q=80" };

const gradientBg = [
  'rgba(255,255,255,0.7)',
  'rgba(209,234,255,0.7)',
  'rgba(255,255,255,0.5)',
  'rgba(255, 243, 207, 0.7)'
];

const DishDetailScreen = ({ route }) => {
  const meal = MEALS.find((item) => item.id == route.params.mealId);

  // Animation refs for steps
  const stepAnims = useRef(meal.steps.map(() => new Animated.Value(0))).current;
  const ingredientAnim = useRef(new Animated.Value(0)).current;

  // Hover state for pills and steps
  const [hoveredPill, setHoveredPill] = useState(null);
  const [hoveredStep, setHoveredStep] = useState(null);

  useEffect(() => {
    Animated.timing(ingredientAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
    Animated.stagger(120, meal.steps.map((_, idx) =>
      Animated.timing(stepAnims[idx], {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      })
    )).start();
  }, []);

  return (
    <View style={styles.bgImage}>
      <View style={styles.overlay} />
      <ScrollView contentContainerStyle={[styles.contentContainer, isWide && styles.contentContainerWide]} showsVerticalScrollIndicator={false}>
        <View style={[styles.neumorphContainer, isWide && styles.neumorphContainerWide]}> 
          <View style={[styles.leftCol, isWide && styles.leftColWide]}>
            <Image style={[styles.image, isWide && styles.imageWide]} source={{ uri: meal.imageUrl }} />
            <Text style={[styles.title, isWide && styles.titleWide]}>{meal.title}</Text>
          </View>
          <View style={[styles.rightCol, isWide && styles.rightColWide]}> 
            <View style={styles.recipeDetailBg}>
              <View style={styles.gradientBg} />
              <View style={styles.section}>
                <Text style={styles.sectionTitle}><FontAwesome5 name="carrot" size={20} color="#6e7b8b" />  Ingredients</Text>
                <Animated.View style={{ opacity: ingredientAnim, transform: [{ translateY: ingredientAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }}>
                  <View style={styles.pillContainer}>
                    {meal.ingredients.map((ingredient, idx) => {
                      const { amount, name } = parseIngredient(ingredient);
                      const isHovered = hoveredPill === idx;
                      return (
                        <Pressable
                          key={idx}
                          style={[
                            styles.ingredientPill,
                            { backgroundColor: pillColors[idx % pillColors.length] },
                            isHovered && styles.ingredientPillHovered,
                          ]}
                          onHoverIn={Platform.OS === 'web' ? () => setHoveredPill(idx) : undefined}
                          onHoverOut={Platform.OS === 'web' ? () => setHoveredPill(null) : undefined}
                          onPressIn={Platform.OS !== 'web' ? () => setHoveredPill(idx) : undefined}
                          onPressOut={Platform.OS !== 'web' ? () => setHoveredPill(null) : undefined}
                        >
                          <MaterialIcons name="check-circle" size={16} color="#41d95d" style={{ marginRight: 4 }} />
                          <Text style={styles.ingredientAmount}>{amount}</Text>
                          <Text style={styles.ingredientName}>{name}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </Animated.View>
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}><FontAwesome5 name="list-ol" size={20} color="#6e7b8b" />  Recipe Steps</Text>
                {meal.steps.map((step, idx) => {
                  const isHovered = hoveredStep === idx;
                  return (
                    <Animated.View
                      key={idx}
                      style={{
                        opacity: stepAnims[idx],
                        transform: [{ translateY: stepAnims[idx].interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
                      }}
                    >
                      <Pressable
                        style={[styles.stepBox, isHovered && styles.stepBoxHovered]}
                        onHoverIn={Platform.OS === 'web' ? () => setHoveredStep(idx) : undefined}
                        onHoverOut={Platform.OS === 'web' ? () => setHoveredStep(null) : undefined}
                        onPressIn={Platform.OS !== 'web' ? () => setHoveredStep(idx) : undefined}
                        onPressOut={Platform.OS !== 'web' ? () => setHoveredStep(null) : undefined}
                      >
                        <View style={styles.stepCircle}><Text style={styles.stepNumber}>{idx + 1}</Text></View>
                        <Text style={styles.stepText}>{step}</Text>
                      </Pressable>
                    </Animated.View>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e5ec',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 41, 59, 0.25)',
    zIndex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    minHeight: height * 0.7,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  contentContainerWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    minHeight: height * 0.7,
    paddingVertical: 30,
  },
  neumorphContainer: {
    width: width > 600 ? 600 : '97%',
    padding: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.22)',
    shadowColor: '#fff',
    shadowOffset: { width: -8, height: -8 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 10,
    alignItems: 'center',
    zIndex: 2,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    marginBottom: 10,
    backdropFilter: Platform.OS === 'web' ? 'blur(8px)' : undefined,
    minHeight: height * 0.5,
    flexDirection: 'column',
  },
  neumorphContainerWide: {
    flexDirection: 'row',
    width: 900,
    alignItems: 'flex-start',
    justifyContent: 'center',
    minHeight: height * 0.6,
    padding: 24,
  },
  leftCol: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  leftColWide: {
    width: 340,
    marginRight: 32,
    marginBottom: 0,
  },
  rightCol: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  rightColWide: {
    width: 400,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  recipeDetailBg: {
    width: '100%',
    borderRadius: 24,
    padding: 12,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(12px)',
      },
    }),
    shadowColor: '#b8bac6',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(209,234,255,0.5)',
    marginBottom: 8,
    position: 'relative',
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    backgroundColor: 'transparent',
    ...Platform.select({
      web: {
        background: 'linear-gradient(135deg, #f5e0ff 0%, #d1eaff 100%)',
      },
      default: {
        backgroundColor: 'rgba(255,255,255,0.7)',
      },
    }),
    opacity: 0.95,
  },
  image: {
    width: width > 600 ? 220 : 140,
    height: width > 600 ? 220 : 140,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: '#e0e5ec',
    shadowColor: '#b8bac6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  imageWide: {
    width: 260,
    height: 260,
    borderRadius: 24,
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6e7b8b',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(255,255,255,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  titleWide: {
    fontSize: 28,
    marginBottom: 18,
  },
  section: {
    width: '100%',
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6e7b8b',
    marginBottom: 8,
    marginLeft: 4,
    textShadowColor: 'rgba(255,255,255,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  ingredientPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 2,
    shadowColor: '#b8bac6',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    transitionProperty: Platform.OS === 'web' ? 'background-color, box-shadow, transform' : undefined,
    transitionDuration: Platform.OS === 'web' ? '0.2s' : undefined,
  },
  ingredientPillHovered: {
    backgroundColor: '#fff7d1',
    transform: [{ scale: 1.08 }],
    shadowColor: '#368dff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  ingredientAmount: {
    fontWeight: 'bold',
    color: '#368dff',
    marginRight: 4,
    fontSize: 13,
  },
  ingredientName: {
    color: '#333',
    fontSize: 13,
  },
  stepBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 14,
    padding: 8,
    marginBottom: 6,
    marginHorizontal: 2,
    shadowColor: '#b8bac6',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    transitionProperty: Platform.OS === 'web' ? 'background-color, box-shadow, transform' : undefined,
    transitionDuration: Platform.OS === 'web' ? '0.2s' : undefined,
  },
  stepBoxHovered: {
    backgroundColor: '#e0ffe6',
    transform: [{ scale: 1.04 }],
    shadowColor: '#41d95d',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#368dff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  stepNumber: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  stepText: {
    color: '#333',
    fontSize: 13,
    flex: 1,
    flexWrap: 'wrap',
  },
});

export default DishDetailScreen;
