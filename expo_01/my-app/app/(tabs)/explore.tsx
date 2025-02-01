import { useEffect, useState, useRef } from 'react';
import { StyleSheet, Alert, Text, TextInput, View, TouchableOpacity, FlatList } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { ThemedView } from '@/components/ThemedView';

// Função para calcular distância entre dois pontos (Haversine Formula)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Raio da Terra em km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function TabTwoScreen() {
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(null);
  const [price, setPrice] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'O app precisa da sua localização para funcionar corretamente.');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    })();
  }, []);

  // Função para buscar sugestões de endereços
  const fetchSuggestions = async (query) => {
    if (query.length > 2) { // Busca apenas se o usuário digitar mais de 2 caracteres
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=SUA_CHAVE_DA_API_GOOGLE_MAPS`
        );
        const data = await response.json();
        if (data.predictions) {
          setSuggestions(data.predictions);
        }
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
      }
    } else {
      setSuggestions([]); // Limpa as sugestões se o texto for muito curto
    }
  };

  // Função para buscar detalhes de um endereço selecionado
  const fetchPlaceDetails = async (placeId) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=SUA_CHAVE_DA_API_GOOGLE_MAPS`
      );
      const data = await response.json();
      if (data.result) {
        const { lat, lng } = data.result.geometry.location;
        setDestination({ latitude: lat, longitude: lng });

        if (location) {
          const dist = getDistance(location.latitude, location.longitude, lat, lng);
          setDistance(dist.toFixed(2));
          setPrice((dist * 100).toFixed(2)); // Calcula o preço da viagem
        }

        mapRef.current?.fitToCoordinates([
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: lat, longitude: lng }
        ], {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível encontrar o endereço');
    }
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setDestination({ latitude, longitude });

    if (location) {
      const dist = getDistance(location.latitude, location.longitude, latitude, longitude);
      setDistance(dist.toFixed(2));
      setPrice((dist * 100).toFixed(2)); // Calcula o preço da viagem
    }
  };

  const handleFindMotorcyclists = () => {
    Alert.alert('Buscar Motociclistas', 'Funcionalidade de busca de motociclistas ainda não implementada.');
  };

  const handleClearDestination = () => {
    setDestination(null); // Remove o destino
    setDistance(null); // Limpa a distância
    setPrice(null); // Limpa o preço
    setSuggestions([]); // Limpa as sugestões
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar endereço..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            fetchSuggestions(text); // Busca sugestões conforme o usuário digita
          }}
        />
      </View>

      {/* Lista de sugestões */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => {
                  setSearchQuery(item.description); // Atualiza o campo de busca com o endereço selecionado
                  fetchPlaceDetails(item.place_id); // Busca detalhes do endereço selecionado
                  setSuggestions([]); // Fecha a lista de sugestões
                }}
              >
                <Text style={styles.suggestionText}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {location ? (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          showsUserLocation={true}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={handleMapPress}
        >
          {destination && (
            <Marker
              coordinate={destination}
              title="Destino"
              description={`Distância: ${distance} km`}
            />
          )}
        </MapView>
      ) : (
        <Text style={styles.loadingText}>Carregando localização...</Text>
      )}

      {/* Seção Inferior */}
      {destination && (
        <View style={styles.bottomContainer}>
          <Text style={styles.distanceText}>
            Distância: {distance} km
          </Text>
          <Text style={styles.priceText}>
            Preço da Viagem: R$ {price}
          </Text>
          <TouchableOpacity style={styles.findButton} onPress={handleFindMotorcyclists}>
            <Text style={styles.findButtonText}>Buscar Motociclistas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearDestination}>
            <Text style={styles.clearButtonText}>Remover Marcação</Text>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  suggestionsContainer: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    borderRadius: 5,
    elevation: 5,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 14,
  },
  map: {
    flex: 1,
    width: '100%',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  findButton: {
    backgroundColor: '#0066ff',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  findButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  clearButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
});