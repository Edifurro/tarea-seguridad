import CryptoJS from 'crypto-js'

// Usa process.env para Vue CLI
const SECRET_KEY = process.env.VUE_APP_CRYPTO_SECRET || "LlaveSecretaSuperSegura123!"

export const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString()
}

export const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}