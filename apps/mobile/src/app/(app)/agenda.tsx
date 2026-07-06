import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { format } from 'date-fns'
import { colors } from '../../theme'
import { TabBar } from '../../components/TabBar'

const mockEvents = [
  { id: '1', title: 'Culto de Domingo', date: new Date(), location: 'Templo Principal' },
  { id: '2', title: 'Grupo de Jovens', date: new Date(Date.now() + 86400000), location: 'Salão 2' },
]

export default function AgendaScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Agenda</Text>
      </View>
      <FlatList
        data={mockEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: '/(app)/event-detail', params: { id: item.id } })}>
            <View style={styles.dateBadge}>
              <Text style={styles.dateDay}>{format(item.date, 'dd')}</Text>
              <Text style={styles.dateMonth}>{format(item.date, 'MMM')}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardLocation}>{item.location}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum evento encontrado</Text>}
      />
      <TabBar />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 24, paddingTop: 60, backgroundColor: colors.primary },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  list: { padding: 16 },
  card: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 12, alignItems: 'center' },
  dateBadge: { alignItems: 'center', marginRight: 16, width: 50 },
  dateDay: { fontSize: 22, fontWeight: 'bold', color: colors.primary },
  dateMonth: { fontSize: 12, color: colors.textSecondary, textTransform: 'uppercase' },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  cardLocation: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  empty: { color: colors.textSecondary, textAlign: 'center', paddingVertical: 40 },
})
