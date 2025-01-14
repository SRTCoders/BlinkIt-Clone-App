import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import {Image} from 'expo-image'
import { getImageSize, wp } from '@/helpers/common'
import { theme } from '@/constants/theme'

const ImageCard = ({index , item , columns}) => {
    
    
    const getImageHeight = ()=>{
        let {width , height } = item ;
        return {height  : getImageSize(height , width)}

    }

    const isLastInRow = ()=> {
        return ( index+1) % columns === 0 ;
    }

  return (

   
    <Pressable style={[styles.imageWrapper , !isLastInRow() && styles.spacing]}>
      <Image style={[styles.image , getImageHeight()]} 
         transition={100}
      source={{uri:item.urls?.regular } } 
      
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
    image : {

        height : 300 , 
        width : "100%"

    },
    imageWrapper:{
        backgroundColor : theme.colors.grayBG,
        borderRadius : theme.radius.xl ,
        borderCurve : 'continuous',
        overflow : 'hidden',
        marginBottom : wp(2),


    },
    spacing : {
         marginRight : wp(2)
    }

})

export default ImageCard