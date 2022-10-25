import {ToastProgrammatic as Toast} from 'buefy'

export const $success = message => {
  Toast.open({
    position: 'is-bottom',
    message,
    type: 'is-success'
  })
}

export const $warn = message => {
  Toast.open({
    position: 'is-bottom',
    message,
    type: 'is-dark'
  })
}

export const $indefinite = message => {
  Toast.open({
    position: 'is-bottom',
    indefinite: true,
    message,
    type: 'is-dark'
  })
}

export const $error = message => {
  Toast.open({
    position: 'is-bottom',
    message,
    type: 'is-error'
  })
}


export const formatDateToSQLFormat = (date: Date): string => {
  const year = date.getFullYear();
  const month = ('' + (date.getMonth() + 1)).padStart(2, '0');
  const dateStr = ('' + date.getDate()).padStart(2, '0');
  return `${year}-${month}-${dateStr}`
}

export const formatDateFromSQLFormat = (dateString: string): string => {
  const date = new Date(dateString.split('T')[0])
  const year = date.getFullYear();
  const month = date.toLocaleString('default', { month: 'short' });
  const dateStr = ('' + date.getDate()).padStart(2, '0');
  return `${dateStr} ${month} ${year}`
}
