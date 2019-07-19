import settings from "../settings";

// 实验config文件
export default {
  EgretDoubleAuction: {
    img: `${settings.rootname}/static/sxpm_p.png`,
    name: "双向拍卖",
    nameEn: "Double Auction",
    coverImg: `${settings.rootname}/static/double_auction_cover.png`,
    desc:
      "按照买卖双方交易人数的不同，拍卖可以分为单向拍卖和双向拍卖。传统的英式拍卖、荷式拍卖、封标第一价格和封标第二价格属于单向拍卖的范畴，因为这些拍卖中至少有一方的交易人数为“1”，该方掌握着市场中的稀缺资源，称为“资源优势方”；而最终的成交价格是由人数多的一方共同决定的，称为“信息优势方”。而双向拍卖市场是“多对多”的结构，即买方和卖方都不止一个，该市场中买卖双方的关系也从单向拍卖中的“信息优势方”或“资源优势”方，转变为一种平等的供给和需求关系。"
  },
  ParallelApplication: {
    img: `${settings.rootname}/static/pxzy_p.png`,
    name: "平行志愿",
    nameEn: "Parallel Application",
    coverImg: `${settings.rootname}/static/parallel_application_cover.png`,
    desc:
      "平行志愿是高考志愿的一种新的投档录取模式。所谓平行志愿，即一个志愿中包含若干所平行的院校。是指考生在填报高考志愿时，可在指定的批次同时填报若干个平行院校志愿。录取时，按照“分数优先，遵循志愿”的原则进行投档，对同一科类分数线上未被录取的考生按总分从高到低排序进行一次性投档，即所有考生排一个队列，高分者优先投档。每个考生投档时，根据考生所填报的院校顺序，投档到排序在前且有计划余额的院校。"
  }
};
