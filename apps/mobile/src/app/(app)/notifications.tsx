import { View, Text, StyleSheet, FlatList } from 'react-native'
import { colors } from '../../theme'

const mockNotifications = [
  { id: '1', title: 'Lembrete de Evento', body: 'Culto hoje às 19h', read: false },
  { id: '2', title: 'Pedido de Oração', body: 'Maria pediu oração', read: true },
]

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Notificações</Text></View>
      <FlatList
        data={mockNotifications} keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, !item.read && styles.unread]}>
            <View style={styles.dot}>{!item.read && <View style={styles.unreadDot} />}</View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardBody}>{item.body}</Text>
            </View>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 24, paddingTop: 60, backgroundColor: colors.primary },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  list: { padding: 16 },
  card: { flexDirection: 'row', backgroundColor: colors.surface, padding: 16, borderRadius: 12, marginBottom: 8 },
  unread: { borderLeftWidth: 3, borderLeftColor: colors.primary },
  dot: { width: 16, justifyContent: 'center' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  cardBody: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
})
