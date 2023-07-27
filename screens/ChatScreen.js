import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import React from "react";
import { useLayoutEffect, useState } from "react";
import { Avatar } from "@rneui/base";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { auth, db } from "../firebase";
import {
  serverTimestamp,
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [displayNames, setDisplayNames] = useState([]);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerBackTitleVisible: false,
      headerTitleAlign: "left",
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: -10,
          }}
        >
          <Avatar
            rounded
            source={{
              uri: messages[0]?.data.photoURL,
            }}
          />
          <View>
            <Text
              style={{
                color: "white",
                marginLeft: 10,
                fontWeight: "600",
                fontSize: 18,
              }}
            >
              {route.params.chatName}
            </Text>
            <Text
              style={{
                color: "white",
                marginLeft: 10,
                fontWeight: "300",
                fontSize: 12,
              }}
            >
              {displayNames}
            </Text>
          </View>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity>
            <FontAwesome
              name="video-camera"
              size={24}
              color="white"
              title="video call"
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="white" title="voice call" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [displayNames, navigation, messages, route.params.chatName]);

  const sendMessage = async () => {
    Keyboard.dismiss();
    try {
      await addDoc(collection(db, "chats", route.params.id, "message"), {
        timestamp: serverTimestamp(),
        displayName: auth?.currentUser?.displayName,
        message: input,
        email: auth?.currentUser?.email,
        photoURL: auth?.currentUser?.photoURL,
      });

      setInput("");
    } catch (error) {
      alert("Error sending message:", error);
    }
  };

  useLayoutEffect(() => {
    const q = query(
      collection(db, `chats/${route.params.id}/message`),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setMessages(messages);
      const distinctDisplayNames = Array.from(
        new Set(messages.map((message) => message.displayName))
      ).sort((a, b) => a.localeCompare(b < a)); // Sort the displayNames in ascending order
      setDisplayNames((prevDisplayNames) => distinctDisplayNames);
    });
    return unsubscribe;
  }, [route]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback>
          <>
            <FlatList
              inverted // Set the inverted prop to true
              contentContainerStyle={{ paddingTop: 15 }}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) =>
                auth.currentUser.email === item.data.email ? (
                  <View key={item.id} style={styles.receiver}>
                    <Avatar
                      position="absolute"
                      containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        right: -5,
                      }}
                      bottom={-15}
                      right={-5}
                      rounded
                      size={30}
                      source={{
                        uri: item.data.photoURL,
                      }}
                    />
                    <Text style={styles.recieverText}>{item.data.message}</Text>
                    <Text style={styles.senderTime}>
                      {item.data?.displayName}
                    </Text>
                    <Text style={styles?.senderTime}>
                      {item.data.timestamp?.toDate().toLocaleString()}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.sender}>
                    <Avatar
                      position="absolute"
                      containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        left: -5,
                      }}
                      bottom={-15}
                      right={-5}
                      rounded
                      size={30}
                      source={{
                        uri: item.data.photoURL,
                      }}
                    />
                    <Text style={styles.senderText}>{item.data.message}</Text>
                    <Text style={styles.senderName}>
                      {item.data.displayName}
                    </Text>
                    <Text style={styles.senderName}>
                      {item.data.timestamp?.toDate().toLocaleString()}
                    </Text>
                  </View>
                )
              }
            />
            <View style={styles.footer}>
              <TextInput
                value={input}
                onChangeText={(text) => setInput(text)}
                onSubmitEditing={sendMessage}
                placeholder="Signal Message"
                style={styles.textInput}
              />
              <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                <Ionicons name="send" size={24} color="#2B68E6" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  receiver: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  sender: {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },
  senderText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
  recieverText: {
    color: "black",
    fontWeight: "500",
    marginLeft: 10,
  },
  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "white",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
    backgroundColor: "transparent",
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "grey",
    borderRadius: 30,
  },
  senderTime: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "black",
  },
});
