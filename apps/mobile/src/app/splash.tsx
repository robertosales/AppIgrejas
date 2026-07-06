import { useEffect } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { colors } from '../theme'

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/(auth)/welcome'), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Igrejas</Text>
      <Text style={styles.subtitle}>Conectando sua comunidade</Text>
      <ActivityIndicator color="#fff" style={styles.loader} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary },
  title: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 16, color: '#e0e7ff', marginTop: 8 },
  loader: { marginTop: 40 },
})
