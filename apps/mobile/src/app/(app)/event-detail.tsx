import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../theme'
import { format } from 'date-fns'

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams()

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Culto de Domingo</Text>
        <View style={styles.infoRow}><Ionicons name="calendar" size={18} color={colors.primary} /><Text style={styles.infoText}>{format(new Date(), "EEEE, dd 'de' MMMM")}</Text></View>
        <View style={styles.infoRow}><Ionicons name="time" size={18} color={colors.primary} /><Text style={styles.infoText}>19:00</Text></View>
        <View style={styles.infoRow}><Ionicons name="location" size={18} color={colors.primary} /><Text style={styles.infoText}>Templo Principal</Text></View>
        <Text style={styles.description}>Venha adorar conosco! Culto com louvores, palavra e comunhão.</Text>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Confirmar Presença</Text></TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 16, paddingTop: 60, backgroundColor: colors.primary },
  content: { padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  infoText: { fontSize: 16, color: colors.text },
  description: { fontSize: 15, color: colors.textSecondary, lineHeight: 24, marginTop: 20, marginBottom: 30 },
  button: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
