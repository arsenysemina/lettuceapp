import { create } from "zustand";
import { Content } from "../components/content-card";

// Define types for state & actions
interface FeedState {
  feed: Content[]
  setFeed: (newFeed: Content[]) => void
}
const useFeed = create<FeedState>((set) => ({
  feed: [] as Content[],
  setFeed: (newFeed) => set({feed: newFeed}) 
}));

export default useFeed