import * as React from 'react'
import {StyleSheet, View} from 'react-native'
import {Text} from './Themed'
import useColorScheme from '../hooks/useColorScheme'
import colors from '../constants/Colors'



export default function Header({title} : any){

    const colorScheme = useColorScheme()
   

    return(
        <View style={styles.container}>
            <View style={[styles.innerContainer, {backgroundColor : colors[colorScheme].headerColor}]}>
              <Text style={styles.title}>{title}</Text>
            </View>
          
        </View>
    )

}

const styles = StyleSheet.create({
    container : {
        overflow: 'hidden',
        paddingBottom : 3,
    },
    innerContainer : {
        padding: 20,
        elevation : 2,
    },
    title : {
        textAlign: "left",
        fontWeight: "bold",
        fontSize: 20,
    }
})