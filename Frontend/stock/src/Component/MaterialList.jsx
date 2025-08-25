function MaterialList({ materials }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Lista de Materiales</h2>
      <ul className="space-y-2">
        {Array.isArray(materials) && materials.length > 0 ? (
          materials.map((m) => (
            <li key={m.id} className="border p-2 rounded">
              {m.name} - {m.quantity} unidades ({m.type})
            </li>
          ))
        ) : (
          <li className="text-gray-500">No hay materiales registrados</li>
        )}
      </ul>
    </div>
  );
}

export default MaterialList;
