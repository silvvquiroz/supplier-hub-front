import { z } from 'zod'

const PHONE_REGEX = /^[+\s\-()0-9]{7,30}$/
const ELEVEN_DIGITS_REGEX = /^\d{11}$/

export const AddProviderSchema = z.object({
  razonSocial: z
    .string()
    .min(1, 'La razón social es obligatoria.'),
  nombreComercial: z
    .string()
    .min(1, 'El nombre comercial es obligatorio.'),
  identificacionTributaria: z
    .string()
    .min(1, 'La identificación tributaria es obligatoria.')
    .regex(ELEVEN_DIGITS_REGEX, 'La identificación tributaria debe tener 11 dígitos.'),
  numeroTelefonico: z
    .string()
    .refine(
      (v) => v === '' || PHONE_REGEX.test(v),
      'El número telefónico no tiene un formato válido.'
    ),
  correoElectronico: z
    .string()
    .min(1, 'El correo electrónico es obligatorio.')
    .email('El correo electrónico no tiene un formato válido.'),
  sitioWeb: z
    .string()
    .refine(
      (v) => v === '' || z.string().url().safeParse(v).success,
      'El sitio web no tiene un formato válido.'
    ),
  direccionFisica: z.string().optional().default(''),
  pais: z
    .string()
    .min(1, 'El país es obligatorio.'),
  facturacionAnual: z
    .number({ required_error: 'La facturación anual es obligatoria.', invalid_type_error: 'La facturación anual debe ser un número.' })
    .positive('La facturación anual debe ser mayor a cero.'),
})
