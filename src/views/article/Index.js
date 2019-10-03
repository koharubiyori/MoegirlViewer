import React from 'react'
import { 
  View, Text,
  StyleSheet, NativeModules,
} from 'react-native'
import PropTypes from 'prop-types'
import ArticleView from '~/components/webView/ArticleView'
import StatusBar from '~/components/StatusBar'
import Header from './Header'
import CatalogTriggerView from './catalogTriggerView/index'
import CommentBtn from './commentBtn/Index'
import storage from '~/utils/storage'
import saveHistory from '~/utils/saveHistory'

const NavigationContext = React.createContext()

export { NavigationContext }

export default class Article extends React.Component{
  static propTypes = {
    navigation: PropTypes.object
  }

  constructor (props){
    super(props)

    this.state = {
      link: props.navigation.getParam('link'),
      pageName: props.navigation.getParam('link'),

      catalogItems: []
    }

    this.articleViewInjectCss = `
      body {
        padding-top: 55px;
      }
    `

    // 给webview注入的字符串js代码
    this.articleViewInjectJs = (function injectedJs(){
      var lastPosition = 0,
      postMessageFlag = false   // 设置一个标记，防止和webview通信过频降低性能

      $(window).scroll(function(){
        function changeHeaderVisible(status){
          if(postMessageFlag){ return }
          postMessageFlag = true
          ReactNativeWebView.postMessage(JSON.stringify({ type: 'changeHeaderVisible', data: status }))
          setTimeout(() => postMessageFlag = false, 50)
        }

        if(window.scrollY < 100){
          changeHeaderVisible(true)
          return true
        }

        changeHeaderVisible(!(window.scrollY > lastPosition))
        lastPosition = window.scrollY
      })
    }).toString() + ';injectedJs()'
  }

  // 接收需要隐藏或显示header的指令
  changeHeaderVisible = isVisible =>{
    const {show, hide} = this.refs.header
    const {show: showBtn, hide: hideBtn} = this.refs.commentBtn
    isVisible ? show() : hide()
    isVisible ? showBtn() : hideBtn()
  }

  contentLoaded = data =>{
    var title = this.state.pageName
    var trueTitle = data.parse.title

    // 写入缓存
    storage.merge('articleCache', { [trueTitle]: data })

    if(title !== trueTitle){
      $dialog.dropToast.show(`“${this.state.pageName}”被重定向至此页`)

      // 记录至文章重定向表
      storage.merge('articleRedirectMap', { [title]: trueTitle })
    }

    saveHistory(trueTitle)

    this.setState({
      // 名字不一样要提示
      pageName: trueTitle,
      catalogItems: data.parse.sections
    })
  }

  articleViewIntoAnchor = anchor =>{
    this.refs.articleView.injectScript(`
      document.getElementById('${anchor}').scrollIntoView({ behavior: 'smooth' })
    `)
  }

  render (){
    return (
      <NavigationContext.Provider value={this.props.navigation}>
        <StatusBar />
        {/* 这只是一个普通的view，但被绑定了滑动显示catalog的事件 */}
        <CatalogTriggerView style={{ flex: 1 }} items={this.state.catalogItems} onTapTitle={this.articleViewIntoAnchor}>
         <Header style={styles.header} 
          navigation={this.props.navigation} 
          title={this.state.pageName} 
          onTapRefreshBtn={() => this.refs.articleView.loadContent(true)}
          ref="header" 
        />
         <ArticleView style={{ flex: 1 }} navigation={this.props.navigation}
            link={this.state.link} 
            injectStyle={['page']}
            injectCss={this.articleViewInjectCss}
            injectJs={this.articleViewInjectJs}
            onMessages={{ changeHeaderVisible: this.changeHeaderVisible }}
            onLoaded={this.contentLoaded}
            ref="articleView"
          />       
          
          <CommentBtn ref="commentBtn" />   
        </CatalogTriggerView>
      </NavigationContext.Provider>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: NativeModules.StatusBarManager.HEIGHT,
    left: 0,
    right: 0,
  }
})