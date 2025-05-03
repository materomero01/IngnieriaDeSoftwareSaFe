"use client";

import { useEffect, useRef, useState } from "react";
import { MainContainer, ChatContainer, MessageList, MessageInput } from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import Mensaje from "./Mensaje"; 

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
        empleado_id: null, // Puede ser el ID del empleado si estás enviando un mensaje desde el supervisor
        hora: new Date().toLocaleTimeString(), // Hora actual del mensaje
        alumno_id: chat.alumno_id, // El ID del alumno que participa en este chat
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
              <Mensaje key={m.id_mensaje} mensaje={m} />
            ))}
            <div ref={bottomRef}></div>
          </MessageList>

          
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
