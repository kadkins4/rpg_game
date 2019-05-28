// require lodash
const _ = require('lodash');

// TODO: think of an easier way to mutate stats -- example, if we add in strength or armor characteristics
// we will then have to add that stat to starting character, items added, etc -- we should be able to add
// a characteristic on item and ui only

// configuration
let maxItemsInInventory = 6;

// main character object -- make this a class
let char = {
  general: {
    name: '',
    class: {
      className: '',
      classBaseHP: 0,
      classBaseMana: 0,
      classBaseStamina: 0
    },
    race: {
      type: 'Human', 
      racialPerk: {
        name: 'Balanced',
        hp: 0,
        mana: -1,
        stamina: 1
      }
    }
  },
  stats: {
    maxStats: {
      hp: 0, 
      mana: 0, 
      stamina: 0
    },
    currentStats: {
      hp: 0,
      mana: 0,
      stamina: 0
    }
  },
  modifiers: {
    buffs: [],
    debuffs: []
  }, 
  xpToNextLevel: 0,
  level: 1,
  items: [], 
  skills: [],
  rep: 0,
  perks: []
};

const randomNameArray = ['Mino', 'Quarth', 'Paud', 'Asmorath', 'Artemis'];
const getRandomName = () => {
  const index = Math.floor(Math.random() * randomNameArray.length);
  return randomNameArray[index];
};

// array of objects
const classList = [
  { className: 'Warrior', classBaseHP: 10, classBaseMana: 3, classBaseStamina: 1 },
  { className: 'Rogue', classBaseHP: 6, classBaseMana: 4, classBaseStamina: 9 }
];
const selectAClass = (classSelectionName) => {
  const selection = _.find(classList, (c) => c.className === classSelectionName);
  // TODO need to define error
  if (selection === -1) return error;
  return char.general.class = { 
    className: selection.className, 
    classBaseHP: selection.classBaseHP, 
    classBaseMana: selection.classBaseMana, 
    classBaseStamina: selection.classBaseStamina 
  };
};

// array of objects
const raceList = [
  { type: 'Human', perkName: 'Balanced', hp: 0, mana: -1, stamina: 1 }
];

const calculateBaseStats = () => {
  const racialPerk = char.general.race.racialPerk;

  const baseHP = char.general.class.classBaseHP + racialPerk.hp;
  const baseMana = char.general.class.classBaseMana + racialPerk.mana;
  const baseStamina = char.general.class.classBaseStamina + racialPerk.stamina;

  return { baseHP, baseMana, baseStamina };
}

// buffs
const buffList = [
  { id: 'buff-haste', name: 'haste', duration: 10, hp: 0, mana: 0, stamina: 4 },
  { id: 'buff-toughness', name: 'toughness', duration: 5, hp: 8, mana: 0, stamina: -1 }
];
const addBuffToCharacter = (buffToAddById) => {
  const currentBuffs = char.modifiers.buffs;

  const buffAlreadyExists = _.findIndex(currentBuffs, (b) => b.id === buffToAddById);
  if (buffAlreadyExists > 0) return;

  const buff = _.find(buffList, (buff) => buff.id === buffToAddById);

  currentBuffs.push(buff);

  console.log(`${char.general.name} received buff: ${buff.name} (${buff.duration})`);
  console.log(`Active Buffs: ${currentBuffs.length}`);

  setTimeout(() => {
    removeBuffFromCharacter(buffToAddById);
  }, buff.duration * 1000);
}

const removeBuffFromCharacter = (buffToRemoveById) => {
  const currentBuffs = char.modifiers.buffs;

  const buffExists = _.findIndex(currentBuffs, (b) => b.id === buffToRemoveById);
  if (buffExists < 0) return;

  const buffRemoved = _.remove(currentBuffs, (b) => b.id === buffToRemoveById); 
  console.log('Buff Faded: ', buffRemoved[0].id);
  console.log('Active Buffs: ', currentBuffs.length);
}

