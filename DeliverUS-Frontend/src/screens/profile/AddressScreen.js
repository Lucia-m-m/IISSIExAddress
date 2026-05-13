import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, View, FlatList, Pressable } from 'react-native'
import { brandPrimary, brandPrimaryTap, brandSecondary, flashStyle, flashTextStyle } from '../../styles/GlobalStyles'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import { getAddresses, setDefault, deleteAddress } from '../../api/AddressEndpoints'
import { showMessage } from 'react-native-flash-message'
import { Ionicons } from '@expo/vector-icons'
import DeleteModal from '../../components/DeleteModal'
import { AuthorizationContext } from '../../context/AuthorizationContext'
export default function AddressScreen ({ navigation, route }) {
  const [addresses, setAddresses] = useState([])
  const [addressToBeDeleted, setAddressToBeDeleted] = useState(null)
  const { loggedInUser } = useContext(AuthorizationContext)
  useEffect(() => {
    if (loggedInUser) {
      fetchAddresses()
    } else {
      setAddresses(null)
    }
  }, [loggedInUser, route])

  async function fetchAddresses () { // Addresses problem 1
    try {
      const fetchedAddresses = await getAddresses()
      setAddresses(fetchedAddresses)
    } catch (error) { // Addresses problem 3
      showMessage({
        message: `There was an error while retrieving Addresses. ${error} `,
        type: 'error',
        style: flashStyle,
        titleStyle: flashTextStyle
      })
    }
  }
  const setAddressAsDefault = async (item) => {
    try {
      await setDefault(item.id)
      await fetchAddresses()
      showMessage({
        message: `Dirección ${item.alias} establecida como predeterminada`,
        type: 'success',
        style: flashStyle,
        titleStyle: flashTextStyle
      })
    } catch (error) { // Addresses problem 3
      showMessage({
        message: `There was an error while retrieving ${item.alias} predeterminada:. ${error} `,
        type: 'error',
        style: flashStyle,
        titleStyle: flashTextStyle
      })
    }
  }
  const removeAddress = async (item) => {
    try {
      await deleteAddress(item.id)
      await fetchAddresses()
      setAddressToBeDeleted(null)
      showMessage({
        message: `Dirección ${item.alias} eliminada`,
        type: 'success',
        style: flashStyle,
        titleStyle: flashTextStyle
      })
    } catch (error) { // Addresses problem 3
      showMessage({
        message: `There was an error while eliminating: ${item.alias} . ${error} `,
        type: 'error',
        style: flashStyle,
        titleStyle: flashTextStyle
      })
    }
  }
  const renderEmptyAddressList = () => {
    return (
          <TextRegular textStyle={styles.emptyList}>
            This restaurant has no address yet.
          </TextRegular>
    )
  }

  const renderAddress = ({ item }) => {
    return (
      <View style={styles.addressContainer}>
      <TextSemiBold numberOfLines={2}>{item.alias}</TextSemiBold>
          <TextRegular>{item.street}, {item.city}, {item.province}, {item.zipCode}</TextRegular>
      <View style={styles.actions}>
      <Pressable
      onPress={() => setAddressAsDefault(item)}
        style={({ pressed }) => [{
          padding: 5,
          borderRadius: 4,
          backgroundColor: pressed ? brandPrimaryTap : 'transparent'
        }]}
       ><Ionicons name={item.isDefault ? 'star' : 'star-outline'} size={24} color={brandPrimary} /></Pressable>
    <Pressable
      onPress={() => setAddressToBeDeleted(item)}
        style={({ pressed }) => [{
          padding: 5,
          borderRadius: 4,
          backgroundColor: pressed ? brandPrimaryTap : 'transparent'
        }]}
       ><Ionicons name="trash" size={24} color={brandPrimary} /></Pressable>
    </View>
    </View>
    )
  }
  return (

    <View style = {styles.container}>
      <TextSemiBold textStyle = {styles.title}> Mis direcciones</TextSemiBold>

    <FlatList
              style={styles.container}
              data={addresses}
              renderItem={renderAddress}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={addresses.length === 0 && styles.emptyContainer}
              ListEmptyComponent= {renderEmptyAddressList}
            />
            <Pressable
            onPress={() => navigation.navigate('AddressDetailsScreen')}
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? brandPrimaryTap
                  : brandPrimary
              },
              styles.button
            ]}>
            {<TextRegular textStyle={styles.textButtom}>
              Añadir nueva direccion
            </TextRegular> }
          </Pressable>
          <DeleteModal
                  isVisible={addressToBeDeleted !== null}
                  onCancel={() => setAddressToBeDeleted(null)}
                  onConfirm={() => removeAddress(addressToBeDeleted)}>
                    <TextRegular>The order and their assigned products will be deleted as well</TextRegular>
                    <TextRegular>If the order is already accepted, it cannot be deleted.</TextRegular>
                </DeleteModal>
      </View>
  )
}

const styles = StyleSheet.create({
  // TODO
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 20,
    marginBottom: 10
  },
  addressContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  actions: {
    flexDirection: 'row',
    gap: 10
  },
  button: {
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 15
  },
  textButtom: {
    fontSize: 16,
    color: brandSecondary,
    textAlign: 'center'
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
