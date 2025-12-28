import {
    StyleSheet,
    View,
    Animated,
    Dimensions,
    Text,
    Pressable,
    Modal,
    PanResponder,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { Image } from 'expo-image';


const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

type Pet = {
    id: number;
    name: string;
    emoji: string;
    rarity: 'Common' | 'Rare' | 'Epic';
    price: number;
};

const PETS: Pet[] = [
    { id: 1, name: 'Dog', emoji: '🐶', rarity: 'Common', price: 250 },
    { id: 2, name: 'Cat', emoji: '🐱', rarity: 'Common', price: 250 },
    { id: 3, name: 'Rabbit', emoji: '🐰', rarity: 'Rare', price: 500 },
    { id: 4, name: 'Parrot', emoji: '🦜', rarity: 'Rare', price: 500 },
    { id: 5, name: 'Fox', emoji: '🦊', rarity: 'Epic', price: 900 },
    { id: 6, name: 'Panda', emoji: '🐼', rarity: 'Epic', price: 900 },
    { id: 7, name: 'Tiger', emoji: '🐯', rarity: 'Epic', price: 1200 },
    { id: 8, name: 'Wolf', emoji: '🐺', rarity: 'Epic', price: 1200 },
];

export default function PetShopScreen() {
    const scrollY = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    const [previewPet, setPreviewPet] = useState<Pet | null>(null);

    const TABS = ['Pets', 'Skins', 'Accessories', 'Animations'];
    const TAB_WIDTH = (width - 24) / TABS.length;
    const [activeTab, setActiveTab] = useState(0);

    const activeTabRef = useRef(activeTab);
    useEffect(() => {
        activeTabRef.current = activeTab;
    }, [activeTab]);

    const changeTab = (index: number) => {
        setActiveTab(index);
        Animated.spring(slideAnim, {
            toValue: index * TAB_WIDTH,
            useNativeDriver: true,
            damping: 18,
            stiffness: 180,
        }).start();
    };

    const panResponder = useRef(
        PanResponder.create({
            // Decide if we want to take control
            onMoveShouldSetPanResponder: (_, gesture) => {
                const isHorizontal =
                    Math.abs(gesture.dx) > Math.abs(gesture.dy);
                const isIntentional = Math.abs(gesture.dx) > 20;
                return isHorizontal && isIntentional;
            },

            // User released finger
            onPanResponderRelease: (_, gesture) => {
                const current = activeTabRef.current;

                if (gesture.dx < -40 && current < TABS.length - 1) {
                    changeTab(current + 1);
                } else if (gesture.dx > 40 && current > 0) {
                    changeTab(current - 1);
                }
            },

        })
    ).current;


    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: false,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 1200,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.container} {...panResponder.panHandlers}>
            <LinearGradient
                colors={['#EAF4FF', '#FDFEFF']}
                style={StyleSheet.absoluteFillObject}
            />

            <Image
                source={require('@/assets/images/ribbon_banner.png')}
                style={styles.banner}
                contentFit="contain"
                
            />


            {/* TAB BAR */}
            <View style={styles.tabBar} {...panResponder.panHandlers}>
                <Animated.View
                    style={[
                        styles.tabSlider,
                        {
                            width: TAB_WIDTH,
                            transform: [{ translateX: slideAnim }],
                        },
                    ]}
                />

                {TABS.map((tab, index) => (
                    <Pressable
                        key={tab}
                        style={styles.tabItem}
                        onPress={() => changeTab(index)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === index && styles.activeTabText,
                            ]}
                        >
                            {tab}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {/* STORE GRID (UNCHANGED) */}
            <Animated.ScrollView
                contentContainerStyle={styles.grid}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            >
                {PETS.map((pet, index) => {
                    const isEpic = pet.rarity === 'Epic';

                    const glowBorderColor = glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                            'rgba(255,215,0,0.3)',
                            'rgba(255,215,0,0.9)',
                        ],
                    });

                    const glowShadow = glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [6, 14],
                    });

                    return (
                        <Animated.View
                            key={pet.id}
                            style={[
                                styles.card,
                                { width: CARD_WIDTH },
                                isEpic && {
                                    borderWidth: 2,
                                    borderColor: glowBorderColor,
                                    shadowColor: '#FFD700',
                                    shadowOpacity: 0.8,
                                    shadowRadius: glowShadow,
                                    elevation: 12,
                                },
                            ]}
                        >
                            <Text style={styles.petEmoji}>{pet.emoji}</Text>
                            <Text style={styles.petName}>{pet.name}</Text>
                            <Text style={styles.petRarity}>{pet.rarity}</Text>

                            <View style={styles.bottomRow}>
                                <Text style={styles.petPrice}>₹ {pet.price}</Text>
                                <Pressable
                                    style={styles.previewBtn}
                                    onPress={() => setPreviewPet(pet)}
                                >
                                    <Text style={styles.previewText}>Preview</Text>
                                </Pressable>
                            </View>
                        </Animated.View>
                    );
                })}
            </Animated.ScrollView>

            {/* MODAL */}
            <Modal transparent visible={!!previewPet} animationType="fade">
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setPreviewPet(null)}
                >
                    <View style={styles.modalBox}>
                        <Text style={styles.modalEmoji}>{previewPet?.emoji}</Text>
                        <Text style={styles.modalName}>{previewPet?.name}</Text>
                        <Pressable style={styles.buyBtn}>
                            <Text style={styles.buyText}>Buy</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
        </View >
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },

    banner: {
        width: '90%',
        height: 80,
        alignSelf: 'center',
        marginTop: 50,
        marginBottom: 12,     
    },

    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#EAF0F6',
        padding: 0,
        borderRadius: 14,
        margin: 12,
        position: 'relative',
        overflow: 'hidden',
    },

    tabSlider: {
        position: 'absolute',
        height: '100%',
        backgroundColor: '#4A90E2',
        borderRadius: 12,
    },

    tabItem: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        zIndex: 1,
    },

    tabText: {
        color: '#555',
        fontWeight: '600',
    },

    activeTabText: {
        color: '#fff',
    },

    grid: {
        paddingHorizontal: 16,
        paddingBottom: 40,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    card: {
        height: 190,
        marginBottom: 20,
        borderRadius: 24,
        backgroundColor: '#fff',
        padding: 14,
        alignItems: 'center',

        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
    },

    petEmoji: {
        fontSize: 44,
        marginTop: 6,
    },

    petName: {
        marginTop: 6,
        fontSize: 16,
        fontWeight: '700',
        color: '#222',
    },

    petRarity: {
        fontSize: 12,
        color: '#6C63FF',
        marginBottom: 8,
    },

    bottomRow: {
        marginTop: 'auto',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    petPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },

    previewBtn: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 14,
        backgroundColor: '#6C63FF',
    },

    previewText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalBox: {
        width: 240,
        borderRadius: 24,
        backgroundColor: '#fff',
        padding: 24,
        alignItems: 'center',
    },

    modalEmoji: {
        fontSize: 60,
    },

    modalName: {
        fontSize: 20,
        fontWeight: '700',
        marginVertical: 10,
    },

    buyBtn: {
        marginTop: 14,
        width: '100%',
        height: 42,
        borderRadius: 18,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },

    buyText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
