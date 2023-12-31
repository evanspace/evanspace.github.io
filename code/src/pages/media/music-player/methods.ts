

export class MusicFileLoader {

	constructor() {
	}

  load( url, onLoad, onProgress?, onError? ) {
    // start the fetch
		const req = new Request( url, {
			headers: new Headers( {} ),
			credentials: 'same-origin',
		} )
    fetch( req )
    .then( ( response: any ) => {
      if ( response.status == 200 || response.status === 0 ) {
        const reader = response.body.getReader()
        const contentLength = response.headers.get( 'Content-Length' )
        const total = contentLength ? parseInt( contentLength ) : 0
        const lengthComputable = total !== 0
        let loaded = 0
        return new ReadableStream( {
          start( controller ) {
            readData()
            function readData() {
              reader.read().then( ( { done, value } ) => {
                if ( done ) {
                  controller.close()
                } else {
                  loaded += value.byteLength
                  const event = new ProgressEvent( 'progress', { lengthComputable, loaded, total } )
                  if ( onProgress ) onProgress( event )
                  controller.enqueue( value )
                  readData()
                }
              } )
            }
          }
        } )
      } else {
        throw Error( `fetch for "${ response.url }" responded with ${ response.status }: ${ response.statusText }` )
      }
    } )
    .then( stream => {
      const response = new Response( stream )
      return response.text()
    } )
    .then( data => {
      const res = this.formste( data )
      if ( res ) {
        if ( onLoad ) onLoad( res )
      } else {
        throw Error( `文件格式不对!` )
      }
    } )
    .catch( er => {
      if ( onError ) onError( er )
    } )
  }

  formste( lyric ) {
    const lrcObj: any = {
      ti: '',    // 曲名
      ar: '',    // 艺人
      al: '',    // 专辑
      by: '',    // 编者
      offset: 0, // 歌词偏移时间
      lrc: []
    }
    lyric.split( '\n' ).filter( value => {
      // 1.通过回车去分割歌词每一行,遍历数组，去除空行空格
      return value.trim() !== ''
    } ).map( value => {
        // 2.解析歌词
        const line = this.parseLyricLine( value.trim() )
        if ( !line ) return false
        if ( line.type === 'lyric' ) {
            lrcObj.lrc.push( line.data )
        } else {
            lrcObj[ line.type ] = line.data
        }
        return value.trim()
    } )
    let rgx = new RegExp( `^\\d+(?:\\.\\d{0,${ 3 }})?` )
    lrcObj.lrc.forEach( ( item, index ) => {
      const nextTsp = ( lrcObj.lrc[ index + 1 ] || {} ).tsp
      let duration = nextTsp ? nextTsp - item.tsp : 2
      duration = Number( duration.toString().match( rgx ) )
      item.duration = duration
    } )
    return lrcObj
  }

  parseLyricLine( line ) {
    const tiArAlByExp = /^\[(ti|ar|al|by|offset):(.*)\]$/
    const lyricExp = /^\[(\d{2}):(\d{2}).(\d{2})\](.*)/
    let result
    if ( ( result = line.match( tiArAlByExp ) ) !== null ) {
      return {
        type: result[ 1 ],
        data: result[ 2 ]
      }
    } else if ( ( result = line.match( lyricExp ) ) !== null ) {
      const m = Number( result[ 1 ] )
      const s = Number( result[ 2 ] )
      const ms = Number( result[ 3 ] )
      return {
        type: 'lyric',
        data: {
          time: {
            m,
            s,
            ms
          },
          tsp: ( ( m * 60 * 1000 ) + ( s * 1000 ) + ms ) / 1000,
          lyric: result[ 4 ].trim()
        }
      }
    }
  }
}

// 时间
export const timeDispose = ( time: number ) => {
  let minutes: any = parseInt( ( time / 60 ).toString() )
  let seconds: any = parseInt( ( time % 60 ).toString() )
  minutes = minutes > 9 ? minutes : '0' + minutes
  seconds = seconds > 9 ? seconds : '0' + seconds
  return minutes + ':' + seconds
}
