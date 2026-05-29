import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import ContentCard, { Content } from "./components/content-card";


export default function Index() {
  
  const [feed, setFeed] = useState<Content[]>([])
  const [tab, setTab] = useState('All Articles')

  const getFeed = async () => {
    try {
      const response = await fetch(
        'https://www.lettuce.com/wp-json/lettuce/blog-content',
      );
      const json = await response.json();
      setFeed(json);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

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
        tabFeed=='Openings' ? feed.filter(item => item.topics.includes('Openings')) : 
        feed.filter(item => item.topics.includes('Guides'))} 
      renderItem={({item}) => <ContentCard {...item}/>}
      />
  )

  return (
    <SafeAreaView style={styles.container}>
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
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  header: {
    fontWeight: 'bold',
    paddingHorizontal: 16,
    fontSize: 28,
    marginBottom: 24
  },
  tabs: {
    paddingHorizontal: 16,
    flexDirection: 'row'
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
    marginTop: 12,
    lineHeight: 5,
    justifyContent: 'flex-end',
    backgroundColor: '#258834'
  },
  feed: {
    paddingHorizontal: 16,
    gap: 16
  }

});
