

export const namespace = 'e'

export const getCN = ( ...names: string[] ) => {
  return namespace + '-' + names.join( '-' )
}

export const getVar = ( ...names: string[] ) => {
  return '--' + namespace + '-' + names.join( '-' )
}