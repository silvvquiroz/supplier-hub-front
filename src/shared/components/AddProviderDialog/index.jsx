import { Dialog } from '../Dialog'
import { useCreateProveedor } from '../../hooks/useCreateProveedor'
import { useUpdateProveedor } from '../../hooks/useUpdateProveedor'
import { usePaises } from '../../hooks/usePaises'
import { useRef, useEffect } from 'react'

const ADD_PROVIDER_DIALOG_ID = 'AddProviderDialog'

export function AddProviderDialog({ proveedor = null, onClose = null }) {
  const { createProveedor, isPending: isPendingCreate, isError: isErrorCreate, error: errorCreate } = useCreateProveedor()
  const { updateProveedor, isPending: isPendingUpdate, isError: isErrorUpdate, error: errorUpdate } = useUpdateProveedor()
  const { paises } = usePaises()
  const formRef = useRef(null)
  const isEditing = proveedor != null

  const isPending = isEditing ? isPendingUpdate : isPendingCreate
  const isError = isEditing ? isErrorUpdate : isErrorCreate
  const error = isEditing ? errorUpdate : errorCreate

  useEffect(() => {
    if (isEditing && formRef.current) {
      formRef.current.razonSocial.value = proveedor.razonSocial || ''
      formRef.current.nombreComercial.value = proveedor.nombreComercial || ''
      formRef.current.identificacionTributaria.value = proveedor.nif || ''
      formRef.current.numeroTelefonico.value = proveedor.telefono || ''
      formRef.current.correoElectronico.value = proveedor.email || ''
      formRef.current.sitioWeb.value = proveedor.sitioWeb || ''
      formRef.current.direccionFisica.value = proveedor.direccionFisica || ''
      formRef.current.pais.value = proveedor.pais || ''
      // facturacionAnual viene formateado con localeString, extraer solo números
      const facNum = proveedor.facturacionAnual ? proveedor.facturacionAnual.replace(/\D/g, '') : ''
      formRef.current.facturacionAnual.value = facNum
    } else if (!isEditing && formRef.current) {
      formRef.current.reset()
    }
  }, [proveedor, isEditing])

  const handleDialogClose = () => {
    if (onClose) onClose()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const formData = new FormData(form)
    const facturacionAnual = formData.get('facturacionAnual')
    const payload = {
      razonSocial: formData.get('razonSocial') ?? '',
      nombreComercial: formData.get('nombreComercial') ?? '',
      identificacionTributaria: formData.get('identificacionTributaria') ?? '',
      numeroTelefonico: formData.get('numeroTelefonico') ?? '',
      correoElectronico: formData.get('correoElectronico') ?? '',
      sitioWeb: formData.get('sitioWeb') ?? '',
      direccionFisica: formData.get('direccionFisica') ?? '',
      pais: formData.get('pais') ?? '',
      facturacionAnual: facturacionAnual ? Number(facturacionAnual) : 0,
    }
    try {
      if (isEditing) {
        await updateProveedor({ id: proveedor.id, raw: payload })
      } else {
        await createProveedor(payload)
      }
      form.reset()
      document.getElementById(ADD_PROVIDER_DIALOG_ID)?.hidePopover?.()
      handleDialogClose()
    } catch (_err) {
      // Validation or API error: mutation sets isError / error, shown below the buttons
      // Do not reset form or close dialog so the user can correct and retry
    }
  }

  return (
    <>
      <Dialog id={ADD_PROVIDER_DIALOG_ID} title={isEditing ? 'Editar Proveedor' : 'Añadir Proveedor'}>
        <form
          ref={formRef}
          className="Form"
          data-columns="2"
          onSubmit={handleSubmit}
        >
          <fieldset>
            <label htmlFor="razonSocial">Razon social</label>
            <input
              id="razonSocial"
              type="text"
              name="razonSocial"
              placeholder="Razon social"
              required
            />
          </fieldset>
          <fieldset>
            <label htmlFor="nombreComercial">Nombre comercial</label>
            <input
              id="nombreComercial"
              type="text"
              name="nombreComercial"
              placeholder="Nombre comercial"
            />
          </fieldset>
          <fieldset>
            <label htmlFor="identificacionTributaria">NIF</label>
            <input
              id="identificacionTributaria"
              type="text"
              name="identificacionTributaria"
              placeholder="NIF"
            />
          </fieldset>
          <fieldset>
            <label htmlFor="numeroTelefonico">Teléfono</label>
            <input
              id="numeroTelefonico"
              type="text"
              name="numeroTelefonico"
              placeholder="Teléfono"
            />
          </fieldset>
          <fieldset>
            <label htmlFor="correoElectronico">Correo electrónico</label>
            <input
              id="correoElectronico"
              type="email"
              name="correoElectronico"
              placeholder="Correo electrónico"
            />
          </fieldset>
          <fieldset>
            <label htmlFor="sitioWeb">Sitio web</label>
            <input
              id="sitioWeb"
              type="url"
              name="sitioWeb"
              placeholder="Sitio web"
            />
          </fieldset>
          <fieldset>
            <label htmlFor="pais">País</label>
            <select id="pais" name="pais">
              <option value="" disabled defaultValue="">
                País
              </option>
              {paises.map((pais, idx) => (
                <option key={idx} value={pais}>
                  {pais}
                </option>
              ))}
            </select>
          </fieldset>
          <fieldset>
            <label htmlFor="direccionFisica">Dirección física</label>
            <input
              id="direccionFisica"
              type="text"
              name="direccionFisica"
              placeholder="Dirección física"
            />
          </fieldset>
          <fieldset>
            <label htmlFor="facturacionAnual">Facturación anual en USD</label>
            <input
              id="facturacionAnual"
              type="number"
              name="facturacionAnual"
              placeholder="Facturación anual en USD"
              min="0"
              step="0.01"
            />
          </fieldset>
          <fieldset>
            <button
              className="Button PrimaryButton BlueButton"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (isEditing ? 'Actualizando…' : 'Guardando…') : (isEditing ? 'Actualizar' : 'Guardar')}
            </button>
            <button
              className="Button PrimaryButton RedButton"
              type="button"
              onClick={() => {
                document.getElementById(ADD_PROVIDER_DIALOG_ID)?.hidePopover?.()
                handleDialogClose()
              }}
            >
              Cancelar
            </button>
          </fieldset>
          {isError && (
            <p style={{ color: 'var(--color-red)', fontSize: 'var(--font-size-xs)' }}>
              {error?.message ?? 'Error al guardar'}
            </p>
          )}
        </form>
      </Dialog>
    </>
  )
}
