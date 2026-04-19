import { useEffect, useState } from 'react';
import { pedidosApi } from '../services/api';

export const AdminPedidosPage = () => {
  return (
    <div className="container mx-auto p-4 pt-28 min-h-screen">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">
        Panel de Cocina
      </h1>
      <p className="text-center text-gray-500">
        Aquí montaremos el Tablero Kanban de pedidos...
      </p>
    </div>
  );
};