import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import AppText from '../AppText';
import { useTheme } from '../../utils/ThemeContext';

const CritInfo = (props) => {
    const { theme } = useTheme();
  return (
    <ScrollView style={[styles.container, {backgroundColor: theme?.midnight}]}>
        <View style={{paddingBottom: 80}}>
            <AppText style={styles.head} color={theme?.amberGlow}>Crit Feature</AppText>
            <AppText style={styles.details} color={theme?.horizon}>The Crit (also known as Friendly) feature in Shopwit is a social tool that enhances your shopping experience by allowing you to connect with friends, family, or like-minded shoppers through group chats. With Crit, you can create private groups, share product finds, and discuss your shopping choices with others in real time. Sign up/register for free to use Crit. </AppText>

            <AppText style={styles.head} color={theme?.amberGlow}>Creating a Group in Crit</AppText>
            <AppText style={styles.details} color={theme?.horizon}>Crit allows you to create groups where you and other users can chat about products, deals, and recommendations. You can set up a group to share products from the app or simply to chat about your shopping experience.</AppText>

            <AppText style={styles.head} color={theme?.amberGlow}>Adding Users to Your Group</AppText>
            <AppText style={styles.details} color={theme?.horizon}>Adding users to your group is easy. You can invite friends who are already using Shopwit to join your Crit group.</AppText>

            <AppText style={styles.head} color={theme?.amberGlow}>Sharing Products in Crit</AppText>
            <AppText style={styles.details} color={theme?.horizon}>One of the best features of Crit is the ability to share products from the app directly into your group chat. If you find an item that you think others in the group might like, you can easily share it for discussion.</AppText>

            <AppText style={styles.head} color={theme?.amberGlow}>Freedom to Chat and Discuss</AppText>
            <AppText style={styles.details} color={theme?.horizon}>In Crit, you can have open conversations about anything—from the latest deals you’ve found to recommendations on what to buy. It’s a space for you and your group to exchange ideas, opinions, and thoughts.</AppText>
            
            <AppText style={styles.head} color={theme?.amberGlow}>Leaving a Group</AppText>
            <AppText style={styles.details} color={theme?.horizon}>If you no longer wish to be part of a group, you can leave it at any time. This will remove you from the group chat and prevent you from receiving further notifications.</AppText>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: '100%',
        padding: 10,
        borderRadius: 10,
      },
      head: {
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
      },
      details: {
        fontSize: 14,
        marginBottom: 10,
      }
});

export default CritInfo;