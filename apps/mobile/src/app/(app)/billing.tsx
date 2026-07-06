import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../theme'

const invoices = [
  { id: '1', amount: 'R$ 49,90', date: '01 Jul 2026', status: 'paid' as const },
  { id: '2', amount: 'R$ 49,90', date: '01 Jun 2026', status: 'paid' as const },
  { id: '3', amount: 'R$ 49,90', date: '01 Mai 2026', status: 'paid' as const },
]

export default function BillingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
        <Text style={styles.title}>Histórico de Pagamentos</Text>
      </View>
      <FlatList
        data={invoices} keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View><Text style={styles.amount}>{item.amount}</Text><Text style={styles.date}>{item.date}</Text></View>
            <View style={[styles.statusBadge, { backgroundColor: item.status === 'paid' ? '#dcfce7' : '#fef2f2' }]}>
              <Text style={[styles.statusText, { color: item.status === 'paid' ? colors.success : colors.error }]}>{item.status === 'paid' ? 'Pago' : 'Pendente'}</Text>
            </View>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, paddingTop: 60, backgroundColor: colors.primary },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  list: { padding: 16 },
  card: { flexDirection: 'row', backgroundColor: colors.surface, padding: 16, borderRadius: 12, marginBottom: 8, alignItems: 'center', justifyContent: 'space-between' },
  amount: { fontSize: 16, fontWeight: '600', color: colors.text },
  date: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  statusText: { fontSize: 13, fontWeight: '600' },
})
