import { Dialog } from '../Dialog'
import { useCreateProveedor } from '../../hooks/useCreateProveedor'

const ADD_PROVIDER_DIALOG_ID = 'AddProviderDialog'

export function AddProviderDialog() {
  const { createProveedor, isPending, isError, error } = useCreateProveedor()

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
      await createProveedor(payload)
      form.reset()
      document.getElementById(ADD_PROVIDER_DIALOG_ID)?.hidePopover?.()
    } catch (_err) {
      // Validation or API error: mutation sets isError / error, shown below the buttons
      // Do not reset form or close dialog so the user can correct and retry
    }
  }

  return (
    <>
      <button
        type="button"
        className="Button PrimaryButton BlueButton"
        popoverTarget={ADD_PROVIDER_DIALOG_ID}
      >
        <span>Añadir Proveedor</span>
      </button>
      <Dialog id={ADD_PROVIDER_DIALOG_ID} title="Añadir Proveedor">
        <form
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
            <label htmlFor="direccionFisica">Dirección física</label>
            <input
              id="direccionFisica"
              type="text"
              name="direccionFisica"
              placeholder="Dirección física"
            />
          </fieldset>
          <fieldset>
            <label htmlFor="pais">País</label>
            <select id="pais" name="pais">
              <option value="" disabled defaultValue="">
                País
              </option>
              <option value="1">Perú</option>
              <option value="2">USA</option>
              <option value="3">España</option>
            </select>
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
              {isPending ? 'Guardando…' : 'Guardar'}
            </button>
            <button
              className="Button PrimaryButton RedButton"
              type="button"
              popoverTarget={ADD_PROVIDER_DIALOG_ID}
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