// debuffs
const debuffList = [
  { id: 'debuff-poisoned', name: 'poisoned', duration: 5, hp: -1, mana: 0, stamina: -2 },
  { id: 'debuff-null-field', name: 'null field', duration: 8, hp: 0, mana: -4, stamina: 0 }
];
const addDebuffToCharacter = (debuffToAddById) => {
  const currentDebuffs = char.modifiers.debuffs;

  const debuffAlreadyExists = _.findIndex(currentDebuffs, (d) => d.id === debuffToAddById);
  if (debuffAlreadyExists >= 0) return;

  const debuff = _.find(debuffList, (debuff) => debuff.id === debuffToAddById);

  currentDebuffs.push(debuff);

  console.log(`${char.general.name} received debuff: ${debuff.name} (${debuff.duration})`);
  console.log(`Active Debuffs: ${currentDebuffs.length}`);

  setTimeout(() => {
    removeDebuffFromCharacter(debuffToAddById);
  }, debuff.duration * 1000);
}

const removeDebuffFromCharacter = (debuffToRemoveById) => {
  const currentDebuffs = char.modifiers.debuffs;

  const debuffExists = _.findIndex(currentDebuffs, (d) => d.id === debuffToRemoveById);
  if (debuffExists < 0) return;

  const debuffRemoved = _.remove(currentDebuffs, (d) => d.id === debuffToRemoveById);
  console.log('Debuff Faded: ', debuffRemoved[0].id);
  console.log('Active Debuffs: ', currentDebuffs.length);
}

// XP & Levelling
const xpPerLevel = {
  1: { xpToNext: 0 },
  2: { xpToNext: 20 },
  3: { xpToNext: 22 },
  4: { xpToNext: 25 },
  5: { xpToNext: 30 },
  6: { xpToNext: 34 }
}

const getXPNeeded = (levelToCheck) => {
  let level;
  if (_.isNil(levelToCheck) || levelToCheck === 0) level = char.level;
  else level = levelToCheck;
  return xpPerLevel[level].xpToNextLevel;
}

const setXPNeeded = () => {
  const nextLevel = char.level + 1;
  return char.xpToNextLevel += getXPNeeded(nextLevel);
}

const characterLevelUp = () => {
  char.level++;
  console.log(`---------LEVEL UP ${char.level}--------`);
  setXPNeeded();
  if(char.xpToNextLevel <= 0) return characterLevelUp();
}

const xpGainOrLoss = (num) => {
  char.xpToNextLevel -= num;
  if (num < 0) getXPNeeded(char.level - 1);
  if (char.xpToNextLevel <= 0) return characterLevelUp();
};

// items
const itemList = [
  { 
    id: 'item-worn-shield',
    name: 'Worn Shield',
    type: 'Equipment', 
    description: 'LOREM IPSUM', 
    stats: {
      hp: 2
    } 
  },
  { 
    id: 'item-lightweight-slippers',
    name: 'Lightweight Slippers',
    type: 'Equipment',
    description: 'LOREM IPSUM',
    stats: {
      stamina: 2
    }
  },
  { 
    id: 'item-health-potion-minor',
    name: 'Minor Health Potion',
    type: 'Consumable',
    description: 'Drink To Restore Health',
    props: {
      isBuff: false,
      maxStats: false,
      maxStack: 5,
      currentStack: 1
    },
    stats: {
      hp: 5
    }
  },
  { 
    id: 'item-endurance-booster-minor',
    name: 'Endurance Booster',
    type: 'Consumable',
    description: 'Drink To Boost Endurance For A Period Of Time',
    props: {
      isBuff: true,
      maxStats: true,
      maxStack: 1,
      currentStack: 1
    },
    stats: {
      hp: 5
    }
  }
];

// this will return an array -- either contains nothing, if no match is found, or the indices
// of the matched items
const isItemInInventory = (itemToSearchFor) => {
  // returns index if in inventory, otherwise returns -1
  let indexArr = [];
  _.forEach(char.items, (i, index) => {
    if (i.id === itemToSearchFor.id) indexArr.push(index);
  })
  return indexArr;
}

const addToInventory = (item) => {
  let itemInInventory;

  function pushToInventory() {
    if (char.items.length < maxItemsInInventory) {
      let itemToAdd = _.cloneDeep(item);
      // let itemToAdd = Object.assign({}, item);
      char.items.push(itemToAdd);
    } else {
      console.log('inventory is full');
    }
  }

  // is it stackable
  const isItemStackable = _.isUndefined(item.props) ? false : item.props.maxStack > 1;
  if (isItemStackable) {

    // is it already in inventory?
    const indexArr = isItemInInventory(item);
  
    // did not find item
    if (indexArr.length === 0) {
      pushToInventory();
      return;
    }
    let continueSearching = true;

    _.forEach(indexArr, (index, i) => {
      itemInInventory = char.items[index];

      let overflowItemsFromStacking = 0;

      // is there room for more?
      let spaceToStack = itemInInventory.props.currentStack < itemInInventory.props.maxStack ? true : false;

      if (spaceToStack) {
        itemInInventory.props.currentStack += item.props.currentStack;
        overflowItemsFromStacking = itemInInventory.props.currentStack - itemInInventory.props.maxStack;

        if (overflowItemsFromStacking > 0)
          itemInInventory.props.currentStack = itemInInventory.props.maxStack;

        return true;
      } else {
        if ((indexArr.length - 1) !== i) return;
        pushToInventory();
      }
    });
  } else {
    pushToInventory();
  }
}

