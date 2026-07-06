import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../theme'
import { TabBar } from '../../components/TabBar'

const quickActions = [
  { icon: 'calendar', label: 'Agenda', route: 'agenda' },
  { icon: 'heart', label: 'Pedir Oração', route: 'prayer' },
  { icon: 'chatbubbles', label: 'Atendimento', route: 'care' },
  { icon: 'people', label: 'Grupos', route: 'groups' },
]

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá!</Text>
          <Text style={styles.churchName}>Igreja Batista</Text>
        </View>

        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity key={action.label} style={styles.actionCard} onPress={() => router.push(`/(app)/${action.route}` as any)}>
              <Ionicons name={action.icon as any} size={28} color={colors.primary} />
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximos Eventos</Text>
          <Text style={styles.empty}>Nenhum evento agendado</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conteúdos Recentes</Text>
          <Text style={styles.empty}>Nenhum conteúdo publicado</Text>
        </View>
      </ScrollView>
      <TabBar />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  header: { padding: 24, paddingTop: 60, backgroundColor: colors.primary },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  churchName: { fontSize: 16, color: '#e0e7ff', marginTop: 4 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 12 },
  actionCard: { width: '47%', backgroundColor: colors.surface, padding: 20, borderRadius: 16, alignItems: 'center', gap: 8 },
  actionLabel: { fontSize: 14, fontWeight: '500', color: colors.text },
  section: { paddingHorizontal: 16, marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 8 },
  empty: { color: colors.textSecondary, fontStyle: 'italic', paddingVertical: 20, textAlign: 'center' },
})
