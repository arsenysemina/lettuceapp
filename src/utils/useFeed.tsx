import { create } from "zustand";
import { Content } from "../components/content-card";

//I wanted to avoid fetching twice to display blog pages 
// (passing the entire object in url params was ugly) 
// and decided to use zustand for a global state

interface FeedState {
  feed: Content[]
  setFeed: (newFeed: Content[]) => void
}

const useFeed = create<FeedState>((set) => ({
  feed: [] as Content[],
  setFeed: (newFeed) => set({feed: newFeed}) 
}));

export default useFeed