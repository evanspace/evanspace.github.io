
type responseBody = {
  code: number | boolean,
  msg: string,
  data?: any,
  _header?: object | null
}

let responseBody: responseBody = {
  code: 0,
  msg: '',
  data: null,
  _header: null
}

export const builder = ( data: any, message: string | undefined = 'ok', code: number = 0, headers: object | null ) => {
  responseBody.msg = message
  responseBody.code = code
  if ( typeof data === 'string' || data instanceof Array ) {
    responseBody.data = data
  } else {
    Object.keys( data ).forEach( key => {
      responseBody[ key ] = data[ key ]
    } )
  }

  if ( headers !== null && typeof headers === 'object' && Object.keys( headers ).length > 0 ) {
    responseBody._header = headers
  }
  return responseBody
}