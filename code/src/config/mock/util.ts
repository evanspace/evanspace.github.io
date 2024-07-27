
type ResponseBody = {
  code?: number | boolean,
  msg?: string,
  data?: any,
} | string | any[]


export const builder = ( data: any, message?: string, code?: number ) => {
  let responseBody: ResponseBody = {}
  if ( typeof data === 'string' || data instanceof Array ) {
    responseBody = data
  } else {
    message != void 0 && ( responseBody.msg = message )
    code != void 0 && ( responseBody.code = code )
    if ( typeof data == 'object' ) {
      Object.keys( data ).forEach( key => {
        responseBody[ key ] = data[ key ]
      } )
    }
  }
  return responseBody
}