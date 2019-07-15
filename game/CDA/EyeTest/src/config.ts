export const namespace = 'EyeTest'

export enum MoveType {
    //player
    submitSeatNumber = 'submitSeatNumber',
    anwser = 'anwser',
    sendBackPlayer = 'sendBackPlayer',
    //owner
    startMainTest = 'startMainTest'
}

export enum PushType {
}

export enum FetchRoute {
    exportXls = '/exportXls/:gameId'
}

/**------------------------------------------**/
export enum GameStage {
    seatNumber,
    mainTest,
    result
}

export enum GENDER {
    male,
    female
}

export const EYE_EXAMPLE = {
    url: 'https://qiniu1.anlint.com/an/img/p.png',
    items: ['妒忌', '恐慌', '自大', '厌恶'],
    desc: `<b>1妒忌  (jealous)</b> 
        英文注释：envious 
        汉语注释：对别人的长处感到不痛快或忿恨，同时又希望自己具有同样长处。
        例句：张正总是妒忌班里那些比他高，比他帅的同学。

        <b>2恐慌  (panicked)</b>
        英文注释：distraught, feeling of terror or anxiety
        汉语注释：恐惧惊慌。
        例句：发觉熊熊大火已经包围房子的时候，整家人都恐慌起来。

        <b>3自大  (arrogant)</b>
        英文注释：conceited, self-important, having a big opinion of oneself
        汉语注释：自以为了不起；把自己的地位作用等看得很重要的，夸大自己的价值的。
        例句：那个自大的人认为自己是这屋子里最懂政治的。

        <b>4厌恶  (hateful)</b>
        英文注释：showing intense dislike 
        汉语大辞典注释：讨厌，憎恶。
        例句：这对姐妹彼此厌恶对方，并因此常常打架。
        `
}

