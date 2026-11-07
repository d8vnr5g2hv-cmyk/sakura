// キャラクター設定：表示名と、年代ごとの立ち絵
// 年代: kinder=幼稚園 / elem=小学校 / middle=中学 / high=高校
// 画像がない年代は、近い年代の画像を使う（null の場合は立ち絵を出さない）
window.CHARS = {
  yohei:     { name: '耀平',   img: { kinder: 'yohei_kinder', elem: 'yohei_elem', middle: 'yohei_middle', high: 'yohei_high' } },
  noa:       { name: '乃亜',   img: { kinder: 'noa_kinder',   elem: 'noa_elem',   middle: 'noa_middle',   high: 'noa_high' } },
  ryoma:     { name: '竜馬',   img: { kinder: 'ryoma_kinder', elem: 'ryoma_elem', middle: 'ryoma_middle', high: 'ryoma_high' } },
  yuzuki:    { name: '柚月',   img: { middle: 'yuzuki_middle', high: 'yuzuki' } },
  jin:       { name: '迅',     img: { high: 'jin' } },
  ren:       { name: '蓮',     img: { middle: 'ren', high: 'ren' } },
  principal: { name: '学園長', img: { high: 'principal' } },
  hotaru:    { name: '蛍',     img: { high: 'hotaru' } },
  mumyo:     { name: '無明',   img: { high: 'mumyo' } },
  genzo:     { name: '玄蔵',   img: { high: 'genzo' } },
  suiran:    { name: '翠嵐',   img: { high: 'suiran' } },
  saku:      { name: '朔',     img: { high: 'saku' } },
  setsuka:   { name: '雪華',   img: { high: 'setsuka' } }
};

// BGMの割り当て（ファイルはリポジトリ直下。差し替えはここを書き換えるだけ）
window.BGM = {
  title: 'title',
  daily1: 'daily1', daily2: 'daily2', daily3: 'daily3', daily4: 'daily4', daily5: 'daily5',
  soft1: 'soft1', soft2: 'soft2', soft3: 'soft3', soft4: 'soft4',
  night1: 'night1', night2: 'night2', night3: 'night3',
  tense1: 'tense1', tense2: 'tense2',
  sad1: 'sad1', sad2: 'sad2',
  battle1: 'battle1', battle2: 'battle2', battle_emiya: 'battle_emiya',
  climax1: 'climax1', climax2: 'climax2'
};

window.ERA_LABEL = { kinder: '幼稚園編', elem: '小学校編', middle: '中学編', high: '高校編' };
