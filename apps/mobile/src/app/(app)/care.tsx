import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../theme'

export default function CareScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
        <Text style={styles.title}>Atendimento Pastoral</Text>
      </View>
      <View style={styles.info}>
        <Ionicons name="shield-checkmark" size={48} color={colors.primary} />
        <Text style={styles.infoTitle}>Acolhimento e Cuidado</Text>
        <Text style={styles.infoText}>
          Espaço seguro para compartilhar suas necessidades.{'\n'}
          A triagem inicial direciona você à pessoa certa.
        </Text>
      </View>
      <TouchableOpacity style={styles.startButton} onPress={() => router.push('/(app)/care-triage')}>
        <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
        <Text style={styles.startButtonText}>Iniciar Atendimento</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, paddingTop: 60, backgroundColor: colors.primary },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  info: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  infoTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginTop: 16, marginBottom: 12 },
  infoText: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  startButton: { flexDirection: 'row', backgroundColor: colors.primary, margin: 24, padding: 18, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 10 },
  startButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
})
