import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../theme'
import { TabBar } from '../../components/TabBar'

const mockContent = [
  { id: '1', title: 'A Paz que Excede o Entendimento', type: 'sermon', date: '15 Jun' },
  { id: '2', title: 'Devocional Diário', type: 'devotional', date: 'Hoje' },
]

export default function ContentScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Conteúdos</Text></View>
      <FlatList
        data={mockContent} keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.iconWrap}><Ionicons name={item.type === 'sermon' ? 'mic' : 'book'} size={24} color={colors.primary} /></View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMeta}>{item.type} • {item.date}</Text>
            </View>
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
  iconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  cardMeta: { fontSize: 13, color: colors.textSecondary, marginTop: 4, textTransform: 'capitalize' },
})
