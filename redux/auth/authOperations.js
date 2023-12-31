import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, storage } from "../../firebase/config";

const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    const { name, email, password, avatarLocalPath } = userData;

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (avatarLocalPath) {
        // dispatch(updateAvatarURL(avatarLocalPath));
        const avatar = await fetch(avatarLocalPath);
        const blobAvatar = await avatar.blob();
        const blobAvatarLocalPath =
          "photos-of-avatars/" + blobAvatar._data.blobId;

        await uploadBytes(ref(storage, blobAvatarLocalPath), blobAvatar);
        const avatarURL = await getDownloadURL(
          ref(storage, blobAvatarLocalPath)
        );
        await updateProfile(user, {
          displayName: name,
          photoURL: avatarURL,
        });
        return { uid: user.uid, email, name, avatarURL };
      } else {
        await updateProfile(user, {
          displayName: name,
        });
        return { uid: user.uid, email, name, avatarURL: "" };
      }
    } catch (error) {
      alert(`RegisterError, ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

const logIn = createAsyncThunk(
  "auth/logIn",
  async (credentials, { rejectWithValue }) => {
    const { email, password } = credentials;
    try {
      const {
        user: { uid, displayName, photoURL },
      } = await signInWithEmailAndPassword(auth, email, password);

      return {
        uid,
        email,
        name: displayName,
        avatarURL: photoURL,
      };
    } catch (error) {
      alert(`LoginError, ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

const logOut = createAsyncThunk(
  "auth/logOut",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
    } catch (error) {
      alert(`LogoutError, ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

const updateAvatarURL = createAsyncThunk(
  "auth/updateAvatarURL",
  async (avatarLocalPath, { rejectWithValue }) => {
    try {
      const avatar = await fetch(avatarLocalPath);
      const blobAvatar = await avatar.blob();
      const blobAvatarLocalPath =
        "photos-of-avatars/" + blobAvatar._data.blobId;

      await uploadBytes(ref(storage, blobAvatarLocalPath), blobAvatar);
      const avatarURL = await getDownloadURL(ref(storage, blobAvatarLocalPath));
      await updateProfile(auth.currentUser, {
        photoURL: avatarURL,
      });

      return avatarURL;
    } catch (error) {
      alert(`updateAvatarURL, ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

const removeAvatarURL = createAsyncThunk(
  "auth/removeAvatarURL",
  async (_, { rejectWithValue }) => {
    try {
      const { photoURL } = auth.currentUser;
      await deleteObject(ref(storage, photoURL));
    } catch (error) {
      alert(`removeAvatarURL, ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

export { register, logIn, logOut, updateAvatarURL, removeAvatarURL };
