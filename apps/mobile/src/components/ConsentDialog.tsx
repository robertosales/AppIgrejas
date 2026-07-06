import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../theme'

interface Props {
  visible: boolean
  onAccept: () => void
  onDecline: () => void
}

export function ConsentDialog({ visible, onAccept, onDecline }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Ionicons name="shield-checkmark" size={48} color={colors.primary} />
          <Text style={styles.title}>Triagem por IA</Text>
          <Text style={styles.body}>
            Este atendimento começa com uma triagem automatizada por inteligência artificial para entender sua
            necessidade e direcionar ao cuidado adequado.{'\n\n'}
            A IA não substitui o atendimento humano. Casos urgentes são escalados imediatamente para a equipe pastoral.
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.accept} onPress={onAccept}>
              <Text style={styles.acceptText}>Aceitar e Continuar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.decline} onPress={onDecline}>
              <Text style={styles.declineText}>Falar com um pastor agora</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { backgroundColor: colors.surface, borderRadius: 20, padding: 28, alignItems: 'center', width: '100%', maxWidth: 360 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginTop: 16, marginBottom: 12 },
  body: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  actions: { width: '100%', gap: 10 },
  accept: { backgroundColor: colors.primary, padding: 14, borderRadius: 12, alignItems: 'center' },
  acceptText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  decline: { borderWidth: 1, borderColor: colors.border, padding: 14, borderRadius: 12, alignItems: 'center' },
  declineText: { color: colors.text, fontSize: 15 },
})