addToInventory(itemList[0]);
addToInventory(itemList[2]);
addToInventory(itemList[2]);
addToInventory(itemList[2]);
addToInventory(itemList[2]);
addToInventory(itemList[2]);
addToInventory(itemList[0]);
addToInventory(itemList[2]);
addToInventory(itemList[2]);

// TODO think of a name for this
const modifyStatsByItem = (modifyingObject, targetObject) => {
  _.map(modifyingObject, (v, k) => {
    console.log(`${targetObject[k]}${k}`);
    targetObject[k] = targetObject[k] + v;
    console.log(` + ${v} = ${targetObject[k]}`);
  });
}

// add consumables that both increase current a current stat or raise the max of a stat
const useOrEquipItem = (itemId) => {
  let maxStats = char.stats.maxStats;
  let currentStats = char.stats.currentStats;
  let healthPercentage = currentStats.hp / maxStats.hp;
  const item = _.find(itemList, (i) => i.id === itemId);
  switch (item.type) {
    case 'Equipment':
      console.log(`Equipping ${item.name}`);
      modifyStatsByItem(item.stats, maxStats);
      // subtract from inventory
      // adjust health to the same percentage
      break;
    case 'Consumable':
      if (item.props.maxStats) 
        modifyStatsByItem(item.stats, maxStats);
      else modifyStatsByItem(item.stats, currentStats);
      // subtract from inventory
      // add others item types here
      default:
      break;
  }
  console.log(maxStats, currentStats, char.items);
}

const unequipItem = (item) => {
  let maxStats = char.stats.maxStats;
  let currentStats = char.stats.currentStats;
  let healthPercentage = currentStats.hp / maxStats.hp;
  const item = _.find(itemList, (i) => i.id === itemId);
  // remove stats from current / max stats
  _.map(item.stats, (i) => {
    // subtract from max and current?
  })
  // remove from inventory
  // adjust health to the same percentage
}

// TODO items need to modify maxstats when equipped, unequipped, or consumed

// will call all of the functions necessary after player has made selections
const createCharacter = () => {
  console.log('-----------------------------------------------------------');
  // FOR TESTING PURPOSES ONLY
  char.general.name = getRandomName();
  selectAClass('Rogue');
  // END TESTING

  // calculate basestats
  const baseStats = calculateBaseStats();
  char.stats.maxStats = { hp: baseStats.baseHP, mana: baseStats.baseMana, stamina: baseStats.baseStamina };
  char.stats.currentStats = { hp: baseStats.baseHP, mana: baseStats.baseMana, stamina: baseStats.baseStamina };
  
  console.log(
    `${char.general.name}, the L${char.level} ${char.general.race.racialPerk.name} ${char.general.race.type} ${char.general.class.className}, is 
    being created with base stats of ${char.stats.maxStats.hp} HP (rp: ${char.general.race.racialPerk.hp}), ${char.stats.maxStats.mana} 
    MANA (rp: ${char.general.race.racialPerk.mana}), ${char.stats.maxStats.stamina} STAMINA (rp: ${char.general.race.racialPerk.stamina}).`
  );
  setXPNeeded();
  console.log('-----------------------------------------------------------');
};

createCharacter();
addBuffToCharacter('buff-haste');
addBuffToCharacter('buff-toughness');
xpGainOrLoss(1);
xpGainOrLoss(19);
addDebuffToCharacter('debuff-null-field');
xpGainOrLoss(-2);
xpGainOrLoss(22);
useOrEquipItem('item-lightweight-slippers');
useOrEquipItem('item-health-potion-minor');
addDebuffToCharacter('debuff-poisoned');
xpGainOrLoss(2);
addDebuffToCharacter('debuff-poisoned');
xpGainOrLoss(20);