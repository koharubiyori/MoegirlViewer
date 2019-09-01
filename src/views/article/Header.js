import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Animated,
  StyleSheet, NativeModules, Dimensions
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Button from '~/components/Button'
import iconBtnStyle from '~/styles/header/iconBtnStyle'

export const height = 55

export default class ArticleHeader extends React.Component{
  static propTypes = {
    style: PropTypes.object,
    navigation: PropTypes.object,
  }

  constructor (props){
    super(props)
    this.state = {
      visible: true,
      transitionTop: new Animated.Value(0)
    }
    
    this.iconStyle = iconBtnStyle
  }
  
  openDrawer = () =>{
    console.log(true)
  }

  toSearchView = () =>{}

  hide = () =>{
    if(!this.state.visible){ return }
    this.setState({ visible: false })

    Animated.timing(this.state.transitionTop, {
      toValue: -height,
      duration: 200
    }).start()
  }

  show = () =>{
    if(this.state.visible){ return }
    this.setState({ visible: true })

    Animated.timing(this.state.transitionTop, {
      toValue: 0,
      duration: 200
    }).start()
  }

  render (){
    return (
      <Animated.View style={{ ...styles.body, ...this.props.style, top: this.state.transitionTop }}>
        <View style={{ flexDirection: 'row' }}>
          <Button onPress={() => this.props.navigation.goBack()} >
            <Icon name="keyboard-backspace" {...this.iconStyle} />
          </Button>
          
          <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>
            {this.props.title.replace(/_/g, ' ')}
          </Text>
        </View>

        <View style={styles.rightBtnContainer}>
          <Button onPress={this.toSearchView} style={styles.rightBtn}>
            <Icon name="search" {...this.iconStyle} />
          </Button>
          
          <Button onPress={this.toSearchView} style={styles.rightBtn}>
            <Icon name="star-border" {...this.iconStyle} />
          </Button>
          
          <Button onPress={this.toSearchView} style={styles.rightBtn}>
            <Icon name="edit" {...this.iconStyle} />
          </Button>
        </View>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  body: {
    ...$theme.mainBg,
    paddingHorizontal: 15,
    height,
    elevation: 3,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1
  },
  
  title: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
    marginTop: 5,
    flexShrink: 1,
    maxWidth: Dimensions.get('window').width / 2
  },

  rightBtnContainer: {
    flexDirection: 'row-reverse'
  },

  rightBtn: {
    marginRight: 5
  }
})