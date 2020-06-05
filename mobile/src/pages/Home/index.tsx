import React, { useEffect, useState } from 'react';
import { ImageBackground, View, Image, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from "@expo/vector-icons";
import RNPickerSelect from 'react-native-picker-select';
import Axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface PickerItem {
  label: string;
  value: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  const navigation = useNavigation();

  function handleNavigateToPoints() {
    if (selectedUf === '0') {
      Alert.alert('Calma aí!', 'Selecione uma UF para continuar...');
      return;
    }

    if (selectedUf !== '0' && selectedCity === '0') {
      Alert.alert('Calma aí!', 'Selecione uma cidade para continuar...');
      return;
    }
    
    navigation.navigate('Points', {
      city: selectedCity,
      uf: selectedUf
    });
  }
  
  useEffect(() => {
    Axios.get<IBGEUFResponse[]>('http://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then(res => {
      const ufInitials = res.data.map(uf => uf.sigla);

      setUfs(ufInitials);
    });
  }, []);  

  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }
    
    Axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(res => {
        const cityNames = res.data.map(city => city.nome);

        setCities(cityNames);
    })
  }, [selectedUf]);
  
  const pickerUfItems: PickerItem[] = [];
  const pickerCityItems: PickerItem[] = [];
  ufs.map(uf => pickerUfItems.push({label: uf, value: uf}));
  cities.map(city => pickerCityItems.push({label: city, value: city}))
  
  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}  
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrar pontos de coleta de forma eficiente</Text>
      </View>

      <View style={styles.footer}>

        <RNPickerSelect
          onValueChange={(uf) => setSelectedUf(uf)}
          items={pickerUfItems}
          Icon={() => <Icon name="chevron-down" size={20} color="#6C6C80" />}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
          placeholder={{label: 'Selecione uma UF'}}
        />

        <RNPickerSelect
          onValueChange={(city) => setSelectedCity(city)}
          items={pickerCityItems}
          Icon={() => <Icon name="chevron-down" size={20} color="#6C6C80" />}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
          placeholder={{label: 'Selecione uma cidade'}}
        />
        
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Icon name='arrow-right' color='#fff' size={24} />
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
      
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {
    paddingVertical: 20,
  },

  select: {},

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    marginBottom: 10,
    alignItems: 'center',
    fontSize: 16,
    height: 60,
    paddingHorizontal: 10,
    borderRadius: 10,
    color: 'black',
    backgroundColor: '#fff',
    paddingRight: 30, 
    paddingLeft: 24 // to ensure the text is never behind the icon
  },
  inputAndroid: {
    marginBottom: 10,
    alignItems: 'center',
    fontSize: 16,
    height: 60,
    paddingHorizontal: 10,
    borderRadius: 10,
    color: 'black',
    backgroundColor: '#fff',
    paddingRight: 30,
    paddingLeft: 24 // to ensure the text is never behind the icon
  },
  iconContainer: {
    top: 20,
    right: 15
  },
  placeholder: {
    color: '#6C6C80',
  },
});

export default Home;