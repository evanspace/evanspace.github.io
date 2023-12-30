/* *
 * @description: 页面缓存状态
 * @file: tags.ts
 * @author: Evan
 * @date: 2023.07.24 17:52:14
 * @week: 周一
 * @version: V
* */
import { defineStore } from 'pinia'

const visitedViews: any[] = []
const cachedViews: string[] = []
export const useTagsStore = defineStore( {
  id: 'tags',
  state: () => ( {
  
    // 已访问
    visitedViews,
    // 缓存
    cachedViews
  } ),

  actions: {

    // 添加界面
    addView( view: any ) {
      // 添加访问页面
      this.addVisitedView( view )

       // 添加缓存页面
       this.addCachedView( view )
    },

    // 添加已访问界面
    addVisitedView( view: any ) {
      if ( !this.visitedViews.some( ( v: { path: any } ) => v.path === view.path ) ) { 
        this.visitedViews.push( Object.assign( {}, view, {
          title: view.meta.title || 'no-name'
        } ) )
       }
  
    },

    // 添加缓存界面
    addCachedView( view: { name: any; meta: { cache: boolean } } ) {
      if ( !this.cachedViews.includes( view.name ) ) { 
        if ( view.meta.cache ) {
          this.cachedViews.push( view.name )
        }
      }
    },

    // 删除界面
    delView( view: any ) {
      // 删除访问页面
      this.delVisitedView( view )

      // 删除缓存界面
      this.delCachedView( view )
      return ( {
        visitedViews: [ ...this.visitedViews ],
        cachedViews: [ ...this.cachedViews ]
      } )
    },

    // 删除已访问页面
    delVisitedView( view: any ) {
      for ( const [ i, v ] of this.visitedViews.entries() ) {
        if ( v.path === view.path ) {
          this.visitedViews.splice( i, 1 )
          break
        }
      }
    },
  
    // 删除缓存页面
    delCachedView( view: any ) {
      for ( const v in this.cachedViews ) {
        if ( v === view.name ) {
          let index = this.cachedViews.indexOf( v )
          console.log( index )
          this.cachedViews.splice( index, 1 )
          break
        }
      }
    },

    // 删除其他页面
    delOthersViews( view: any ) {
      // 删除其他访问界面
      this.delOthersVisitedViews( view )

      // 删除其他缓存界面
      this.delOthersCachedViews( view )
      return ( {
        visitedViews: [ ...this.visitedViews ],
        cachedViews: [ ...this.cachedViews ]
      } )
    },

    // 删除其他访问界面
    delOthersVisitedViews( view: any ) {
      this.visitedViews = this.visitedViews.filter( ( v: { meta: { affix: any }; path: any } ) => {
        return v.meta.affix || v.path === view.path
      } )
    },
  
    // 删除其他缓存界面
    delOthersCachedViews( view: any ) {
      for ( const v in this.cachedViews ) {
        if ( v === view.name ) {
          let index = this.cachedViews.indexOf( v )
          this.cachedViews = this.cachedViews.slice( index, index + 1 )
          break
        }
      }
    },

    // 删除所有页面
    delAllViews() {
      // 删除所有界面 只返回固定标签页
      this.delAllVisitedViews()
      // 删除所有缓存界面
      this.delAllCachedViews()
      return ( {
        visitedViews: [ ...this.visitedViews ],
        cachedViews: [ ...this.cachedViews ]
      } )
    },

    // 删除所有访问界面
    delAllVisitedViews() {
      this.visitedViews = this.visitedViews.filter( ( v: { meta: { affix: any } } ) => v.meta.affix )
    },
  
    // 删除所有缓存界面
    delAllCachedViews() {
      this.cachedViews = []
    },

    // 更新访问界面
    updateVisitedView( view: any ) {
      for ( let v of this.visitedViews ) {
        if ( v.path === view.path ) {
          v = Object.assign( v, view )
          break
        }
      }
    }
  }
} )