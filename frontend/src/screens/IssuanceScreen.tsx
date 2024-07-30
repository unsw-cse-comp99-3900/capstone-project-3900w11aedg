import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../config/types';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { RouteProp } from '@react-navigation/native';
import IssueCredentialList from '../components/IssueCredentialList';

type Props = {
  route: RouteProp<RootStackParamList, 'Issue'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Issue'>;
};

export default function IssuanceScreen({ route, navigation }: Props): JSX.Element {
  const { issuerMetadata } = route.params ?? {};

  return (
    <View className="flex flex-col h-[100%] w-[100%] bg-white dark:bg-dark-green">
      <Header />
      <View className="flex flex-col px-[5%] h-[100%]">
        <TouchableOpacity
          className="w-[30%] bg-theme-gold py-[3px] rounded-[15px]"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-black text-lg font-medium text-center">Back</Text>
        </TouchableOpacity>
        <Text className="mt-[8%] font-medium text-3xl text-text-grey pb-6 pl-4 dark:text-white">
          Add a credential
        </Text>
        {issuerMetadata ? (
          <IssueCredentialList issuerMetadata={Object.values(issuerMetadata)[0]} />
        ) : (
          <></>
        )}
      </View>
      <Footer />
    </View>
  );
}
