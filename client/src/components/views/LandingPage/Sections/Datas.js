const continents = [
  {
    _id: 1,
    name: "디지털기기",
  },
  {
    _id: 2,
    name: "생활가전",
  },
  {
    _id: 3,
    name: "가구/인테리어",
  },
  {
    _id: 4,
    name: "생활/가공식품",
  },
  {
    _id: 5,
    name: "도서/티켓/음반",
  },
  {
    _id: 6,
    name: "스포츠/레저",
  },
  {
    _id: 7,
    name: "의류/잡화",
  },
  {
    _id: 8,
    name: "게임/취미",
  },
  {
    _id: 9,
    name: "기타",
  },
];

const price = [
  {
    _id: 0,
    name: "Any",
    array: [],
  },
  {
    _id: 1,
    name: "$0 to $199",
    array: [0, 199],
  },
  {
    _id: 2,
    name: "$200 to $249",
    array: [200, 249],
  },
  {
    _id: 3,
    name: "$250 to $279",
    array: [250, 279],
  },
  {
    _id: 4,
    name: "$280 to $299",
    array: [280, 299],
  },
  {
    _id: 5,
    name: "More than $300",
    array: [300, 1500000],
  },
];

export { continents, price };
