import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    ImageBackground,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const ACCENT = "#6C63FF";

const AVATARS = [
  require("../../assets/avatar/av1.jpg"),
  require("../../assets/avatar/av2.jpg"),
  require("../../assets/avatar/av3.jpg"),
  require("../../assets/avatar/av4.jpg"),

];

export default function Settings() {
  const navigation = useNavigation<any>();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [avatar, setAvatar] = useState(0);

  const [verified, setVerified] = useState(false);
  const [otp, setOtp] = useState("");

  const [otpModal, setOtpModal] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  /* LOAD SAVED DATA */
  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem("PROFILE");
      if (data) {
        const p = JSON.parse(data);
        setUsername(p.username);
        setEmail(p.email);
        setMobile(p.mobile);
        setAvatar(p.avatar);
        setVerified(p.verified);
      }
    })();
  }, []);

  /* SAVE DATA */
  const saveProfile = async () => {
    await AsyncStorage.setItem(
      "PROFILE",
      JSON.stringify({
        username,
        email,
        mobile,
        avatar,
        verified,
      })
    );
  };

  /* OTP CONFIRM */
  const confirmOtp = () => {
    setVerified(true);
    setOtp("");
    setOtpModal(false);
    saveProfile();
  };

  return (
    <ImageBackground
      source={require("../../assets/images/bg.jpg")}
      style={styles.bg}
    >
      <View style={styles.overlay}>
        {/* HEADER */}
        <View style={styles.header}>
          <Feather name="settings" size={22} />
          <Text style={styles.headerText}>Settings</Text>
        </View>

        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <View>
            <Image source={AVATARS[avatar]} style={styles.avatarImage} />
            <TouchableOpacity
              style={styles.editAvatar}
              onPress={() => setAvatarModal(true)}
            >
              <Feather name="edit-2" size={14} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileFields}>
            <TextInput
              placeholder="Username"
              value={username}
              onChangeText={(t) => {
                setUsername(t);
                saveProfile();
              }}
              style={styles.input}
            />

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setVerified(false);
              }}
              style={styles.input}
            />

            <TextInput
              placeholder="Mobile"
              value={mobile}
              onChangeText={(t) => {
                setMobile(t);
                setVerified(false);
              }}
              keyboardType="number-pad"
              style={styles.input}
            />

            <View style={styles.verifyRow}>
              {verified ? (
                <Text style={styles.verified}>✅ Verified</Text>
              ) : (
                <TouchableOpacity onPress={() => setOtpModal(true)}>
                  <Text style={styles.verifyText}>Verify</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* SETTINGS */}
        <SettingItem
          icon="credit-card"
          label="Card Setting"
        />
        <SettingItem
          icon="bell"
          label="Notification"
        />
        <SettingItem
          icon="moon"
          label="Theme"
          onPress={() => navigation.navigate("Theme")}
        />
        <SettingItem
          icon="volume-2"
          label="Sound"
        />
        <SettingItem
          icon="log-out"
          label="Logout"
          onPress={() => setLogoutModal(true)}
        />

        {/* OTP MODAL */}
        <Modal transparent visible={otpModal}>
          <View style={styles.modalBg}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Enter OTP</Text>
              <TextInput
                value={otp}
                onChangeText={setOtp}
                maxLength={6}
                keyboardType="number-pad"
                style={styles.otpInput}
              />
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={confirmOtp}
              >
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* AVATAR MODAL */}
        <Modal transparent visible={avatarModal}>
          <View style={styles.modalBg}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Choose Avatar</Text>
              <FlatList
                data={AVATARS}
                numColumns={3}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[
                      styles.avatarOption,
                      avatar === index && styles.avatarSelected,
                    ]}
                    onPress={() => {
                      setAvatar(index);
                      saveProfile();
                      setAvatarModal(false);
                    }}
                  >
                    <Image source={item} style={styles.avatarOptionImage} />
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* LOGOUT MODAL */}
        <Modal transparent visible={logoutModal}>
          <View style={styles.modalBg}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Logout?</Text>
              <Text style={{ textAlign: "center", marginBottom: 20 }}>
                Are you sure you want to logout?
              </Text>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={async () => {
                  await AsyncStorage.clear();
                  setLogoutModal(false);
                }}
              >
                <Text style={styles.confirmText}>Yes, Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

/* REUSABLE SETTING ITEM */
function SettingItem({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.settingCard}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <View style={styles.settingLeft}>
        <Feather name={icon} size={18} color={ACCENT} />
        <Text style={styles.settingText}>{label}</Text>
      </View>
      <Feather name="chevron-right" size={18} color="#777" />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  bg: { flex: 1,
    height:"100%",
    width:"100%"
  },
  overlay: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.65)",
  },
  header: { flexDirection: "row", gap: 10, marginBottom: 20 },
  headerText: { fontSize: 20, fontWeight: "700" },

  profileCard: {
    flexDirection: "row",
    gap: 18,
    padding: 18,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginBottom: 24,
    elevation: 5,
  },

  avatarImage: { width: 90, height: 90, borderRadius: 45 },
  editAvatar: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: ACCENT,
    padding: 8,
    borderRadius: 20,
  },

  profileFields: { flex: 1 },
  input: { borderBottomWidth: 1, borderColor: "#ddd", marginBottom: 10 },

  verifyRow: { marginTop: 4 },
  verifyText: { color: ACCENT, fontWeight: "600" },
  verified: { color: "green", fontWeight: "600" },

  settingCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#fff",
    marginBottom: 12,
    elevation: 3,
  },
  settingLeft: { flexDirection: "row", gap: 12 },
  settingText: { fontSize: 15 },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  otpInput: {
    borderBottomWidth: 1,
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
  },
  confirmBtn: {
    backgroundColor: ACCENT,
    padding: 12,
    borderRadius: 8,
  },
  confirmText: { color: "#fff", textAlign: "center" },

  avatarOption: { width: "33%", alignItems: "center", marginVertical: 14 },
  avatarOptionImage: { width: 64, height: 64, borderRadius: 32 },
  avatarSelected: {
    borderWidth: 2,
    borderColor: ACCENT,
    padding: 4,
    borderRadius: 40,
  },
});
