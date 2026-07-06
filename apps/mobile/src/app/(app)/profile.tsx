import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../theme'
import { TabBar } from '../../components/TabBar'
import { supabase } from '../../services/supabase'

const menuItems = [
  { icon: 'notifications', label: 'Notificações', route: 'notifications' },
  { icon: 'card', label: 'Assinatura', route: 'subscription' },
  { icon: 'document-text', label: 'Histórico', route: 'billing' },
  { icon: 'chatbubbles', label: 'Meus Atendimentos', route: 'care' },
  { icon: 'people', label: 'Grupos', route: 'groups' },
]

export default function ProfileScreen() {
  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/(auth)/welcome')
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}><Ionicons name="person" size={40} color="#fff" /></View>
        <Text style={styles.name}>Usuário</Text>
        <Text style={styles.email}>usuario@email.com</Text>
      </View>
      <View style={styles.menu}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.label} style={styles.menuItem} onPress={() => router.push(`/(app)/${item.route}` as any)}>
            <Ionicons name={item.icon as any} size={22} color={colors.primary} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
      <TabBar />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { alignItems: 'center', padding: 40, paddingTop: 80, backgroundColor: colors.primary },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 12 },
  email: { fontSize: 14, color: '#e0e7ff', marginTop: 4 },
  menu: { margin: 16, backgroundColor: colors.surface, borderRadius: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  menuLabel: { flex: 1, fontSize: 16, color: colors.text, marginLeft: 12 },
  logout: { marginHorizontal: 16, padding: 16, borderRadius: 12, alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.error },
  logoutText: { color: colors.error, fontSize: 16, fontWeight: '600' },
})
