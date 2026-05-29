import { Link } from 'expo-router';
import { Image, Text, View } from 'react-native';

export type Content = {
    topics?: string[],
    regions?: string[],
    restaurants?: string[],
    created_at: string,
    updated_at?: string,
    ID: number,
    title: string,
    featured_image: {url:string,alt_text?:string},
    content: string,
    tagline?: string
}

export default function ContentCard(item:Content) {
  
  return <Link href={{pathname: '/blog/[id]', params:{id: item.ID,
                                                      content: item.content,
                                                      created_at: item.created_at,
                                                      title: item.title,
                                                      featuerd_image_url: item.featured_image.url
  }}}>  
    <View style={{width: '100%', flexDirection: 'row'}}>
      <Image 
        style= {{flex:5, width: 150, height: 100}}
        source={{
          uri: item.featured_image.url
        }}
        alt= {item.featured_image.alt_text}
      />

      {/* this may be a fluke of my javascript version, but 
      Date.parse refuses to parse date strings that do not 
      contain a day of the week, whether or not the day is
      correct does not matter */}
      {(Date.parse("Mon, " + item.created_at.replace(',','')) > (Date.now() - (7*24*60*60*1000))) ? 
        <Text style={{
          position:'absolute',
          backgroundColor: '#258834',
          color: 'white',
          textAlignVertical: 'center',
          borderRadius: 22,
          paddingVertical: 4,
          paddingHorizontal: 16,
          top: 7,
          left: 4
          }}>NEW!</Text> : null}

      <View style={{flex:7, flexDirection: 'column', justifyContent: 'space-between', paddingLeft: 16}}>
        <Text style={{fontSize: 17, fontWeight: 'bold'}}>
          {item.title}
        </Text>
        <Text style={{}}>
          {item.created_at}
        </Text>
      </View>
    </View>
  </Link>
;
}
