import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal, Appearance } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LinearGradient from 'react-native-linear-gradient';
import ExpiryStatusLabel from '../components/ExpiryStatusLabel';
import { formatDate } from '../helper/data.ts';
import { normaliseURL } from '../helper/normalise.ts';
import { RootStackParamList } from '../config/types.ts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Keychain from 'react-native-keychain';

type ViewScreenRouteProp = RouteProp<RootStackParamList, 'View'>;
type ViewScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'View'>;

const ViewScreen: React.FC = () => {
  const route = useRoute<ViewScreenRouteProp>();
  const { card } = route.params;
  const navigation = useNavigation<ViewScreenNavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);

  const handleButtonPress = () => {
    navigation.navigate('Home');
  };

  const handleRemoveConfirmation = async (key: string) => {
    try {
      await Keychain.resetGenericPassword({ service: key });
    } catch (error) {
      console.log('Failed to remove credentials:');
    }
    navigation.navigate('Home');
  };

  const offset = 10 * 60 * 60 * 1000;
  const isExpired = new Date(card.expiryDate) < new Date(new Date().getTime() + offset);
  const formattedExpiryDate = new Date(card.expiryDate).toDateString().toString();
  const darkGradientColour = isExpired ? ['#606665', '#C1CCCA'] : ['#1F2A29', '#527E78'];
  const lightGradientColour = isExpired ? ['#c2d6ba', '#8da883'] : ['#8da883', '#c2d6ba'];

  const [currColorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const getGradientColors = () => {
    return currColorScheme === 'light' ? lightGradientColour : darkGradientColour;
  };

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  const usedGradient = getGradientColors();

  return (
    <View className="w-[100%] flex-1 bg-light-cream dark:bg-dark-green">
      <Header />
      <View className="px-12 py-5">
        <Pressable onPress={handleButtonPress} className="w-[27%] bg-theme-gold p-2 rounded-3xl ">
          <Text className="font-medium text-center text-base">Done</Text>
        </Pressable>
      </View>
      <View className="h-[65%] flex items-center space-y-5">
        <LinearGradient
          colors={usedGradient}
          className="rounded-2xl text-text-black dark:text-white"
        >
          <View className="h-40 w-[80%] rounded-md overflow-hidden p-4">
            <View className="flex-row justify-between">
              <Text className="text-xl font-bold p-4 text-text-black dark:text-white">
                {card.name}
              </Text>
            </View>
            <View className="flex-1 p-4 justify-end">
              <Text className="font-bold text-base text-text-black dark:text-white">
                {card.type}
              </Text>
              <View className="flex-row justify-between items-center">
                <Text className="text-base mr-4 text-text-black dark:text-white">
                  Expiry:{' '}
                  <Text className="font-bold text-text-black dark:text-white">
                    {formattedExpiryDate}
                  </Text>
                </Text>
                <ExpiryStatusLabel isExpired={isExpired} />
              </View>
            </View>
          </View>
        </LinearGradient>

        <View className="w-[90%] bg-light-green dark:bg-card-view-grey rounded-2xl space-y-5 p-5">
          <View className="p-3 bg-view-light dark:bg-popup-grey rounded-lg justify-around">
            <Text className="text-text-black dark:text-white font-bold">Pin to Wallet</Text>
          </View>
          <View className="w-[100%] bg-view-light dark:bg-popup-grey flex-row p-3 space-x-5 rounded-2xl">
            <View>
              <Text className="text-black dark:text-white font-medium">Issued by</Text>
              <Text className="text-black dark:text-white font-medium">Issued at</Text>
              <Text className="text-black dark:text-white font-medium">Expiry</Text>
            </View>
            <View>
              <Text className="text-white ">{normaliseURL(card.credIssuedBy)}</Text>
              <Text className="text-white ">{formatDate(card.issuanceDate)}</Text>
              <Text className="text-white ">{formatDate(card.expiryDate)}</Text>
            </View>
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View className="flex-1 items-center justify-center bg-dark-green opacity-80">
              <View className="w-[80%] bg-light-cream dark:bg-dark-grey p-5 flex align-center rounded-md space-y-5">
                <Text className="text-black dark:text-white px-5">
                  Do you wish to permanently remove this credential from your wallet?
                </Text>
                <View className="flex flex-row justify-around w-[100%]">
                  <Pressable onPress={() => setModalVisible(false)}>
                    <Text className="text-white font-medium bg-gray-500 p-2 rounded-md px-4">
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      handleRemoveConfirmation(card.originalName);
                      setModalVisible(false);
                    }}
                  >
                    <Text className="text-white bg-red-500 font-medium p-2 rounded-md px-4">
                      Remove
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
          <Pressable onPress={() => setModalVisible(true)}>
            <View className="p-3 bg-view-light dark:bg-popup-grey rounded-lg justify-around">
              <Text className="text-red-500 font-bold">Remove Credential</Text>
            </View>
          </Pressable>
        </View>
      </View>
      <Footer />
    </View>
  );
};

export default ViewScreen;
