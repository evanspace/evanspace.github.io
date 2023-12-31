<template>
  <div class="page">

    <div class="music-box">
      <!-- 方法一：将音频文件放在static目录中，然后进行调用 -->
      <!-- 方法二：给项目配置mp3格式的解析器 -->
      <audio :src="control.src" ref="mysong" controls></audio>

      <div class="left-control">
        <el-link :underline="false" type="info" @click.stop="onCutSong( -1 )">
          <icon-ep-d-arrow-left/>
        </el-link>
        <el-link title="快退" :underline="false" type="info" @click="onFast( -10 )">
          <icon-ep-arrow-left/>
        </el-link>
        <el-link title="播放" :underline="false" type="info" @click="onPlay">
          <icon-ep-video-play/>
        </el-link>
        <el-link title="暂停" :underline="false" type="info" @click="onPause">
          <icon-ep-video-pause/>
        </el-link>
        <el-link title="快进" :underline="false" type="info" @click="onFast( 10 )">
          <icon-ep-arrow-right/>
        </el-link>
        <el-link title="下一首" :underline="false" type="info" @click="onCutSong( 1 )">
          <icon-ep-d-arrow-right/>
        </el-link>
      </div>

      <div class="process-control">
        <div class="up">
          <div class="music-name">{{ audio.name }}</div>
          <div class="time">
            <span class="cu">{{ timeDispose( control.currentTime ) }}</span>
            <span class="line"></span>
            <span class="total">{{ timeDispose( control.totalTime ) }}</span>
          </div>
        </div>
        <div class="progress">
          <div class="bar" :style="{ width: control.process + '%' }"></div>
        </div>
      </div>

      <div class="right-control">
        <div class="min" title="音量-" @click="onVolume( -.1 )"></div>
        <div class="progress">
          <div class="bar" :style="{ width: control.volume + '%' }"></div>
        </div>
        <div class="max" title="音量+" @click="onVolume( .1 )"></div>

        <el-link title="歌单" :underline="false" type="info" @click.stop="audio.show = !audio.show">
          <icon-ep-menu />
        </el-link>
        <el-link title="麦克风" :underline="false" type="info" @click.stop="onGetMicrophone">
          <icon-ep-mic />
        </el-link>

        <el-color-picker
          title="歌词颜色"
          v-model="color"
          show-alpha
          size="small"
          :style="{ marginLeft: '4px' }"
          :predefine="predefineColors">
        </el-color-picker>

      </div>

      <transition name="el-zoom-in-bottom">
        <div class="music-list" v-show="audio.show">
          <div
            v-for="( name, index ) in audio.list"
            :key="index"
            class="item"
            :class="{ 'is-active': index == audio.index }"
            @click.stop="onAssinSong( index )"
          >{{ name }}</div>
        </div>
      </transition>

    </div>


    <div class="canvas-box">

      <!-- 歌词 -->
      <div class="lrc-box">
        <div
          class="move"
          :style="{
            top: `-${ lrcObj.active * 30 }px`,
            '--color': color
          }"
        >
          <div class="list">
            <div
              v-for="( item, index ) in lrcObj.lrc"
              :key="index"
              class="item"
              :style="{
                '--time': item.duration + 's'
              }"
            >
              <span class="w">
                {{ item.lyric }}
                <span v-if="index == lrcObj.active" :key="index" class="c" :style="{ animationPlayState: control.status == 'paused' ? 'paused' : ''  }">{{ item.lyric }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 画布 -->
      <canvas ref="cvs"></canvas>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { nextTick } from 'vue';
import { MusicFileLoader, timeDispose } from './methods'

let _REG_ = /\.(mp3|ogg)$/
const modulesFiles = import.meta.glob( '../../../../public/audio/*.(mp3|ogg)' )
const audios = Object.entries( modulesFiles ).map( ( [ path ] ) => {
  const filename = ( ( path || '' ).match(/\/([^\/]+)\.\w+$/) || [''] )[ 0 ].replace( /\//, '')
  return filename
} )

const mysong = ref()
const cvs = ref()
// 控制器
const control = reactive( {
  src: '',
  status: '',
  totalTime: 0,
  currentTime: 0,
  process: 0,
  volume: 100,
} )

// 音乐
const audio = reactive( {
  list: audios,
  index: -1,
  name: '',
  show: false,
} )

// 歌词
const lrcObj = reactive<any>( {
  al: '',
  lrc: [],
  active: 0,
} )

// 颜色
const color =  ref( '#ff4500' )
const predefineColors = ref( [
  '#0add31', '#ff4500', '#ff8c00',
  '#ffd700', '#90ee90', '#00ced1',
  '#1e90ff', '#c71585', 'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)', 'hsv(51, 100, 98)', 'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)', 'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
] )

// 播放 音乐 麦克风
let __play__ = false
let __isAudio__ = false
let __isMic__ = false
// 播放
const onPlay = () => {
  mysong.value?.play()
  __play__ = true
  playProgress()
  control.status = 'play'

  if ( __isAudio__ ) return

  initAudioAnalyser()

  __isAudio__ = true
  update()
}

// 播放进度
let __timer__: any
const playProgress = () => {
  clearInterval( __timer__ )
  __timer__ = setInterval( calcProcess, 300 )
}

// 计算当前进度
const calcProcess = () => {
  let currentTime = mysong.value?.currentTime || 0
  let duration = mysong.value?.duration || 0
  control.totalTime = duration
  control.currentTime = currentTime
  control.process = currentTime / duration * 100

  findLyricIndex()
  // 当前播放完毕
  if ( duration > 0 && currentTime == duration ) {
    onCutSong( 1 )
  }
}

// 查找歌词位置
const findLyricIndex = () => {
  if ( !mysong.value ) return
  if ( control.status !== 'play' ) return
  let currentTime = mysong.value.currentTime || 0
  const index = lrcObj.lrc.findIndex( it => it.tsp <=  currentTime && currentTime <= it.tsp + it.duration )
  if ( index == lrcObj.active ) return
  lrcObj.active = index
}

// 初始化音频
let analyser: any
let micAnalyser: any
let buffer: any
const initAudioAnalyser = () => {
  // 创建音频上下文
  const AudioContext = window.AudioContext
  const audioContext = new AudioContext()
  // 创建音频分析节点
  analyser = audioContext.createAnalyser()
  // analyser.fftSize = 1024

  // 存储频谱数据，Uint8Array 数组创建的时候必须制定长度，
  // 长度就从 analyser.frequencyBinCount里面获取，长度是fftSize 一半
  buffer = new Uint8Array( analyser.frequencyBinCount )

  // 创建输入源
  let source = audioContext.createMediaElementSource( mysong.value )
  // 连接：source → analyser → destination
  source.connect( analyser )
  //声音连接到扬声器
  analyser.connect( audioContext.destination )
}

// 更新
let __animationId__: any
const update = () => {
  __animationId__ = requestAnimationFrame( update )
  let _analyser
  if ( __isAudio__ ) _analyser = analyser
  if ( __isMic__ ) _analyser = micAnalyser
  if ( !_analyser ) return

  // 获取音频分析数据
  _analyser.getByteFrequencyData( buffer )
  // 音频数据后面基本为0 取一部分
  const offset = Math.floor( buffer.length * 2 / 3 )
  // 为了效果对称取双倍
  const datas = new Array( offset * 2 )
  for ( let i = 0; i < offset; i++ ) {
    datas[ i ] = datas[ datas.length - i - 1 ] = buffer[ i ]
  }
  draw( datas, 255, 250 )
}

// 绘图
const draw = ( datas, maxValue, max = 100 ) => {
  const canvas = cvs.value, w = canvas.width, h = canvas.height
  const context = canvas.getContext( '2d' )
  // 设置线条宽度
  context.lineWidth = 2

  // 每次要清除画布
  context.clearRect( 0, 0, w, h )
  // 半径
  const arc = Math.min( w, h ) / 2
  // 圆形背景
  // context.arc( w / 2, h / 2, arc, 0, 2 * Math.PI )
  // context.fillStyle = 'rgba(255,255,255,.1)'
  // context.fill()

  const len = datas.length
  // 内圈半径
  const cArc = parseInt( ( arc * .5 ).toString() )
  // 可用最长度
  const maxLen = parseInt( ( arc * .99 - cArc ).toString() )
  // 能量柱个数,不能大于数组长度
  const count = Math.min( max, len )
  // 步数
  const step = Math.round( len / count )
  for ( let i = 0; i < count; i ++ ) {
    const value = datas[ i * step + step ]
    // 换算点位置 最小为1 不至于没声音时没有
    const x = parseInt( ( maxLen * ( value / maxValue ) ).toString() ) || 1
    // 开始一条路径
    context.beginPath()
    // 设置画笔颜色，hsl通过这个公式出来的是很漂亮的彩虹色
    // H：Hue(色调)。0(或360)表示红色，120表示绿色，240表示蓝色，
    //   也可取其他数值来指定颜色。取值为：0 - 360
    // S：Saturation(饱和度)。取值为：0.0% - 100.0%
    // L：Lightness(亮度)。取值为：0.0% - 100.0%
    // context.strokeStyle = `hsl( ${ 360 - value }, 100%, 50%)`
    // const r = parseInt( 360 - 360 * ( value / 360 ) )
    const r = Math.round( i * 360 / count )
    context.strokeStyle = `hsla(${r}, 100%, 50%, 1)`

    context.save()
    // 改变起点位置
    context.translate( w / 2, h / 2)
    // 旋转
    context.rotate( i * Math.PI * 2 / count - Math.PI * .5 )
    context.moveTo( 0, cArc )
    context.lineTo( 0, cArc + x )

    // stroke方法才是真正的绘制方法,顺便也相当于结束了这次的绘画路径,就不用调用closePath方法了
    // 之前的是水平排布显示条块，不需要 但此处是做了圆圈布局显示需要闭合一下如果不闭合。会出现收尾相连进行描绘的操作。既会出现白色的条块显示bug
    context.closePath()
    context.stroke()
    context.restore()
  }
}

// 暂停
const onPause = () => {
  __play__ = false
  mysong.value?.pause()
  control.status = 'paused'
  clearInterval( __timer__ )
}

// 切歌
const onCutSong = ( cut = 1 ) => {
  let index = audio.index
  index += cut
  const len = audio.list.length
  if ( index >= len ) {
    index = 0
  } else if ( index < 0 ) {
    index = len - 1
  }
  onAssinSong( index )
}

const base = import.meta.env.VITE_BEFORE_STATIC_PATH
// 指定歌曲
const onAssinSong = ( index = 0 ) => {
  if ( audio.index == index ) return
  audio.index = index
  // 播放地址
  let name = audio.list[ index ]
  control.src = `${ base }/audio/${ name }`
  name = name.replace( _REG_, '' )
  audio.name = name
  const lrc = `${ base }/audio/${ name }.lrc`

  lrcObj.active = -1
  new MusicFileLoader().load( lrc, data => {
    console.log( data )
    Object.keys( data ).forEach( key => {
      lrcObj[ key ] = data[ key ]
    } )
  } )

  if ( __isAudio__ ) {
    nextTick( () => {
      mysong.value?.play()
    } )
  }
}

// 快进
const onFast = ( seconds = 0 ) => {
  mysong.value.currentTime += seconds
  calcProcess()

}

// 音量
const onVolume = ( step = .1 ) => {
  let volume = mysong.value.volume
  volume += step
  if ( volume > 1 ) {
    volume = 1
  } else if ( volume < 0 ) {
    volume = 0
  }
  mysong.value.volume = volume
  control.volume = volume * 100

}

// 麦克风
let stream: any
const onGetMicrophone = () => {
  // 本地地址 才可
  if ( !navigator.mediaDevices ) {
    console.log('获取麦克风失败!')
    return
  }
  if ( __isMic__ ) {
    onCloseMicrophone()
    onPlay()
    return
  } else {
    onPause()
  }
  navigator.mediaDevices.getUserMedia( { audio: true } )
  .then( _stream => {
    stream = _stream

    // 创建音频上下文
    const AudioContext = window.AudioContext
    const audioContext = new AudioContext()
    // 创建音频分析节点
    const analyser = audioContext.createAnalyser()
    // analyser.fftSize = 1024
    micAnalyser = analyser

    // 存储频谱数据，Uint8Array 数组创建的时候必须制定长度，
    // 长度就从 analyser.frequencyBinCount里面获取，长度是fftSize 一半
    buffer = new Uint8Array( analyser.frequencyBinCount )

    // 创建输入源
    let source = audioContext.createMediaStreamSource( stream )
    // 连接：source → analyser → destination
    source.connect( analyser )
    //声音连接到扬声器
    analyser.connect( audioContext.destination )

    __isMic__ = true

    update()
  } )
}

// 关闭麦克风
const onCloseMicrophone = () => {
  if ( !stream ) return
  __isMic__ = false
  stream.getAudioTracks().forEach( track => {
    track.stop()
  } )
}

// 自动播放
const autoPlayAudio = () => {
  // 音频上下文
  const ctx = new AudioContext()
  // 是否可自动播放
  const canAutoPlay = ctx.state === 'running'
  console.log('是否可自动播放', canAutoPlay)

  __play__ = canAutoPlay
  if ( canAutoPlay ) {
    onPlay()
  }
}

const onKeydown = ( e ) => {
  const code = e.keyCode
  switch( code ) {
    case 32: // 空格
      if ( __play__ ) {
        onPause()
      } else {
        onPlay()
      }
      break
    case 37:  // 左箭头
      // Ctrl 键是否被按下
      if ( e.ctrlKey ) {
        onCutSong( -1 )
      } else {
        onFast( -10 )
      }
      break
    case 39:  // 右箭头
      // Ctrl 键是否被按下
      if ( e.ctrlKey ) {
        onCutSong( 1 )
      } else {
        onFast( 10 )
      }
      break

  }

}

// 初始化 画布
const initCanvas = () => {
  const canvas = cvs.value
  const pm = canvas.parentNode, w = pm.offsetWidth, h = pm.offsetHeight
  canvas.width = w
  canvas.height = h
}

const initPlayer = () => {
  onAssinSong( 1 )
  nextTick( autoPlayAudio )

  initCanvas()

  let datas = new Array( 256 ).fill( 0 )
  draw( datas, 255, 190 )
}

onMounted( () =>{
  initPlayer ()
  
  window.addEventListener( 'resize', initCanvas )
  window.addEventListener( 'keydown', onKeydown )
})
onBeforeUnmount(() => {
  clearInterval( __timer__ )
  cancelAnimationFrame( __animationId__ ) // 停止动画
  window.removeEventListener( 'resize', initCanvas )
  window.removeEventListener( 'keydown', onKeydown )
})
</script>
  
<style lang="scss" src="./style.scss" scoped>
</style>