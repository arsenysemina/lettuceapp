import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import RenderHtml from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Content } from "../../components/content-card";
import useFeed from "../../utils/useFeed";


export default function Blog() {
  const router = useRouter()
  const params = useLocalSearchParams()

  const {feed} = useFeed()
  const [blog, setBlog] = useState<Content>()

  const parseContent = (content:string) => {
    // I'm removing a bunch of <br> tags after elements 
    // that already cause line breaks bc they look bad in mobile
    var result:string 
    result = content.replaceAll("p>\r\n","p>")
    result = content.replaceAll("h2>\r\n","h2>")
    result = content.replaceAll("div>\r\n","div>")
    // every other line break I convert to a <br> so it is displayed by RenderHtml
    result = content.replaceAll("\r\n","<br>")
    return result
  }

  const getBlog = async () => {
    //check if content param is present, otherwise fetch
    const findBlog = feed.find((item)=>item.ID.toString()==params.id)
    if(findBlog) {
      findBlog.content = parseContent(findBlog.content)
      setBlog(findBlog)
    }
    else {
      try {
        const response = await fetch(
          'https://www.lettuce.com/wp-json/lettuce/blog-content',
        );
        const json = await response.json();
        let result:Content = json.find((item:Content) => item.ID.toString()==params.id)
        result.content = parseContent(result.content) 
      
        setBlog(result);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getBlog();
  }, []);


  return (
    blog ?
    <SafeAreaView style={{width: Dimensions.get('window').width, marginHorizontal:'auto',height: Dimensions.get('window').height}}>
      <ScrollView horizontal={false}>
        <Image style={{height:150}} source={{uri: blog.featured_image.url as string}}/>
        <Text style={styles.header}>{blog.title}</Text>
        <Text style={styles.date}>{blog.created_at}</Text>
        <RenderHtml contentWidth={Dimensions.get('window').width-36} 
                    source={{html: `${blog?.content}`}}
                    baseStyle={{paddingHorizontal:16, fontSize: 12}}
                    tagsStyles={{a: {color:'green', textDecorationLine:'none'},
                                p: {marginVertical:5},
                                h2: {marginVertical:5},
                                img: {marginBottom:10}}}
                    systemFonts={['Sans-Serif']}/>
      </ScrollView>

      <TouchableOpacity 
        style={styles.back} 
        onPress={() => router.canGoBack() ? router.back() : router.navigate('/')}
      >
        <Image style={{}} source={require('../../../assets/images/back.svg')}/>
      </TouchableOpacity>
    </SafeAreaView> : ''
  );
}

const styles = StyleSheet.create({
  back: {
    position: "absolute",
    top: Platform.OS=='web' ? 16 : 80,
    left: 16,
    backgroundColor: "white",
    padding: 7,
    borderRadius: 30,
    borderWidth: 10,
    borderColor: "white",
    zIndex: 10
  },
  header: {
    paddingHorizontal:16,
    marginVertical: 10,
    fontWeight: 'bold',
    fontSize: 18
  },
  date: {
    paddingHorizontal:16,
    marginBottom: 16,
    fontSize: 12
  }
});
