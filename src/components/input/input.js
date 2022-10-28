import { qs, qsa } from '../../js/helpers/query'
import Inputmask from 'inputmask/lib/inputmask'

const inputs = qsa('.input-field__input')
if (inputs.length) {
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      const parent = input.closest('.input-field')
      const label = qs('.input-field__label', parent)
      label.style.transform = 'translate(0, -14px)'
      label.style.fontSize = '16rem'
    })

    input.addEventListener('blur', function () {
      const parent = input.closest('.input-field')
      const label = qs('.input-field__label', parent)

      if (!this.value.trim().length) {
        label.removeAttribute('style')
      }
    })

    // mask
    const { mask } = input.dataset

    if (mask) {
      Inputmask({ mask, jitMasking: true }).mask(input)
    }
  })
}