export const EYES = [
    {
        url: 'https://qiniu1.anlint.com/an/img/1.png',
        items: ['快乐', '安慰', '恼怒', '无聊'],
        desc: `<b>1快乐  (playful)  </b>
        英文注释：full of high spirits and fun 
        汉语大辞典注释：欢乐。指感到高兴或满意。
        例句：曹晶在生日聚会上感到非常快乐。
        
        <b>2安慰  (comforting)</b>
        英文注释：consoling, compassionate 
        汉语注释：安顿抚慰。
        例句：护士在安慰受伤的士兵。
        
        <b>3恼怒  (irritated)</b>
        英文注释：exasperated, annoyed 
        汉语注释：生气；愤怒。
        例句：李丽收到很多垃圾邮件，恼怒不已。
        
        <b>4无聊（bored）</b>
        英文注释：in extreme depression
        汉语注释：郁闷，精神空虚；没有意义而令人生厌。
        例句：这些话真无聊。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/2.png',
        items: ['恐惧', '难过', '自大', '懊恼'],
        desc: `<b>1恐惧  (terrified)</b>
        英文注释：alarmed, fearful 
        汉语注释：畏惧，害怕。
        例句：李海认为自己看到了鬼怪，他非常恐惧。
        
        <b>2难过  (upset)</b>
        英文注释：agitated, worried, uneasy 
        汉语注释：指生活困难，日子不容易过；指身体不舒服；心情不痛快；伤心。
        例句：妈妈去世了，张红非常难过。
        
        <b>3自大  (arrogant)</b>
        英文注释：conceited, self-important, having a big opinion of oneself
        汉语注释：自以为了不起；把自己的地位作用等看得很重要的，夸大自己的价值的。
        例句：那个自大的人认为自己是这屋子里最懂政治的。
        
        <b>4懊恼  (annoyed) </b>
        英文注释：irritated, displeased
        汉语注释：烦恼；懊悔。
        例句：李强发现自己错过了最后一班回家的公交车，十分懊恼。        
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/3.png',
        items: ['玩笑', '轻浮', '渴望', '确信'],
        desc: `<b>1玩笑  (joking)</b>
        英文注释：being funny, playful 
        汉语注释：玩耍嬉笑的言语、行动；玩耍嬉笑。
        例句：王强喜欢和他的朋友们开玩笑。 
        
        <b>2轻浮  (flirtatious)</b>
        英文注释：brazen, saucy, teasing, playful 
        汉语注释：轻率浮躁；言语举止随便,不稳重；不庄重；轻佻的；指茶味不同凡响。
        例句：李妮在聚会上频繁地向陌生人抛媚眼，大家都觉得她很轻浮。   
        
        <b>3渴望  (desire)</b>
        英文注释：passion, lust, longing for 
        汉语注释：迫切地希望；殷切盼望。
        例句：李梅对巧克力的美味有一种极度的渴望。  
        
        <b>4确信  (convinced)</b>
        英文注释：certain, absolutely positive 
        汉语注释：确实地相信;坚定地相信；确切的消息。
        例句：张强确信他已经作出了正确的决定。        
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/4.png',
        items: ['玩笑', '坚持', '愉悦', '放松'],
        desc: `<b>1玩笑  (joking)</b>
        英文注释：being funny, playful 
        汉语注释：玩耍嬉笑的言语、行动；玩耍嬉笑。
        例句：王强喜欢和他的朋友们开玩笑。  
        
        <b>2坚持  (insisting)</b> 
        英文注释：demanding, persisting, maintaining 
        汉语注释：坚决保持住或进行下去。
        例句：工作结束后，李博坚持要请大家吃饭。   
        
        <b>3愉悦  (amused)</b>
        英文注释：finding something funny 
        汉语注释：欢乐；喜悦。
        例句：昨天，我听到一个非常愉悦的笑话。  
        
        <b>4放松  (relaxed)</b> 
        英文注释：taking it easy, calm, carefree
        汉语注释：控制或注意力由紧变松而松驰，松懈或轻松。
        例句：放假时，张亮心情愉快，身心都处于放松的状态。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/5.png',
        items: ['恼怒', '刻薄', '担心', '友好'],
        desc: `<b>1恼怒  (irritated)</b>
        英文注释：exasperated, annoyed 
        汉语注释：生气；愤怒。
        例句：李丽收到很多垃圾邮件，恼怒不已。  
        
        <b>2刻薄  (sarcastic)</b>
        英文注释：cynical, mocking, scornful 
        汉语大辞典注释：待人处事挑剔、无情；克扣。
        例句：每当同组的成员出了一点儿小错误，李明就会刻薄地挖苦他。   
        
        <b>3担心  (worried)</b>
        英文注释：anxious, fretful, troubled
        汉语注释：心中有顾虑；不放心。
        例句：她在停车场找不到自己的车了，开始担心自己的车是不是被偷了。  
        
        <b>4友好  (friendly)</b>
        英文注释：sociable, amiable 
        汉语注释：好友；亲近友善。
        例句：女孩友好地给那些旅行者指了去往镇中心的路。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/6.png',
        items: ['惊恐', '幻想', '急躁', '惊慌'],
        desc: `<b>1惊恐  (aghast)</b>
        英文注释：horrified, astonished, alarmed 
        汉语注释：惊慌害怕。
        例句：王欢惊恐地发现自己家里被打劫了。  
        
        <b>2幻想  (fantasizing)</b> 
        英文注释：daydreaming 
        汉语注释：虚而不实的思想；没有道理的想象;无根据的看法或信念；以理想或愿望为依据，对还没有实现的事物有所想象。
        例句：张娜幻想自己成为了一个著名的电影明星。   
        
        <b>3急躁  (impatient)</b>
        英文注释：restless, wanting something to happen soon 
        汉语注释：碰到不称心的事情易于激动；想赶快达到目的，不经仔细考虑或准备就行动。
        例句：张雪等待她男友将近20分钟，她慢慢地变得急躁起来。  
        
        <b>4惊慌  (alarmed)</b>
        英文注释：fearful, worried, filled with anxiety 
        汉语注释：惊恐慌乱。
        例句：当发现自己被陌生人尾随了，小红显得惊慌万分。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/7.png',
        items: ['歉意', '友好', '不安', '沮丧'],
        desc: `<b>1歉意  (apologetic)</b>
        英文注释：feeling sorry 
        汉语注释：心有愧疚不安，对不住别人；请求原谅,对不起。
        例句：服务员将汤洒在了顾客的身上，他深感歉意。
        
        <b>2友好  (friendly)</b>
        英文注释：sociable, amiable 
        汉语注释：好友；亲近友善。
        例句：女孩友好的给那些旅行者指了去往镇中心的路。   
        
        <b>3不安  (uneasy)</b>
        英文注释：unsettled, apprehensive, troubled
        汉语注释：不安宁的；感到烦恼、不宁或不祥之兆的；客套话。表达歉意和感激。
        例句：之前只有一面之缘的神秘男人送了张霞一份礼物，她感到有点不安。 
        
        <b>4沮丧  (dispirited)</b>
        英文注释：glum, miserable, low
        汉语大辞典注释：灰心失望；失色貌。
        例句：李翔因为没有通过这次考试而沮丧。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/8.png',
        items: ['绝望', '轻松', '害羞', '兴奋'],
        desc: `<b>1绝望  (despondent)</b>
        英文注释：gloomy, despairing, without hope
        汉语注释：断绝希望；毫无希望。
        例句：在得知自己没有得到那份他想要的工作后，赵志感到很绝望。 
        
        <b>2轻松  (relieved)</b>
        英文注释：freed from worry or anxiety 
        汉语注释：不感到有负担、不紧张。
        例句：在机场，王刚发现他并没有忘记带自己的身份证件，如释重负，整个人变得轻松起来。    
        
        <b>3害羞（shy）</b>  
        英文注释：nervous and embarrassed about meeting and speaking to other people
        汉语注释：感到不好意思；难为情。
        例句：房间里的人都在看新娘。她很大方，一点也没有害羞的样子。
        
        <b>4兴奋（excited）</b>
        英文注释：happy, interested, or hopeful because something good has happened or will happen
        汉语注释：感情因受刺激而冲动 
        例句：在电影中看到我们的工作，我们感到非常兴奋。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/9.png',
        items: ['懊恼', '敌意', '惊骇', '忧虑'],
        desc: `<b>1懊恼  (annoyed)</b> 
        英文注释：irritated, displeased
        汉语注释：烦恼；懊悔。
        例句：李强发现自己错过了最后一班回家的公交车，十分懊恼。  
        
        <b>2敌意  (hostile)</b>
        英文注释：unfriendly 
        汉语注释：敌视的心理。
        例句：两位街坊邻居都认为对方的音响的声音开得太大了，彼此互相充满了敌意。   
        
        <b>3惊骇  (horrified)</b>
        英文注释：terrified, appalled 
        汉语注释：恐慌、恐惧。
        例句：他惊骇地发现新婚妻子原来是重婚。  
        
        <b>4忧虑  (preoccupied)</b>
        英文注释：absorbed, engrossed in one's own thoughts 
        汉语注释：忧愁思虑。
        例句：在工作中，戴林满脑子都在忧虑她母亲目前的病情。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/10.png',
        items: ['谨慎', '坚持', '无聊', '惊恐'],
        desc: `<b>1谨慎  (cautious)</b>
        英文注释：careful, wary 
        汉语注释：细心慎重；指认为自己的看法有所根据,但还有所保留。
        例句：与陌生人交谈时，李红总是很谨慎。  
        
        <b>2坚持  (insisting)</b> 
        英文注释：demanding, persisting, maintaining 
        汉语注释：坚决保持住或进行下去。
        例句：工作结束后，李博坚持要请大家吃饭。   
        
        <b>3无聊（bored）</b>
        英文注释：in extreme depression
        汉语注释：郁闷，精神空虚；没有意义而令人生厌。
        例句：这些话真无聊。  
        
        <b>4惊恐  (aghast)</b>
        英文注释：horrified, astonished, alarmed 
        汉语注释：惊慌害怕。
        例句：王欢惊恐地发现自己家里被打劫了。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/11.png',
        items: ['恐惧', '愉悦', '后悔', '轻浮'],
        desc: `<b>1恐惧  (terrified)</b>
        英文注释：alarmed, fearful 
        汉语注释：畏惧，害怕。
        例句：李海认为自己看到了鬼怪，他非常恐惧。  
        
        <b>2愉悦  (amused)</b>
        英文注释：finding something funny 
        汉语注释：欢乐；喜悦。
        例句：昨天，我听到一个非常愉悦的笑话。   
        
        <b>3后悔  (regretful)</b>
        英文注释：sorry 
        汉语注释：为了过去的作为或为了没有做到的事而感到懊悔。
        例句：李明总是后悔年轻的时候没有出去旅游过。  
        
        <b>4轻浮  (flirtatious)</b>
        英文注释：brazen, saucy, teasing, playful 
        汉语注释：轻率浮躁；言语举止随便,不稳重；不庄重；轻佻的；指茶味不同凡响。
        例句：李妮在聚会上频繁地向陌生人抛媚眼，大家都觉得她很轻浮。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/12.png',
        items: ['中立', '尴尬', '疑心', '沮丧'],
        desc: `<b>1中立  (indifferent)</b> 
        英文注释：disinterested, unresponsive, don't care
        汉语注释：处于对立的双方之间,不倾向或偏袒一方；独立。
        例句：朋友们建议去看电影或者去酒吧，张伟表示无所谓，保持中立。  
        
        <b>2尴尬  (embarrassed)</b>
        英文注释：ashamed 
        汉语注释：处于两难境地无法摆脱；行为、态度不正常的。
        例句：李静感到非常尴尬，因为她在晨会上忘记了同事的名字。   
        
        <b>3疑心  (sceptical)</b>
        英文注释：doubtful, suspicious, mistrusting
        汉语注释：猜疑之心；推测；猜测。
        例句：算命先生说可以解读他的命运，张强疑心这个说法。  
        
        <b>4沮丧  (dispirited)</b>
        英文注释：glum, miserable, low
        汉语大辞典注释：灰心失望；失色貌。
        例句：李翔因为没有通过这次考试而沮丧。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/13.png',
        items: ['果断', '期待', '威胁', '害羞'],
        desc: `<b>1果断  (decisive)</b>
        英文注释：already made your mind up 
        汉语注释：有决断，不犹豫。
        例句：李丽果断地走进了投票站。  
        
        <b>2期待  (anticipating)</b>
        英文注释：expecting 
        汉语注释：期盼；等待。
        例句：足球赛刚开始，球迷们都期待着一次快速的进球。   
        
        <b>3威胁（threaten）</b> 
        英文注释：pose a threat to; present a danger to
        汉语释义：威逼胁迫。用威力使人服从。
        例句：他们威胁要烧毁我们的房子。
        
        <b>4害羞（shy）</b>  
        英文注释：nervous and embarrassed about meeting and speaking to other people
        汉语注释：感到不好意思；难为情。
        例句：房间里的人都在看新娘。她很大方，一点也没有害羞的样子。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/14.png',
        items: ['恼怒', '失望', '郁闷', '谴责'],
        desc: `<b>1恼怒  (irritated)</b>
        英文注释：exasperated, annoyed 
        汉语注释：生气；愤怒。
        例句：李丽收到很多垃圾邮件，恼怒不已。  
        
        <b>2失望  (disappointed)</b>
        英文注释：displeased, disgruntled 
        汉语注释：丧失信心；希望没能实现；希望未实现而不愉快。
        例句：因为自己支持的球队没有赢得比赛，中国队的球迷们很失望。   
        
        <b>3郁闷  (depressed)</b>
        英文注释：miserable 
        汉语大辞典注释：愁眉不展的性质或状态；迟钝和无兴趣状态。
        例句：张强感到郁闷，因为在生日那天他连一张生日卡都没有收到。  
        
        <b>4谴责  (accusing)</b>
        英文注释：blaming
        汉语注释：斥责;责备
        例句：警察谴责偷钱包的人。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/15.png',
        items: ['沉思', '慌张', '鼓励', '愉悦'],
        desc: `<b>1沉思  (contemplative)</b>
        英文注释：reflective, thoughtful, considering 
        汉语注释：深思。
        例句：张教授在他60岁寿诞前夕，感慨万千，陷入了沉思。 
        
        <b>2慌张  (flustered)</b>
        英文注释：confused, nervous and upset 
        汉语注释：恐惧、不沉着而急切忙乱。
        例句：在开会时，徐丽不仅迟到了，还忘记了一个重要文件，她感到很慌张。   
        
        <b>3鼓励  (encouraging)</b>
        英文注释：hopeful, heartening, supporting 
        汉语注释：鼓动激励,勉人向上。
        例句：所有的家长都鼓励孩子在学校里多运动。  
        
        <b>4愉悦  (amused)</b>
        英文注释：finding something funny 
        汉语注释：欢乐；喜悦。
        例句：昨天，我听到一个非常愉悦的笑话。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/16.png',
        items: ['恼怒', '深思', '鼓励', '同情'],
        desc: `<b>1恼怒  (irritated)</b>
        英文注释：exasperated, annoyed 
        汉语注释：生气；愤怒。
        例句：李丽收到很多垃圾邮件，恼怒不已。  
        
        <b>2深思  (thoughtful)</b> 
        英文注释：thinking about something
        汉语注释：认真思考，深入考虑。
        例句：黄路反复深思自己是不是应该和现在的女友分手。   
        
        <b>3鼓励  (encouraging)</b>
        英文注释：hopeful, heartening, supporting 
        汉语注释：鼓动激励,勉人向上。
        例句：所有的家长都鼓励孩子在学校里多运动。  
        
        <b>4同情  (sympathetic)</b> 
        英文注释：kind, compassionate
        汉语注释：在感情上对别人的遭遇产生共鸣；同一性质；实质相同；同心，一心；同谋；亦指同谋者，同伙。
        例句：当护士告诉病人坏消息的时候，脸上呈现出同情的表情。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/17.png',
        items: ['怀疑', '深情', '快乐', '惊恐'],
        desc: `<b>1怀疑  (doubtful)</b>
        英文注释：dubious, suspicious, not really believing
        汉语注释：心中存疑。
        例句：张芳怀疑自己的儿子在说谎。  
        
        <b>2深情  (affectionate)</b>
        英文注释：showing fondness towards someone
        汉语注释：深长悠厚的情感；怀有深厚感情。
        例句：大多数母亲通过亲吻和拥抱，来表达她们对孩子深情的关爱。   
        
        <b>3快乐  (playful)</b>  
        英文注释：full of high spirits and fun 
        汉语大辞典注释：欢乐。指感到高兴或满意。
        例句：曹晶在生日聚会上感到非常快乐。  
        
        <b>4惊恐  (aghast)</b>
        英文注释：horrified, astonished, alarmed 
        汉语注释：惊慌害怕。
        例句：王欢惊恐地发现自己家里被打劫了。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/18.png',
        items: ['果断', '愉悦', '惊恐', '无聊'],
        desc: `<b>1果断  (decisive)</b>
        英文注释：already made your mind up 
        汉语注释：有决断，不犹豫。
        例句：李丽果断地走进了投票站。  
        
        <b>2愉悦  (amused)</b>
        英文注释：finding something funny 
        汉语注释：欢乐；喜悦。
        例句：昨天，我听到一个非常愉悦的笑话。   
        
        <b>3惊恐  (aghast)</b>
        英文注释：horrified, astonished, alarmed 
        汉语注释：惊慌害怕。
        例句：王欢惊恐地发现自己家里被打劫了。  
        
        <b>4无聊（bored）</b>
        英文注释：in extreme depression
        汉语注释：郁闷，精神空虚；没有意义而令人生厌。
        例句：这些话真无聊。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/19.png',
        items: ['自大', '感激', '刻薄', '踌躇'],
        desc: `<b>1自大  (arrogant)</b>
        英文注释：conceited, self-important, having a big opinion of oneself
        汉语注释：自以为了不起；把自己的地位作用等看得很重要的，夸大自己的价值的。
        例句：那个自大的人认为自己是这屋子里最懂政治的。  
        
        <b>2感激  (grateful)</b>
        英文注释：thankful 
        汉语注释：因为别人的好意或帮助而对他有好感；对于施恩者怀有热烈友好的感情，促使人去报答恩情；感动奋发。
        例句：王云非常感激那个帮助她的陌生人。  
        
        <b>3刻薄  (sarcastic)</b>
        英文注释：cynical, mocking, scornful 
        汉语大辞典注释：待人处事挑剔、无情；克扣。
        例句：每当同组的成员出了一点儿小错误，李明就会刻薄地挖苦他。  
        
        <b>4踌躇  (tentative)</b>
        英文注释：hesitant, uncertain, cautious 
        汉语注释：犹豫不决；思量，考虑；停留;徘徊不前；得意的样子；痛心；心情不愉快。
        例句：进入一间满是陌生人的房间里，李明有一点踌躇。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/20.png',
        items: ['主导', '友好', '愧疚', '惊骇'],
        desc: `<b>1主导  (dominant)</b>
        英文注释：commanding, bossy
        汉语注释：统领全局;推动全局发展；引导全局并推动全局发展的事物。
        例句：当连长在巡查新兵营的时候，他给人一种主导一切的感觉。  
        
        <b>2友好  (friendly)</b>
        英文注释：sociable, amiable 
        汉语注释：好友；亲近友善。
        例句：女孩友好地给那些旅行者指了去往镇中心的路。  
        
        <b>3愧疚  (guilty)</b>
        英文注释：feeling sorry for doing something wrong 
        汉语注释：惭愧内疚。
        例句：张华对自己的婚外情感到很愧疚。  
        
        <b>4惊骇  (horrified)</b>
        英文注释：terrified, appalled 
        汉语注释：恐慌、恐惧。
        例句：他惊骇地发现新婚妻子原来是重婚。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/21.png',
        items: ['尴尬', '幻想', '迷惑', '恐慌'],
        desc: `<b>1尴尬  (embarrassed)</b>
        英文注释：ashamed 
        汉语注释：处于两难境地无法摆脱；行为、态度不正常的。
        例句：李静感到非常尴尬，因为她在晨会上忘记了同事的名字。  
        
        <b>2幻想  (fantasizing)</b> 
        英文注释：daydreaming 
        汉语注释：虚而不实的思想；没有道理的想象;无根据的看法或信念；以理想或愿望为依据，对还没有实现的事物有所想象。
        例句：张娜幻想自己成为了一个著名的电影明星。  
        
        <b>3迷惑  (confused)</b>
        英文注释：puzzled, perplexed 
        汉语注释：使人迷乱；心神迷乱,辨不清是非。
        例句：虽然有张地图，但莉莉仍然对地图上的复杂标识有点迷惑，最后还是迷路了。  
        
        <b>4恐慌  (panicked)</b>
        英文注释：distraught, feeling of terror or anxiety
        汉语注释：恐惧惊慌。
        例句：发觉熊熊大火已经包围房子的时候，整家人都恐慌起来。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/22.png',
        items: ['忧虑', '感激', '坚持', '恳求'],
        desc: `<b>1忧虑  (preoccupied)</b>
        英文注释：absorbed, engrossed in one's own thoughts 
        汉语注释：忧愁思虑。
        例句：在工作中，戴林满脑子都在忧虑她母亲目前的病情。  
        
        <b>2感激  (grateful)</b>
        英文注释：thankful 
        汉语注释：因为别人的好意或帮助而对他有好感；对于施恩者怀有热烈友好的感情，促使人去报答恩情；感动奋发。
        例句：王云非常感激那个帮助她的陌生人。  
        
        <b>3坚持  (insisting)</b> 
        英文注释：demanding, persisting, maintaining 
        汉语注释：坚决保持住或进行下去。
        例句：工作结束后，李博坚持要请大家吃饭。   
        
        <b>4恳求  (imploring)</b>
        英文注释：begging, pleading 
        汉语注释：恳切地请求。
        例句：李莉恳求地看着他老爸，请求她老爸允许她出去和同学玩一会儿。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/23.png',
        items: ['满足', '歉意', '挑衅', '好奇'],
        desc: `<b>1满足  (contented)</b>
        英文注释：satisfied 
        汉语注释：对已得到的感到足够了；完全满意于一项欲望、渴念、需要或者要求的实现。
        例句：酒足饭饱之后，李磊感到很满足。  
        
        <b>2歉意  (apologetic)</b>
        英文注释：feeling sorry 
        汉语注释：心有愧疚不安，对不住别人；请求原谅,对不起。
        例句：服务员将汤洒在了顾客的身上，他深感歉意。  
        
        <b>3挑衅  (defiant)</b>
        英文注释：insolent, bold, don’t care what anyone else thinks
        汉语注释：寻衅生事，蓄意引起争斗。
        例句：即使被送进监狱，抗议者们仍然摆出挑衅的姿态。   
        
        <b>4好奇  (curious)</b>
        英文注释：inquisitive, inquiring, prying
        汉语注释：流露或显示出好奇的(尤指对他人之事)</b>；对还不了解的新鲜事物有兴趣的。
        例句：王刚非常好奇那个奇形怪状的包裹里到底有什么。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/24.png',
        items: ['忧思', '恼怒', '兴奋', '敌意'],
        desc: `<b>1忧思  (pensive)</b>
        英文注释：thinking about something slightly worrying 
        汉语注释：忧虑；忧虑的心绪。
        例句：第一次去见她男友父母，途中，孙玲忧思不已。 
        
        <b>2恼怒  (irritated)</b>
        英文注释：exasperated, annoyed 
        汉语注释：生气；愤怒。
        例句：李丽收到很多垃圾邮件，恼怒不已。  
        
        <b>3兴奋（excited）</b>
        英文注释：happy, interested, or hopeful because something good has happened or will happen
        汉语注释：感情因受刺激而冲动 
        例句：在电影中看到我们的工作，我们感到非常兴奋。   
        
        <b>4敌意  (hostile)</b>
        英文注释：unfriendly 
        汉语注释：敌视的心理。
        例句：两位街坊邻居都认为对方的音响的声音开得太大了，彼此互相充满了敌意。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/25.png',
        items: ['恐慌', '疑虑', '绝望', '有趣'],
        desc: `<b>1恐慌  (panicked)</b>
        英文注释：distraught, feeling of terror or anxiety
        汉语注释：恐惧惊慌。
        例句：发觉熊熊大火已经包围房子的时候，整家人都恐慌起来。  
        
        <b>2疑虑  (incredulous)</b> 
        英文注释：not believing 
        汉语注释：怀疑顾虑。
        例句：张龙得知自己中了彩票大奖后，仍然心存疑虑，怀疑这是假的。  
        
        <b>3绝望  (despondent)</b>
        英文注释：gloomy, despairing, without hope
        汉语注释：断绝希望；毫无希望。
        例句：在得知自己没有得到那份他想要的工作后，赵志感到很绝望。 
        
        <b>4有趣  (interested)</b> 
        英文注释：inquiring, curious 
        汉语注释：有兴味,有趣味。
        例句：看完《侏罗纪公园》这部电影后，郭宏觉得恐龙很有趣。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/26.png',
        items: ['惊慌', '害羞', '敌意', '焦虑'],
        desc: `<b>1惊慌  (alarmed)</b>
        英文注释：fearful, worried, filled with anxiety 
        汉语注释：惊恐慌乱。
        例句：当发现自己被陌生人尾随了，小红显得惊慌万分。  
        
        <b>2害羞（shy）</b>  
        英文注释：nervous and embarrassed about meeting and speaking to other people
        汉语注释：感到不好意思；难为情。
        例句：房间里的人都在看新娘。她很大方，一点也没有害羞的样子。  
        
        <b>3敌意  (hostile)</b>
        英文注释：unfriendly 
        汉语注释：敌视的心理。
        例句：两位街坊邻居都认为对方的音响的声音开得太大了，彼此互相充满了敌意。   
        
        <b>4焦虑  (anxious)</b>
        英文注释：worried, tense, uneasy 
        汉语注释： (心情)</b>焦愁忧虑。
        例句：在期末考试前，这名学生显得很焦虑。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/27.png',
        items: ['玩笑', '谨慎', '自大', '安心'],
        desc: `<b>1玩笑  (joking)</b>
        英文注释：being funny, playful 
        汉语注释：玩耍嬉笑的言语、行动；玩耍嬉笑。
        例句：王强喜欢和他的朋友们开玩笑。  
        
        <b>2谨慎  (cautious)</b>
        英文注释：careful, wary 
        汉语注释：细心慎重；指认为自己的看法有所根据,但还有所保留。
        例句：与陌生人交谈时，李红总是很谨慎。  
        
        <b>3自大  (arrogant)</b>
        英文注释：conceited, self-important, having a big opinion of oneself
        汉语注释：自以为了不起；把自己的地位作用等看得很重要的，夸大自己的价值的。
        例句：那个自大的人认为自己是这屋子里最懂政治的。   
        
        <b>4安心  (reassuring)</b>
        英文注释：supporting, encouraging, giving someone confidence
        汉语注释：放心；心情安定。
        例句：张亮信誓旦旦地告诉妻子这件新衣服非常合身，让她安心地买下来。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/28.png',
        items: ['有趣', '玩笑', '深情', '满足'],
        desc: `<b>1有趣  (interested)</b> 
        英文注释：inquiring, curious 
        汉语注释：有兴味,有趣味。
        例句：看完《侏罗纪公园》这部电影后，郭宏觉得恐龙很有趣。  
        
        <b>2玩笑  (joking)</b>
        英文注释：being funny, playful 
        汉语注释：玩耍嬉笑的言语、行动；玩耍嬉笑。
        例句：王强喜欢和他的朋友们开玩笑。  
        
        <b>3深情  (affectionate)</b>
        英文注释：showing fondness towards someone
        汉语注释：深长悠厚的情感；怀有深厚感情。
        例句：大多数母亲通过亲吻和拥抱，来表达她们对孩子深情的关爱。   
        
        <b>4满足  (contented)</b>
        英文注释：satisfied 
        汉语注释：对已得到的感到足够了；完全满意于一项欲望、渴念、需要或者要求的实现。
        例句：酒足饭饱之后，李磊感到很满足。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/29.png',
        items: ['急躁', '惊恐', '恼怒', '反思'],
        desc: `<b>1急躁  (impatient)</b>
        英文注释：restless, wanting something to happen soon 
        汉语注释：碰到不称心的事情易于激动；想赶快达到目的，不经仔细考虑或准备就行动。
        例句：张雪等待她男友将近20分钟，她慢慢地变得急躁起来。  
        
        <b>2惊恐  (aghast)</b>
        英文注释：horrified, astonished, alarmed 
        汉语注释：惊慌害怕。
        例句：王欢惊恐地发现自己家里被打劫了。  
        
        <b>3恼怒  (irritated)</b>
        英文注释：exasperated, annoyed 
        汉语注释：生气；愤怒。
        例句：李丽收到很多垃圾邮件，恼怒不已。   
        
        <b>4反思  (reflective)</b>
        英文注释：contemplative, thoughtful 
        汉语注释：回头、反过来思考的意思。
        例句：李磊深深地反思，想着刚才做的事对他妻子究竟意味着什么。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/30.png',
        items: ['感激', '轻浮', '敌意', '绝望'],
        desc: `<b>1感激  (grateful)</b>
        英文注释：thankful 
        汉语注释：因为别人的好意或帮助而对他有好感；对于施恩者怀有热烈友好的感情，促使人去报答恩情；感动奋发。
        例句：王云非常感激那个帮助她的陌生人。  
        
        <b>2轻浮  (flirtatious)</b>
        英文注释：brazen, saucy, teasing, playful 
        汉语注释：轻率浮躁；言语举止随便,不稳重；不庄重；轻佻的；指茶味不同凡响。
        例句：李妮在聚会上频繁地向陌生人抛媚眼，大家都觉得她很轻浮。  
        
        <b>3敌意  (hostile)</b>
        英文注释：unfriendly 
        汉语注释：敌视的心理。
        例句：两位街坊邻居都认为对方的音响的声音开得太大了，彼此互相充满了敌意。  
        
        <b>4绝望  (despondent)</b>
        英文注释：gloomy, despairing, without hope
        汉语注释：断绝希望；毫无希望。
        例句：在得知自己没有得到那份他想要的工作后，赵志感到很绝望。 
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/31.png',
        items: ['羞愧', '自信', '玩笑', '沮丧'],
        desc: `<b>1羞愧  (ashamed)</b>
        英文注释：overcome with shame or guilt 
        汉语注释：自卑，惭愧。
        例句：男孩从钱包里偷钱被妈妈发现了，他十分羞愧。  
        
        <b>2自信  (confident)</b>
        英文注释：self-assured, believing in oneself 
        汉语注释：相信自己;相信自己的。
        例句：运动员张猛非常自信自己会在比赛中获胜。  
        
        <b>3玩笑  (joking)</b>
        英文注释：being funny, playful 
        汉语注释：玩耍嬉笑的言语、行动；玩耍嬉笑。
        例句：王强喜欢和他的朋友们开玩笑。   
        
        <b>4沮丧  (dispirited)</b>
        英文注释：glum, miserable, low
        汉语大辞典注释：灰心失望；失色貌。
        例句：李翔因为没有通过这次考试而沮丧。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/32.png',
        items: ['严肃', '羞愧', '无措', '惊慌'],
        desc: `<b>1严肃  (serious)</b>
        英文注释：solemn, grave 
        汉语注释：令人敬畏；认真；使严格。
        例句：银行经理严肃地拒绝李翔再一次透支。  
        
        <b>2羞愧  (ashamed)</b>
        英文注释：overcome with shame or guilt 
        汉语注释：自卑，惭愧。
        例句：男孩从钱包里偷钱被妈妈发现了，他十分羞愧。  
        
        <b>3无措  (bewildered)</b>
        英文注释：utterly confused, puzzled, dazed 
        汉语注释：无法对付；不知如何应付。
        例句：第一次来到大城市，孩子感到很无措。   
        
        <b>4惊慌  (alarmed)</b>
        英文注释：fearful, worried, filled with anxiety 
        汉语注释：惊恐慌乱。
        例句：当发现自己被陌生人尾随了，小红显得惊慌万分。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/33.png',
        items: ['尴尬', '愧疚', '幻想', '关切'],
        desc: `<b>1尴尬  (embarrassed)</b>
        英文注释：ashamed 
        汉语注释：处于两难境地无法摆脱；行为、态度不正常的。
        例句：李静感到非常尴尬，因为她在晨会上忘记了同事的名字。  
        
        <b>2愧疚  (guilty)</b>
        英文注释：feeling sorry for doing something wrong 
        汉语注释：惭愧内疚。
        例句：张华对自己的婚外情感到很愧疚。  
        
        <b>3幻想  (fantasizing)</b> 
        英文注释：daydreaming 
        汉语注释：虚而不实的思想；没有道理的想象;无根据的看法或信念；以理想或愿望为依据，对还没有实现的事物有所想象。
        例句：张娜幻想自己成为了一个著名的电影明星。   
        
        <b>4关切  (concerned)</b>
        英文注释：worried, troubled
        汉语注释：关心。
        例句：医生很关切病人病情的变化。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/34.png',
        items: ['惊恐', '困惑', '警惕', '恐惧'],
        desc: `<b>1惊恐  (aghast)</b>
        英文注释：horrified, astonished, alarmed 
        汉语注释：惊慌害怕。
        例句：王欢惊恐地发现自己家里被打劫了。  
        
        <b>2困惑  (baffled)</b>
        英文注释：confused, puzzled, dumbfounded 
        汉语注释：感到疑难，不知所措。
        例句：在这场谋杀案中，侦探们对这些相互矛盾的证据感到非常困惑。  
        
        <b>3警惕  (distrustful)</b>
        英文注释：suspicious, doubtful, wary 
        汉语注释：对可能发生的危险等保持警觉。
        例句：独居的老奶奶对门外的陌生人很警惕。   
        
        <b>4恐惧  (terrified)</b>
        英文注释：alarmed, fearful 
        汉语注释：畏惧，害怕。
        例句：李海认为自己看到了鬼怪，他非常恐惧。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/35.png',
        items: ['茫然', '紧张', '坚持', '沉思'],
        desc: `<b>1茫然  (puzzled)</b>
        英文注释：perplexed, bewildered, confused
        汉语注释：模糊不清的样子；失意的样子。
        例句：做填字游戏已经做了一个小时了，对于其中一条线索，张雪仍然感到很茫然，无法做答。  
        
        <b>2紧张  (nervous)</b>
        英文注释：apprehensive, tense, worried 
        汉语注释：精神处于高度准备状态；激烈;紧迫；供应不充分，难于应付。
        例句：面试开始前，李薇紧张得坐立不安。  
        
        <b>3坚持  (insisting)</b> 
        英文注释：demanding, persisting, maintaining 
        汉语注释：坚决保持住或进行下去。
        例句：工作结束后，李博坚持要请大家吃饭。   
        
        <b>4沉思  (contemplative)</b>
        英文注释：reflective, thoughtful, considering 
        汉语注释：深思。
        例句：张教授在他60岁寿诞前夕，感慨万千，陷入了沉思。
        `
    },
    {
        url: 'https://qiniu1.anlint.com/an/img/36.png',
        items: ['羞愧', '紧张', '多疑', '犹豫'],
        desc: `<b>1羞愧  (ashamed)</b>
        英文注释：overcome with shame or guilt 
        汉语注释：自卑，惭愧。
        例句：男孩从钱包里偷钱被妈妈发现了，他十分羞愧。  
        
        <b>2紧张  (nervous)</b>
        英文注释：apprehensive, tense, worried 
        汉语注释：精神处于高度准备状态；激烈;紧迫；供应不充分，难于应付。
        例句：面试开始前，李薇紧张得坐立不安。  
        
        <b>3多疑  (suspicious)</b>
        英文注释：disbelieving, suspecting, doubting
        汉语注释：疑心太重，好怀疑。
        例句：周勤在工作期间丢了两次钱包后，就变得多疑起来，怀疑这是他同事所为。   
        
        <b>4犹豫  (indecisive)</b> 
        英文注释：unsure, hesitant, unable to make your mind up
        汉语注释：犹移；迟疑不决。
        例句：方瑜正在犹豫午饭该吃什么。
        `
    }
]

export enum SheetType {
    log = 'log',
    result = 'result'
}

export interface IAnwserLog {
    seatNumber: number,
    emotion: number,
    gender: GENDER,
    time: number
}

export interface IResult {
    seatNumber: number,
    emotionNum: number,
    genderNum: number,
    point: number
}
