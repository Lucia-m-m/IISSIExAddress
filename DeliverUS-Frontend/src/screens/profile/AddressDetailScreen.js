import React, { useState } from 'react'
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, Pressable, Switch } from 'react-native' // NOTESE EL USO DE SWITCH
import { Formik } from 'formik'
import * as yup from 'yup'
import InputItem from '../../components/InputItem'
import TextSemibold from '../../components/TextSemibold'
import { addAddress } from '../../api/AddressEndpoints'
import { showMessage } from 'react-native-flash-message'
import { brandPrimary, brandPrimaryTap, brandSuccessDisabled, flashStyle, flashTextStyle } from '../../styles/GlobalStyles'
import TextError from '../../components/TextError'
export default function AddressDetailScreen ({ navigation, route }) {
// TODO
  const [backendErrors, setBackendErrors] = useState()
  const initialValues = useState({ alias: null, street: null, city: null, zipCode: null, province: null })
  const validationSchema = yup.object().shape({
    alias: yup
      .string()
      .max(255, 'First name too long')
      .required('First name is required'),
    street: yup
      .string()
      .max(255, 'Last name too long')
      .required('Last name is required'),
    city: yup
      .string()
      .max(255, 'Phone too long')
      .required('Phone is required'),
    zipCode: yup
      .string()
      .max(255, 'Address too long')
      .matches(/^[0-9]{5}$/, 'Código postal debe tener 5 dígitos')
      .required('Address is required'),
    province: yup
      .string()
      .max(255, 'Postal code too long')
      .required('Postal code is required')

  })

  const createAddress = async (values) => {
    setBackendErrors([])
    try {
      const address = await addAddress(values)
      showMessage({
        message: `Dirección ${address.alias} guardada`,
        type: 'success',
        style: flashStyle,
        titleStyle: flashTextStyle
      })
      navigation.navigate('AddressScreen', { dirty: true })
    } catch (error) {
      console.log(error)
      setBackendErrors(error.errors)
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={createAddress}
    >
      {({ handleSubmit, isValid, values, setFieldValue }) => (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          ><View style={styles.container}>
              <TextSemibold textStyle={styles.title}>
                Nueva dirección
              </TextSemibold>

              <InputItem label="Alias" name="alias" placeholder="Casa, Trabajo..." />
              <InputItem label="Calle" name="street" placeholder="Ej: Mejos 1" />
              <InputItem label="Ciudad" name="city" placeholder="Ej: Dos Hermanas" />
              <InputItem label="Provincia" name="province" placeholder="Ej: Sevilla" />
              <InputItem label="Código postal" name="zipCode" placeholder="41700" keyboardType="numeric" />

              <View style={styles.toggleContainer}>
                <TextSemibold textStyle={styles.toggleLabel}>
                  Dirección predeterminada
                </TextSemibold>
                <Switch
                  value={values.isDefault}
                  onValueChange={val => setFieldValue('isDefault', val)}
                  thumbColor={values.isDefault ? brandPrimary : brandSuccessDisabled}
                  trackColor={{ true: brandPrimaryTap, false: '#ccc' }}
                />
              </View>

              {backendErrors &&
                backendErrors.map((error, index) => <TextError key={index}>{error.param}-{error.msg}</TextError>)}

              <Pressable
                onPress={handleSubmit}
                disabled={!isValid}
                style={({ pressed }) => [
                  { backgroundColor: pressed ? brandPrimaryTap : brandPrimary },
                  styles.button,
                  !isValid && { backgroundColor: brandSuccessDisabled }
                ]}
              >
                <TextSemibold textStyle={styles.buttonText}>Guardar dirección</TextSemibold>
              </Pressable>
            </View>
            TODO
          </KeyboardAvoidingView>
        </ScrollView>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1
  },
  keyboardView: {
    flex: 1
  },
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 20,
    marginBottom: 15
  },
  button: {
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    fontSize: 16,
    color: 'white'
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20
  },
  toggleLabel: {
    fontSize: 16
  }
})
