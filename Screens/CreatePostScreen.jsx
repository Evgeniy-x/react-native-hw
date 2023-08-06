import {
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Text,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Feather, FontAwesome } from "@expo/vector-icons";

import { selectUser } from "../redux/auth/authSelectors";
import { addPost } from "../redux/posts/postsOperations";

const defaultMapLocation = {
  isLoading: false,
  latitude: null,
  longitude: null,
};

export default function CreatePostScreen() {
  const [isCameraPermissionDenied, setCameraDenied] = useState(false);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [place, setPlace] = useState("");
  const [mapLocation, setMapLocation] = useState({ ...defaultMapLocation });
  const isDataFullFilled = image && title && place && !mapLocation.isLoading;

  const { uid } = useSelector(selectUser);
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  async function makePhoto() {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      setCameraDenied(true);
      return alert("Permission to camera access was denied");
    }

    await MediaLibrary.requestPermissionsAsync();
    const { canceled, assets } = await ImagePicker.launchCameraAsync({
      quality: 1,
      allowsEditing: true,
      allowsMultipleSelection: false,
    });
    if (!canceled) {
      await MediaLibrary.createAssetAsync(assets[0].uri);
      setImage(assets[0].uri);
      setCameraDenied(false);
    }
  }

  function removePhoto() {
    setImage(null);
  }

  async function getMapLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return setMapLocation({ ...defaultMapLocation });
    }

    setMapLocation((state) => ({ ...state, isLoading: true }));
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({
      accuracy: Location.LocationAccuracy.Low,
    });
    setMapLocation((state) => ({
      ...state,
      isLoading: false,
      latitude,
      longitude,
    }));
  }

  function handleSubmit() {
    dispatch(
      addPost({
        authorID: uid,
        image,
        title,
        place,
        mapLocation: {
          latitude: mapLocation.latitude,
          longitude: mapLocation.longitude,
        },
        comments: [],
        likes: 0,
      })
    );
    resetData();
    navigate("PostsScreen");
  }

  function resetData() {
    setImage(null);
    setTitle("");
    setPlace("");
    setMapLocation({ ...defaultMapLocation });
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps='handled'
    >
      <TouchableOpacity
        style={styles.imgWrapper}
        onPress={image ? removePhoto : makePhoto}
      >
        {image && <Image style={styles.imgSize} source={{ uri: image }} />}
        <View style={[styles.cameraBtn, image && styles.transparent]}>
          <FontAwesome
            name='camera'
            size={24}
            color={image ? "#fff" : "#BDBDBD"}
          />
        </View>
      </TouchableOpacity>
      {isCameraPermissionDenied ? (
        <Text style={styles.warning}>
          To create a new post, please allow access to your camera.
        </Text>
      ) : (
        <Text style={styles.cameraText}>
          {image ? "Редагувати фото" : "Завантажте фото"}
        </Text>
      )}

      <View style={styles.inputsList}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder='Назва...'
            style={styles.input}
            value={title}
            onChangeText={(value) => setTitle(value.trim())}
            placeholderTextColor='#BDBDBD'
          />
        </View>
        <View style={styles.inputWrapper}>
          <Feather name='map-pin' size={24} color='#BDBDBD' />
          <TextInput
            placeholder='Місцевість...'
            style={styles.input}
            value={
              mapLocation.isLoading
                ? "Please, wait for setting your location . . ."
                : place
            }
            onChangeText={(value) => setPlace(value.trim())}
            onBlur={() => place && getMapLocation()}
            placeholderTextColor='#BDBDBD'
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitBtn, isDataFullFilled && styles.activeBtn]}
        disabled={!isDataFullFilled}
        onPress={handleSubmit}
      >
        <Text
          style={[styles.submitBtnText, isDataFullFilled && styles.activeText]}
        >
          Опубліковати
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetBtn} onPress={resetData}>
        <Feather name='trash-2' size={24} color='#BDBDBD' />
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 32,
    backgroundColor: "#fff",
  },
  imgWrapper: {
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderColor: "#E8E8E8",
    borderWidth: 1,
    borderRadius: 8,
  },
  imgSize: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  cameraBtn: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 50,
  },
  transparent: {
    backgroundColor: "rgba(255, 255, 255, 0.30)",
  },
  cameraText: {
    marginTop: 8,
    color: "#BDBDBD",
    fontSize: 16,
  },
  warning: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
  },
  inputsList: {
    rowGap: 16,
    marginVertical: 32,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  input: {
    width: "100%",
    height: 50,
    fontSize: 16,
    fontWeight: "500",
    color: "#212121",
  },
  submitBtn: {
    alignItems: "center",
    padding: 16,
    fontSize: 16,
    backgroundColor: "#F6F6F6",
    borderRadius: 100,
  },
  activeBtn: {
    backgroundColor: "#FF6C00",
  },
  submitBtnText: {
    color: "#BDBDBD",
    fontSize: 16,
  },
  activeText: {
    color: "#ffffff",
  },
  resetBtn: {
    width: 70,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 16,
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
  },
});
