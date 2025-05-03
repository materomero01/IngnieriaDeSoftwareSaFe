"use client";

import { Message, Avatar } from "@chatscope/chat-ui-kit-react";

export type MensajeType = {
  id_mensaje: string;
  chat_id: string;
  texto: string;
  empleado_id: string | null;
  hora: string;
  nombre_empleado?: string;
  avatar_url?: string;
};

type MensajeProps = {
  mensaje: MensajeType;
};

export default function Mensaje({ mensaje }: MensajeProps) {
  return (
    <Message
      key={mensaje.id_mensaje}
      model={{
        message: mensaje.texto,
        sentTime: mensaje.hora,
        sender: mensaje.empleado_id
          ? mensaje.nombre_empleado || "Empleado"
          : "Estudiante",
        direction: mensaje.empleado_id ? "incoming" : "outgoing",
        position: "single",
      }}
    >
      {mensaje.empleado_id && mensaje.avatar_url && (
        <Avatar
          src={mensaje.avatar_url}
          name={mensaje.nombre_empleado || "Empleado"}
        />
      )}
    </Message>
  );
}
