import { useEffect, useState } from "react";
import {
  ActivityIndicator, FlatList, Platform, Pressable,
  StyleSheet, Text,
  TextInput,
  useWindowDimensions, View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import ContentCard, { Content } from "../components/content-card";
import useFeed from "../utils/useFeed";

export default function Index() {
  const {width,height} = useWindowDimensions()

  const allArticles = 'All Articles'

  // stores the currently active tab
  const [tab, setTab] = useState(allArticles)
  // zustand store for the blog feed
  const {feed, setFeed} = useFeed()

  const [tabs, setTabs] = useState([''])

  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const getFeed = async () => {
    try {
      const response = await fetch(
        'https://www.lettuce.com/wp-json/lettuce/blog-content',
      );
      const json = await response.json();
      setFeed(json)
      setLoading(false)
      setTabs(generateTabs(json))
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  function generateTabs(json:Content[]):string[] {
    let allTabs: {[index:string]: number} = {}
    json.forEach((element) => {
      element.topics?.forEach((topic) => {
        if(topic in allTabs) {
          allTabs[topic] += 1
        }
        else {
          allTabs[topic] = 1
        }
      })
    })
    
    let arr = Object.entries(allTabs).sort((b,a) => a[1] - b[1])
    return [allArticles, arr[0][0],arr[1][0]]
  }

  function filterFeed():Content[] {
      let searchedFeed = feed.filter(item => item.title?.toLowerCase().includes(search.toLowerCase()))
      switch(tab) {
        case tabs[0]:
          return searchedFeed
        case tabs[1]:
          return searchedFeed.filter(item => item.topics?.includes(tabs[1]))
        case tabs[2]:
          return searchedFeed.filter(item => item.topics?.includes(tabs[2]))
      default:
        return searchedFeed
      }
  }

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

  const Feed = () => (
    <FlatList 
      ListEmptyComponent={<Text>I'm Empty, Boss</Text>}
      contentContainerStyle = {styles.feed}
      data={filterFeed()} 
      renderItem={({item}) => <ContentCard {...item}/>}
      />
  )

  const Spinner = () => (
    <ActivityIndicator style={styles.spinner}/>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>
        Newsfeed
      </Text>
      <TextInput 
        style={styles.search} 
        onChangeText={setSearch}
        value={search}
      />
      
      <View style={styles.tabs}>
        <Tab width={90} text={tabs[0]}/>
        <Tab width={80} text={tabs[1]}/>
        <Tab width={70} text={tabs[2]}/>
      </View>

      {loading ? <Spinner/> :
        <Feed/> 
      }
      
    </SafeAreaView> 
  );
}

const styles = StyleSheet.create({
  search: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  spinner: {
    marginTop: 24
  },
  container: {
    flex: 1,
    flexDirection: "column",
    // justifyContent: "center",
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
