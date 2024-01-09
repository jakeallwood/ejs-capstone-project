import express from "express";
import axios from "axios";

const APP = express();
const PORT = 3000;
const API_URL = "https://api.pokemontcg.io/v2";

const MY_TOKEN = "a711bc6d-9f15-4f06-ae63-1363b7ea82be";
const CONFIG = {
  headers: { "X-API-KEY": MY_TOKEN }
};

const P_UPGRADE = 1;
const Q_UPGRADE = 9;
const RATES = {
  "common": 40,
  "uncommon": 25,
  "rare": 15,
  "rareACE": 1,
  "rareBREAK": 1,
  "rareHolo": 2,
  "rareHoloEX": 1,
  "rareHoloGX": 1,
  "rareHoloLVX": 1,
  "rareHoloStar": 1,
  "rareHoloV": 1,
  "rareHoloVMAX": 1,
  "rarePrime": 1,
  "rarePrismStar": 1,
  "rareRainbow": 1,
  "rareSecret": 1,
  "rareShining": 1,
  "rareShiny" : 1,
  "rareShinyGX": 1,
  "rareUltra": 1,
  "amazingRare": 1,
  "promo": 0.0,
  "legend": 1,
}

APP.use(express.static("public"));
APP.set("view engine", "ejs");

var cardsGlobal = [];
var energiesGlobal = [];
var rarities = {};
var currentPack = [];

function createTables() {
  rarities["common"]        = cardsGlobal.filter((card) => card.rarity === "Common");
  rarities["uncommon"]      = cardsGlobal.filter((card) => card.rarity === "Uncommon");
  rarities["rare"]          = cardsGlobal.filter((card) => card.rarity === "Rare");
  rarities["rareACE"]       = cardsGlobal.filter((card) => card.rarity === "Rare ACE");
  rarities["rareBREAK"]     = cardsGlobal.filter((card) => card.rarity === "Rare BREAK");
  rarities["rareHolo"]      = cardsGlobal.filter((card) => card.rarity === "Rare Holo");
  rarities["rareHoloEX"]    = cardsGlobal.filter((card) => card.rarity === "Rare Holo EX");
  rarities["rareHoloGX"]    = cardsGlobal.filter((card) => card.rarity === "Rare Holo GX");
  rarities["rareHoloLVX"]   = cardsGlobal.filter((card) => card.rarity === "Rare Holo LV.X");
  rarities["rareHoloStar"]  = cardsGlobal.filter((card) => card.rarity === "Rare Holo Star");
  rarities["rareHoloV"]     = cardsGlobal.filter((card) => card.rarity === "Rare Holo V");
  rarities["rareHoloVMAX"]  = cardsGlobal.filter((card) => card.rarity === "Rare Holo VMAX");
  rarities["rarePrime"]     = cardsGlobal.filter((card) => card.rarity === "Rare Prime");
  rarities["rarePrismStar"] = cardsGlobal.filter((card) => card.rarity === "Rare Prism Star");
  rarities["rareRainbow"]   = cardsGlobal.filter((card) => card.rarity === "Rare Rainbow");
  rarities["rareSecret"]    = cardsGlobal.filter((card) => card.rarity === "Rare Secret");
  rarities["rareShining"]   = cardsGlobal.filter((card) => card.rarity === "Rare Shining");
  rarities["rareShiny"]     = cardsGlobal.filter((card) => card.rarity === "Rare Shiny");
  rarities["rareShinyGX"]   = cardsGlobal.filter((card) => card.rarity === "Rare Shiny GX");
  rarities["rareUltra"]     = cardsGlobal.filter((card) => card.rarity === "Rare Ultra");
  rarities["amazingRare"]   = cardsGlobal.filter((card) => card.rarity === "Amazing Rare");
  rarities["promo"]         = cardsGlobal.filter((card) => card.rarity === "Promo");
  rarities["legend"]        = cardsGlobal.filter((card) => card.rarity === "LEGEND");
}

function generateCard(raritylist, check = true){
  if (check && (Math.floor(Math.random() * Q_UPGRADE) < P_UPGRADE))
  {
    console.log("triggered card upgrade!");
    currentPack.push(randomCard(["rareHoloV", "rareHoloVMAX", "rareUltra", "rareRainbow", "rareSecret"]));
  } else
    currentPack.push(randomCard(raritylist));
}

function randomCard(listOfRarities) {
  let oddSum = 0;
  let accumulatedOdds = [];
  let givenRarities = [];

  // generate a list of bounds and a list of given rarities
  listOfRarities.forEach(element => {
    oddSum += RATES[element];
    accumulatedOdds.push(oddSum);
    givenRarities.push(element);
  });
  
  // generate a random number to test against bounds
  let randomNum = Math.floor(Math.random() * oddSum);
  // start with the lowest possible rarity
  let result = givenRarities[0];

  for (let i = 0; i < accumulatedOdds.length; i++)
  {
    if (accumulatedOdds.at(i) >= randomNum) {
      // if this element is greater than our number, it must be within this raritys bounds
      result = givenRarities[i];
      break;
    }
  }

  // return a random card of this rarity
  console.log(`unpacked a ${result} card.`);
  return rarities[result][Math.floor(Math.random() * rarities[result].length)];
}

function createPack() {
  currentPack = [];

  // slot 0: energy
  currentPack.push(energiesGlobal[Math.floor(Math.random() * energiesGlobal.length)]);

  // slot 1: common
  //generateCard(["common"]);
  generateCard(["common"]);

  // slot 2: common/uncommon
  generateCard(["common", "uncommon"]);
  generateCard(["common", "uncommon"]);

  // slot 3: uncommon
  generateCard(["uncommon"]);
  generateCard(["uncommon"]);

  // slot 4: common/uncommon/rare/holo rare
  generateCard(["common", "uncommon", "rare", "rareHolo"], false);
  generateCard(["common", "uncommon", "rare", "rareHolo"], false);

  // slot 5: rare/holo rare/holo rare v/holo rare vmax/ultra rare/rainbow rare/secret rare
  generateCard(["rare", "rareHolo", "rareHoloV", "rareHoloVMAX", "rareUltra", "rareRainbow", "rareSecret"], false);
  generateCard(["rare", "rareHolo", "rareHoloV", "rareHoloVMAX", "rareUltra", "rareRainbow", "rareSecret"], false);
  console.log("----------------------------");
}

APP.get("/", (req, res) => {
  res.render("index.ejs");
});

APP.get("/open-pack", (req, res) => {
  createPack();
  res.render("open.ejs", { cards: currentPack });
})

APP.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  // initialise set data
  var setID = "swsh3";
  console.log(`getting a copy of ${setID}...`);
  const result = await axios.get(`${API_URL}/cards?q=set.id:${setID}`, CONFIG);
  cardsGlobal = result.data.data;
  const result2 = await axios.get(`${API_URL}/cards?q=name:basic*energy`, CONFIG);
  energiesGlobal = result2.data.data;
  if (cardsGlobal.length > 0)
  {
    console.log("done!");
    console.log("creating tables...");
    createTables();
    console.log("done!");
    console.log("----------------------------");
  }
  else{
    console.log("you done fucked up");
  }
  // for (var i in rarities) {
  //   console.log(`${i}: ${rarities[i].length}`);
  // }
});

