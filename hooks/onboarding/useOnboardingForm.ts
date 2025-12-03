import * as Location from "expo-location"
import { useState } from "react"
import { Alert } from "react-native"

export const useOnboardingForm = () => {
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [bio, setBio] = useState("")
    const [location, setLocation] = useState("")

    const handleGetLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            Alert.alert('Permission to access location denied.')
            return
        }

        try {
            let location = await Location.getCurrentPositionAsync({})
            const point = {
                type: 'point',
                cordinates: [location.coords.longitude, location.coords.latitude]
            }

            const locationtString = `POINT(${location.coords.longitude} ${location.coords.latitude})`
            setLocation(locationtString)
            Alert.alert('Location Captured!', 'Your location has been successfully set.');
        } catch (e) {
            console.log('Failed to get location', e)
            Alert.alert('Error could not fetch location')
        }
    }

    return {
        name,
        setName,
        phone,
        setPhone,
        bio,
        setBio,
        location,
        setLocation,
        handleGetLocation
    }
}
