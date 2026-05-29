import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Image, Platform, ScrollView, StyleSheet } from "react-native";
import RenderHtml from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Content } from "../components/content-card";


export default function Blog() {

  const params = useLocalSearchParams()
  
  const blogStyle:string = `
    <style>
      img {width: ${(Dimensions.get('window').width-32)}px; height: unset;} 
      body {margin: 0px; padding: 0 16px; font-family: Sans; text-align: left; font-size: 12px;}
      a {color: #258834; text-decoration: none;}
      p {margin: 0;}
      h2 {margin: 0;}
      html {overflow-x:hidden;}
    </style>`

  const [blog, setBlog] = useState<Content>()

  const getBlog = async () => {
    try {
      const response = await fetch(
        'https://www.lettuce.com/wp-json/lettuce/blog-content',
      );
      const json = await response.json();
      let result:Content = json.find((item:Content) => item.ID.toString()==params.id)
      result.content = `<img src="${result.featured_image.url}"
                              style="position:relative;
                              object-fit: cover;
                              left:-16px;
                              height: 150px;
                              width:${Dimensions.get('window').width}px">
                        <h1>${result.title}</h1>
                        ${result.created_at}\r\n\r\n` + result.content
      result.content += blogStyle
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
    <SafeAreaView>
      <ScrollView style={styles.container}>
        {/* <RenderHtml 
          contentWidth={Dimensions.get('window').width} 
          source={{html: `${blog?.content}`}}
          tagsStyles={tagsStyles}/> */}
        <Link href={{pathname: '/'}}><Image style={styles.back} source={require('../../../assets/images/back.svg')}/></Link>
        {Platform.OS == 'web' ? 
          <iframe style={{border: "none",height:Dimensions.get('window').height}} 
                  srcDoc={blog?.content}></iframe> : 
            <RenderHtml source={{html: `${blog?.content}`}}/>
            }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  header: {
    fontWeight: 'bold',
    paddingHorizontal: 16,
    fontSize: 28,
    marginBottom: 24
  },
  back: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "white",
    padding: 7,
    borderRadius: 30,
    borderWidth: 10,
    borderColor: "white"
  }

});
