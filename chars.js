// キャラクター設定：表示名と、年代ごとの立ち絵
// 年代: kinder=幼稚園 / elem=小学校 / middle=中学 / high=高校
// 画像がない年代は、近い年代の画像を使う（null の場合は立ち絵を出さない）
window.CHARS = {
  yohei:     { name: '耀平',   img: { kinder: 'yohei_kinder', elem: 'yohei_elem', middle: 'yohei_middle', high: 'yohei_high', high3: 'yohei_p3', high4: 'yohei_p4' } },
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
  setsuka:   { name: '雪華',   img: { high: 'setsuka' } },
  // 第2部
  rika:      { name: '莉花',   img: { high: 'rika', high3: 'rika_p3', high4: 'rika_p4' } },
  todo:      { name: '藤堂',   img: { high: 'todo' } },
  rio:       { name: '理央',   img: { high: 'rio' } },
  tsukumo:   { name: '九十九', img: { high: 'tsukumo' } },
  soleil:    { name: 'ソレイユ', img: { high: 'soleil' } },
  // 第3部
  ramy:      { name: 'ラミィ', img: { high: 'ramy', high4: 'ramy_p4' } },
  remy:      { name: 'レミィ', img: { high: 'remy' } },
  ogami:     { name: '大神',   img: { high: 'ogami' } },
  yanagi:    { name: '柳',     img: { high: 'yanagi' } },
  arthur:    { name: 'アーサー王', img: { high: 'arthur' } },
  lancelot:  { name: 'ランスロット', img: { high: 'lancelot' } },
  gawain:    { name: 'ガウェイン', img: { high: 'gawain' } },
  percival:  { name: 'パーシヴァル', img: { high: 'percival' } },
  gareth:    { name: 'ガレス', img: { high: 'gareth' } },
  odin:      { name: 'オーディン', img: { high: 'odin' } },
  uriel:     { name: 'ウリエル', img: { high: 'uriel' } },
  // 第4部（画像ができたら img に追加。なければ立ち絵なし）
  makoto:    { name: '真琴',   img: {} },
  sayo:      { name: '氷室',   img: {} },
  hikari:    { name: '小早川', img: {} },
  kito:      { name: '鬼頭',   img: { high: 'kito' } },
  nurarihyon:{ name: 'ぬらりひょん', img: { high: 'nurarihyon' } },
  noa4:      { name: '乃亜',   img: { high4: 'noa_p4' } },
  cafe:      { name: '店員',   img: { high: 'cafe' } }
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

window.ERA_LABEL = { kinder: '幼稚園編', elem: '小学校編', middle: '中学編', high: '高校編', high2: '第2部 二年生編', high3a: '第3部 枯花計画編', high3: '第3部 枯花計画編', high4: '第4部 復讐編' };
