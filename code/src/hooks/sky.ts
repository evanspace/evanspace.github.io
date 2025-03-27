/**
 * 天空盒子列表
 * @returns
 */
export const useSky = () => {
  // const list = import.meta.glob(`/public/oss/sky/**/posX.*`)

  // const skys = Object.entries(list).map(t => t[0].split('/')[4])
  const skys = [
    '101',
    '102',
    '103',
    '104',
    '201',
    '202',
    '203',
    '301',
    '302',
    '401',
    '501',
    '502',
    '503',
    '504',
    '505',
    '601'
  ]

  return {
    skys
  }
}
