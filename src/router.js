import React from 'react'
import { createAppContainer, createStackNavigator, createDrawerNavigator, NavigationContainer } from "react-navigation"

import drawer from './views/drawer/Index'

import main from './views/main/Index'
import article from './views/article/Index'
import search from './views/search/Index'
import searchResult from './views/searchResult/Index'

const StackNavigator = createStackNavigator(
  { main, article, search, searchResult, drawer },

  { 
    initialRouteName: 'main',
    headerMode: 'none',
  }
)

const DrawerNavigator = createDrawerNavigator(
  { drawer },

  {
    initialRouteName: 'drawer',
    drawerWidth: 250,
    drawerBackgroundColor: $colors.main,
    contentOptions: {
      activeTintColor: '#fff',
      activeBackgroundColor: '#6b52ae',
    },
  }
)

const AppNavigator = createAppContainer(StackNavigator, DrawerNavigator)

export default AppNavigator