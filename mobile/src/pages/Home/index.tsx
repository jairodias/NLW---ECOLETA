import React, {useState, useEffect, ChangeEvent, FormEvent} from 'react';
import { Feather as Icon} from '@expo/vector-icons';
import { View, Text, ImageBackground,Image, StyleSheet, Picker, KeyboardAvoidingView, Platform, TextInput} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUF{
  sigla: string;
}

interface IBGECity{
  nome: string;
}

const Home = () => {

  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [uf, setUf] = useState('');
  const [city, setCity] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    axios.get<IBGEUF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);
      setUfs(ufInitials);
    })
  }, []);

  
  useEffect(() => {
    if(uf === ''){
      return;
    }

    axios
    .get<IBGECity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
    .then(response => {
      const cityNames = response.data.map(city => city.nome);
      console.log(cityNames);
      setCities(cityNames);
    })

  }, [uf])

  function handleUf(params: string){
    if(params !== null){
      setUf(params);
    }
      
  }
  
  function handleNavigateToPoints(){
    navigation.navigate('Points', {
      uf,
      city
    });
  }
  return(
    <KeyboardAvoidingView style={{ flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

      <ImageBackground source={require('../../assets/home-background.png')}
          style={styles.container}
          imageStyle={{width: 300, height: 370}}
          >
          
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View> 
            <Text style={styles.title}>
              Seu marketplace de coleta de resíduos.
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
            </Text>

          </View>
          
        </View>
        <View style={styles.footer}>
          <View style={styles.input}>
            <RNPickerSelect
              onValueChange={
                (value) => handleUf(value)
              }
              placeholder={{
                label: 'Selecione o Estado',
                value: null,
              }}
              items={
                ufs.map(uf => (
                  {
                    label: uf,
                    value: uf
                  }))}
            />
          </View>

          <View style={styles.input}>
            <RNPickerSelect
              onValueChange={handleUf}
              placeholder={{
                label: 'Selecione a Cidade',
                value: null,
              }}
              items={
                cities.map(city => (
                  {
                    label: city,
                    value: city
                  }))}
            />
          </View>

            <RectButton style={styles.button} onPress={handleNavigateToPoints}>
              <View style={styles.buttonIcon}>
                <Text>
                  <Icon name="arrow-right" color="#FFF" size={24} />
                </Text>
              </View>
              <Text style={styles.buttonText}>
                Entrar
              </Text>
            </RectButton>
        </View>
      </ImageBackground>

    </KeyboardAvoidingView>
    
    
  ) 
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
    backgroundColor: '#f5f4f2'
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

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

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
    alignItems: 'center',
    borderTopLeftRadius: 10
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

export default Home;