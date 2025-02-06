import ID_TO_NAME from "@/data/id_to_name.CHS.json";
import 常驻 from "./常驻.json";

/**
 * @param {number} last4star 上一个4星(绝区零的A级)
 * @param {number} last5star 上一个5星(绝区零的S级)
 * @param {number} rank 等级
 * @param {number} gachaType 卡池类型
 *
 * @returns {number} 卡池中对应等级的概率，单位：千分之一
 */
const getProbability = (rank, gachaType, last4star, last5star) => {
  if ([300, 301, 400].includes(gachaType)) {
    let star5 = 0;
    if (rank === 5) {
      star5 = last5star > 73 ? 6 + 60 * (last5star - 73) : 6;
      // console.log("getProbability", star5, last4star, last5star);
      return star5;
    }
    let star4 = 0;
    if (rank === 4) {
      star4 = last4star >= 9 ? 1000 : 53;
      return star4;
    }
    if (rank === 3) {
      return 1000 - star4 - star5;
    }
    throw new Error("Invalid rank");
  }
  if (gachaType === "80") {
    let star5 = 0;
    if (rank === 5) {
      star5 = last5star > 65 ? 7 + 70 * (last5star - 65) : 7;
      return star5;
    }
    let star4 = 0;
    if (rank === 4) {
      star4 = last4star >= 10 ? 1000 : 53;
      return star4;
    }
    if (rank === 3) {
      return 1000 - star4 - star5;
    }
    throw new Error("Invalid rank");
  }
};

const getNextRank = (gachaType, last4star, last5star) => {
  const randomNumber = Math.floor(Math.random() * 1000);
  if ([300, 301, 400].includes(gachaType)) {
    if (randomNumber < getProbability(5, gachaType, last4star, last5star)) {
      return 5;
    } else if (
      randomNumber < getProbability(4, gachaType, last4star, last5star)
    ) {
      return 4;
    } else {
      return 3;
    }
  }
};

const getNextItem = (gachaType, last4star, last5star, banner) => {
  const rank = getNextRank(gachaType, last4star, last5star);
  const { star5, star4 } = banner;
  if (rank === 5) {
    return {
      rank: 5,
      name:
        Math.random() >= 0.5
          ? ID_TO_NAME[star5[Math.floor(Math.random() * star5.length)]]
          : ID_TO_NAME[
              常驻.star5.character[Math.floor(Math.random() * 常驻.star5.length)]
            ],
    };
  } else if (rank === 4) {
    return {
      rank: 4,
      name:
        Math.random() >= 0.5
          ? ID_TO_NAME[star4[Math.floor(Math.random() * star4.length)]]
          : ID_TO_NAME[
              常驻.star4[Math.floor(Math.random() * 常驻.star4.length)]
            ],
    };
  } else {
    return {
      rank: 3,
      name: ID_TO_NAME[
        常驻.star3[Math.floor(Math.random() * 常驻.star3.length)]
      ],
    };
  }
};

export class Simulator {
  /**
   * @param {Number} banner 卡池信息
   */
  constructor(banner) {
    console.log(banner);
    this.banner = banner;
    this.type = banner.type;
    this.last4star = 0;
    this.last5star = 0;
    this.star4 = 0;
    this.star5 = 0;
    this.history = [];
  }

  /**
   *
   * @param {Number} number 抽数
   */
  simulate(number) {
    this.new = [];
    for (let i = 0; i < number; i++) {
      const item = getNextItem(
        this.type,
        this.last4star,
        this.last5star,
        this.banner
      );
      if (item.rank == 5) this.star5++;
      if (item.rank == 4) this.star4++;
      this.new.push({
        ...item,
        last4star: this.last4star,
        last5star: this.last5star,
      });
      this.last5star++;
      this.last4star++;
      if (item.rank == 5) this.last5star = 0;
      if (item.rank == 4) this.last4star = 0;
    }
    this.history.push(...this.new);
    return {
      newHistory: this.new,
      star5: this.star5,
      star4: this.star4,
    };
  }

  getHistory() {
    return this.history;
  }

  clearHistory() {
    this.history = [];
  }
}
