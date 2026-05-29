import { useEffect, useState } from "react";
import { Dimensions, FlatList, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import ContentCard from "../components/content-card";
import useFeed from "../utils/useFeed";

export default function Index() {

  // stores the currently active tab
  const [tab, setTab] = useState('All Articles')
  // zustand store for the blog feed
  const {feed, setFeed} = useFeed()

  const getFeed = async () => {
    try {
      const response = await fetch(
        'https://www.lettuce.com/wp-json/lettuce/blog-content',
      );
      const json = await response.json();
      setFeed(json)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  // I'm passing in the width for the tabs so that they don't push each other
  // around whenever one of them expands from the text becoming bold
  // in order to add a thick underline that is apart from the text I added
  // an extra Text component
  type TabProps = {width:number, text:string}; 
  const Tab = ({...props}:TabProps) => (
    <Pressable style={[styles.tab, {width:props.width}]} onPress={() => { setTab(props.text) }}>
      <Text style={tab==props.text ? styles.active : styles.inactive}>{props.text}</Text>
      <Text style={tab==props.text ? styles.underline : ''}> </Text>
    </Pressable>
  )

  type FeedProps = {tabFeed:string}
  const Feed = ({tabFeed}:FeedProps) => (
    <FlatList 
      contentContainerStyle = {styles.feed}
      data={tabFeed=='All Articles' ? feed : 
        tabFeed=='Openings' ? feed.filter(item => item.topics?.includes('Openings')) : 
        feed.filter(item => item.topics?.includes('Guides'))} 
      renderItem={({item}) => <ContentCard {...item}/>}
      />
  )

  return (
    <SafeAreaView style={{width: Dimensions.get('window').width > 500 ? 500 : Dimensions.get('window').width, ...styles.container}}>
      <Text style={styles.header}>
        Newsfeed
      </Text>
      
      <View style={styles.tabs}>
        <Tab width={90} text='All Articles'/>
        <Tab width={80} text='Openings'/>
        <Tab width={70} text='Guides'/>
      </View>

      <Feed tabFeed={tab}/>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 'auto',
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  header: {
    fontWeight: 'bold',
    paddingHorizontal: 16,
    fontSize: 28,
    marginBottom: 24,
    marginTop: Platform.OS=='web' ? 16 : 0
  },
  tabs: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#D3D3D3'
  },
  tab: {
    flexDirection: 'column'
  },
  inactive: {
    color: '#194A23',
    textAlign: 'center'
  },
  active: {
    color: '#258834',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  underline: {
    marginTop: 13 ,
    lineHeight: 5,
    justifyContent: 'flex-end',
    backgroundColor: '#258834'
  },
  feed: {
    marginTop: 16,
    paddingHorizontal: 16,
    gap: 16
  }

});
