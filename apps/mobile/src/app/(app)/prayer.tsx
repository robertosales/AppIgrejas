import { useState } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../theme'
import { TabBar } from '../../components/TabBar'

interface PrayerItem { id: string; title: string; anonymous: boolean; date: string }

export default function PrayerScreen() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [prayers] = useState<PrayerItem[]>([])

  function handleSubmit() {
    if (!title.trim()) return
    setTitle(''); setContent('')
  }

  return (
    <FlatList
      style={styles.container}
      data={prayers}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View>
          <View style={styles.header}><Text style={styles.title}>Pedidos de Oração</Text></View>
          <View style={styles.form}>
            <TextInput style={styles.input} placeholder="Título" value={title} onChangeText={setTitle} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Compartilhe seu pedido..." value={content} onChangeText={setContent} multiline numberOfLines={4} />
            <TouchableOpacity style={styles.anonymousRow} onPress={() => setAnonymous(!anonymous)}>
              <Ionicons name={anonymous ? 'checkbox' : 'square-outline'} size={22} color={colors.primary} />
              <Text style={styles.anonymousText}>Pedido anônimo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}><Text style={styles.buttonText}>Enviar Pedido</Text></TouchableOpacity>
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.card}><Text style={styles.cardTitle}>{item.anonymous ? 'Anônimo' : item.title}</Text></View>
      )}
      ListFooterComponent={<TabBar />}
    />
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 24, paddingTop: 60, backgroundColor: colors.primary },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  form: { padding: 16, backgroundColor: colors.surface, margin: 16, borderRadius: 16 },
  input: { borderWidth: 1, borderColor: colors.border, padding: 14, borderRadius: 10, marginBottom: 12, fontSize: 16 },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  anonymousRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  anonymousText: { color: colors.text, fontSize: 14 },
  button: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  card: { backgroundColor: colors.surface, padding: 16, marginHorizontal: 16, marginBottom: 8, borderRadius: 12 },
  cardTitle: { fontSize: 16, color: colors.text },
})
