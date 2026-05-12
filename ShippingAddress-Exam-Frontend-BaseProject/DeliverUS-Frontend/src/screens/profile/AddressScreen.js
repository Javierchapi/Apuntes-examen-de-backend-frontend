import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, View, FlatList, Pressable } from 'react-native'
import { brandPrimary, brandPrimaryTap, brandSecondary } from '../../styles/GlobalStyles'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import { getAddresses, setDefault, deleteAddress } from '../../api/AddressEndpoints'
import { showMessage } from 'react-native-flash-message'
import { Ionicons } from '@expo/vector-icons'
import DeleteModal from '../../components/DeleteModal'
import * as GlobalStyles from '../../styles/GlobalStyles'
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

  async function fetchAddresses () {
    try {
      const fetchedAddresses = await getAddresses()
      setAddresses(fetchedAddresses)
    } catch (error) {
      showMessage({
        message: `There was an error while fetching addresses. ${error} `,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }
  const removeAddress = async (address) => {
    try {
      await deleteAddress(address.id)
      await fetchAddresses()
      setAddressToBeDeleted(null)
      showMessage({
        message: `Address ${address.alias} succesfully removed`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    } catch (error) {
      console.log(error)
      setAddressToBeDeleted(null)
      showMessage({
        message: `Address ${address.alias} could not be removed.`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
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
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    } catch (error) {
      showMessage({
        message: `Error al establecer ${item.alias} predeterminada: ${error}`,
        type: 'danger',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const renderAddress = ({ item }) => {
    return (
      <View style={styles.addressContainer}>
        <TextSemiBold>{item.alias}</TextSemiBold>
        <TextRegular>{item.street},{item.city},{item.province},{item.zipCode}</TextRegular>
        <View style={styles.actions}>
           <Pressable
          onPress={() => setAddressAsDefault(item)}
          style={({ pressed }) => [{
            padding: 5,
            borderRadius: 4,
            backgroundColor: pressed ? brandPrimaryTap : 'transparent'
          }]}
        >
          <Ionicons name={item.isDefault ? 'star' : 'star-outline'} size={24} color={brandPrimary} />
        </Pressable>
        <Pressable
          onPress={() => setAddressToBeDeleted(item)}

          style={({ pressed }) => [{
            padding: 5,
            borderRadius: 4,
            backgroundColor: pressed ? 'rgba(255,0,0,0.2)' : 'transparent'
          }]}
        >
          <Ionicons name="trash" size={24} color="red" />
        </Pressable>
        </View>
      </View>
    )
  }
  const renderEmptyList = () => (
    <TextRegular textStyle={styles.emptyList}>No tienes direcciones guardadas.</TextRegular>
  )

  // TODO
  return (
     <View style={styles.container}>
      <TextSemiBold textStyle={styles.title}>Mis direcciones</TextSemiBold>

      <FlatList
        data={addresses}
        renderItem={renderAddress}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={addresses.length === 0 && styles.emptyContainer}
        ListEmptyComponent={renderEmptyList}
      />
      <Pressable
        onPress={() => navigation.navigate('AddressDetailScreen')}
        style={({ pressed }) => [
          { backgroundColor: pressed ? brandPrimaryTap : brandPrimary },
          styles.button
        ]}
      >
        <TextRegular textStyle={styles.textButtom}>Añadir nueva dirección</TextRegular>
      </Pressable>
      <DeleteModal
       isVisible={addressToBeDeleted !== null}
       onCancel={() => setAddressToBeDeleted(null)}
       onConfirm={() => {
         removeAddress(addressToBeDeleted)
       }}
     >
       <TextRegular>¿Seguro que quieres eliminar esta dirección?</TextRegular>
     </DeleteModal>
    </View>
  )
}

const styles = StyleSheet.create({
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
