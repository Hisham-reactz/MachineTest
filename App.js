/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {FlatGrid} from 'react-native-super-grid';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Header, ListItem, Avatar, Card, Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from 'react-native/Libraries/NewAppScreen';
const renderItem = ({item}) => (
  <ListItem bottomDivider>
    <Avatar title={item.author} source={item.url && {uri: item.url}} />
    <ListItem.Content>
      <ListItem.Title>{item.author}</ListItem.Title>
      <ListItem.Subtitle>{item.height}</ListItem.Subtitle>
    </ListItem.Content>
    <ListItem.Chevron />
  </ListItem>
);
const App = () => {
  //hook states
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [page, setPage] = useState(1);

  //component did mount
  useEffect(() => {
    getApi();
  }, []);

  //api call
  const getApi = () => {
    fetch('https://picsum.photos/v2/list?page=' + page + '&limit=20')
      .then(response => response.json())
      .then(json => {
        console.log(json);
        storeData(json);
        getData();
        setPage(page + 1);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };

  //store data on local storage
  const storeData = async value => {
    try {
      const jsonValue = JSON.stringify([...data, ...value]);
      await AsyncStorage.setItem('@storage_Key', jsonValue);
    } catch (e) {
      // saving error
    }
  };

  //get data from local storage
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key');
      const jsonResult = jsonValue != null ? JSON.parse(jsonValue) : null;
      setData(jsonResult);
      return jsonResult;
    } catch (e) {
      // error reading value
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={'dark-content'} />
      <Header
        leftComponent={{icon: 'menu', color: '#fff'}}
        centerComponent={{text: 'Machine Test', style: {color: '#fff'}}}
        rightComponent={
          <View>
            {!isLoading ? (
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => {
                  setIsEnabled(!isEnabled);
                }}
                value={isEnabled}
              />
            ) : (
              <View />
            )}
          </View>
        }
      />
      <View contentInsetAdjustmentBehavior="automatic">
        <View
          style={{
            backgroundColor: Colors.white,
          }}>
          <View style={styles.sectionContainer}>
            {isLoading ? (
              <ActivityIndicator />
            ) : !isEnabled ? (
              <SwipeListView
                disableLeftSwipe={true}
                onEndReached={getApi}
                onEndReachedThreshold={0.3}
                data={data}
                renderItem={renderItem}
                renderHiddenItem={(dta, rowMap) => (
                  <Button
                    buttonStyle={styles.btn}
                    icon={{
                      name: 'delete',
                      size: 15,
                      color: 'red',
                    }}
                  />
                )}
                leftOpenValue={75}
                rightOpenValue={-75}
              />
            ) : (
              <FlatGrid
                onEndReached={getApi}
                onEndReachedThreshold={0.3}
                itemDimension={130}
                data={data}
                renderItem={({item}) => (
                  <Card>
                    <Card.Title>{item.author}</Card.Title>
                    <Card.Divider />
                    <Card.Image source={{uri: item.download_url}} />
                  </Card>
                )}
              />
            )}
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    height: 888,
    paddingHorizontal: 24,
  },
  btn: {
    width: 75,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
