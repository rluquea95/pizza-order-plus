import { useState, useRef, useCallback } from 'react';

// Hook personalizado para manejar avisos temporales.
// Muestra un mensaje y lo oculta automáticamente tras un tiempo determinado.
export const useAutoAlert = (tiempoMs = 4000) => {
  const [aviso, setAviso] = useState(null);
  const timerRef = useRef(null);

  // Fuerza la ocultación inmediata del aviso y cancela cualquier cuenta atrás pendiente.
  // Ideal para limpiar el estado al hacer focus o escribir en un formulario.
  const ocultarAviso = useCallback(() => {
    setAviso(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  // Muestra un nuevo aviso y arranca (o reinicia) la cuenta atrás para su desaparición.
  const mostrarAviso = useCallback((nuevoAviso) => {
    setAviso(nuevoAviso);

    // Si ya había un temporizador, lo cancela para que no se solapen los mensajes
    if (timerRef.current) clearTimeout(timerRef.current);

    // Inicia la nueva cuenta atrás
    timerRef.current = setTimeout(() => {
      setAviso(null);
    }, tiempoMs);
  }, [tiempoMs]);

  return { aviso, mostrarAviso, ocultarAviso };
};