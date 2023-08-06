import {
  ImageBackground,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Text,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

import PostItem from "../components/PostItem";
import { selectUser } from "../redux/auth/authSelectors";
import { selectPostsByOwner } from "../redux/posts/postsSelectors";
import { updateAvatarURL, removeAvatarURL } from "../redux/auth/authOperations";
import mountainsBgImage from "../images/mountains-bg.png";
import defaultOwnerAvatar from "../images/default-owner-avatar.png";
import addIcon from "../images/add-icon.png";
import removeIcon from "../images/remove-icon.png";

export default function PostsScreen() {
  const { name, avatarURL } = useSelector(selectUser);
  // const posts = useSelector(selectPostsByOwner);
  const posts = [];
  const dispatch = useDispatch();

  async function selectAvatar() {
    const { granted } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (!granted) {
      alert("Permission to access of the image library is required!");
      return;
    }

    const { canceled, assets } = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsEditing: true,
      allowsMultipleSelection: false,
    });
    if (!canceled) {
      dispatch(updateAvatarURL(assets[0].uri));
    }
  }

  function removeAvatar() {
    dispatch(removeAvatarURL());
  }

  return (
    <ImageBackground style={styles.mountainsBgImage} source={mountainsBgImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profile}>
          <TouchableOpacity
            style={styles.userAvatarWrapper}
            onPress={avatarURL ? removeAvatar : selectAvatar}
          >
            {avatarURL && (
              <Image style={styles.userAvatar} source={{ uri: avatarURL }} />
            )}
            <View style={styles.photoBtn}>
              <Image
                source={avatarURL ? removeIcon : addIcon}
                style={{ width: 30, height: 30 }}
              />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{name}</Text>
          <View style={styles.postsList}>
            {posts.map((post) => {
              return <PostItem key={post.id} post={post} />;
            })}
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  mountainsBgImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  profile: {
    paddingTop: 92,
    paddingBottom: 45,
    paddingRight: 16,
    paddingLeft: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  userAvatarWrapper: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -60 }],
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
  },
  userAvatar: {
    height: "100%",
    borderRadius: 16,
  },
  photoBtn: {
    position: "absolute",
    zIndex: 69,
    right: -14,
    bottom: 14,
  },
  userName: {
    color: "#212121",
    fontSize: 30,
    fontWeight: 500,
    textAlign: 'center',
  },
  postsList: {
    paddingBottom: 42,
  },
});