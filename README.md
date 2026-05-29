# Arseny Semina's Lettuce Entertain You coding take home test

I chose to use Expo to develop this project, and you can use Expo as you normally would to deploy this app to a phone. That said, for convenience I also developed this project as a web app so that it could be easily hosted and shared.
- If you don't want to clone the repo and deploy it yourself [you can just visit the app here](https://leyapp-596b37761c1c.herokuapp.com/) 
- (I recommend opening it on a phone but if you are not on a phone then open the browser inspect tools and switch to a phone layout)

## To Deploy

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

## Comments
Initially I tried using a more native expo-router-y approach to navigation but decided to switch to links and pressables because I wasn't happy with how it looked compared to the Figma.  
The notable third party libraries in use are:
1. react-native-render-html
   - I use this for rendering the blog content, with some significant overides to attempt to replicate the style in the Figma.
   - I chose not to use WebView because it is 1. a pain to setup and 2. much bulkier than needed considering it is serving static content
2. zustand
   - I added this to avoid double fetching when clicking on a blog, this way it is stored in a state accessible by both pages
3. express
   - This is here just for heroku deployments

Longest Struggles:
- WebView, what a nightmare to set up. I assume the issue is because I am developing for an iOS device but on a linux machine. Every troubleshooting advice advised me to do something with XCode.
- Rendering blogs! Most of the stuff in content looks wildly different from the figma, references css not in the body, and also has internal linking(!) So this took a lot of tinkering. (the internal linking still isn't working)
- Navigation went back and forth. Ultimately I went with zustand and links, but it took some experimenting.