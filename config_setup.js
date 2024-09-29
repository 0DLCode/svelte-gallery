import inquirer from 'inquirer';
import chalk from 'chalk';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { homedir } from 'os';
import open from 'open';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function setupConfig() {
  console.log(chalk.blue.bold('Configuration de votre application'));

  // Configuration du dossier média
  const staticMediaPath = join(__dirname, 'static', 'media');
  let mediaPath;

  try {
    const stats = await fs.lstat(staticMediaPath);
    if (stats.isSymbolicLink()) {
      const currentTarget = await fs.readlink(staticMediaPath);
      const { modifyMedia } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'modifyMedia',
          message: `Le lien symbolique static/media existe déjà et pointe vers ${currentTarget}. Voulez-vous le modifier?`,
          default: false
        }
      ]);

      if (modifyMedia) {
        mediaPath = await configureMediaPath();
      } else {
        console.log(chalk.yellow('Configuration du dossier média inchangée.'));
      }
    } else {
      mediaPath = await configureMediaPath();
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      mediaPath = await configureMediaPath();
    } else {
      console.error(chalk.red(`Erreur lors de la vérification de static/media: ${error.message}`));
    }
  }

  if (mediaPath) {
    try {
      await fs.mkdir(dirname(staticMediaPath), { recursive: true });
      await fs.unlink(staticMediaPath).catch(() => {});
      await fs.symlink(mediaPath, staticMediaPath, 'dir');
      console.log(chalk.green(`✔ Lien symbolique créé: ${staticMediaPath} -> ${mediaPath}`));
    } catch (error) {
      console.error(chalk.red(`Erreur lors de la création du lien symbolique: ${error.message}`));
    }
  }

  const { port, action, openBrowser } = await inquirer.prompt([
    {
      type: 'input',
      name: 'port',
      message: 'Entrez le port sur lequel l\'application doit s\'exécuter:',
      default: '3000',
      validate: (input) => {
        const port = parseInt(input);
        if (isNaN(port) || port < 1 || port > 65535) {
          return 'Veuillez entrer un numéro de port valide (1-65535).';
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'action',
      message: 'Que voulez-vous faire?',
      choices: [
        { name: 'Lancer le mode développement', value: 'dev' },
        { name: 'Construire et démarrer', value: 'build-start' },
        { name: 'Ne rien faire', value: 'nothing' }
      ]
    },
    {
      type: 'confirm',
      name: 'openBrowser',
      message: 'Voulez-vous ouvrir l\'application dans le navigateur web après le lancement?',
      default: true,
      when: (answers) => answers.action !== 'nothing'
    }
  ]);

  // Enregistrer le port dans un fichier de configuration
  const configPath = join(__dirname, '.env');
  await fs.writeFile(configPath, `PORT=${port}\n`);
  console.log(chalk.green(`✔ Port ${port} enregistré dans .env`));

  // Fonction pour ouvrir le navigateur
  const openInBrowser = () => {
    if (openBrowser) {
      setTimeout(() => {
        open(`http://localhost:${port}`);
        console.log(chalk.green(`Application ouverte dans le navigateur: http://localhost:${port}`));
      }, 3000); // Attendre 3 secondes avant d'ouvrir le navigateur
    }
  };

  // Exécuter l'action choisie
  switch (action) {
    case 'dev':
      console.log(chalk.yellow('Lancement du mode développement...'));
      const devProcess = spawn('npm', ['run', 'dev', '--', '--port', port], { stdio: 'inherit' });
      
      devProcess.on('error', (error) => {
        console.error(chalk.red(`Erreur lors du lancement du mode développement: ${error.message}`));
      });

      devProcess.on('spawn', () => {
        openInBrowser();
      });

      devProcess.on('close', (code) => {
        if (code !== 0) {
          console.log(chalk.red(`Le processus de développement s'est terminé avec le code ${code}`));
        }
      });
      break;

    case 'build-start':
      console.log(chalk.yellow('Construction et démarrage de l\'application...'));
      const buildProcess = spawn('npm', ['run', 'build'], { stdio: 'inherit' });

      buildProcess.on('error', (error) => {
        console.error(chalk.red(`Erreur lors de la construction: ${error.message}`));
      });

      buildProcess.on('close', (code) => {
        if (code === 0) {
          console.log(chalk.green('Construction terminée. Démarrage de l\'application...'));
          const startProcess = spawn('npm', ['run', 'preview', '--', '--port', port], { stdio: 'inherit' });

          startProcess.on('error', (error) => {
            console.error(chalk.red(`Erreur au démarrage: ${error.message}`));
          });

          startProcess.on('spawn', () => {
            openInBrowser();
          });

          startProcess.on('close', (code) => {
            if (code !== 0) {
              console.log(chalk.red(`Le processus de démarrage s'est terminé avec le code ${code}`));
            }
          });
        } else {
          console.log(chalk.red(`La construction a échoué avec le code ${code}`));
        }
      });
      break;

    case 'nothing':
      console.log(chalk.blue('Aucune action effectuée. Configuration terminée.'));
      break;
  }
}

async function configureMediaPath() {
  const { mediaPath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'mediaPath',
      message: 'Entrez le chemin vers votre dossier média:',
      default: join(homedir(), 'Media'),
      validate: async (input) => {
        try {
          await fs.access(input);
          return true;
        } catch (error) {
          return 'Le chemin spécifié n\'existe pas. Veuillez entrer un chemin valide.';
        }
      }
    }
  ]);
  return mediaPath;
}

setupConfig().catch(console.error);