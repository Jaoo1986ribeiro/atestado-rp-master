import { Font, Template } from '@pdfme/common';
import { generate } from '@pdfme/generator';
import { barcodes, image, text } from '@pdfme/schemas';
import CourierPrime from '../assets/fonts/CourierPrime.ttf';
import templateSchemaJson from './templateSchemas.json';

// Defina um tipo para o schema individual
type SchemaItem = {
  name: string;
  type: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  rotate?: number;
  alignment?: string;
  verticalAlignment?: string;
  fontSize?: number;
  lineHeight?: number;
  fields?: {
    [key: string]: {
      type: string;
      required: boolean;
      label: string;
    }
  };
};

// Converta o JSON importado para o tipo correto
const templateSchema: SchemaItem[][] = templateSchemaJson as SchemaItem[][];

const font: Font = {
  courier: {
    data: await (async () => {
      const response = await fetch(CourierPrime);
      return response.arrayBuffer();
    })(),
    fallback: true,
  },
};

class Certificate {
  formData: Record<string, unknown> | null;

  constructor(formData: Record<string, unknown> | null) {
    this.formData = formData;
  }

  json() {
    return this.formData;
  }

  async loadBasePdf() {
    'use server';

    const response = await fetch('/template.pdf');
    if (!response.ok) {
      throw new Error('Erro ao carregar o PDF base');
    }
    const data = await response.arrayBuffer();

    return data;
  }

  validarCampos(input: Record<string, unknown>): string[] {
    const camposVazios: string[] = [];

    templateSchema.forEach((schemaArray: SchemaItem[]) => {
      schemaArray.forEach((schema: SchemaItem) => {
        if (schema.fields) {
          Object.entries(schema.fields).forEach(([key, field]) => {
            if (field.required && this.isEmpty(input[key])) {
              camposVazios.push(field.label || key);
            }
          });
        }
      });
    });

    return camposVazios;
  }

  private isEmpty(value: unknown): boolean {
    return (
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0)
    );
  }

  async pdf(input: Record<string, unknown>) {
    'use server';

    const camposVazios = this.validarCampos(input);
    if (camposVazios.length > 0) {
      throw new Error(`Os seguintes campos obrigatórios não foram preenchidos: ${camposVazios.join(', ')}`);
    }

    const basePdfBuffer = await this.loadBasePdf();

    const template: Template = {
      basePdf: basePdfBuffer,
      schemas: templateSchema,
    };

    const plugins = { text, image, qrcode: barcodes.qrcode };

    try {
      const pdf = await generate({
        template,
        inputs: [input],
        plugins,
        options: { font },
      });

      // Retorne o buffer do PDF em vez de tentar abrir no navegador
      return pdf.buffer;
    } catch (error) {
      console.error('Erro ao gerar o PDF:', error);
      throw new Error('Não foi possível gerar o PDF. Por favor, tente novamente.');
    }
  }
}

export default Certificate;
