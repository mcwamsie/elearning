//import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";


export const TOKEN_STORAGE_NAME = "token_storage"
const HOST = "http://localhost"
export const HOST_PORT = "8125"
export const HOST_URL = `${HOST}:${HOST_PORT}`;
//export const HOST_URL = "http://192.168.43.250:8125"
export const BASE_URL = `${HOST_URL}/api/v1`;
export const getRandomColor = () => {
    return Math.floor(Math.random() * 16777215).toString(16);
}
const AGORA_APP_ID = "9bc7750f382446df84deeeea37226f4a"
export const config = { mode: "rtc", codec: "vp8", appId: AGORA_APP_ID };
//export const useClient = createClient(config);

export const generatePassword = (
  passwordLength = 8,
) => {
  const lowerCase = 'abcdefghijklmnopqrstuvwxyz'
  const upperCase = lowerCase.toUpperCase()
  const numberChars = '0123456789'
  const specialChars = '!"@$%+-_?^&*()'

  let generatedPassword = ''
  let restPassword = ''

  const restLength = passwordLength % 4
  const usableLength = passwordLength - restLength
  const generateLength = usableLength / 4

  const randomString = (char) => {
    return char[Math.floor(Math.random() * (char.length))]
  }
  for (let i = 0; i <= generateLength - 1; i++) {
    generatedPassword += `${randomString(lowerCase)}${randomString(upperCase)}${randomString(numberChars)}${randomString(specialChars)}`
  }

  for (let i = 0; i <= restLength - 1; i++) {
    restPassword += randomString([...lowerCase, ...upperCase, ...numberChars, ...specialChars])
  }

  return generatedPassword + restPassword
}