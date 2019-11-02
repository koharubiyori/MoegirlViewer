import React from 'react'
import {
  View, Text,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import Toolbar from '~/components/Toolbar'
import { NavigationContext } from '../Index'

export default class IndexHeader extends React.Component{
  static propTypes = {
    title: PropTypes.string.isRequired
  }

  constructor (props){
    super(props)
    this.state = {
      showToast: false
    }

  }

  eventHandlers = (event, navigation) =>{
    console.log(event)
    if(event.action === 'search'){
      navigation.push('search')
    }
  }

  render (){
    return (
      <NavigationContext.Consumer>{navigation =>
        <Toolbar size={26}
          leftElement="menu"
          centerElement={this.props.title}
          rightElement={{
            actions: ['search'],
          }}

          onLeftElementPress={() => $drawer.open()}
          onRightElementPress={event =>{ this.eventHandlers(event, navigation) }}
        />
      }</NavigationContext.Consumer>
    )
  }
}

const styles = StyleSheet.create({

})