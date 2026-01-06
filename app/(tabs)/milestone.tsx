import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

// Simulated current day
const CURRENT_DAY = 5;
const STORAGE_KEY = 'TASK_DONE_DAY';

const generateMilestones = (
    start: number,
    count: number,
    taskDoneDay: number
) =>
    Array.from({ length: count }).map((_, i) => {
        const day = start + i;
        return {
            id: day,
            unlocked: day <= taskDoneDay,
        };
    });


export default function MilestoneScreen() {
    const [taskDoneDay, setTaskDoneDay] = useState(0);
    const [data, setData] = useState<any[]>([]);
    const [selected, setSelected] = useState<number | null>(null);

    /* 🔄 Load saved progress */
    useEffect(() => {
        const loadProgress = async () => {
            const savedDay = await AsyncStorage.getItem(STORAGE_KEY);
            const parsedDay = savedDay ? Number(savedDay) : 0;

            setTaskDoneDay(parsedDay);
            setData(generateMilestones(1, 30, parsedDay));
        };

        loadProgress();
    }, []);

    /* 💾 Persist progress */
    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEY, String(taskDoneDay));
    }, [taskDoneDay]);

    const loadMore = () => {
        const lastId = data[data.length - 1]?.id ?? 0;
        setData([
            ...data,
            ...generateMilestones(lastId + 1, 20, taskDoneDay),
        ]);
    };

    const completeTodayTask = () => {
        if (CURRENT_DAY > taskDoneDay) {
            setTaskDoneDay(CURRENT_DAY);
            setData(generateMilestones(1, data.length, CURRENT_DAY));
        }
    };

    return (
        <View style={styles.container}>
            {/* 🌤 Ambient Creamy Background */}
            <LinearGradient
                colors={['#FFF4CC', '#FFE9A8', '#FFE066', '#FFD966']}
                style={StyleSheet.absoluteFill}
            />

            {/* ☁️ Soft Ambient Blobs */}
            <View pointerEvents="none" style={styles.ambientLayer}>
                <View style={[styles.blob, styles.blob1]} />
                <View style={[styles.blob, styles.blob2]} />
                <View style={[styles.blob, styles.blob3]} />
            </View>

            {/* 🏷 Header */}
            <View style={styles.headerWrapper}>
                <View style={styles.goldFrame}>
                    <LinearGradient
                        colors={['#4B8DF8', '#2F6FDB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.ribbon}
                    >
                        <Text style={styles.headerText}>MILESTONE PATH</Text>
                    </LinearGradient>
                </View>
            </View>
            

            {/* Milestone Path */}
            <Animated.FlatList
                inverted
                data={data}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={loadMore}
                onEndReachedThreshold={0.4}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingVertical: 80, paddingTop: 40,
                    paddingBottom: 120,
                }}
                renderItem={({ item, index }) => {
                    const isLeft = index % 2 === 0;

                    return (
                        <View style={styles.row}>

                            <Pressable
                                onPress={() => item.unlocked && setSelected(item.id)}
                                style={[
                                    styles.node,
                                    item.unlocked ? styles.unlocked : styles.locked,
                                    {
                                        alignSelf: isLeft ? 'flex-start' : 'flex-end',
                                        marginLeft: isLeft ? 30 : 0,
                                        marginRight: !isLeft ? 30 : 0,
                                    },
                                ]}
                            >
                                <Text style={styles.nodeText}>{item.id}</Text>
                            </Pressable>
                        </View>
                    );
                }}
            />

            {/* 🎁 Reward Modal */}
            <Modal transparent visible={!!selected} animationType="fade">
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalCard}>
                        <Text style={styles.rewardText}>🎁 Reward Unlocked!</Text>
                        <Pressable
                            style={styles.collectBtn}
                            onPress={() => setSelected(null)}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                                Collect
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}


/* 🔒 STYLES UNCHANGED */
const styles = StyleSheet.create({
    headerWrapper: {
        alignItems: 'center',
        marginVertical: 16,
    },
    goldFrame: {
        padding: 4,
        borderRadius: 14,
        backgroundColor: '#F6C453', // gold border
        elevation: 6,
    },

    ribbon: {
        paddingHorizontal: 40,
        paddingVertical: 14,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#1F4FB2', // darker blue edge
    },

    headerText: {
        color: '#FFFFFF',
        fontSize: 26,
        fontWeight: '900',
        letterSpacing: 1,
        textTransform: 'uppercase',
        textShadowColor: '#1C3E8A',
        textShadowOffset: { width: 0, height: 3 },
        textShadowRadius: 0,
    },
    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFE066',
        paddingHorizontal: 16,
    },
    row: {
        height: 110,
        justifyContent: 'center',
    },

    node: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
    },
    unlocked: {
        backgroundColor: '#FF6F91',
    },
    locked: {
        backgroundColor: '#BDBDBD',
    },
    nodeText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        width: 260,
        alignItems: 'center',
    },
    rewardText: {
        fontSize: 20,
        marginBottom: 16,
    },
    collectBtn: {
        backgroundColor: '#6C63FF',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 14,
    },
    ambientLayer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },

    blob: {
        position: 'absolute',
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: 999,
    },

    blob1: {
        width: 260,
        height: 260,
        top: 100,
        left: -80,
    },

    blob2: {
        width: 320,
        height: 320,
        top: 420,
        right: -120,
    },

    blob3: {
        width: 220,
        height: 220,
        bottom: 200,
        left: 40,
    },

});
