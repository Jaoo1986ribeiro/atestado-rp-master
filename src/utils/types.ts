export type SchemaField = {
  required?: boolean;
  // Adicione outras propriedades conforme necessário
};

export type Schema = {
  fields: Record<string, SchemaField>;
  // Adicione outras propriedades conforme necessário
};
