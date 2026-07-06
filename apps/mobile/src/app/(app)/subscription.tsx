import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../theme'

const plans = [
  { tier: 'starter', name: 'Starter', price: 'Grátis', members: 50, features: ['App Mobile', 'Agenda', 'Pedidos de Oração'] },
  { tier: 'growth', name: 'Growth', price: 'R$ 49,90', members: 100, features: ['Tudo do Starter', 'Grupos', 'Notificações', 'Atendimento Básico'] },
  { tier: 'pro', name: 'Pro', price: 'R$ 99,90', members: 200, features: ['Tudo do Growth', 'Conteúdo Completo', 'Triagem IA', 'Relatórios', 'Multicampus'] },
]

export default function SubscriptionScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
        <Text style={styles.title}>Planos</Text>
      </View>
      <FlatList
        data={plans} keyExtractor={(p) => p.tier}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.planName}>{item.name}</Text>
            <Text style={styles.price}>{item.price}<Text style={styles.priceMonth}>/mês</Text></Text>
            <Text style={styles.members}>Até {item.members} pessoas</Text>
            <View style={styles.features}>
              {item.features.map((f) => (
                <View key={f} style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>{item.tier === 'starter' ? 'Contratar' : 'Assinar'}</Text></TouchableOpacity>
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
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, marginBottom: 16 },
  planName: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  price: { fontSize: 28, fontWeight: 'bold', color: colors.primary, marginTop: 8 },
  priceMonth: { fontSize: 14, color: colors.textSecondary, fontWeight: 'normal' },
  members: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  features: { marginTop: 16, gap: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { fontSize: 14, color: colors.text },
  button: { backgroundColor: colors.primary, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
