"use client";

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import { useEffect, useRef, useState } from "react";

type Mensaje = {
  id_mensaje: string;
  chat_id: string;
  texto: string;
  empleado_id: string | null;
  hora: string;
  nombre_empleado?: string;
  avatar_url?: string;
};

type Chat = {
  chat_id: string;
  nombre_chat: string;
  alumno_id: string;
  supervisor_id: string;
  estado: string;
  fecha_creacion: string;
  ultimo_mensaje: string;
  ultimo_mensaje_hora: string;
  mensaje_visto: boolean;
  empleado_avatar_url?: string;
  alumno_avatar_url?: string;
  topico: string;
};

type Props = {
  chat: Chat;
  mensajes: Mensaje[];
  onEnviar: (texto: string, chatId: string) => Promise<Mensaje>;
};

export default function Chat({ chat, mensajes, onEnviar }: Props) {
  const [mensajeInput, setMensajeInput] = useState("");
  const [mensajesActuales, setMensajesActuales] = useState<Mensaje[]>(mensajes);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajesActuales]);

  const enviarMensaje = async () => {
    if (!mensajeInput.trim()) return;

    try {
      const nuevo = await onEnviar(mensajeInput, chat.chat_id);
      setMensajesActuales((prev) => [...prev, nuevo]);
      setMensajeInput("");
    } catch (e) {
      console.error("Error enviando mensaje:", e);
    }

    // **Parte de Firebase comentada**
    /*
    try {
      const chatRef = firebase.firestore().collection("chats").doc(chat.chat_id);
      await chatRef.collection("mensajes").add({
        texto: mensajeInput,
        empleado_id: null, 
        hora: new Date().toLocaleTimeString(),
        alumno_id: chat.alumno_id,
      });
    } catch (error) {
      console.error("Error al enviar mensaje a Firebase:", error);
    }
    */
  };

  return (
    <div className="h-[600px] w-full">
      <MainContainer>
        <ChatContainer>
          <div className="chat-header">
            <h2>{chat.nombre_chat}</h2>
            <p>{chat.topico}</p>
          </div>

          <MessageList>
            {mensajesActuales.map((m) => (
              <Message
                key={m.id_mensaje}
                model={{
                  message: m.texto,
                  sentTime: m.hora,
                  sender: m.empleado_id
                    ? m.nombre_empleado || "Empleado"
                    : "Estudiante",
                  direction: m.empleado_id ? "incoming" : "outgoing",
                  position: "single",
                }}
              >
                {m.empleado_id && m.avatar_url && (
                  <Avatar
                    src={m.avatar_url}
                    name={m.nombre_empleado || "Empleado"}
                  />
                )}
              </Message>
            ))}
            <div ref={bottomRef}></div>
          </MessageList>

          {/* Input de mensaje */}
          <MessageInput
            value={mensajeInput}
            onChange={setMensajeInput}
            onSend={enviarMensaje}
            placeholder="Escribí tu mensaje..."
            attachButton={false}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
