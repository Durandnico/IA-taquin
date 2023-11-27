import Taquin from "./Taquin.ts"
import { manhanttan, hamming } from "./utils/heuristic.ts";
import Pair from "./utils/Pair.ts";
import TimeDiff from "./utils/TimeDiff.ts"; 
import inquirer from "inquirer";
import Astar from "./solver.ts";

const menu = await inquirer.prompt([
  {
    type: 'list',
    name: 'choice',
    message: 'Mode de jeu ?',
    choices : ['IA', 'Manuel']
  }
]);


async function setupManuel() {
  let game : Taquin = new Taquin([[6,4,7],[8,5,0],[3,2,1]]);

  game.render();
  while(!game.isWin())
  {
    await game.promptMove();
    game.render();
  }
}


async function setupIa() {
  const functionChoice = await inquirer.prompt([
    {
      type: 'list',
      name: 'fctH',
      message: 'Quelle fonction heuristique utiliser ?',
      choices: ['Hamming', 'Manhanttan', 'Duel']
    }
  ]);

  let fctH : Function | null = null;
  let fctName: string = "";
  switch(functionChoice.fctH)
  {
    case 'Hamming':
      fctH = hamming;
      fctName = "Hamming"
      break;
    
    case 'Manhanttan':
      fctH = manhanttan;
      fctName = "Manhanttan"
      break;

    default:

  }

  console.log(fctH);
  let game : Taquin = new Taquin([[6,4,7],[8,5,0],[3,2,1]]);
  //game.scramble()
  if(fctH !== null) {
    const elapse = new TimeDiff<Pair<number, number[]>>(Astar, fctH, game);
    const result = elapse.value;
    
    console.clear();
    console.log('  ============== RESULT : ============== ');

    console.log('test Grid :');
    game.draw();

    console.log('\t '+ fctName +' :\n\t\t- solution found in '+ elapse.time + 'ms\n\t\t- number of move check: ' + result.first + "\n\t\t- solution in " + result.second.length + " moves which are :\n\t\t" + result.second);
  }
    
  else {
    
    const elapseHmg = new TimeDiff<Pair<number, number[]>>(Astar, hamming, game);
    const hmg = elapseHmg.value;

    const elapseHmt = new TimeDiff<Pair<number, number[]>>(Astar, manhanttan, game)
    const mht:Pair<number, number[]> = elapseHmt.value

    console.clear();
    console.log('  ============== RESULT : ============== ');

    console.log('Test Grid :');
    game.draw();

    console.log('\t Hamming :\n\t\t- solution found in '+ elapseHmg.time + 'ms\n\t\t- number of move check: ' + hmg.first + "\n\t\t- solution in " + hmg.second.length + " moves which are :\n\t\t" + hmg.second);
    console.log("\n\t Manhanttan :\n\t\t- solution found in "+ elapseHmt.time + "ms\n\t\t- number of move check: " + mht.first + "\n\t\t- solution in " + mht.second.length + " moves which are :\n\t\t" + mht.second+ "\n\n\t\t\t---------------------------\n"); 
  }
}

if(menu.choice === "Manuel")
  setupManuel();
else {
  setupIa();
}