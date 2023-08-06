import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { selectUser } from "../auth/authSelectors";

const selectPosts = (state) => state.posts;

const selectPostsByOwner = createSelector([selectPosts], (posts) => {
  const { uid } = useSelector(selectUser);
  return posts.filter((post) => post.authorID === uid);
});

const selectPostByID = (id) => (state) => {
  return state.posts.find((postItem) => postItem.id === id);
};

export { selectPosts, selectPostsByOwner, selectPostByID };