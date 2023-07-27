import React, { useState, useEffect } from "react";
import { ListItem, Avatar } from "@rneui/base";
import { View, Text, StyleSheet } from "react-native";
import { db } from "../firebase";
import { onSnapshot, collection, orderBy, query } from "firebase/firestore";

const CustomListItem = ({ id, chatName, enterChat }) => {
  const [chatMessages, setChatMessages] = useState([]);
  useEffect(() => {
    const q = query(
      collection(db, `chats/${id}/message`),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setChatMessages(messages);
    });

    return unsubscribe;
  }, [id]);
  return (
    <ListItem key={id} bottomDivider onPress={() => enterChat(id, chatName)}>
      <Avatar
        title="Profile Url"
        rounded
        source={{
          uri:
            chatMessages?.[0]?.data.photoURL ||
            "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "700" }}>
          {chatName}
        </ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontWeight: "500" }}>
              {chatMessages?.[0]?.displayName}: {chatMessages?.[0]?.message}
            </Text>
          </View>
          <Text style={{ fontWeight: "500", color: "gray" }}>
            {chatMessages?.[0]?.data.message}
          </Text>
        </ListItem.Subtitle>
        <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
          <Text style={styles.senderTime}>
            {chatMessages?.[0]?.data?.displayName}
          </Text>
          <Text style={styles?.senderTime}>
            {chatMessages?.[0]?.data.timestamp?.toDate().toLocaleString()}
          </Text>
        </View>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItem;

const styles = StyleSheet.create({
  senderTime: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "black",
  },
});
