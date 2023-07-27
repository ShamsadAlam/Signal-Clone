import { StyleSheet, Text, View, Image } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Button, Input } from "@rneui/base";
import { Icon } from "@rneui/base";
import { db } from "../firebase";
import { collection, doc, setDoc } from "firebase/firestore";

const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new chat",
      headerBackTitle: "Chats",
    });
  }, []);

  const createChat = async () => {
    const chatCollection = collection(db, "chats");
    await setDoc(doc(chatCollection), {
      chatName: input,
    })
      .then(() => {
        navigation.goBack();
      })
      .catch((err) => alert(err));
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter the chat name"
        value={input}
        onChangeText={(text) => setInput(text)}
        leftIcon={
          // <Icon name="wechat" type="antdesign" size={24} color="Black" />
          <Image
            source={require("../assets/chat.png")}
            resizeMode="contain"
            style={{ height: 35, width: 35 }}
          />
        }
      />
      <Button disabled={!input} onPress={createChat} title="Create new chat" />
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 30,
    height: "100%",
  },
});
