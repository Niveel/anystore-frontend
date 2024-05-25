import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable';


import ProductCard from '../ProductCard'
import CartDeleteAction from './CartDeleteAction'

const CartItem = ({image, name, desc, price, companyName, onPress, delPress}) => {
  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={()=> <CartDeleteAction onPress={delPress}/>}>
        <ProductCard 
          image={image}
          name={name}
          desc={desc}
          price={price}
          companyName={companyName}
          onPress={onPress}
        />
      </Swipeable>

    </GestureHandlerRootView>
  )
}

export default CartItem