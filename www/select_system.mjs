import { writeJsonToStorage, SYSTEM_FILE_NAMES } from './exo3d.mjs'

/* Adds dropdown options to the system generation form, containing the name of
all pre-existing exosystems. */
const exoSelect = document.querySelector('#exo-select')
for (const jsonName of SYSTEM_FILE_NAMES) {
  const selectOption = exoSelect.appendChild(document.createElement('option'))
  selectOption.innerText = jsonName
}

/* Allows to launch the exo3d.html when clicking on the system generating
button. This won't work if the form is invalid : a pre-existing system must be
chosen at least. */
const systemGenForm = document.querySelector('#system-gen-form')
systemGenForm.addEventListener(
  'submit',
  async () => {
    if (systemGenForm.checkValidity()) {
      const jsonNameSelected = exoSelect.options[exoSelect.selectedIndex].text
      await writeJsonToStorage(jsonNameSelected)
      let _ = window.open('exo3d.html', '_self', '')
    }
  },
  false
)
