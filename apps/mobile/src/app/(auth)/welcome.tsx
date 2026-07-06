import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { colors } from '../../theme'

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Bem-vindo</Text>
        <Text style={styles.subtitle}>
          Acompanhe sua igreja, participe de eventos,{'\n'}ore e receba cuidado pastoral.
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonOutline} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.buttonOutlineText}>Criar conta</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(app)')}>
          <Text style={styles.skip}>Explorar sem login</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', padding: 24, backgroundColor: colors.surface },
  hero: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: colors.text },
  subtitle: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginTop: 16, lineHeight: 24 },
  actions: { gap: 12, paddingBottom: 40 },
  button: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  buttonOutline: { borderWidth: 1, borderColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonOutlineText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  skip: { color: colors.textSecondary, textAlign: 'center', fontSize: 14, marginTop: 8 },
})
