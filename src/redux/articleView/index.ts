import { ApiData } from '~/api/article.d'
import setActionHandler from '~/utils/redux/setActionHandler'

export const ADD = Symbol()

export interface ActionTypes {
  [ADD]: {
    name: string
    data: ApiData.GetContent
  }
} 

export interface State {
  pagesCache: {
    [pageName: string]: ApiData.GetContent
  }
}

const reducer: __Redux.ReduxReducer<State, keyof ActionTypes> = (state = {
  pagesCache: {}
}, action) => setActionHandler<ActionTypes, State>(action, {
  [ADD]: action => {
    return {
      pagesCache: {
        ...state.pagesCache,
        [action.name]: action.data
      } 
    }
  } 
}) || state

export default reducer