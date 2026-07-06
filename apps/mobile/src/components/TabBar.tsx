import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { usePathname, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../theme'

const tabs = [
  { name: 'index' as const, label: 'Início', icon: 'home' },
  { name: 'agenda' as const, label: 'Agenda', icon: 'calendar' },
  { name: 'prayer' as const, label: 'Oração', icon: 'heart' },
  { name: 'content' as const, label: 'Conteúdo', icon: 'book' },
  { name: 'profile' as const, label: 'Perfil', icon: 'person' },
]

export function TabBar() {
  const pathname = usePathname()

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = pathname === `/${tab.name}` || (tab.name === 'index' && pathname === '/')
        return (
          <TouchableOpacity key={tab.name} style={styles.tab} onPress={() => router.push(`/(app)/${tab.name}` as any)}>
            <Ionicons name={(isActive ? tab.icon : `${tab.icon}-outline`) as any} size={22} color={isActive ? colors.primary : colors.textSecondary} />
            <Text style={[styles.label, isActive && styles.activeLabel]}>{tab.label}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface, paddingBottom: 20, paddingTop: 8 },
  tab: { flex: 1, alignItems: 'center', gap: 2 },
  label: { fontSize: 11, color: colors.textSecondary },
  activeLabel: { color: colors.primary, fontWeight: '600' },
})
