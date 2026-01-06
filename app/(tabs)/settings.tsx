import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
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

const BACKGROUNDS = [
  require("../../assets/themes/bg1.jpg"),
  require("../../assets/themes/bg2.jpg"),
  require("../../assets/themes/bg3.jpg"),
  require("../../assets/themes/bg4.jpg"),
  require("../../assets/themes/bg5.jpg"),
  require("../../assets/themes/bg6.jpg"),
  require("../../assets/themes/bg7.jpg"),
  require("../../assets/themes/bg8.jpg"),
  require("../../assets/themes/bg9.png"),
];
const DEFAULT_BG = require("../../assets/images/bg.jpg");

const ACCENT = "#6C63FF";
const DEFAULT_AVATAR = require("../../assets/avatar/default profile.jpg");

const AVATARS = [
  require("../../assets/avatar/av1.jpg"),
  require("../../assets/avatar/av2.jpg"),
  require("../../assets/avatar/av3.jpg"),
  require("../../assets/avatar/av4.jpg"),

];
const DEFAULT_PROFILE = {
  username: "",
  email: "",
  mobile: "",
  avatar: -1,      // default avatar index
  verified: false,
};


export default function Settings() {
  const navigation = useNavigation<any>();

  const [themeModal, setThemeModal] = useState(false);
  const [bgIndex, setBgIndex] = useState(-1);


  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [avatar, setAvatar] = useState(-1);

  const [verified, setVerified] = useState(false);
  const [otp, setOtp] = useState("");

  const [otpModal, setOtpModal] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  const [soundModal, setSoundModal] = useState(false);

  const [music, setMusic] = useState(50);
  const [sound, setSound] = useState(50);
  const [petSound, setPetSound] = useState(50);
  const [notificationSound, setNotificationSound] = useState(50);


  const resetProfile = async () => {
    await AsyncStorage.removeItem("PROFILE");

    setUsername(DEFAULT_PROFILE.username);
    setEmail(DEFAULT_PROFILE.email);
    setMobile(DEFAULT_PROFILE.mobile);
    setAvatar(DEFAULT_PROFILE.avatar);
    setVerified(DEFAULT_PROFILE.verified);
  };


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
        setBgIndex(p.bgIndex ?? -1);
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
        bgIndex
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
      source={bgIndex === -1 ? DEFAULT_BG:BACKGROUNDS[bgIndex]}
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
            <Image source={avatar === -1 ? DEFAULT_AVATAR : AVATARS[avatar]} style={styles.avatarImage} />
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
              placeholderTextColor="#999"
              value={username}
              onChangeText={(t) => {
                setUsername(t);
                saveProfile();
              }}
              style={styles.input}
            />

            <TextInput
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setVerified(false);
              }}
              style={styles.input}
            />

            <TextInput
              placeholder="Mobile"
              placeholderTextColor="#999"
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
          onPress={() => setThemeModal(true)}
        />
        <SettingItem
          icon="volume-2"
          label="Sound"
          onPress={() => setSoundModal(true)}
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
        {/* THEME MODAL */}
        <Modal transparent visible={themeModal} animationType="fade">
          <View style={styles.modalBg}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Choose Theme</Text>
                <TouchableOpacity
  style={[
    styles.defaultThemeBtn,
    bgIndex === -1 && styles.themeSelected,
  ]}
  onPress={() => {
    setBgIndex(-1);
    saveProfile();
    setThemeModal(false);
  }}
>
  <Text style={{ fontWeight: "600" }}>Default Theme</Text>
</TouchableOpacity>

              <FlatList
                data={BACKGROUNDS}
                numColumns={2}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[
                      styles.themeOption,
                      bgIndex === index && styles.themeSelected,
                    ]}
                    onPress={() => {
                      setBgIndex(index);
                      saveProfile();
                      setThemeModal(false);
                    }}
                  >
                    <Image source={item} style={styles.themeImage} />
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>


        {/* SOUND MODAL */}
        <Modal transparent visible={soundModal} animationType="fade">
          <View style={styles.modalBg}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Sound Settings</Text>

              <SoundSlider label="Music" value={music} onChange={setMusic} />
              <SoundSlider label="Sound" value={sound} onChange={setSound} />
              <SoundSlider label="Pet Sound" value={petSound} onChange={setPetSound} />
              <SoundSlider
                label="Notification"
                value={notificationSound}
                onChange={setNotificationSound}
              />

              <TouchableOpacity
                style={[styles.confirmBtn, { marginTop: 20 }]}
                onPress={() => setSoundModal(false)}
              >
                <Text style={styles.confirmText}>Done</Text>
              </TouchableOpacity>
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
                  await resetProfile();
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

function SoundSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "600" }}>{label}</Text>
        <Text style={{ color: "#777" }}>{value}%</Text>
      </View>
      <Slider
        value={value}
        onValueChange={onChange}
        minimumValue={0}
        maximumValue={100}
        step={1}
        minimumTrackTintColor={ACCENT}
        maximumTrackTintColor="#ddd"
        thumbTintColor={ACCENT}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    height: "100%",
    width: "100%"
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
  themeOption: {
    width: "48%",
    margin: "1%",
    borderRadius: 12,
    overflow: "hidden",
  },
  themeImage: {
    width: "100%",
    height: 120,
  },
  themeSelected: {
    borderWidth: 3,
    borderColor: ACCENT,
  },
  defaultThemeBtn: {
  padding: 14,
  borderRadius: 12,
  backgroundColor: "#f2f2f2",
  marginBottom: 12,
  alignItems: "center",
},

});
