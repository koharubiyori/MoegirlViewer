import React, { PropsWithChildren, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, InteractionManager, LayoutAnimation, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import StatusBar from '~/components/StatusBar'
import ViewContainer from '~/components/ViewContainer'
import useLayoutAnimation from '~/hooks/useLayoutAnimation'
import store from '~/redux'
import { SET as COMMENT_SET } from '~/redux/comment'
import { CommentConnectedProps, commentHOC } from '~/redux/comment/HOC'
import toast from '~/utils/toast'
import Editor from './components/Editor'
import Header from './components/Header'
import Item from './components/Item'

export interface Props {

}

export interface RouteParams {
  title: string
}

type FinalProps = Props & __Navigation.InjectedNavigation<RouteParams> & CommentConnectedProps

function Comment(props: PropsWithChildren<FinalProps>) {
  const [visibleEditor, setVisibleEditor] = useState(false)
  const [commentTargetId, setCommentTargetId] = useState<undefined | string>(undefined)

  const theme = useTheme()
  const title = props.navigation.getParam('title')
  const signedName = store.getState().user.name

  useLayoutAnimation(
    LayoutAnimation.create(200, LayoutAnimation.Types.easeIn, LayoutAnimation.Properties.opacity)
  )

  function loadList() {
    InteractionManager.runAfterInteractions(() => {
      props.$comment.load().catch(() => toast.show('加载失败，正在重试'))
    })
  }

  function addComment() {
    if (!signedName) {
      return $dialog.confirm.show({
        content: '需要先登录才能发表评论，是否前往登录界面？',
        onPressCheck: () => props.navigation.push('login')
      })
    }

    setVisibleEditor(true)
  }

  function toReply(id: string) {
    const activeDataCommentTree = props.$comment.getActiveData().tree.tree
    // 判断评论下是否有回复
    if (activeDataCommentTree.find(comment => comment.id === id)!.children.length === 0) {
      setCommentTargetId(id)
      setVisibleEditor(true)
    } else {
      store.dispatch({ type: COMMENT_SET, data: { activeId: id } })
      props.navigation.push('reply', { signedName: signedName! })
    }
  }

  // 使用redux的数据源
  const state = props.$comment.getActiveData()
  if (state.status === 1) return null
  return (
    <ViewContainer grayBgColor>
      <StatusBar />
      <Header title={'评论：' + title} onPressAddComment={addComment} navigation={props.navigation} />
      <Editor 
        visible={visibleEditor} 
        pageId={state.pageId} 
        targetId={commentTargetId}
        onPosted={() => { props.$comment.incrementLoad(); setVisibleEditor(false); setCommentTargetId(undefined) }} 
        onDismiss={() => { setVisibleEditor(false); setCommentTargetId(undefined) }}
      />
    
      <FlatList removeClippedSubviews data={state.tree.tree} 
        onEndReachedThreshold={1}
        onEndReached={loadList}
        initialNumToRender={4}
        style={{ flex: 1 }}
        renderItem={item => <Item key={item.item.id} 
          data={item.item}
          navigation={props.navigation}
          signedName={signedName}
          onDel={props.$comment.del}
          onPressReply={toReply}
        />}
          
        ListHeaderComponent={state.data.popular.length !== 0 ? <>
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 18, marginLeft: 20, color: theme.colors.disabled, marginBottom: 10 }}>热门评论</Text>
            {state.data.popular.map(item =>
              <Item key={item.id} 
                data={item} 
                navigation={props.navigation} 
                visibleReply={false} 
                visibleReplyBtn={false} 
                signedName={signedName}
                onDel={props.$comment.del} 
              />  
            )}
            <Text style={{ fontSize: 18, marginLeft: 20, color: theme.colors.disabled, marginTop: 10 }}>全部评论</Text>
          </View>
        </> : null}

        ListFooterComponent={(({
          0: () => 
            <TouchableOpacity onPress={loadList}>
              <View style={{ height: 50, justifyContent: 'center', alignItems: 'center', elevation: 2 }}>
                <Text>加载失败，点击重试</Text>
              </View>
            </TouchableOpacity>,

          2: () => <ActivityIndicator color={theme.colors.accent} size={50} style={{ marginVertical: 10 }} />,
          4: () => <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: theme.colors.disabled }}>已经没有啦</Text>,
          5: () => <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: theme.colors.disabled }}>还没有评论哦</Text>
        } as { [status: number]: () => JSX.Element | null })[state.status] || (() => {}))()}
      />
    </ViewContainer>
  )
}

export default commentHOC(Comment)

const styles = StyleSheet.create({
  
})