import React, {useState} from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import * as Yup from 'yup';

import Screen from '../components/Screen';
import AppText from '../components/AppText';
import List from '../components/List';
import { useTheme } from '../utils/ThemeContext';
import useAuth from '../auth/useAuth';
import AppButton from '../components/AppButton';
import PopupModal from '../components/modals/PopupModal';
import Icon from '../components/Icon';
import deleteAccount from '../api/deleteAccount';
import storage from '../auth/storage';
import DescriptionModal from '../components/modals/DescriptionModal';
import { AppForm, AppFormField, SubmitButton, } from '../components/forms';
import routes from '../navigation/routes';

const validationSchema = Yup.object().shape({
    username: Yup.string().required("Enter your name").label("Username").min(3, "Name too short").max(40, "Name too long"),
});

const AccountDetailsSettingsScreen = ({navigation}) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [changeNameModalVisible, setChangeNameModalVisible] = useState(false)
    const {theme} = useTheme()
    const {user} = useAuth()

    const performDeleteAccount = async () => {
        const authToken = await storage.getToken();
    
        if (!authToken) {
          console.log('Authentication token not found.');
          alert('Authentication token not found.');
          return;
        }
    
        if (!email) {
          console.log('User not found.');
          alert('User not found.');
          return;
        }
    
        const result = await deleteAccount.deleteAccount(email, authToken);
        
        if (!result.ok) {
          console.log(result.data.message);
          alert(result.data.message);
          return;
        }
    
        logOut();
      }

    const handleChangeName = async (values) => {
        console.log("name values", values);

        setTimeout(() => {
            setChangeNameModalVisible(false);
        }, 1000);
    }

  return (
    <Screen style={{backgroundColor: theme?.midnight}}>
        {/* new name modal */}
        <DescriptionModal
            visible={changeNameModalVisible}
            header='Change your name'
            closeModal={() => setChangeNameModalVisible(false)}
        >
            <View style={{
                width: '100%',
                paddingVertical: 10,
                gap: 10,
                marginVertical: 30,
            }}>
                <AppForm
                    initialValues={{username: user.username}}
                    validationSchema={validationSchema}
                    onSubmit={handleChangeName}
                >
                    <AppFormField
                        name="username"
                        icon="account"
                        placeholder="Violet Jones"
                        placeholderTextColor={theme?.mistyLight}
                        label="New Username"
                        autoCapitalize="none"
                        autoCorrect={false}
                        color={theme?.misty}
                    />
                    <SubmitButton 
                        title="Save" 
                        textColor={theme?.white}
                        width="50%"
                    />
                </AppForm>
            </View>
        </DescriptionModal>
        {/* main screen */}
        <ScrollView contentContainerStyle={{
                flexGrow: 1, 
                gap: 10, 
                padding: 10, 
                paddingBottom: 80
            }}>
            {/* list box */}
            <View style={styles.listBox}>
                <AppText style={styles.listTitle} color={theme?.horizon}>Username:</AppText>
                <List
                    title={user.username.toUpperCase()}
                    onPress={() => setChangeNameModalVisible(true)}
                    accessibilityLabel="Double tap to change email"
                />
            </View>
            {/* end of list box */}
            {/* list box */}
            <View style={styles.listBox}>
                <AppText style={styles.listTitle} color={theme?.horizon}>Email:</AppText>
                <List
                    title={user.email.toLowerCase()}
                    onPress={() => navigation.navigate(routes.EMAIL_RESET)}
                    accessibilityLabel="Double tap to change email"
                />
            </View>
            {/* end of list box */}
            {/* list box */}
            <View style={styles.listBox}>
                <AppText style={styles.listTitle} color={theme?.horizon}>Password</AppText>
                <List
                    title="********"
                    onPress={() => navigation.navigate(routes.PASSWORD_RESET)}
                    accessibilityLabel="Double tap to change password"
                />
            </View>
            {/* end of list box */}
            <View style={styles.listBox}>
                <AppText style={{fontSize: 14, marginBottom: 10}} color={theme?.punch}>Delete your account permanently</AppText>
                <AppButton
                    title="Delete Account"
                    onPress={() => setModalVisible(true)}
                    color={theme?.horizon}
                    accessibilityLabel="Double tap to delete account"
                    textColor={theme?.white}
                    width="55%"
                />
            </View>
        </ScrollView>
        {/* permanent delete modal */}
        <PopupModal 
            visible={modalVisible}
            closeModal={() => setModalVisible(false)}
        >
            <View style={styles.modalInner}>
                <View>
                    <AppText style={styles.bigText}>Delete Account permanently?</AppText>
                    <AppText style={styles.smallText}>Are you sure you want Account permanently?</AppText>
                </View>
                <Icon
                    name="cancel"
                    size={200}
                    color={theme?.punch}
                    style={{alignSelf: "center"}}
                />
                <View>
                    <AppButton
                        title="Delete forever"
                        onPress={performDeleteAccount}
                        color={theme?.horizon}
                        accessibilityLabel="Double tap to delete account"
                        textColor={theme?.white}
                        width="55%"
                        style={{alignSelf: "center", marginBottom: 10}}
                    />
                    <AppText style={styles.smallText} color={theme?.punch}>This action cannot be undone.</AppText>
                </View>
            </View>
        </PopupModal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
  listBox: {
    padding: 5,
  },
    listTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
    },
    bigText: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        textTransform: "uppercase",
        marginBottom: 20,
    },
    smallText: {
        fontSize: 14,
        textAlign: "center",
        textTransform: "capitalize",
    },
    modalInner: {
        flex: 1,
        padding: 10,
        justifyContent: "space-evenly",
    },
});

export default AccountDetailsSettingsScreen;