import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../theme'
import { TabBar } from '../../components/TabBar'

const mockGroups = [
  { id: '1', name: 'Jovens Conectados', members: 24, nextMeeting: 'Sábado 19h' },
  { id: '2', name: 'Grupo de Casais', members: 16, nextMeeting: 'Quinta 20h' },
]

export default function GroupsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Grupos</Text></View>
      <FlatList
        data={mockGroups} keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.avatar}><Ionicons name="people" size={24} color={colors.primary} /></View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardMeta}>{item.members} membros • {item.nextMeeting}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
        ListFooterComponent={<TabBar />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 24, paddingTop: 60, backgroundColor: colors.primary },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  list: { padding: 16 },
  card: { flexDirection: 'row', backgroundColor: colors.surface, padding: 16, borderRadius: 12, marginBottom: 12, alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  cardMeta: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
})
