import enFile from '../_locales/en/messages.json';
import deFile from '../_locales/de/messages.json';

function getMessage(data) {
  if (data?.message) {
    return data.message;
  }
  return null;
} 

export default function (key, lang) {
  lang = lang || Office.context.displayLanguage.split('-')[0];
  switch (lang) {
    case 'de': return getMessage(deFile[key]);
    default: return getMessage(enFile[key]);
  }
  return null;
}