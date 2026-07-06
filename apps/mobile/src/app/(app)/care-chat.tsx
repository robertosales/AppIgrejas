import { useState } from 'react'
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../theme'

interface Message { id: string; text: string; from: 'user' | 'pastor'; time: string }

export default function CareChatScreen() {
  const [messages] = useState<Message[]>([{ id: '1', text: 'Obrigado por compartilhar. Um da nossa equipe vai acompanhar você em breve.', from: 'pastor', time: '10:30' }])
  const [input, setInput] = useState('')

  function handleSend() {
    if (!input.trim()) return
    setInput('')
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
        <View style={styles.headerInfo}><Text style={styles.headerTitle}>Atendimento Pastoral</Text><Text style={styles.headerStatus}>Online</Text></View>
      </View>
      <FlatList
        style={styles.chat} data={messages} keyExtractor={(m) => m.id}
        contentContainerStyle={styles.chatContent}
        renderItem={({ item }) => (
          <View style={[styles.message, item.from === 'user' ? styles.userMsg : styles.pastorMsg]}>
            <Text style={[styles.messageText, item.from === 'user' && styles.userMsgText]}>{item.text}</Text>
            <Text style={[styles.messageTime, item.from === 'user' && styles.userMsgTime]}>{item.time}</Text>
          </View>
        )}
      />
      <View style={styles.inputBar}>
        <TextInput style={styles.chatInput} placeholder="Digite sua mensagem..." value={input} onChangeText={setInput} />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}><Ionicons name="send" size={20} color="#fff" /></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, paddingTop: 60, backgroundColor: colors.primary },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  headerStatus: { fontSize: 12, color: '#bbf7d0' },
  chat: { flex: 1 },
  chatContent: { padding: 16, gap: 12 },
  message: { maxWidth: '80%', padding: 14, borderRadius: 16, marginBottom: 4 },
  userMsg: { backgroundColor: colors.primary, alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  pastorMsg: { backgroundColor: colors.surface, alignSelf: 'flex-start', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.border },
  messageText: { fontSize: 15, color: colors.text, lineHeight: 22 },
  userMsgText: { color: '#fff' },
  messageTime: { fontSize: 11, color: colors.textSecondary, marginTop: 4, alignSelf: 'flex-end' },
  userMsgTime: { color: '#c7d2fe' },
  inputBar: { flexDirection: 'row', padding: 12, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'center', gap: 8 },
  chatInput: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 24, paddingHorizontal: 18, paddingVertical: 12, fontSize: 15 },
  sendButton: { backgroundColor: colors.primary, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
})
