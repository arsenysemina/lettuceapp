import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import RenderHtml from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Content } from "../components/content-card";


export default function Blog() {
  const router = useRouter()
  const params = useLocalSearchParams()

  const [blog, setBlog] = useState<Content>()

  const getBlog = async () => {
    try {
      const response = await fetch(
        'https://www.lettuce.com/wp-json/lettuce/blog-content',
      );
      const json = await response.json();
      let result:Content = json.find((item:Content) => item.ID.toString()==params.id)
      result.content = result.content.replaceAll("p>\r\n","p>")
      result.content = result.content.replaceAll("h2>\r\n","h2>")
      result.content = result.content.replaceAll("div>\r\n","div>")
      result.content = result.content.replaceAll("\r\n","<br>")
      setBlog(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBlog();
  }, []);


  return (
    blog ?
    <SafeAreaView style={{height: Dimensions.get('window').height}}>
      <ScrollView horizontal={false} style={{overflowX:'hidden'}}>
        <Image style={{height:150}} source={{uri: blog.featured_image.url}}/>
        <Text style={styles.header}>{blog.title}</Text>
        <Text style={styles.date}>{blog.created_at}</Text>
        <RenderHtml contentWidth={Dimensions.get('window').width-36} 
                    source={{html: `${blog?.content}`}}
                    baseStyle={{paddingHorizontal:16, fontSize: 12, fontFamily:'Sans'}}
                    tagsStyles={{a: {color:'green', textDecorationLine:'none'},
                                p: {marginVertical:5},
                                h2: {marginVertical:5},
                                img: {marginBottom:10}}}/>
      </ScrollView>

      <TouchableOpacity 
        style={styles.back} 
        onPress={() => router.navigate('/')}
      >
        <Image style={{}} source={require('../../../assets/images/back.svg')}/>
      </TouchableOpacity>
    </SafeAreaView> : ''
  );
}

const styles = StyleSheet.create({
  back: {
    position: "absolute",
    top: 64,
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
