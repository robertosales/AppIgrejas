import { useState } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { router } from 'expo-router'
import { colors } from '../../theme'
import { supabase } from '../../services/supabase'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { Alert.alert('Erro', error.message); return }
    router.replace('/(app)')
  }

  async function handleSignUp() {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) { Alert.alert('Erro', error.message); return }
    Alert.alert('Conta criada', 'Verifique seu email para confirmar.')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{loading ? 'Entrando...' : 'Entrar'}</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonOutline} onPress={handleSignUp} disabled={loading}>
        <Text style={styles.buttonOutlineText}>Criar conta</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.surface },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 24 },
  input: { borderWidth: 1, borderColor: colors.border, padding: 14, borderRadius: 10, marginBottom: 12, fontSize: 16 },
  button: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  buttonOutline: { borderWidth: 1, borderColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonOutlineText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
})
